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
                    tasks: category.tasks.filter(
                      t => t.id !== taskId && t._id !== taskId
                    ),
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

function normalizeProject(project, username) {
  return {
    ...project,
    categories: project.categories.map(category => ({
      ...category,
      creator: category.creator || username,
      tasks: category.tasks.map(task => ({
        ...task,
        creator: task.creator || username,
        participants: task.participants
          ? task.participants.map(p => (typeof p === "string" ? p : p.username))
          : [],
      })),
    })),
  };
}

export function ProjectsProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { projects } = state;
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

  const addProject = async project => {
    dispatch({ type: "projects/add", payload: project });
  };

  const removeProject = async project => {
    dispatch({ type: "projects/remove", payload: project.id });
  };

  const setActiveProject = projectId => {
    dispatch({ type: "projects/setActive", payload: projectId });
  };

  const addTaskToCategory = async (projectId, categoryId, taskFromFrontend) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const category = project.categories.find(c => c._id === categoryId);
    if (!category) throw new Error("Category not found");

    category.tasks.push(taskFromFrontend);

    const normalizedProject = normalizeProject(project, user.username);

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedProject),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update project");

    return data;
  };

  const moveTaskToCategory = async (projectId, taskId, targetCategoryName, updatedTask = null) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const currentCategory = project.categories.find(c =>
      c.tasks.some(t => t.id === taskId)
    );
    if (!currentCategory) throw new Error("Task not found in any category");

    let task = currentCategory.tasks.find(t => t.id === taskId);
    if (updatedTask) task = { ...task, ...updatedTask };

    currentCategory.tasks = currentCategory.tasks.filter(t => t.id !== taskId);

    const targetCategory = project.categories.find(c => c.name === targetCategoryName);
    if (!targetCategory) throw new Error(`Category "${targetCategoryName}" not found`);

    targetCategory.tasks.push(task);

    const normalizedProject = normalizeProject(project, user.username);

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedProject),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to move task");

    return data;
  };

  const deleteTaskFromCategory = async (projectId, categoryId, taskId) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) throw new Error("Project not found");

    const category = project.categories.find(c => c.id === categoryId);
    if (!category) throw new Error("Category not found");

    const task = category.tasks.find(t => t.id === taskId || t._id === taskId);
    if (!task) throw new Error("Task not found");

    if (task.creatorAccountName !== user.username && !user.isAdmin) {
      alert("Vain tehtävän luonut käyttäjä tai admin voi poistaa tämän tehtävän.");
      return;
    }

    category.tasks = category.tasks.filter(t => t.id !== taskId && t._id !== taskId);

    const normalizedProject = normalizeProject(project, user.username);

    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(normalizedProject),
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to delete task");

    dispatch({ type: "projects/deleteTask", payload: { projectId, categoryId, taskId } });

    return data;
  };

  const joinTask = async (projectId, categoryId, taskId, username) => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return alert("Project not found");

    const category = project.categories.find(c => c.id === categoryId);
    if (!category) return alert("Category not found");

    const task = category.tasks.find(t => t.id === taskId || t._id === taskId);
    if (!task) return alert("Task not found");

    const participants = task.participants ? [...task.participants] : [];
    if (participants.includes(username)) return alert("Olet jo liittynyt projektiin!");

    participants.push(username);

    const normalizedProject = normalizeProject(project, username);

    normalizedProject.categories = normalizedProject.categories.map(c => {
      if (c.id === categoryId) {
        return {
          ...c,
          tasks: c.tasks.map(t => {
            if (t.id === taskId || t._id === taskId) return { ...t, participants };
            return t;
          }),
        };
      }
      return c;
    });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(normalizedProject),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to join task");

      dispatch({
        type: "projects/updateTaskParticipants",
        payload: { projectId, categoryId, taskId, participants },
      });

      alert("Liityit projektiin!");
    } catch (error) {
      console.error("Join task error:", error);
      alert("Virhe liittyessä projektiin: " + error.message);
    }
  };

  return (
    <ProjectsContext.Provider
      value={{
        projects,
        activeProjectId: state.activeProjectId,
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
