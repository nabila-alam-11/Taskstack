import { NavLink } from "react-router-dom";
import "../css/sidebar.css";
import { SidebarData } from "./SidebarData";
const Sidebar = () => {
  return (
    <div>
      <h1 className="responsive-brand">Workasana</h1>
      <div className="sidebar">
        <h1 className="brand">Workasana</h1>
        <div className="line"></div>
        <ul>
          {SidebarData?.map((data, index) => (
            <li key={index}>
              <NavLink
                to={data.path}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <img src={data.icon} />
                <span className="sidebar-names">{data.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
export default Sidebar;
