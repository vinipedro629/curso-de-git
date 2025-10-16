// Estrutura de dados: { id, title, description, date, status }
const storageKey = 'todoapp.tasks.v1';
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const descInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const taskIdInput = document.getElementById('taskId');
const taskListEl = document.getElementById('taskList');
const countBadge = document.getElementById('countBadge');
const filters = document.querySelectorAll('.filters button');
const sortSelect = document.getElementById('sort');

// Estado local
let tasks = [];
let currentFilter = '';

function load(){
  try{
    const raw = localStorage.getItem(storageKey);
    tasks = raw ? JSON.parse(raw) : [];
  }catch(e){ tasks = []; }
  render();
}

function saveAll(){
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function uid(){
  return Date.now().toString(36) + Math.random().toString(36).slice(2,8);
}

function clearForm(){
  taskIdInput.value='';
  titleInput.value='';
  dateInput.value='';
  descInput.value='';
  statusInput.value='Pendente';
  saveBtn.textContent = 'Salvar';
}

function addOrUpdateTask(){
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const desc = descInput.value.trim();
  const status = statusInput.value || 'Pendente';
  if(!title){ alert('Título é obrigatório'); return }
  if(!date){ alert('Data é obrigatória'); return }
  const existingId = taskIdInput.value;
  if(existingId){
    const idx = tasks.findIndex(t=>t.id===existingId);
    if(idx>-1){
      tasks[idx].title = title;
      tasks[idx].description = desc;
      tasks[idx].date = date;
      tasks[idx].status = status;
    }
  }else{
    tasks.push({ id: uid(), title, description: desc, date, status });
  }
  saveAll();
  render();
  clearForm();
}

function deleteTask(id){
  if(!confirm('Remover essa tarefa?')) return;
  tasks = tasks.filter(t=>t.id!==id);
  saveAll();
  render();
}

function editTask(id){
  const t = tasks.find(x=>x.id===id);
  if(!t) return;
  taskIdInput.value = t.id;
  titleInput.value = t.title;
  dateInput.value = t.date;
  descInput.value = t.description;
  statusInput.value = t.status;
  saveBtn.textContent = 'Atualizar';
  window.scrollTo({top:0,behavior:'smooth'});
}

function toggleStatus(id){
  const idx = tasks.findIndex(t=>t.id===id);
  if(idx===-1) return;
  tasks[idx].status = tasks[idx].status === 'Pendente' ? 'Concluída' : 'Pendente';
  saveAll();
  render();
}

function applyFilter(list){
  if(!currentFilter) return list;
  return list.filter(t=>t.status===currentFilter);
}

function applySort(list){
  const mode = sortSelect.value;
  const copy = [...list];
  copy.sort((a,b)=>{
    if(mode==='date_asc') return new Date(a.date) - new Date(b.date);
    return new Date(b.date) - new Date(a.date);
  });
  return copy;
}

function render(){
  // contar pendentes
  const pendingCount = tasks.filter(t=>t.status==='Pendente').length;
  countBadge.textContent = pendingCount + ' pendentes';

  let list = applyFilter(tasks);
  list = applySort(list);

  taskListEl.innerHTML = '';
  if(list.length===0){
    taskListEl.innerHTML = '<div class="muted">Nenhuma tarefa encontrada.</div>';
    return;
  }

  for(const t of list){
    const div = document.createElement('div');
    div.className = 'task';

    const left = document.createElement('div');
    left.className = 'left';

    const statusBtn = document.createElement('button');
    statusBtn.className = 'status-btn';
    statusBtn.title = t.status === 'Pendente' ? 'Marcar como Concluída' : 'Marcar como Pendente';
    statusBtn.innerHTML = t.status==='Pendente' ? '✅' : '↩️';
    statusBtn.onclick = ()=> toggleStatus(t.id);

    const meta = document.createElement('div');
    meta.className = 'meta';
    const title = document.createElement('div');
    title.className = 'title';
    title.textContent = t.title;
    const date = document.createElement('div');
    date.className = 'date';
    date.textContent = (new Date(t.date)).toLocaleDateString();
    if(t.status === 'Concluída'){
      title.classList.add('strike');
    }

    meta.appendChild(title);
    meta.appendChild(date);

    left.appendChild(statusBtn);
    left.appendChild(meta);

    const actions = document.createElement('div');
    actions.className = 'actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'icon-btn';
    editBtn.title = 'Editar';
    editBtn.textContent = '✏️';
    editBtn.onclick = ()=> editTask(t.id);

    const delBtn = document.createElement('button');
    delBtn.className = 'icon-btn';
    delBtn.title = 'Excluir';
    delBtn.textContent = '🗑️';
    delBtn.onclick = ()=> deleteTask(t.id);

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);

    div.appendChild(left);
    div.appendChild(actions);

    taskListEl.appendChild(div);
  }
}

// eventos
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
taskForm.addEventListener('submit', (e)=>{ e.preventDefault(); addOrUpdateTask(); });
clearBtn.addEventListener('click', clearForm);

filters.forEach(f=> f.addEventListener('click', ()=>{
  filters.forEach(x=>x.classList.remove('active'));
  f.classList.add('active');
  currentFilter = f.dataset.filter || '';
  render();
}));

sortSelect.addEventListener('change', ()=> render());

// inicializar
load();
