import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      setIsValid(false);
      return;
    }

    // Validate token by checking /api/auth/me endpoint
    const validateToken = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/auth/me", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        
        if (response.ok) {
          setIsValid(true);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("userName");
          setIsValid(false);
        }
      } catch (error) {
        console.error("Token validation error:", error);
        setIsValid(false);
      }
    };

    validateToken();
  }, []);

  if (isValid === null) {
    return <div className="flex items-center justify-center min-h-screen"><p>Loading...</p></div>;
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
