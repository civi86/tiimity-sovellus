import { useState } from "react";
import { useProjects } from "./ProjectsContext";

export default function AddTask({ projectId }) {
  const [title, setTitle] = useState("");
  const { projects, addTaskToCategory } = useProjects();

  const handleAddTask = async () => {
    if (!title.trim()) return;

    const project = projects.find(p => p.id === projectId);
    if (!project) return;

    const waitingCategory = project.categories.find(c => c.name === "Odottaa ryhmää");
    if (!waitingCategory) return;

    const newTask = {
      title,
      description: "",
      creator: "Unknown",
      completed: false,
      github: "",
      teams: "",
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/projects/${projectId}/categories/${waitingCategory._id}/tasks`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newTask),
        }
      );

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error adding task: ${text}`);
      }

      const savedTask = await res.json();

      savedTask.id = savedTask._id;

      await addTaskToCategory(projectId, waitingCategory.id, savedTask);
      setTitle("");
    } catch (err) {
      console.error(err.message);
    }
  };


  return (
    <div style={{ marginTop: "1rem" }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Uusi tehtävä"
      />
      <button onClick={handleAddTask} style={{ marginLeft: "0.5rem" }}>
        Add Task
      </button>
    </div>
  );
}
