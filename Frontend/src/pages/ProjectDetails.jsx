import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";

const ProjectDetails = () => {
  const { projectId } = useParams();
  const { data } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );
  const task = data?.filter((task) => task?.project?._id === projectId);
  console.log(task);
  return (
    <div>
      <Sidebar />
      <div className="main">
        <h1>Project: </h1>
      </div>
    </div>
  );
};
export default ProjectDetails;
