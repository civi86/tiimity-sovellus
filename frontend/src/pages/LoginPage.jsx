import { useState } from "react";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const endpoint = isSignup ? "signup" : "login";
      const res = await fetch(`https://tiimity-backend.onrender.com/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (!isSignup) {
        // Save JWT token for future requests
        localStorage.setItem("token", data.token);
        alert("✅ Login successful");
      } else {
        alert("✅ Signup successful! Please log in.");
        setIsSignup(false);
      }
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

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
        {isSignup
          ? "Onko sinulla jo käyttäjä?"
          : "Eikö sinulla ole vielä käyttäjää?"}{" "}
        <button type="button" onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? "Kirjaudu" : "Rekisteröidy"}
        </button>
      </p>
    </div>
  );
}
