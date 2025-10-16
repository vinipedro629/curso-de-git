# ToDoApp

Versão simples de uma Agenda de Tarefas (To-Do) feita com HTML, CSS e JavaScript puro.

Arquivos:
- `index.html` — página principal (interface)
- `css/style.css` — estilos
- `js/app.js` — lógica (localStorage para persistência)

Como usar:
1. Abra `ToDoApp/index.html` no navegador.
2. Crie tarefas preenchendo Título e Data (obrigatórios).
3. Use os botões para marcar concluída, editar ou excluir.
4. Filtros e ordenação estão no topo.

Observações:
- As tarefas são salvas no `localStorage` do navegador (chave: `todoapp.tasks.v1`).
- Para resetar, abra o DevTools -> Application -> Local Storage e remova a chave.
