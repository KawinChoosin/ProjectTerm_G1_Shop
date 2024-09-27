import React from "react";
import "./style_login.css"; // Assuming the CSS file is imported here

const LoginForm: React.FC = () => {
  return (
    <div className="wrapper">
      <form action="">
        <h1>Login</h1>
        <div className="input-box">
          <input type="text" placeholder="Username" required />
          <i className="bx bxs-user"></i>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Password" required />
          <i className="bx bxs-lock-alt"></i>
        </div>

        <div
          className="remember-forgot"
          style={{ marginTop: "1px", marginBottom: "5px" }}
        >
          <label>
            <input type="checkbox" style={{ marginRight: "5px" }} />
            Remember me
          </label>
          <a href="#">Forgot password?</a>
        </div>

        <button type="submit" className="btn_login">
          <span>Login</span>
        </button>

        <div
          className="button-divider-with-text"
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          <span className="divider-text">Log in with</span>
        </div>

        <button type="submit" className="btn_authG">
          <img
            className="google"
            src="/element/google.png"
            alt="Google"
            style={{ height: "25px" }}
          />
        </button>

        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <a href="https://www.google.com/">Register</a>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
