// GoogleCallback.tsx
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
      // console.log(code);
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
          console.log(result.email);

          if (res.ok) {
            setC_id(result.C_id); // Set C_id in UserContext
            sessionStorage.setItem("C_id", result.C_id); // Save C_id to sessionStorage

            // Check if a "from" location is provided (i.e., where the user came from)
            const from = location.state?.from?.pathname || "/";
            navigate(from); // Redirect back to the page they tried to visit, or home
          } else {
            console.log(`User needs to register: ${result.email}`);
            // Redirect to registration flow or handle accordingly
            navigate(`/register`);
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      } else {
        console.log("No authorization code found.");
      }
    };

    fetchGoogleUser();
  }, [navigate]);

  return (
    <div>
      <h1>Loading...</h1> {/* Or a loading spinner */}
    </div>
  );
};

export default GoogleCallback;
