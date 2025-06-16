# Taskstack - A Project Mangement App

A full-stack project management app where users can sign up , log in securely with JWT, create tasks, form teams, filter tasks and track progress with visual reports.<br>
Built with React frontend, Express/Node.js backend, MongoDB database,JWT-based authentication and Bootstrap for styling.

---

## Demo Link

[Live Demo](https://taskstack-nine.vercel.app/)

---

## Login

> **Guest**<br>
> email: `james.lee01@gmail.com`<br>
> password: `james01`

---

## Quick Start

```
git clone https://github.com/nabila-alam-11/Taskstack.git
cd <Frontend>
npm install
npm run dev
```

---

## Technologies

- React JS
- Express
- MongoDB
- Node.js
- React Router
- Context API
- Chart.js
- JWT

---

## Demo Video

Watch a walkthrough (7 minutes) of all major features of this app:
[Video]()

---

## Features

### Authentication

- User Signup and login with JWT
- Protected routes for adding/editing tasks

### Dashboard

- Displays all projects and tasks assigned to logged-in user
- Each task displays its status(Completed, In Progress, Blocked, To Do)
- Filter tasks by status
- **Add New Task+** button to create a new task
- **Add New Task Modal** allows user to create a new task by entering name, project,teams, tags, owners,completion time, status

### Teams

- Displays teams list
- **Add New Team +** button to create a new team
- **Add New Team Modal** allows user to create a new team by entering name and description.

### Report

Get a quick overview of your team's progress:

- Bar chart for total work done last week
- Pie chart for task status distribution
- Donut chart for Completed vs. incomplete tasks
- Bar chart for tasks closed by team
- Bar chart for pending work duration

---

## API Reference

### **GET /auth/me**<br>

Get current authenticated user<br>
Sample Response: <br>

```
{name, email}
```

### **GET /v1/tasks**<br>

List all tasks<br>
Sample Response: <br>

```
[{name, project, team, owners,tags, timeToComplete, status, dueOn, createdAt, updatedAt},...]
```

### **GET /v1/tasks/last-week**<br>

List all tasks completed last week<br>
Sample Response: <br>

```
[{name, project, team, owners,tags, timeToComplete, status, dueOn, createdAt, updatedAt},...]
```

## **GET /v1/teams**<br>

List all teams<br>
Sample Response: <br>

```
[{_id,name, description}, ...]
```

## **GET /v1/users**<br>

List all users<br>
Sample Response: <br>

```
[{_id, name, email, hashedPassword}, ....]
```

## **GET /v1/tags**<br>

List all tags<br>
Sample Response: <br>

```
[{_id,name},...]
```

## **GET /v1/projects**<br>

List all projects<br>
Sample Response: <br>

```
[{_id, name, description, createdAt}]
```

### **POST /auth/signup**<br>

Register a new user<br>
Sample Response: <br>

```
{name, email, hashedPassword}
```

### **POST /auth/login**<br>

Log in a user<br>
Sample Response:<br>

```
{email, password}
```

### **POST /v1/tasks**<br>

Create a new task<br>
Sample Response:<br>

```
{name, project, team, owners,tags, timeToComplete, status, dueOn, createdAt, updatedAt}
```

### **POST /v1/teams**

Create a new team<br>
Sample Response:<br>

```
{name, description}
```

### **POST /v1/tags**

Create a new tag<br>
Sample Response:<br>

```
{name}
```

## **POST /v1/projects**

Create a new project<br>
Sample Response:<br>

```
{name, description, createdAt}
```

### **POST /v1/tasks/:taskId/update-task-info**<br>

Update task details<br>
Sample Response: <br>

```
{name, project, team, owners,tags, timeToComplete, status, dueOn, createdAt, updatedAt}
```

### **POST /v1/teams/:teamId/team-info**<br>

Update team details<br>
Sample Response: <br>

```
{name, description}
```

### **POST /v1/users/:userId/user-info**<br>

Update user inforamtion with the specified ID<br>
Sample Response: <br>

```
{name, email, password}
```

## **POST /v1/projects/:projectName/project-info**<br>

Update team info with the specified project name<br>
Sample Response: <br>

```
{name, description, createdAt}

```

### **DELETE /v1/tasks/:taskId**<br>

Delete a task by ID

### **DELETE /v1/teams/:teamId**<br>

Delete a team by ID

### **DELETE /v1/users/:userName**<br>

Delete an user by user name

### **DELETE /v1/projects/:projectName**<br>

Delete a project by name

---

## Contact

For bugs or feature request, please react out to nabilazaheer1198@gmail.com
