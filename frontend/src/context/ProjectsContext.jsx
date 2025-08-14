import { createContext, useReducer, useContext, useEffect } from "react";

import AddTask from "./AddTask";

export default function Project({ project }) {
  return (
    <div>
      <h2>{project.name}</h2>
      {project.categories.map(category => (
        <div key={category.id}>
          <h3>{category.name}</h3>
          <ul>
            {category.tasks.map(task => (
              <li key={task.id}>{task.title}</li>
            ))}
          </ul>

          {category.name === "Odottaa ryhmää" && (
            <AddTask projectId={project.id} />
          )}
        </div>
      ))}
    </div>
  );
}

const ProjectsContext = createContext();

const initialState = {
  projects: [],
  activeProjectId: null,
  isLoading: false,
  error: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "projects/loaded":
      return {
        ...state,
        projects: action.payload.map(p => ({
          ...p,
          id: p._id,  // backend _id as project frontend id
          categories: p.categories.map((c, index) => ({
            ...c,
            id: index,   // static frontend id: 0,1,2,3
           _id: c._id,  // backend _id for API calls
           tasks: c.tasks.map((t) => ({ ...t, id: t._id, _id: t._id })),
          })),
        })),
        isLoading: false,
        error: null,
      };

    case "projects/loading":
      return { ...state, isLoading: true, error: null };
    case "projects/error":
      return { ...state, isLoading: false, error: action.payload };
    case "projects/add":
      return { ...state, projects: [...state.projects, action.payload] };
    case "projects/remove":
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.payload),
      };
    case "projects/setActive":
      return { ...state, activeProjectId: action.payload };
    case "projects/addTask":
      const { projectId, categoryId, task } = action.payload;
      return {
        ...state,
        projects: state.projects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              categories: project.categories.map((category) => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    tasks: [...category.tasks, task],
                  };
                }
                return category;
              }),
            };
          }
          return project;
        }),
      };
    default:
      return state;
  }
}

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { projects, activeProjectId } = state;

  // Fetch projects from backend on mount
  useEffect(() => {
    async function loadProjects() {
      dispatch({ type: "projects/loading" });
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects`);
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        dispatch({ type: "projects/loaded", payload: data });
      } catch (err) {
        dispatch({ type: "projects/error", payload: err.message });
      }
    }
    loadProjects();
  }, []);

  async function addProject(project) {
    // API call can go here
    dispatch({ type: "projects/add", payload: project });
  }

  async function removeProject(project) {
    // API call can go here
    dispatch({ type: "projects/remove", payload: project.id });
  }

  function setActiveProject(projectId) {
    dispatch({ type: "projects/setActive", payload: projectId });
  }

  async function addTaskToCategory(projectId, categoryId, taskFromFrontend) {
  try {
    // Find the project locally
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    // Find the category
    const category = project.categories.find(c => c._id === categoryId);
    if (!category) throw new Error("Category not found");

    // Add the task locally
    category.tasks.push(taskFromFrontend);

    // Send the full updated project to backend
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });

    const updatedProject = await res.json();

    if (!res.ok) {
      throw new Error(updatedProject.message || "Failed to update project");
    }

    return updatedProject; // optional: return updated project
  } catch (error) {
    console.error("Error updating project:", error);
    alert("Error updating project: " + error.message);
  }
}


  return (
    <ProjectsContext.Provider
      value={{
        projects,
        activeProjectId,
        addProject,
        removeProject,
        setActiveProject,
        addTaskToCategory,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
