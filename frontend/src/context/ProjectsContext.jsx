import { createContext, useReducer, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";

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
          id: p._id,
          categories: p.categories.map((c, index) => ({
            ...c,
            id: index,
            _id: c._id,
            tasks: c.tasks.map(t => ({ ...t, id: t._id, _id: t._id })),
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
    case "projects/deleteTask": {
      const { projectId, categoryId, taskId } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              categories: project.categories.map(category => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    tasks: category.tasks.filter(t => t.id !== taskId && t._id !== taskId),
                  };
                }
                return category;
              }),
            };
          }
          return project;
        }),
      };
    }
    case "projects/setActive":
      return { ...state, activeProjectId: action.payload };
    case "projects/addTask": {
      const { projectId, categoryId, task } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              categories: project.categories.map(category => {
                if (category.id === categoryId) {
                  return { ...category, tasks: [...category.tasks, task] };
                }
                return category;
              }),
            };
          }
          return project;
        }),
      };
    }
    case "projects/updateTaskParticipants": {
      const { projectId, categoryId, taskId, participants } = action.payload;
      return {
        ...state,
        projects: state.projects.map(project => {
          if (project.id === projectId) {
            return {
              ...project,
              categories: project.categories.map(category => {
                if (category.id === categoryId) {
                  return {
                    ...category,
                    tasks: category.tasks.map(task => {
                      if (task.id === taskId) return { ...task, participants };
                      return task;
                    }),
                  };
                }
               return category;
              }),
            };
          }
          return project;
        }),
      };
    }

    default:
      return state;
  }
}


export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { projects, activeProjectId } = state;
  const { user } = useAuth();

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
    dispatch({ type: "projects/add", payload: project });
  }

  async function removeProject(project) {
    dispatch({ type: "projects/remove", payload: project.id });
  }

  function setActiveProject(projectId) {
    dispatch({ type: "projects/setActive", payload: projectId });
  }

  async function addTaskToCategory(projectId, categoryId, taskFromFrontend) {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const category = project.categories.find(c => c._id === categoryId);
      if (!category) throw new Error("Category not found");

      category.tasks.push(taskFromFrontend);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const updatedProject = await res.json();
      if (!res.ok) throw new Error(updatedProject.message || "Failed to update project");

      return updatedProject;
    } catch (error) {
      alert("Error updating project: " + error.message);
    }
  }

  async function moveTaskToCategory(projectId, taskId, targetCategoryName, updatedTask = null) {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Project not found");

      const currentCategory = project.categories.find(c =>
        c.tasks.some(t => t.id === taskId)
      );
      if (!currentCategory) throw new Error("Task not found in any category");

      let task = currentCategory.tasks.find(t => t.id === taskId);

      if (updatedTask) {
        task = { ...task, ...updatedTask };
      }

      currentCategory.tasks = currentCategory.tasks.filter(t => t.id !== taskId);

      const targetCategory = project.categories.find(c => c.name === targetCategoryName);
      if (!targetCategory) throw new Error(`Category "${targetCategoryName}" not found`);

      targetCategory.tasks.push(task);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const updatedProject = await res.json();
      if (!res.ok) throw new Error(updatedProject.message || "Failed to update project");

      return updatedProject;
    } catch (error) {
      alert("Error moving task: " + error.message);
    }
  }

  async function deleteTaskFromCategory(projectId, categoryId, taskId) {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) throw new Error("Error");

      const category = project.categories.find(c => c.id === categoryId);
      if (!category) throw new Error("Error");

      const task = category.tasks.find(t => t.id === taskId || t._id === taskId);
      if (!task) throw new Error("Error");

      if (task.creatorAccountName !== user.username && !user.isAdmin) {
        alert("Vain tehtävän luonut käyttäjä tai admin voi poistaa tämän tehtävän.");
        return;
      }

      category.tasks = category.tasks.filter(t => t.id !== taskId && t._id !== taskId);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      const updatedProject = await res.json();
      if (!res.ok) throw new Error(updatedProject.message || "Error");

      dispatch({ type: "projects/deleteTask", payload: { projectId, categoryId, taskId } });

      return updatedProject;
    } catch (error) {
      alert("Error: " + error.message);
    }
  }

  async function joinTask(projectId, categoryId, taskId, username) {
    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const category = project.categories.find(c => c.id === categoryId);
    if (!category) return;

    const task = category.tasks.find(t => t.id === taskId || t._id === taskId);
    if (!task) return;

    task.participants = task.participants || [];
    if (!task.participants.some(p => p.username === username)) {
      task.participants.push({ username });

      await fetch(`${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      dispatch({
        type: "projects/updateTaskParticipants",
        payload: {
          projectId,
          categoryId,
          taskId,
          participants: task.participants
        }
      });
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
        moveTaskToCategory,
        deleteTaskFromCategory,
        joinTask,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (!context) throw new Error("useProjects must be used within a ProjectsProvider");
  return context;
}
