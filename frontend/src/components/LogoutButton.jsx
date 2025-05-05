// src/components/LogoutButton.jsx
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div style={{ textAlign: "right", marginBottom: "1rem" }}>
      <button
        onClick={handleLogout}
        style={{
          background: "#dc3545",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default LogoutButton;
