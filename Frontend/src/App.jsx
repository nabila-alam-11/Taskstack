import Sidebar from "./components/Sidebar";
import "../src/css/app.css";
import useFetch from "./useFetch";
import { Link, useParams } from "react-router-dom";

const App = () => {
  const { projectId } = useParams();
  const { data: user, error } = useFetch(
    "https://workasana-backend-eight.vercel.app/auth/me",
    []
  );

  const { data: tasks } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const { data } = useFetch(
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

  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main">
        <h1 className="title">Dashboard</h1>
        <div className="projects-container">
          <h3>Projects</h3>
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
          <h3>My Tasks</h3>
          <div className="d-flex projects tasks">
            {projects?.map((tasks) => (
              <div key={tasks?._id} className="card me-5  task">
                <div className="card-body">
                  <p
                    className="status"
                    style={{ backgroundColor: getsStatusColor(tasks?.status) }}
                  >
                    {tasks?.status}
                  </p>
                  <h5>{tasks?.name}</h5>
                  <p className="date">
                    Due on {tasks?.timeToComplete} June 2025
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default App;
