import Sidebar from "../components/Sidebar";
import useFetch from "../useFetch";
import Profile from "../assets/profile.jpg";
import "../css/settings.css";
import { Link, Navigate } from "react-router-dom";
import Loader from "../components/Loader";

const Settings = () => {
  const { data: user, loading } = useFetch(
    "https://workasana-backend-eight.vercel.app/auth/me",
    []
  );

  const { data: tasks } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/tasks"
  );

  const userTasks = tasks?.filter((task) =>
    task?.owners?.some((owner) => owner.name === user?.name)
  );
  console.log(userTasks);
  return (
    <div>
      <Sidebar />

      <h1 className="title" style={{ width: "86dvw" }}>
        Settings
      </h1>
      {!loading ? (
        <>
          <div className="d-flex">
            <img src={Profile} className="profile-img" />
            <div>
              <h3 className="user-name">{user?.name}</h3>
              <p>Full Stack Developer</p>
            </div>
          </div>
          <div className="user-tasks">
            <h3>My Tasks</h3>
            <ul className="list-group">
              {userTasks?.map((task) => (
                <li key={task._id} className="list-group-item">
                  {task?.name}
                </li>
              ))}
            </ul>
          </div>
          <Link to="/logout" className="logout-btn">
            Logout
          </Link>
        </>
      ) : (
        <Loader />
      )}
    </div>
  );
};
export default Settings;
