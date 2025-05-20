import { Link } from "react-router-dom";
const Signup = () => {
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
        <h3 className="text-center mt-4">Sign Up </h3>
        <p className="text-center text-lightgray">Please enter your details</p>
        <form>
          <label htmlFor="name" className="mb-2">
            Name:{" "}
          </label>
          <input
            className="mb-4 form-control"
            type="text"
            required
            id="name"
            placeholder="Enter your name"
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
          />
          <label className="mb-2" htmlFor="password">
            Password:
          </label>
          <input
            type="password"
            id="password"
            className="form-control mb-4"
            placeholder="Password"
          />
          <button className="btn btn-primary mt-2">Sign Up</button>
          <p className="no-account">
            Already have an account? <Link to="/login">Sign In</Link>
          </p>
        </form>
      </div>
    </>
  );
};
export default Signup;
