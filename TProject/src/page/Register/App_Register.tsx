import React, { useState, useContext, useCallback } from "react";
import "./style_register.css";
import { AuthForm } from "./components/Auth.component.register";
import { useNavigate, useLocation } from "react-router-dom";
import Alert from "@mui/material/Alert";
import bgImage from "../bg.avif"; // Import the background image
import UserContext from "../../context/UserContext";

const RegisterForm: React.FC = () => {
  const { setC_id } = useContext(UserContext); // Access the setC_id function
  const navigate = useNavigate();
  const location = useLocation();

  // Extract OAuth-provided data if available
  const oauthData = location.state || {}; // Contains C_name, C_email, isOauth

  const [credentials, setCredentials] = useState({
    C_name: oauthData.C_name || "", // Pre-fill if available
    C_email: oauthData.C_email || "", // Pre-fill if available
    C_password: "",
    C_gender: "",
    C_age: 0,
    T_pnum: "",
  });

  const [birthday, setBirthday] = useState("");
  const [repassword, setRepassword] = useState({ re_password: "" });
  const [error, setError] = useState("");
  const [phoneError, setPhoneError] = useState(""); // State for phone number validation
  const [passwordMatchError] = useState("");

  // Calculate age based on birthday
  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birthDate = new Date(birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const register = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();

      // Debug log to track form submissions
      // console.log("Register form submitted");

      // Prevent double submission
      if (isSubmitting) {
        // console.log("Form is already submitting, skipping...");
        return;
      }

      setIsSubmitting(true);

      // Validate phone number
      if (
        credentials.T_pnum.length !== 10 ||
        !/^\d{10}$/.test(credentials.T_pnum)
      ) {
        setPhoneError("Phone number must contain 10 digits");
        setIsSubmitting(false);
        return;
      } else {
        setPhoneError("");
      }

      // Validate password match
      if (credentials.C_password !== repassword.re_password) {
        setError("Passwords do not match");
        setIsSubmitting(false);
        return;
      }

      // Debug log to confirm we're about to send the request
      // console.log("Sending register request...");

      try {
        const response = await fetch(
          `${import.meta.env.VITE_APP_API_BASE_URL}/register`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
          }
        );

        const result = await response.json();

        if (response.ok) {
          setC_id(result.C_id); // Set C_id in UserContext
          sessionStorage.setItem("C_id", result.C_id); // Save C_id to sessionStorage

          // console.log("Registration successful, redirecting...");
          const from = location.state?.from?.pathname || "/";
          navigate(from);
        } else {
          setError(result.error || "Failed to register");
        }
      } catch (error) {
        console.error("An error occurred during registration:", error);
        setError("An unexpected error occurred.");
      } finally {
        setIsSubmitting(false); // Re-enable the button
      }
    },
    [isSubmitting, credentials]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      const age = calculateAge(value);
      setCredentials({
        ...credentials,
        C_age: age,
      });
      setBirthday(value);
    } else {
      setCredentials({
        ...credentials,
        [name]: value,
      });
      setRepassword({
        ...repassword,
        [name]: value,
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <AuthForm
        onSubmit={register}
        style={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div className="wrapper">
          <h1>Register</h1>

          {error && (
            <Alert variant="filled" severity="error" sx={{ mb: 3, mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Hide Username and Email for OAuth Users */}
          {!oauthData.isOauth && (
            <>
              <div className="input-box">
                <input
                  type="text"
                  name="C_name"
                  placeholder=" "
                  value={credentials.C_name}
                  onChange={handleChange}
                  required
                />
                <label>Username</label>
                <i className="bx bxs-user"></i>
              </div>

              <div className="input-box">
                <input
                  type="email"
                  name="C_email"
                  placeholder=" "
                  value={credentials.C_email}
                  onChange={handleChange}
                  required
                />
                <label>Email</label>
                <i className="bx bxs-envelope"></i>
              </div>
              <div className="input-box">
                <input
                  type="password"
                  name="C_password"
                  placeholder=" "
                  value={credentials.C_password}
                  onChange={handleChange}
                  required
                />
                <label>Password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>

              <div className="input-box">
                <input
                  type="password"
                  name="re_password"
                  placeholder=" "
                  value={repassword.re_password}
                  onChange={handleChange}
                  required
                />
                <label>Re-type password</label>
                <i className="bx bxs-lock-alt"></i>
              </div>

              {passwordMatchError && (
                <p className="error-message">{passwordMatchError}</p>
              )}
            </>
          )}

          <div className="input-box">
            <input
              type="date"
              name="birthday"
              placeholder=" "
              value={birthday}
              onChange={handleChange}
              required
            />
            <i className="bx bxs-calendar"></i>
          </div>

          <div className="input-box">
            <input
              type="text"
              name="T_pnum"
              placeholder=" "
              value={credentials.T_pnum}
              onChange={handleChange}
              required
            />
            <label>Phone Number</label>
            <i className="bx bxs-phone"></i>
          </div>

          {/* Show phone number validation error */}
          {phoneError && (
            <Alert variant="filled" severity="error" sx={{ mb: 3, mt: 2 }}>
              {phoneError}
            </Alert>
          )}

          <div className="input-box">
            <select
              name="C_gender"
              value={credentials.C_gender}
              onChange={handleChange}
              required
            >
              <option value="">Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <i className="bx bxs-user"></i>
          </div>

          <button type="submit" className="btn_login" disabled={isSubmitting}>
            <span>{isSubmitting ? "Submitting..." : "Register"}</span>
          </button>
        </div>
      </AuthForm>
    </div>
  );
};

export default RegisterForm;
