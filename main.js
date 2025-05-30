let dragged = null;

    document.addEventListener('dragstart', e => {
      if (e.target.classList.contains('task')) {
        dragged = e.target;
        e.target.classList.add('dragging');
      }
    });

    document.addEventListener('dragend', e => {
      if (e.target.classList.contains('task')) {
        dragged = null;
        e.target.classList.remove('dragging');
      }
    });

    document.querySelectorAll('.column').forEach(column => {
      column.addEventListener('dragover', e => e.preventDefault());
      column.addEventListener('drop', e => {
        if (dragged) {
          column.appendChild(dragged);
        }
      });
    });

    function addTask(button) {
      const title = prompt('Anna tehtävän nimi:');
      const description = prompt('Kirjoita lisätietoa tehtävästä:');
      const team = prompt('Ketkä ovat jo mukana? (pilkulla erotettuna)');

      if (title && title.trim() !== '') {
        const task = document.createElement('div');
        task.className = 'task';
        task.draggable = true;
        task.innerHTML = `
          <strong>${title}</strong>
          <small>${description || ''}</small>
          <small>Tiimi: ${team || '-'}</small>
        `;
        button.parentElement.appendChild(task);
      }
    }

    function addCategory() {
      const name = prompt("Anna uuden kategorian nimi:");
      if (name && name.trim() !== '') {
        const button = document.createElement("button");
        button.textContent = name;
        document.getElementById("categoryBar").insertBefore(button, document.querySelector("#categoryBar button:last-child"));
      }
    }