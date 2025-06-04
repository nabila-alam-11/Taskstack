import Sidebar from "./components/Sidebar";
import "../src/css/app.css";
import useFetch from "./useFetch";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import TaskModal from "./components/TaskModal";
import Loader from "./components/Loader";

const App = () => {
  const { data: user, loading: ownerLoading } = useFetch(
    "https://workasana-backend-eight.vercel.app/auth/me",
    []
  );

  const { data: tasks, loading: tasksLoading } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const { data, loading: projectsLoading } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/projects"
  );

  const projects = tasks?.filter((task) =>
    task?.owners?.find((owner) => owner?.name === user?.name)
  );

  const getsStatusColor = (status) => {
    if (status === "To Do") return "#f9e79f";
    if (status === "Completed") return "#abebc6";
    if (status === "In Progress") return "#aed6f1";
    if (status === "Blocked") return "#f5b7b1";
    return "#fff";
  };

  const [status, setStatus] = useState("");
  const statusOptions = [...new Set(tasks?.map((task) => task?.status))];
  const filterByStatus = projects?.filter((project) =>
    status ? project.status === status : true
  );
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main">
        <h1 className="title">Dashboard</h1>
        {!tasksLoading || !projectsLoading || !ownerLoading ? (
          <>
            <div className="projects-container">
              <div className="mb-4 gap-4">
                <h3>Projects</h3>
              </div>
              <div className="d-flex projects">
                {data?.map((project) => (
                  <Link
                    to={`/project/${project.name}`}
                    className="card me-5 project"
                    key={project?._id}
                  >
                    <div className="card-body">
                      <h5>{project?.name}</h5>
                      <p className="description">{project?.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
            <div className="projects-container">
              <div className="d-flex justify-content-between ">
                <div className="d-flex mb-4 gap-4">
                  <h3>My Tasks</h3>
                  <select onChange={(e) => setStatus(e.target.value)}>
                    <option value="">Filter by status</option>

                    {statusOptions?.map((status, index) => (
                      <option key={index} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <TaskModal />
              </div>{" "}
              <div className="d-flex projects tasks">
                {filterByStatus?.map((tasks) => (
                  <Link
                    key={tasks?._id}
                    to={`/task/${tasks?._id}`}
                    className="card me-5  task"
                  >
                    <div className="card-body">
                      <p
                        className="status"
                        style={{
                          backgroundColor: getsStatusColor(tasks?.status),
                        }}
                      >
                        {tasks?.status}
                      </p>
                      <h5>{tasks?.name}</h5>
                      <p className="date">
                        Due on {tasks?.timeToComplete} June 2025
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
export default App;
