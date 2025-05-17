import "../css/login.css";
const Login = () => {
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
        <form>
          <label className="mb-2" htmlFor="email">
            Email:{" "}
          </label>
          <input
            type="text"
            id="email"
            required
            className="form-control mb-4"
            placeholder="Enter your email"
          />
          <label className="mb-2" htmlFor="password">
            Password:{" "}
          </label>
          <input
            type="password"
            id="password"
            className="form-control mb-4"
            placeholder="Password"
          />
          <button className="btn btn-primary mt-2">Sign In</button>
        </form>
      </div>
    </>
  );
};
export default Login;
