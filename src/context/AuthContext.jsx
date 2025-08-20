import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

const API_URL = "https://tiimity-backend.onrender.com";

const getUser = () => {
  const data = localStorage.getItem("user");
  const user = data 
    ? JSON.parse(data) 
    : {
        username: null,
        isAdmin: false,
        token: null
      };
  return user;
};


const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    saveUser(user);
  }, [user]);

  async function login(username, password) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Kirjautuminen epäonnistui");

      setUser({ 
        username: data.username, 
        isAdmin: data.isAdmin || false,
        token: data.token
      });
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

      setUser({ 
        username: data.username, 
        isAdmin: data.isAdmin || false
      });

      
    } catch (error) {
      console.error("Error:", error.message);
    }
  }

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
    value={{
      username: user.username ,
      token: user.token,
      login,
      signup,
      logout
    }}
  >{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
