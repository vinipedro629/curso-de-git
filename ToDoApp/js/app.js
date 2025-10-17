// Estrutura de dados: { id, title, description, date, status }
const storageKey = 'todoapp.tasks.v1';
const taskForm = document.getElementById('taskForm');
const titleInput = document.getElementById('title');
const dateInput = document.getElementById('date');
const descInput = document.getElementById('description');
const statusInput = document.getElementById('status');
const taskIdInput = document.getElementById('taskId');
const taskListEl = document.getElementById('taskList');
const completedListEl = document.getElementById('completedList');
const countBadge = document.getElementById('countBadge');
const filters = document.querySelectorAll('.filters button');
const sortSelect = document.getElementById('sort');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const clearCompletedBtn = document.getElementById('clearCompletedBtn');
const toggleCompletedBtn = document.getElementById('toggleCompletedBtn');
const toastContainer = document.getElementById('toastContainer');

// Estado local
let tasks = [];
let currentFilter = '';
// buffer para desfazer ações (undo)
let undoBuffer = null;

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
  // limpar mensagens de validação
  const titleErr = document.getElementById('titleError');
  const dateErr = document.getElementById('dateError');
  if(titleErr) titleErr.textContent = '';
  if(dateErr) dateErr.textContent = '';
}

function addOrUpdateTask(){
  const title = titleInput.value.trim();
  const date = dateInput.value;
  const desc = descInput.value.trim();
  const status = statusInput.value || 'Pendente';
  // validação inline
  let ok = true;
  const titleErr = document.getElementById('titleError');
  const dateErr = document.getElementById('dateError');
  if(!title){ if(titleErr) titleErr.textContent = 'Título obrigatório'; ok=false } else if(titleErr) titleErr.textContent = '';
  if(!date){ if(dateErr) dateErr.textContent = 'Data obrigatória'; ok=false } else if(dateErr) dateErr.textContent = '';
  if(!ok){ showToast('Preencha os campos obrigatórios', 'warn'); return }
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
  showToast(existingId ? 'Tarefa atualizada' : 'Tarefa criada', 'success');
}

function deleteTask(id){
  if(!confirm('Remover essa tarefa?')) return;
  const removed = tasks.find(t=>t.id===id);
  tasks = tasks.filter(t=>t.id!==id);
  saveAll();
  render();
  // configura undo
  undoBuffer = { type: 'delete', data: removed };
  showToastWithUndo('Tarefa removida', 'warn', ()=>{
    if(undoBuffer && undoBuffer.type==='delete'){
      tasks.push(undoBuffer.data); saveAll(); render(); undoBuffer = null; showToast('Ação desfeita', 'success');
    }
  });
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
  showToast('Status alterado', 'success');
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

  // separar pendentes e concluidas, respeitando o filtro atual
  let list = applyFilter(tasks);
  list = applySort(list);

  const pending = list.filter(t=>t.status==='Pendente');
  const completed = list.filter(t=>t.status==='Concluída');

  // render pendentes
  taskListEl.innerHTML = '';
  if(pending.length===0){
    taskListEl.innerHTML = '<div class="muted">Nenhuma tarefa pendente.</div>';
  } else {
    for(const t of pending){
      const el = renderTaskItem(t);
      el.classList.add('added');
      taskListEl.appendChild(el);
      setTimeout(()=> el.classList.remove('added'), 300);
    }
  }

  // render concluídas
  if(completedListEl){
    completedListEl.innerHTML = '';
    if(completed.length===0){
      completedListEl.innerHTML = '<div class="muted">Nenhuma tarefa concluída.</div>';
    } else {
      for(const t of completed){
        const el = renderTaskItem(t);
        completedListEl.appendChild(el);
      }
    }
  }
}

function renderTaskItem(t){
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

  return div;
}

// eventos
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearBtn');
taskForm.addEventListener('submit', (e)=>{ e.preventDefault(); addOrUpdateTask(); });
clearBtn.addEventListener('click', clearForm);

if(exportBtn) exportBtn.addEventListener('click', ()=>{
  const data = JSON.stringify(tasks, null, 2);
  const blob = new Blob([data], {type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = 'todo-export.json';
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
  showToast('Exportado arquivo JSON', 'success');
});

if(importBtn && importFile){
  importBtn.addEventListener('click', ()=> importFile.click());
  importFile.addEventListener('change', (ev)=>{
    const f = ev.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = (e)=>{
      try{
        const arr = JSON.parse(e.target.result);
        if(Array.isArray(arr)){
          const replaceBox = document.getElementById('importReplace');
          const replace = replaceBox ? replaceBox.checked : true;
          if(replace){
            tasks = arr; saveAll(); render(); showToast('Importado (substituído)', 'success');
          } else {
            // merge by id
            const existing = new Set(tasks.map(t=>t.id));
            const toAdd = arr.filter(a=> !existing.has(a.id));
            if(toAdd.length>0){
              tasks = tasks.concat(toAdd); saveAll(); render(); showToast('Importado (mesclado)', 'success');
            } else showToast('Nada novo para importar', 'warn');
          }
        } else showToast('Arquivo inválido', 'error');
      }catch(err){ showToast('Erro ao importar', 'error'); }
    };
    reader.readAsText(f);
    importFile.value = '';
  });
}

if(clearCompletedBtn) clearCompletedBtn.addEventListener('click', ()=>{
  if(!confirm('Remover todas as tarefas concluídas?')) return;
  const removed = tasks.filter(t=>t.status==='Concluída');
  if(removed.length===0){ showToast('Nenhuma concluída', 'warn'); return }
  tasks = tasks.filter(t=>t.status !== 'Concluída');
  saveAll(); render();
  undoBuffer = { type: 'clearCompleted', data: removed };
  showToastWithUndo('Concluídas removidas', 'warn', ()=>{
    if(undoBuffer && undoBuffer.type==='clearCompleted'){
      tasks = tasks.concat(undoBuffer.data); saveAll(); render(); undoBuffer = null; showToast('Ação desfeita', 'success');
    }
  });
});

if(toggleCompletedBtn){
  toggleCompletedBtn.addEventListener('click', ()=>{
    const sec = document.querySelector('.completed-section');
    if(!sec) return;
    sec.classList.toggle('collapsed');
    showToast(sec.classList.contains('collapsed') ? 'Concluídas ocultas' : 'Concluídas mostradas', 'success');
  });
}

filters.forEach(f=> f.addEventListener('click', ()=>{
  filters.forEach(x=>x.classList.remove('active'));
  f.classList.add('active');
  currentFilter = f.dataset.filter || '';
  render();
}));

sortSelect.addEventListener('change', ()=> render());

// inicializar
load();

// toast helper
function showToast(message, type=''){
  if(!toastContainer) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type?type:'');
  el.textContent = message;
  toastContainer.appendChild(el);
  // force reflow to allow animation
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 300);
  }, 2800);
}

// toast with undo action (button)
function showToastWithUndo(message, type='', undoCb){
  if(!toastContainer) return;
  const el = document.createElement('div');
  el.className = 'toast ' + (type?type:'');
  const span = document.createElement('span'); span.textContent = message;
  const btn = document.createElement('button'); btn.className = 'undo'; btn.textContent = 'Desfazer';
  btn.onclick = ()=>{ undoCb && undoCb(); };
  el.appendChild(span); el.appendChild(btn);
  toastContainer.appendChild(el);
  requestAnimationFrame(()=> el.classList.add('show'));
  setTimeout(()=>{
    el.classList.remove('show');
    setTimeout(()=> el.remove(), 300);
    undoBuffer = null;
  }, 4000);
}

// Esc para limpar o formulário
document.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') clearForm();
});
