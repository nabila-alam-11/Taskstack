import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import "../css/projectDetails.css";

const ProjectDetails = () => {
  const { projectName } = useParams();
  const { data } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );
  const tasks = data?.filter((task) => task?.project?.name === projectName);
  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1 className="title">{projectName}</h1>
        <h1>Task List</h1>
        <ul className="tasks-container list-group">
          {tasks?.map((task) => (
            <li id="tasks" className="list-group-item">
              <h4>{task?.name}</h4>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ProjectDetails;
