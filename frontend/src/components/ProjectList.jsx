import Button from "./Button";

export default function ProjectList({title, projects, status}) {
    return (
        <section className="project-list" data-status={status}>
              <h2>{title}</h2>
              {/* TODO PROJECTS HERE */}
              <Button className="add-task-btn" onClick="addTask(this)">Lisää tehtävä</Button>
        </section>
    );
}