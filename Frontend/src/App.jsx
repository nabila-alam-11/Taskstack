import Sidebar from "./components/Sidebar";
import "../src/css/app.css";
import useFetch from "./useFetch";

const App = () => {
  const { data, error } = useFetch(
    "https://workasana-backend-eight.vercel.app/auth/me",
    []
  );
  console.log(data);
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="main">
        <h1 className="title">Dashboard</h1>
      </div>
    </div>
  );
};
export default App;
