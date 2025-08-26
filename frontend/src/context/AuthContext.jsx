import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();
const API_URL = "https://tiimity-backend.onrender.com";

const getUser = () => {
  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : { username: null, isAdmin: false, token: null };
};

const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    saveUser(user);
  }, [user]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Login failed");

      const loggedInUser = {
        username: data.username,
        token: data.token,
        isAdmin: data.isAdmin || false,
      };
      setUser(loggedInUser);
      saveUser(loggedInUser);

      return loggedInUser;
    } catch (error) {
      console.error("Login error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (username, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Signup failed");

      const newUser = {
        username: data.username,
        token: data.token || null,
        isAdmin: data.isAdmin || false,
      };
      setUser(newUser);
      saveUser(newUser);

      return newUser;
    } catch (error) {
      console.error("Signup error:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser({ username: null, isAdmin: false, token: null });
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, username: user.username, token: user.token, isAdmin: user.isAdmin, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
