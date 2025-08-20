import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import "./LoginPage.css";


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const endpoint = isSignup ? "signup" : "login";
      const res = await fetch(`https://tiimity-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (!isSignup) {
        localStorage.setItem("token", data.token);
        login(username, password);
        alert("Kirjautuminen onnistui!");
        navigate("/dashboard");
      } else {
        alert("Rekisteröityminen onnistui!");
        setIsSignup(false);
      }
    } catch (err) {
      alert("Error:" + err.message);
    }
  }

  return (
    <>
      <div className="welcome-container">
        <img
          src="assets/logo.png"
          alt="Logo"
          style={{ height: "80px", marginLeft: "12rem", marginBottom: "0rem" }}
        />
        <p>serveri on hidas käynnistymään kirjautumisessa menee hetki</p>
      </div>

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
          {isSignup
            ? "Onko sinulla jo käyttäjä?"
            : "Eikö sinulla ole vielä käyttäjää?"}{" "}
          <button type="button" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? "Kirjaudu" : "Rekisteröidy"}
          </button>
        </p>
      </div>
    </>
  );
}
