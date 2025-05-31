import { useState } from "react"
import Button from "./components/Button"
import Header from "./components/Header"
import ProjectList from "./components/ProjectList"

function App() {

  const [projects, setProjects] = useState([
    {
      title: "Odottaa ryhmää",
      projects: [],
      status: "",
      id: 69,
      
    },
  ]);

  return (
    <>
       <Header>
    <Button className="active">OHJ2: Python-tiimityö</Button>
    <Button>OHJ4: CanvasAPI</Button>
    <Button>OHJ-näyttö</Button>
    <Button>OKT-näyttö</Button>
    <Button onclick="addCategory()">+ Lisää kategoria</Button>
  </Header>

    <section className="project-list-container">
    {projects.map(p => 
      <ProjectList key={p.id} status={p.status} title={p.title} projects={projects}/>
    )}
    </section>
    </>
  )
}

export default App
