import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";

export default function LoginPage() {
  const { login, signup } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      signup(username, password);
    } else {
      login(username, password);
    }
  };

  return (
    <div className="login-container">
      <h1>{isSignup ? "Rekisteröidy" : "Kirjaudu"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Käyttäjänimi"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Salasana"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isSignup ? "Rekisteröidy" : "Kirjaudu"}</button>
      </form>
      <p>
        {isSignup ? "Onko sinulla jo käyttäjä?" : "Eikö sinulla ole vielä käyttäjää?"}{" "}
        <button onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Kirjaudu" : "Rekisteröidy"}
        </button>
      </p>
    </div>
  );
}
