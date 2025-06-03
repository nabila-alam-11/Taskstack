import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import { Link } from "react-router-dom";
import "../css/projectDetails.css";
import TaskModal from "../components/TaskModal";
import { useState } from "react";

const ProjectDetails = () => {
  const { projectName } = useParams();
  const { data } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );
  const { data: users } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/users"
  );

  const { data: tags } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tags"
  );
  const tasks = data?.filter((task) => task?.project?.name === projectName);

  const getsStatusColor = (status) => {
    if (status === "To Do") return "#f9e79f";
    if (status === "Completed") return "#abebc6";
    if (status === "In Progress") return "#aed6f1";
    if (status === "Blocked") return "#f5b7b1";
    return "#fff";
  };

  const [owner, setOwner] = useState("");

  const [tag, setTag] = useState("");

  const filters = () => {
    return tasks?.filter((task) => {
      const ownerMatch = owner
        ? task?.owners?.some((o) => o?.name === owner)
        : true;
      const tagMatch = tag ? task?.tags?.includes(tag) : true;
      return ownerMatch && tagMatch;
    });
  };
  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1 className="title">Project: {projectName}</h1>
        <div className="d-flex justify-content-between">
          <h3 className="task-list-heading">Task List</h3>
          <div className="task-modal">
            <TaskModal />
          </div>
        </div>
        <div className="d-flex">
          <select
            style={{ marginLeft: "21rem", width: "10rem" }}
            className="mb-4"
            onChange={(e) => setOwner(e.target.value)}
          >
            <option value="">-- Filter by Owner --</option>
            {users?.map((user) => (
              <option key={user._id} value={user?.name}>
                {user.name}
              </option>
            ))}
          </select>
          <select
            style={{ marginLeft: "1rem", width: "10rem" }}
            className="mb-4"
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">-- Filter by Tag --</option>
            {tags?.map((tag) => (
              <option key={tag._id} value={tag?.name}>
                {tag?.name}
              </option>
            ))}
          </select>{" "}
        </div>
        <ul className="list-group tasks-container">
          {filters()?.map((task) => (
            <li className="list-group-item d-flex task-item" key={task._id}>
              <div className="task-name">
                <h5>{task?.name}</h5>
              </div>
              <div className="task-status">
                <p style={{ backgroundColor: getsStatusColor(task?.status) }}>
                  {task?.status}
                </p>
              </div>
              <div className="task-owners">
                {task?.owners.map((owner) => (
                  <h6 key={owner._id}>{owner?.name}</h6>
                ))}
              </div>

              <div className="task-time">
                <p className="date">{task?.dueOn.slice(0, 10)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default ProjectDetails;
