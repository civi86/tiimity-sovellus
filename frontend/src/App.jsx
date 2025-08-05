import { useState } from "react"
import Button from "./components/Button"
import Header from "./components/Header"
import {useProjects} from "./context/ProjectsContext"


function App() {
  const { projects, activeProjectId, setActiveProject } = useProjects();

  const setSelectedProject = (projectId) => {
    setActiveProject(projectId);
  };

  const addCategory = () => {
    console.log("Lisää kategoria");
  };

  const activeProject = projects.find(p => p.id === activeProjectId);

  return (
    <>
      <Header>
        {/* Näytä projektipainikkeet */}
        {projects.map((project) => (
          <Button
            key={project.id}
            className={project.id === activeProjectId ? "active" : ""}
            onClick={() => setSelectedProject(project.id)}
          >
            {project.name}
          </Button>
        ))}
        <Button onClick={addCategory}>+ Lisää kategoria</Button>
      </Header>

      {/* Näytä aktiivisen projektin tehtävät */}
      {activeProject && (
        <div className="project-details">
          <h2>{activeProject.name}</h2>

          {activeProject.categories.map((category) => (
            <div key={category.id} className="category">
              <h3>{category.name}</h3>

              {category.tasks.length > 0 ? (
                <ul>
                  {category.tasks.map((task) => (
                    <li key={task.id}>
                      <input type="checkbox" checked={task.completed} readOnly />
                      {task.title}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Ei tehtäviä.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}


export default App
