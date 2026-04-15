const STORAGE_KEY = 'todo_devops_tasks';
const PRI_LABEL   = ['Alta', 'Media', 'Baja'];
const PRI_CLASS   = ['tag-alta', 'tag-media', 'tag-baja'];
const CAT_LABEL   = { work: 'Trabajo', personal: 'Personal', health: 'Salud', study: 'Estudio' };
const CAT_CLASS   = { work: 'tag-work', personal: 'tag-personal', health: 'tag-health', study: 'tag-study' };
const DAYS        = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
const MONTHS      = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];

let tasks  = [];
let nextId = 1;
let filter = 'all';
let editId = null;

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ tasks, nextId }));
}
function loadFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    tasks  = data.tasks  || [];
    nextId = data.nextId || 1;
  } catch (e) { tasks = []; nextId = 1; }
}

function setDateLabel() {
  const d = new Date();
  document.getElementById('date-label').textContent =
    DAYS[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()];
}

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2200);
}

function fmtDate(d) {
  if (!d) return '';
  const [y, m, dd] = d.split('-');
  return dd + '/' + m + '/' + y;
}

function getVisible() {
  if (filter === 'all')     return tasks;
  if (filter === 'pending') return tasks.filter(t => !t.done);
  if (filter === 'done')    return tasks.filter(t => t.done);
  return tasks.filter(t => t.category === filter);
}

function render() {
  const visible = getVisible();
  const list    = document.getElementById('tasks-list');

  if (visible.length === 0) {
    list.innerHTML = `
      <div class="empty">
        <i class="fas fa-check-double"></i>
        <p>Sin tareas para mostrar</p>
      </div>`;
  } else {
    list.innerHTML = visible.map(t => `
      <div class="task-item ${t.done ? 'is-done' : ''}" data-id="${t.id}">
        <button class="task-check ${t.done ? 'checked' : ''}" data-action="toggle" data-id="${t.id}" title="Marcar como ${t.done ? 'pendiente' : 'completada'}">
          <i class="fas fa-check"></i>
        </button>
        <div class="task-body">
          <div class="task-title">${escHtml(t.title)}</div>
          ${t.description ? `<div class="task-desc">${escHtml(t.description)}</div>` : ''}
          <div class="task-tags">
            <span class="tag ${PRI_CLASS[t.priority]}">${PRI_LABEL[t.priority]}</span>
            <span class="tag ${CAT_CLASS[t.category]}">${CAT_LABEL[t.category]}</span>
          </div>
          ${t.dueDate ? `
          <div class="task-due">
            <i class="far fa-calendar-alt"></i>
            ${fmtDate(t.dueDate)}
          </div>` : ''}
        </div>
        <div class="task-actions">
          <button class="icon-btn edit"  data-action="edit"   data-id="${t.id}" title="Editar">
            <i class="fas fa-pencil-alt"></i>
          </button>
          <button class="icon-btn trash" data-action="delete" data-id="${t.id}" title="Eliminar">
            <i class="fas fa-trash-alt"></i>
          </button>
        </div>
      </div>
    `).join('');
  }

  const done  = tasks.filter(t => t.done).length;
  const pend  = tasks.filter(t => !t.done).length;
  const total = tasks.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;

  document.getElementById('s-total').textContent   = total;
  document.getElementById('s-pend').textContent    = pend;
  document.getElementById('s-done').textContent    = done;
  document.getElementById('top-badge').textContent = pend + ' pendiente' + (pend !== 1 ? 's' : '');
  document.getElementById('prog-pct').textContent  = pct + '%';
  document.getElementById('prog-fill').style.width = pct + '%';
  document.getElementById('list-label').textContent =
    visible.length + ' tarea' + (visible.length !== 1 ? 's' : '');
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function createTask() {
  const title = document.getElementById('inp-title').value.trim();
  if (!title) { showToast('El nombre es obligatorio'); return; }

  const task = {
    id:          nextId++,
    title,
    description: document.getElementById('inp-desc').value.trim(),
    category:    document.getElementById('inp-cat').value,
    priority:    parseInt(document.getElementById('inp-pri').value),
    dueDate:     document.getElementById('inp-due').value || null,
    done:        false,
    createdAt:   new Date().toISOString()
  };

  tasks.push(task);
  saveToStorage();
  render();
  showToast('Tarea creada');

  document.getElementById('inp-title').value = '';
  document.getElementById('inp-desc').value  = '';
  document.getElementById('inp-due').value   = '';
}

function toggleDone(id) {
  tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
  saveToStorage();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveToStorage();
  render();
  showToast('Tarea eliminada');
}

function openEdit(id) {
  const t = tasks.find(t => t.id === id);
  if (!t) return;
  editId = id;
  document.getElementById('edit-title').value = t.title;
  document.getElementById('edit-desc').value  = t.description || '';
  document.getElementById('edit-cat').value   = t.category;
  document.getElementById('edit-pri').value   = t.priority;
  document.getElementById('edit-due').value   = t.dueDate || '';
  document.getElementById('modal').classList.add('open');
}

function saveEdit() {
  const title = document.getElementById('edit-title').value.trim();
  if (!title) { showToast('El nombre no puede estar vacio'); return; }

  tasks = tasks.map(t => t.id === editId ? {
    ...t,
    title,
    description: document.getElementById('edit-desc').value.trim(),
    category:    document.getElementById('edit-cat').value,
    priority:    parseInt(document.getElementById('edit-pri').value),
    dueDate:     document.getElementById('edit-due').value || null
  } : t);

  saveToStorage();
  closeModal();
  render();
  showToast('Tarea actualizada');
}

function closeModal() {
  document.getElementById('modal').classList.remove('open');
  editId = null;
}

function setFilter(f) {
  filter = f;
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.filter === f);
  });
  render();
}

document.getElementById('tasks-list').addEventListener('click', e => {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const id = parseInt(btn.dataset.id);
  if (btn.dataset.action === 'toggle') toggleDone(id);
  if (btn.dataset.action === 'edit')   openEdit(id);
  if (btn.dataset.action === 'delete') deleteTask(id);
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

document.getElementById('btn-create').addEventListener('click', createTask);
document.getElementById('inp-title').addEventListener('keydown', e => {
  if (e.key === 'Enter') createTask();
});
document.getElementById('btn-save').addEventListener('click', saveEdit);
document.getElementById('btn-cancel').addEventListener('click', closeModal);
document.getElementById('modal').addEventListener('click', e => {
  if (e.target === document.getElementById('modal')) closeModal();
});

setDateLabel();
loadFromStorage();
render();