import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import UserContext from "../../context/UserContext";

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const { setC_id } = useContext(UserContext); // Access the setC_id function
  const location = useLocation(); // Access location to get the "from" state

  useEffect(() => {
    const fetchGoogleUser = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code"); // Extract the 'code' from the URL

      if (code) {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_APP_API_BASE_URL}/auth/google/callback`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ code }),
            }
          );

          const result = await res.json();

          if (result.C_id) {
            setC_id(result.C_id); // Set C_id in UserContext
            sessionStorage.setItem("C_id", result.C_id); // Save C_id to sessionStorage

            // Redirect to the page they tried to visit, or home
            const from = location.state?.from?.pathname || "/";
            navigate(from);
          } else {
            // If OAuth user is not registered yet
            navigate(`/register`, {
              state: {
                C_name: result.C_name, // Pass OAuth-provided name
                C_email: result.C_email, // Pass OAuth-provided email
                isOauth: true, // Flag to indicate OAuth registration
              },
            });
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        // If no code is present, likely the user canceled the login
        console.log("No authorization code found or login canceled.");
        navigate("/login"); // Redirect to login
      }
    };

    fetchGoogleUser();
  }, [navigate, setC_id, location.state]);

  return <h1>Loading...</h1>; // Add loading spinner or placeholder
};

export default GoogleCallback;
