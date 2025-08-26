import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

function Header({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="flex items-center justify-between bg-white p-4 shadow-md">
      <div className="flex items-center gap-4">
        {children}
      </div>

      {user && (
        <Button onClick={handleLogout} className="bg-red-500 text-white">
          Kirjaudu ulos
        </Button>
      )}
    </header>
  );
}

export default Header;
