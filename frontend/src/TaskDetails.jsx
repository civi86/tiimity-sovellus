import { useParams, Link, useNavigate } from "react-router-dom";
import { useProjects } from "./context/ProjectsContext";
import { useAuth } from "./context/AuthContext";
import { useState } from "react";
import Header from "./components/Header";
import "./TaskDetails.css";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { projects, moveTaskToCategory, deleteTaskFromCategory, joinTask } = useProjects();
  const { user } = useAuth();
  const navigate = useNavigate();

  let foundTask = null;
  let foundCategory = null;
  let foundProject = null;

  projects.some(project => {
    return project.categories.some(category => {
      const task = category.tasks.find(t => String(t._id || t.id) === taskId);
      if (task) {
        foundTask = task;
        foundCategory = category;
        foundProject = project;
        console.log(foundTask);
        console.log(foundTask.creatorAccountName);
        console.log(foundTask.createdAt);
        return true;
      }
      return false;
    });
  });

  if (!foundTask) {
    return (
      <div className="task-details-container">
        <p>Projektia ei löytynyt.</p>
        <Link className="back-link" to="/dashboard">← Takaisin</Link>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm("Haluatko varmasti poistaa tämän projektin?")) {
      try {
        await deleteTaskFromCategory(
          foundProject.id,
          foundCategory.id,
          foundTask.id || foundTask._id
        );
        navigate("/dashboard");
      } catch (error) {
        console.error(error);
        alert("Error");
      }
    }
  };

  const handleMoveToInProgress = async () => {
    const github = prompt("Syötä linkki GitHub-repositorioon");
    const teams = prompt("Syötä linkki Teams ryhmään");

    if (!github || !teams) {
      alert("Molemmat linkit ovat pakollisia!");
      return;
    }

    const updatedTask = { ...foundTask, github, teams };

    await moveTaskToCategory(foundProject.id, updatedTask._id, "Projekti käynnissä", updatedTask);

    await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${foundProject.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(foundProject),
    });

    alert("Tehtävä siirretty 'Projekti käynnissä' -kategoriaan ja linkit tallennettu!");
    navigate("/dashboard");
  };

  const handleMoveToInComplete = () => {
    moveTaskToCategory(foundProject.id, foundTask._id, "Projekti valmis");
    alert("Tehtävä siirretty 'Valmis' -kategoriaan!");
    navigate("/dashboard");
  };

  const [joined, setJoined] = useState(
    foundTask.participants?.includes(user?.username) || false
  );

  const handleJoin = async () => {
    if (!user) return alert("Kirjaudu ensin liittyäksesi tehtävään!");
    if (joined) return alert("Olet jo liittynyt tähän tehtävään!");

    await joinTask(
      foundProject.id,
      foundCategory.id,
      foundTask._id || foundTask.id,
      user.username
    );

    alert("Liityit projektiin!");
  };

  return (
    <>
      <Header>
        <img
          src="/assets/it-velhot.png"
          alt="Logo"
          style={{ height: "40px", marginRight: "9rem", marginLeft: "2rem" }}
        />
      </Header>

      <div className="task-details-container">
        <h1><strong>Projektin tiedot</strong></h1>
        <p><strong>Projekti:</strong> {foundProject.name}</p>
        <p><strong>Projektin kategoria:</strong> {foundCategory.name}</p>
        <p><strong>Projektin aihe:</strong> {foundTask.title || "Ei otsikkoa"}</p>
        <p><strong>Projektin kuvaus:</strong> {foundTask.description || "Ei kuvausta"}</p>
        <p><strong>Projektin luoja:</strong> {foundTask.creatorAccountName || "Tuntematon"}</p>
        <p><strong>Projekti luotu:</strong> {foundTask.createdAt || "Tuntematon"}</p>
        <p><strong>GitHub repositorio:</strong> {foundTask.github || "Ei linkkiä"}</p>
        <p><strong>Teams linkki:</strong> {foundTask.teams || "Ei linkkiä"}</p>

        <p>
          <strong>Osallistujat:</strong>{" "}
          {foundTask.participants && foundTask.participants.length > 0
            ? foundTask.participants
              .map(p => (typeof p === "string" ? p : p.username))
              .join(", ")
            : "Ei osallistujia"}
        </p>


        <Link className="back-link" to="/dashboard">← Takaisin projekteihin</Link>
        <button onClick={handleMoveToInProgress}>Siirrä projekti työn alle&nbsp;</button>
        <button onClick={handleMoveToInComplete}>Siirrä projekti valmiisiin</button>
        <button onClick={handleDelete}>Poista projekti</button>

        {!joined && <button onClick={handleJoin}>Liity projektiin</button>}
        {joined && <span style={{ color: "green", fontWeight: "bold" }}>Olet liittynyt projektiin!</span>}
      </div>
    </>
  );
}
