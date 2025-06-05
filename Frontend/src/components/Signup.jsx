import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(
        "https://workasana-backend-eight.vercel.app/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      localStorage.setItem("token", data.token);
      navigate("/dashboard");
    } catch (error) {
      setError("Something went wrong");
    }
  };
  return (
    <>
      <nav className="navbar bg-body-tertiary login-navbar">
        <div className="container-fluid">
          <a className="navbar-brand text-blue fw-3" href="#">
            Workasana
          </a>
        </div>
      </nav>
      <div className="form">
        <h3 className="text-center mt-4">Sign Up </h3>
        <p className="text-center text-lightgray">Please enter your details</p>
        <form onClick={handleSubmit}>
          <label htmlFor="name" className="mb-2">
            Name:{" "}
          </label>
          <input
            className="mb-4 form-control"
            type="text"
            required
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label className="mb-2" htmlFor="email">
            Email:
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
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary mt-2" type="submit">
            Sign Up
          </button>
          <p className="no-account">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </>
  );
};
export default Signup;
