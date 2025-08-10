import { useProjects } from "./context/ProjectsContext";
import Button from "./components/Button";
import Header from "./components/Header";
import { Link } from "react-router-dom";


function App() {
  const { projects, activeProjectId, setActiveProject, addTaskToCategory } = useProjects();

  const setSelectedProject = (projectId) => setActiveProject(projectId);

  const addTask = () => {
  const title = prompt("Syötä projektin nimi:");
  if (!title) return;

  const description = prompt("Syötä projektin kuvaus:") || "";
  const creator = prompt("Syötä nimesi:") || "Unknown";

  const activeProject = projects.find(p => p.id === activeProjectId);
  if (activeProject?.categories.length > 0) {
    const categoryId = activeProject.categories[0].id;
    addTaskToCategory(activeProjectId, categoryId, title, description, creator);
  }
};

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      <Header>
        <img src="assets/it-velhot.png" alt="Logo" style={{ height: "40px", marginRight: "9rem", marginLeft: "2rem" }} />
        {projects.map(project => (
          <Button
            key={project.id}
            className={project.id === activeProjectId ? "active" : ""}
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
          </Button>
        ))}
      </Header>

      {activeProject && (
        <div className="project-details">
          <h2>{activeProject.name}</h2>

          <Button onClick={addTask}>+ Aloita Projekti</Button>

          {activeProject.categories.map(category => (
            <div key={category.id} className="category">
              <h3>{category.name}</h3>
              {category.tasks.length > 0 ? (
                <ul>
                  {category.tasks.map(task => (
                    <li key={task.id}>
                      <Link to={`/task/${task.id}`}>
                        <strong>{task.title}</strong>
                      </Link>: {task.description} <em>(projektin luoja: {task.creator})</em>
          </li>
        ))}
      </ul>
    ) : (
      <p>Ei projekteja.</p>
    )}
  </div>
))}
        </div>
      )}
    </>
  );
}


export default App;
