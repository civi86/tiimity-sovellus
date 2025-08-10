import { createContext, useReducer, useContext } from "react";

const ProjectsContext = createContext();

const initialState = {
  projects: [
    {
      id: 1,
      name: "Python Ryhmätyö: Peliprojekti #631",
      categories: [
        {
          id: 1,
          name: "Odottaa ryhmää",
          tasks: []
        },
        {
          id: 2,
          name: "Projekti käynnissä",
          tasks: []
        },
        {
          id: 3,
          name: "Projekti valmis",
          tasks: []
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
          tasks: []
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
          tasks: []
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
          tasks: []
        }
      ]
    }
  ],
  activeProjectId: null,
  isLoading: false,
  error: null,
  
};


function reducer(state, action) {
    switch (action.type) {
        case "projects/loaded":
            return {
                ...state,
                projects: action.payload,
                isLoading: false,
                error: null,
            };
        case "projects/loading":
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case "projects/error":
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case "projects/add":
            return {
                ...state,
                projects: [...state.projects, action.payload],
            };
        case "projects/remove":
            return {
                ...state,
                projects: state.projects.filter(project => project.id !== action.payload),
            };
        case "projects/setActive":
            return {
                ...state,
                activeProjectId: action.payload,
            };
        case "projects/addTask":
            const { projectId, task } = action.payload;
            return {
                ...state,
                projects: state.projects.map(project => { 
                    if (project.id === projectId) {
                        return {
                            ...project,
                            categories: project.categories.map(category => {
                                if (category.id === project.categories[0].id) {
                                    return {
                                        ...category,
                                        tasks: [...category.tasks, task]
                                    };
                                }
                                return category;
                            })
                        };
                    }
                    return project;
                })
            };
        default:
            return state;
    }
}

export function ProjectsProvider({ children }) {
    const [{projects, activeProjectId}, dispatch] = useReducer(reducer, initialState);

  // LISÄÄ LOPUT TARVITTAVAT FUNKTIOT

  async function addProject(project) {
      // API KUTSU
      
      dispatch({ type: "projects/add", payload: project });
  }

  async function addTaskToCategory(projectId, title, description = "", creator = "")  {
    // Convert the above logic to use dispatch
    dispatch({
        type: "projects/addTask",
        payload: { projectId, task: { id: Date.now(), title, description, creator, completed: false }}
    });
};


  async function removeProject(project) {
      // API KUTSU TÄHÄN

      dispatch({ type: "projects/remove", payload: project.id });
  }

  function setActiveProject(projectId) {
      // API KUTSU TÄHÄN

      dispatch({ type: "projects/setActive", payload: projectId });
  }


  // LOPETA FUNKTIOIDEN LISÄÄMINEN

      return (
      <ProjectsContext.Provider value={{ projects, activeProjectId, addProject, removeProject, setActiveProject, addTaskToCategory }}>
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