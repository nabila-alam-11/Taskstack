import Sidebar from "../components/Sidebar";
import "../css/teams.css";
import "../css/sidebar.css";
import useFetch from "../useFetch";
import TeamModal from "../components/TeamModal";
import Loader from "../components/Loader";

const Teams = () => {
  const { data, loading } = useFetch(
    "https://workasana-backend-eight.vercel.app/v1/teams"
  );

  return (
    <div>
      <Sidebar />

      <div className="main">
        <h1 className="title">Teams Management</h1>
        {!loading ? (
          <>
            <div className="d-flex task-list-heading justify-content-between team">
              <h3>Teams List</h3>
              <TeamModal />
            </div>
            <ul className="list-group teams-list">
              {data?.map((team) => (
                <li className="list-group-item" key={team._id}>
                  {team?.name}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
export default Teams;
