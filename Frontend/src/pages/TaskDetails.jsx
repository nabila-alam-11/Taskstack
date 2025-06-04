import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import "../css/tasks.css";
import useTaskContext from "../contexts/TaskContext";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";

const TaskDetails = () => {
  const { taskId } = useParams();
  const { data, loading } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const taskDetail = data?.find((task) => task._id === taskId);

  const [status, setStatus] = useState(taskDetail?.status || "");

  useEffect(() => {
    if (taskDetail) {
      setStatus(taskDetail.status);
    }
  }, [taskDetail]);

  const { updateTaskStatus } = useTaskContext();

  const handleClick = async (e) => {
    e.preventDefault();
    setStatus("Completed");
    try {
      await updateTaskStatus(taskId, {
        status: "Completed",
      });
      window.location.reload();
      setStatus("Completed");
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
      <Sidebar />
      <h1 className="title" style={{ marginBottom: "2rem" }}>
        Task: {taskDetail?.name}
      </h1>
      {!loading ? (
        <>
          <div
            className="d-flex justify-content-between"
            style={{ width: "71rem" }}
          >
            <h5 className="task-list-heading" style={{ marginBlock: "0rem" }}>
              Task Details
            </h5>
            <button className="complete-btn" onClick={handleClick}>
              {status === "Completed" ? "Completed" : "Mark as Complete"}
            </button>
          </div>
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
              <strong>Due Date: </strong>
              {taskDetail?.dueOn.slice(0, 10)}
            </li>
            <li className="list-group-item">
              <strong>Time To Complete: </strong>
              {taskDetail?.timeToComplete} days
            </li>
          </ul>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
export default TaskDetails;
