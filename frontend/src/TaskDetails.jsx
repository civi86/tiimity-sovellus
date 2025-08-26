import { useParams, Link, useNavigate } from "react-router-dom";
import { useProjects } from "./context/ProjectsContext";
import { useAuth } from "./context/AuthContext";
import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./TaskDetails.css";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { projects, moveTaskToCategory, deleteTaskFromCategory, joinTask } = useProjects();
  const { username, user } = useAuth();
  const navigate = useNavigate();

  const [joined, setJoined] = useState(false);

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
        return true;
      }
      return false;
    });
  });

  useEffect(() => {
    if (foundTask) {
      setJoined(foundTask.participants?.includes(username) || false);
    }
  }, [foundTask, username]);

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
        alert("Virhe poistettaessa tehtävää");
      }
    }
  };

  const handleMoveToInProgress = async () => {
    const github = prompt("Syötä linkki GitHub-repositorioon");
    const teams = prompt("Syötä koodi Teams tiimiisi");

    if (!github || !teams) {
      alert("Molemmat linkit ovat pakollisia!");
      return;
    }

    const updatedTask = { ...foundTask, github, teams };

    await moveTaskToCategory(foundProject.id, foundTask._id, "Projekti käynnissä", updatedTask);

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

  const handleJoin = async () => {
    if (!user || !user.username) {
      return alert("Kirjaudu ensin liittyäksesi tehtävään!");
    }
    if (joined) return alert("Olet jo liittynyt tähän tehtävään!");

    try {
      await joinTask(
        foundProject.id,
        foundCategory.id,
        foundTask._id || foundTask.id,
        username
      );
      setJoined(true);
      alert("Liityit projektiin!");
    } catch (err) {
      console.error(err);
      alert("Virhe liittyessä projektiin");
    }
  };

  return (
    <>
      <Header>
        <img
						src="/assets/logo.png"
						alt="Logo"
						style={{
							height: "40px",
							marginRight: "3rem",
							marginLeft: "1rem",
						}}
					/>
        <img
          src="/assets/it-velhot.png"
          alt="Logo"
          style={{ height: "40px", marginRight: "1rem", marginLeft: "85rem" }}
        />
      </Header>

      <div className="task-details-container">
        <h1><strong>Projektin tiedot</strong></h1>
        <p><strong>Projekti:</strong> {foundProject.name}</p>
        <p><strong>Projektin kategoria:</strong> {foundCategory.name}</p>
        <p><strong>Projektin aihe:</strong> {foundTask.title || "Ei otsikkoa"}</p>
        <p><strong>Projektin kuvaus:</strong> {foundTask.description || "Ei kuvausta"}</p>
        {joined && (
        <>
          <p><strong>GitHub repositorio:</strong> {foundTask.github || "Ei linkkiä"}</p>
          <p><strong>Teams liittymiskoodi:</strong> {foundTask.teams || "Ei linkkiä"}</p>
        </>
        )}

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
