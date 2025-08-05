import { createContext, useReducer, useContext } from "react";

const ProjectsContext = createContext();

const initialState = {
    projects: [
        {
            id: '1',
            name: 'OHJ2: Python-tiimityö',
            categories: [
                {
                    id: 'category1',
                    name: 'Kategoria 1',
                    tasks: [
                        {
                            id: 'task1',
                            title: 'Tehtävä 1',
                            completed: false,
                        },
                        {
                            id: 'task2',
                            title: 'Tehtävä 2',
                            completed: true,
                        }
                    ]
                },
                {
                    id: 'category2',
                    name: 'Kategoria 2',
                    tasks: []
                }
            ]
        },
        {
            id: '2',
            name: 'OHJ4: CanvasAPI',
            categories: [
                {
                    id: 'category1',
                    name: 'Kategoria 1',
                    tasks: [
                        {
                            id: 'task1',
                            title: 'Tehtävä 1',
                            completed: false,
                        },
                        {
                            id: 'task2',
                            title: 'Tehtävä 2',
                            completed: true,
                        }
                    ]
                },
                {
                    id: 'category2',
                    name: 'Kategoria 2',
                    tasks: []
                }
            ]
        },
        {
            id: '3',
            name: 'OHJ-näyttö',
            categories: [
                {
                    id: 'category1',
                    name: 'Kategoria 1',
                    tasks: [
                        {
                            id: 'task1',
                            title: 'Tehtävä 1',
                            completed: false,
                        },
                        {
                            id: 'task2',
                            title: 'Tehtävä 2',
                            completed: true,
                        }
                    ]
                },
                {
                    id: 'category2',
                    name: 'Kategoria 2',
                    tasks: []
                }
            ]
        },
        {
            id: '4',
            name: 'OKT-näyttö',
            categories: [
                {
                    id: 'category1',
                    name: 'Kategoria 1',
                    tasks: [
                        {
                            id: 'task1',
                            title: 'Tehtävä 1',
                            completed: false,
                        },
                        {
                            id: 'task2',
                            title: 'Tehtävä 2',
                            completed: true,
                        }
                    ]
                },
                {
                    id: 'category2',
                    name: 'Kategoria 2',
                    tasks: []
                }
            ]
        }
    ],
    isLoading: false,
    error: null,
    activeProjectId: null, // Active project ID
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
    <ProjectsContext.Provider value={{ projects, activeProjectId, addProject, removeProject, setActiveProject }}>
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
