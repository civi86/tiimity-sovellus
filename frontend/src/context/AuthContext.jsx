import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

const API_URL = "https://tiimity-backend.onrender.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  async function login(username, password) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kirjautuminen epäonnistui");

      setUser({ username: data.username });
      setToken(data.token);
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  async function signup(username, password) {
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kirjautuminen epäonnistui");

      setUser({ username });
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
