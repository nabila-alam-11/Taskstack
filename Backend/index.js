const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const app = express();

// const corsOptions = {
//   origin: "*",
//   credentials: true,
//   optionSuccessStatus: 200,
// };
app.use(cors());
app.use(express.json());

const Task = require("./models/task.model");
const Team = require("./models/team.model");
const Tag = require("./models/tag.model");
const Projects = require("./models/project.model");
const User = require("./models/user.model");

const { initializeDatabase } = require("./db/db.connect");
initializeDatabase();

//========================
//********* HOME *********
//========================

app.get("/", (req, res) => {
  res.send(
    `<h1 style="color: #2c3e50; font-size: 3rem;">✨ Welcome to <span style="color: green;">WORKASANA</span> ✨</h1>`
  );
});

//========================
//********* LOGIN /SIGN UP*********
//========================

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("Auth Header: ", req.headers.authorization);

  // Check if header exists and starts with "Bearer"
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

async function addNewUser(newUser) {
  try {
    const savedUser = new User(newUser);
    return await savedUser.save();
  } catch (error) {
    throw error;
  }
}

app.post("/auth/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: `Owner with email '${email}' already exists.` });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const savedUser = await addNewUser({
      name: req.body.name,
      email: req.body.email,
      hashedPassword: hashedPassword,
    });
    res.status(201).json({
      success: true,
      message: `${name} added successfully.`,
      User: savedUser,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add user." });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.hashedPassword
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to login." });
  }
});

app.get("/auth/login", verifyToken, (req, res) => {
  res.json({ message: `Welcome, user ${req.user.email}` });
});

app.get("/auth/me", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-hashedPassword");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: "Server error" });
  }
});

//========================
//******** TASK ********
//========================

async function createNewTask(newTask) {
  try {
    const task = new Task(newTask);
    return await task.save();
  } catch (error) {
    throw error;
  }
}

app.post("/v1/tasks", async (req, res) => {
  try {
    const task = await createNewTask(req.body);
    if (task) {
      res.status(201).json({ message: "Task added suucessfully.", task: task });
    } else {
      res.status(404).json({ message: "Task not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to add task." });
  }
});

async function getAlltasks() {
  try {
    const tasks = await Task.find()
      .populate("project")
      .populate("team")
      .populate("owners");
    return tasks;
  } catch (error) {
    throw error;
  }
}

app.get("/v1/tasks", async (req, res) => {
  try {
    const tasks = await getAlltasks();
    if (tasks.length != 0) {
      res.json(tasks);
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks." });
  }
});

app.get("/v1/tasks/last-week", async (req, res) => {
  try {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);

    const completedTasks = await Task.find({
      status: "Completed",
      updatedAt: { $gte: sevenDaysAgo },
    }).populate("owners");

    res.status(200).json(completedTasks);
  } catch (err) {
    res.status(500).json({ error: "Internal Server error" });
  }
});

async function deleteTaskById(taskId) {
  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);
    return deletedTask;
  } catch (error) {
    throw error;
  }
}

app.delete("/v1/tasks/:taskId", async (req, res) => {
  try {
    const deletedTask = await deleteTaskById(req.params.taskId);
    if (deletedTask) {
      res
        .status(200)
        .json({ message: "Task deleted successfully.", task: deletedTask });
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task." });
  }
});

async function updateTaskById(taskId, dataToUpdate) {
  try {
    const task = await Task.findByIdAndUpdate(taskId, dataToUpdate, {
      new: true,
    });
    return task;
  } catch (error) {
    throw error;
  }
}

app.post("/v1/tasks/:taskId/update-task-info", async (req, res) => {
  try {
    const updatedTask = await updateTaskById(req.params.taskId, req.body);
    if (updatedTask) {
      res
        .status(200)
        .json({ message: "Task updated successfully.", task: updatedTask });
    } else {
      res.status(404).json({ error: "Task not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update task." });
  }
});
//========================
//******** TEAM ********
//========================

async function createNewTeam(newTeam) {
  try {
    const savedTeam = new Team(newTeam);
    return await savedTeam.save();
  } catch (error) {
    throw error;
  }
}

app.post("/v1/teams", async (req, res) => {
  try {
    const savedTeam = await createNewTeam(req.body);
    res
      .status(201)
      .json({ message: "Team added successfully.", Team: savedTeam });
  } catch (error) {
    res.status(500).json({ error: "Failed to add team." });
  }
});

async function getTeams() {
  try {
    const teams = await Team.find();
    return teams;
  } catch (error) {
    throw error;
  }
}

app.get("/v1/teams", async (req, res) => {
  try {
    const teams = await getTeams();
    if (teams.length != 0) {
      res.json(teams);
    } else {
      res.status(404).json({ message: "Teams not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch teams." });
  }
});

async function deleteTeamById(teamId) {
  try {
    const deletedTeam = await Team.findByIdAndDelete(teamId);
    return deletedTeam;
  } catch (error) {
    console.log("Error in deleting team: ", error);
    throw error;
  }
}

app.delete("/v1/teams/:teamId", async (req, res) => {
  try {
    const deletedTeam = await deleteTeamById(req.params.teamId);
    if (deletedTeam) {
      res
        .status(200)
        .json({ message: "Team deleted successfully: ", deletedTeam });
    } else {
      res.status(404).json({ error: "Team not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete team." });
  }
});

async function updateTeamById(teamId, dataToUpdate) {
  try {
    const updatedTeam = await Team.findByIdAndUpdate(teamId, dataToUpdate, {
      new: true,
    });
    return updatedTeam;
  } catch (error) {
    console.log("Error in updating team: ", error);
  }
}

app.post("/v1/teams/:teamId/team-info", async (req, res) => {
  try {
    const updatedTeam = await updateTeamById(req.params.teamId, req.body);
    if (updatedTeam) {
      res
        .status(200)
        .json({ message: "Team updated successfully.", team: updatedTeam });
    } else {
      res.status(404).json({ error: "Team not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update team." });
  }
});

//========================
//******** OWNERS ********
//========================

async function getUsers() {
  try {
    const users = await User.find();
    return users;
  } catch (error) {
    throw error;
  }
}

app.get("/v1/users", async (req, res) => {
  try {
    const users = await getUsers();
    if (users.length != 0) {
      res.json(users);
    } else {
      res.status(404).json({ message: "Users not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users." });
  }
});

async function deleteUserByName(userName) {
  try {
    const deletedUser = await User.findOneAndDelete({ name: userName });
    return deletedUser;
  } catch (error) {
    throw error;
  }
}

app.delete("/v1/users/:userName", async (req, res) => {
  try {
    const deletedUser = await deleteUserByName(req.params.userName);
    if (deletedUser) {
      res
        .status(200)
        .json({ message: "User deleted successfully.", deletedUser });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete User." });
  }
});

async function updateUserById(userId, dataToUpdated) {
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, dataToUpdated);
    return updatedUser;
  } catch (error) {
    throw error;
  }
}

app.post("/v1/users/:userId/user-info", async (req, res) => {
  try {
    const updatedUser = await updateUserById(req.params.userId, req.body);
    if (updatedUser) {
      res
        .status(200)
        .json({ message: `User updated successfully.`, updatedUser });
    } else {
      res.status(404).json({ error: "User not found." });
    }
  } catch (error) {
    throw error;
  }
});

//========================
//********* TAG **********
//========================
async function createNewTag(newTag) {
  try {
    const tag = new Tag(newTag);
    return await tag.save();
  } catch (error) {
    throw error;
  }
}

app.post("/v1/tags", async (req, res) => {
  try {
    const { name } = req.body;
    const existingTag = await Tag.findOne({ name });
    if (existingTag) {
      res.status(409).json({ error: `${name} already exists.` });
    }
    const tag = await createNewTag(req.body);

    res.status(201).json({ message: "Tag added successfully.", Tag: tag });
  } catch (error) {
    res.status(500).json({ error: "Failed to add tag." });
  }
});

async function getAllTags() {
  try {
    const tags = await Tag.find();
    return tags;
  } catch (error) {
    throw error;
  }
}

app.get("/v1/tags", async (req, res) => {
  try {
    const tags = await getAllTags();
    if (tags.length != 0) {
      res.json(tags);
    } else {
      res.status(404).json({ error: "Tags not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tags." });
  }
});

//========================
//******** PROJECTS ******
//========================
async function createNewProject(newProject) {
  try {
    const project = new Projects(newProject);
    return await project.save();
  } catch (error) {
    throw error;
  }
}

app.post("/v1/projects", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Project name is required." });
    }
    const existingProject = await Projects.findOne({ name });
    if (existingProject) {
      res.status(409).json({ error: `${name} project already exists.` });
    }

    const project = await createNewProject(req.body);
    res.status(201).json({
      message: `${project.name} added successfully`,
      Project: project,
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to add project." });
  }
});

async function getAllProjects() {
  try {
    const projects = await Projects.find();
    return projects;
  } catch (error) {
    throw error;
  }
}

app.get("/v1/projects", async (req, res) => {
  try {
    const projects = await getAllProjects();
    if (projects.length != 0) {
      res.json(projects);
    } else {
      res.status(404).json({ error: "Projects not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects." });
  }
});

async function deleteProjectByName(projectName) {
  try {
    const deletedProject = await Projects.findOneAndDelete({
      name: projectName,
    });
    return deletedProject;
  } catch (error) {
    throw error;
  }
}

app.delete("/v1/projects/:projectName", async (req, res) => {
  try {
    const deletedProject = await deleteProjectByName(req.params.projectName);
    console.log(deletedProject);
    if (deletedProject) {
      res
        .status(200)
        .json({ message: "Project deleted successfully.", deletedProject });
    } else {
      res.status(404).json({ message: "Project not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project." });
  }
});

async function updateProjectByName(projectName, dataToUpdate) {
  try {
    const project = await Projects.findOneAndUpdate(
      { name: projectName },
      dataToUpdate,
      { new: true }
    );
    return project;
  } catch (error) {
    throw error;
  }
}

app.post("/v1/projects/:projectName/project-info", async (req, res) => {
  try {
    const updatedProject = await updateProjectByName(
      req.params.projectName,
      req.body
    );
    console.log(updatedProject);
    if (updatedProject) {
      res.status(200).json({
        message: "Project updated successfully.",
        project: updatedProject,
      });
    } else {
      res.status(404).json({ message: "Project not found." });
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: "Failed to update project." });
  }
});
//========================
//******** SERVER ********
//========================
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
