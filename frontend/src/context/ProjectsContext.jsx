import { createContext, useContext, useState } from "react";

const ProjectsContext = createContext();

export function ProjectsProvider({ children }) {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "Python Ryhmätyö: Peliprojekti #631",
      categories: [
        {
          id: 1,
          name: "Projektit",
          tasks: [
          ]
        }
      ]
    },
    {
      id: 2,
      name: "JavaScript Canvas API #658",
      categories: [
        {
          id: 1,
          name: "Projektit",
          tasks: [
          ]
        }
      ]
    },
    {
    id: 3,
      name: "OHJ: Ohjelmointi-tutkinnonosan NÄYTTÖ #664",
      categories: [
        {
          id: 1,
          name: "Projektit",
          tasks: [
          ]
        }
      ]
    },
    {
    id: 4,
      name: "OKT: Ohjelmistokehittäjänä toimiminen - NÄYTTÖ #753",
      categories: [
        {
          id: 1,
          name: "Projektit",
          tasks: [
          ]
        }
      ]
    }
  ]);

  const [activeProjectId, setActiveProjectId] = useState(projects[0]?.id);

  const setActiveProject = (projectId) => {
    setActiveProjectId(projectId);
  };

const addTaskToCategory = (projectId, categoryId, title, description = "", creator = "") => {
  setProjects((prev) =>
    prev.map((project) =>
      project.id === projectId
        ? {
            ...project,
            categories: project.categories.map((category) =>
              category.id === categoryId
                ? {
                    ...category,
                    tasks: [
                      ...category.tasks,
                      {
                        id: Date.now(),
                        title,
                        description,
                        creator,
                        completed: false,
                      },
                    ],
                  }
                : category
            ),
          }
        : project
    )
  );
};

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        activeProjectId,
        setActiveProject,
        addTaskToCategory
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  return useContext(ProjectsContext);
}
