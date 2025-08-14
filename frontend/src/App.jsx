import { useProjects } from "./context/ProjectsContext";
import Button from "./components/Button";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";

function App() {
  const { projects, activeProjectId, setActiveProject, addTaskToCategory } = useProjects();

  const setSelectedProject = (projectId) => setActiveProject(projectId);

  const addTask = async () => {
    const title = prompt("Syötä tehtävän nimi:");
    if (!title) return;

    const description = prompt("Syötä tehtävän kuvaus:") || "";
    const creator = prompt("Syötä nimesi:") || "Unknown";

    const activeProject = projects.find(p => p.id === activeProjectId);
    if (!activeProject) return alert("Valitse projekti ensin");

    const category = activeProject.categories[0]; // first category
    const newTask = { title, description, creator };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${activeProject._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(activeProject), // send full updated project
       }
      );

      const updatedProject = await res.json();

      if (!res.ok) {
        throw new Error(updatedProject.message || "Failed to update project");
      }

    // Update frontend state
      addTaskToCategory(activeProject.id, category._id, newTask);
    } catch (error) {
      alert("Error updating project: " + error.message);
    }
  };


  const activeProject = projects.find((p) => p.id === activeProjectId);

  return (
    <>
      <Header>
        <img
          src="assets/it-velhot.png"
          alt="Logo"
          style={{ height: "40px", marginRight: "9rem", marginLeft: "2rem" }}
        />
        {projects.map((project) => (
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
        <div className="project-details bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6">{activeProject.name}</h2>

          <Button
            className="mb-8 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300"
            onClick={addTask}
          >
            + Luo Tehtävä
          </Button>

          {activeProject.categories.map((category) => (
            <div key={category.id} className="category mb-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-3">
                {category.name}
              </h3>

              {category.tasks.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                  {category.tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">Ei Tehtäviä.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default App;
