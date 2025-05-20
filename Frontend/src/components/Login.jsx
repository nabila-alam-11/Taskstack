import { useState } from "react";
import "../css/login.css";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [passowrd, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://workasana-backend-4vnae8tgu-nabila-alams-projects.vercel.app/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, passowrd }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login Falied");
        return;
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <>
      <nav class="navbar bg-body-tertiary login-navbar">
        <div class="container-fluid">
          <a class="navbar-brand text-blue fw-3" href="#">
            Workasana
          </a>
        </div>
      </nav>
      <div className="form">
        <h3 className="text-center mt-4">Log in to your account</h3>
        <p className="text-center text-lightgray">Please enter your details</p>
        <form onSubmit={handleLogin}>
          <label className="mb-2" htmlFor="email">
            Email:{" "}
          </label>
          <input
            type="text"
            id="email"
            required
            className="form-control mb-4"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label className="mb-2" htmlFor="password">
            Password:{" "}
          </label>
          <input
            type="password"
            id="password"
            className="form-control mb-4"
            placeholder="Password"
            value={passowrd}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary mt-2" type="submit">
            Sign In
          </button>
          <p className="no-account">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
};
export default Login;
