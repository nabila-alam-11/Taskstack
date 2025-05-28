import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import "../css/tasks.css";

const TaskDetails = () => {
  const { taskName } = useParams();
  const { data } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const taskDetail = data?.find((task) => task.name === taskName);
  return (
    <div>
      <Sidebar />
      <h1 className="title">Task: {taskName}</h1>
      <h5 className="task-list-heading">Task Details</h5>
      <ul className="list-group task-details">
        <li className="list-group-item">
          <strong>Project: </strong>
          {taskDetail?.project?.name}
        </li>
        <li className="list-group-item">
          <strong>Team: </strong>
          {taskDetail?.team?.name}
        </li>
        <li className="list-group-item">
          <strong>Owners: </strong>
          {taskDetail?.owners.map((owner) => owner.name).join(", ")}
        </li>
        <li className="list-group-item">
          <strong>Tags: </strong>
          {taskDetail?.tags.join(", ")}
        </li>
        <li className="list-group-item">
          <strong>Due Date: </strong>
          {taskDetail?.timeToComplete}
        </li>
        <li className="list-group-item">
          <strong>Status: </strong>
          {taskDetail?.status}
        </li>
        <li className="list-group-item">
          <strong>Time Remaining: </strong>
          {taskDetail?.timeToComplete}
        </li>
      </ul>
    </div>
  );
};
export default TaskDetails;
