import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import Projects from "./pages/Projects.jsx";
import Teams from "./pages/Teams.jsx";
import Report from "./pages/Report.jsx";
import Settings from "./pages/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/dashboard",
    element: <App />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/projects",
    element: <Projects />,
  },
  {
    path: "/teams",
    element: <Teams />,
  },
  {
    path: "/report",
    element: <Report />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
