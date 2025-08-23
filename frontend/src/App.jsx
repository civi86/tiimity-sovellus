import { useProjects } from "./context/ProjectsContext";
import Button from "./components/Button";
import Header from "./components/Header";
import TaskCard from "./components/TaskCard";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import "./App.css";

function App() {
	const { projects, activeProjectId, setActiveProject, addTaskToCategory } =
		useProjects();
	const { username } = useAuth();
	const navigate = useNavigate();

	const addTask = async () => {
		const title = prompt("Syötä tehtävän nimi:");
		if (!title) return;

		const description = prompt("Syötä tehtävän kuvaus:") || "";

		const activeProject = projects.find(p => p.id === activeProjectId);
		if (!activeProject) return alert("Valitse projekti ensin");

		const category = activeProject.categories[0];

		const newTask = {
			title,
			description,
			creatorAccountName: username || "Unknown",
		};

		try {
			const res = await fetch(
				`${import.meta.env.VITE_BACKEND_URL}/projects/${
					activeProject._id
				}`,
				{
					method: "PUT",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(activeProject),
				}
			);

			const updatedProject = await res.json();

			if (res.ok) {
				alert("Projekti lisätty onnistuneesti!");
				navigate("/dashboard");
			} else {
				throw new Error(updatedProject.message || "Error");
			}

			addTaskToCategory(activeProject.id, category._id, newTask);
		} catch (error) {
			alert("Error: " + error.message);
		}
	};

	const activeProject = projects.find(p => p.id === activeProjectId);

	return (
		<>
			<div className="grid grid-rows-[auto_1fr_auto] h-screen grid-cols-1">
				<Header>
					<img
						src="assets/logo.png"
						alt="Logo"
						style={{
							height: "40px",
							marginRight: "3rem",
							marginLeft: "1rem",
						}}
					/>
					{projects.map(project => (
						<Button
							key={project.id}
							className={
								project.id === activeProjectId ? "active" : ""
							}
							onClick={() => setActiveProject(project.id)}
						>
							{project.name}
						</Button>
					))}
					<img
						src="assets/it-velhot.png"
						alt="Logo"
						style={{
							height: "40px",
							marginRight: "0rem",
							marginLeft: "3rem",
						}}
					/>
				</Header>
        <main className="overflow-y-auto">
					<div className="welcome-container">
						<img
							src="assets/logo.png"
							alt="Logo"
							style={{
								height: "80px",
								marginBottom: "2rem",
								marginLeft: "12.5rem",
							}}
						/>
						<h1>Tervetuloa!</h1>
						<p>
							Valitse itsellesi sopiva projekti yläpalkista ja
							etsi itsellesi tiimikavereita!
						</p>
					</div>

					{activeProject && (
						<div className="project-details bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto">
							<h2 className="text-3xl font-extrabold text-gray-900 mb-6">
								{activeProject.name}
							</h2>
							<Button
								className="create-task-button"
								onClick={addTask}
							>
								+ Luo Tehtävä
							</Button>

							{activeProject.categories.map(category => (
								<div
									key={category.id}
									className="category mb-12"
								>
									<h3 className="text-2xl font-semibold text-gray-900 mb-6 border-b border-gray-300 pb-3">
										{category.name}
									</h3>
									{category.tasks.length > 0 ? (
										<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
											{category.tasks.map(task => (
												<TaskCard
													key={task.id}
													task={task}
												/>
											))}
										</div>
									) : (
										<p className="text-gray-500 italic">
											Ei Tehtäviä.
										</p>
									)}
								</div>
							))}
						</div>
					)}
          </main>
					<footer className="footer">
						&copy; 2025 Tiimity. All rights reserved.
					</footer>
				</div>
		</>
	);
}

export default App;
