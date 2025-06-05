import { NavLink } from "react-router-dom";
import { SidebarData } from "./SidebarData";

const Sidebar = () => {
  return (
    <>
      <button
        className="btn d-md-none m-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileSidebar"
        aria-controls="mobileSidebar"
      >
        ☰
      </button>

      {/* Desktop Sidebar */}
      <div className="d-none d-md-block  vh-100 border-end sidebar">
        <div
          className="text-white text-center py-3  brand"
          style={{ width: "250px" }}
        >
          Workasana
        </div>

        <ul className="nav flex-column">
          {SidebarData?.map((data, index) => (
            <li key={index} className="nav-item">
              <NavLink
                to={data.path}
                className={({ isActive }) =>
                  `nav-link d-flex align-items-center gap-3 ${
                    isActive ? "active fw-bold" : ""
                  }`
                }
              >
                <img src={data.icon} alt={data.name} width="20" height="20" />
                <span>{data.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Offcanvas Sidebar */}
      <div
        className="offcanvas offcanvas-start"
        tabIndex="-1"
        id="mobileSidebar"
        aria-labelledby="mobileSidebarLabel"
      >
        <div
          className="offcanvas-header  text-white"
          style={{ minHeight: "56px" }}
        >
          <h5 className="offcanvas-title fw-bold" id="mobileSidebarLabel">
            Workasana
          </h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>
        </div>
        <div className="offcanvas-body">
          <ul className="nav flex-column">
            {SidebarData?.map((data, index) => (
              <li key={index} className="nav-item">
                <NavLink
                  to={data.path}
                  className={({ isActive }) =>
                    `nav-link d-flex align-items-center gap-2 ${
                      isActive ? "active fw-bold text-primary" : "text-dark"
                    }`
                  }
                  data-bs-dismiss="offcanvas"
                >
                  <img src={data.icon} alt={data.name} width="20" height="20" />
                  <span>{data.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
