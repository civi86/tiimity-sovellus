import { useParams, Link } from "react-router-dom";
import { useProjects } from "./context/ProjectsContext";
import Header from "./components/Header";
import "./TaskDetails.css";

export default function TaskDetails() {
  const { taskId } = useParams();
  const { projects } = useProjects();

  let foundTask = null;
  let foundCategory = null;
  let foundProject = null;

  outerLoop:
  for (const project of projects) {
    for (const category of project.categories) {
      const task = category.tasks.find(t => t.id.toString() === taskId);
      if (task) {
        foundTask = task;
        foundCategory = category;
        foundProject = project;
        break outerLoop;
      }
    }
  }

  if (!foundTask) {
    return (
      <div className="task-details-container">
        <p>Projektia ei löytynyt.</p>
        <Link className="back-link" to="/">Takaisin</Link>
      </div>
    );
  }

  return (
  <>
    <Header>
      <img
        src="/public/assets/it-velhot.png"
        alt="Logo"
        style={{ height: "40px", marginRight: "9rem", marginLeft: "2rem" }}
      />
    </Header>

    <div className="task-details-container">
      <h2>Task Details</h2>
      <p><strong>Projekti:</strong> {foundProject.name}</p>
      <p><strong>Projektin kategoria:</strong> {foundCategory.name}</p>
      <p><strong>Projektin aihe:</strong> {foundTask.title}</p>
      <p><strong>Projektin kuvaus:</strong> {foundTask.description}</p>
      <p><strong>Projektin luoja:</strong> {foundTask.creator || "Unknown"}</p>
      <p><strong>Valmis?:</strong> {foundTask.completed ? "Valmis" : "Ei"}</p>

      <Link className="back-link" to="/">← Takaisin projekteihin</Link>
    </div>
  </>
);

}
