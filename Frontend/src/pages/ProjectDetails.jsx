import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import "../css/projectDetails.css";

const ProjectDetails = () => {
  const { projectName } = useParams();
  const { data } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );
  const tasks = data?.filter((task) => task?.project?.name === projectName);

  const getsStatusColor = (status) => {
    if (status === "To Do") return "#f9e79f";
    if (status === "Completed") return "#abebc6";
    if (status === "In Progress") return "#aed6f1";
    if (status === "Blocked") return "#f5b7b1";
    return "#fff";
  };
  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1 className="title">{projectName}</h1>
        <h3 className="task-list-heading">Task List</h3>
        <ul className="tasks-container list-group">
          {tasks?.map((task) => (
            <li id="tasks" className="list-group-item d-flex">
              <h5>{task?.name}</h5>
              <p
                style={{ backgroundColor: getsStatusColor(task?.status) }}
                className="sts"
              >
                {task?.status}
              </p>
              {task?.owners.map((owner) => (
                <h6 key={owner._id} className="owner">
                  {owner?.name}
                </h6>
              ))}
              <p className="date">{task?.timeToComplete}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ProjectDetails;
