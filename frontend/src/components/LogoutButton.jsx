import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <div className="logout-button-container">
      <button className="logout-button" onClick={handleLogout}>
        Se déconnecter
      </button>
    </div>
  );
};

export default LogoutButton;
