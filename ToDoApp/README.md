# ToDoApp

Pequena Agenda de Tarefas (To-Do) feita com HTML, CSS e JavaScript puro. Projetada para ser executada localmente sem dependências.

Estrutura do projeto
- `index.html` — página principal (interface)
- `css/style.css` — estilos
- `js/app.js` — lógica (salva em localStorage)

Quick start
1. Abra `ToDoApp/index.html` no navegador (duplo-clique ou "Abrir com").
2. Preencha o campo "Título" e selecione uma "Data" — ambos são obrigatórios.
3. Clique em "Salvar" para adicionar. Use os botões ✅/↩️ para alternar status, ✏️ para editar e 🗑️ para excluir.

Funcionalidades
- Criar, editar e excluir tarefas.
- Marcar tarefa como "Concluída" ou "Pendente".
- Filtrar por Todas / Pendentes / Concluídas.
- Ordenar por data (asc/desc).
- Contador de tarefas pendentes.
- Persistência local: tarefas são salvas no `localStorage`.

Armazenamento
- Chave em localStorage: `todoapp.tasks.v1`.
- Para limpar todas as tarefas: abra DevTools (F12) → Application → Local Storage → selecione o host e remova a chave acima.

Testes rápidos (checklist)
- [ ] Criar uma tarefa (Título + Data) → aparece na lista.
- [ ] Editar a tarefa → alterações refletidas.
- [ ] Alternar status → contador e estilo atualizados.
- [ ] Filtrar por Pendentes/Concluídas → mostra somente as correspondentes.
- [ ] Excluir tarefa → removida e persistência atualizada.

Export / Import (manual)
- Exportar: Abra DevTools → Application → Local Storage → copie o valor da chave `todoapp.tasks.v1` (JSON).
- Importar: cole um array JSON válido na mesma chave e recarregue a página.

Melhorias possíveis
- Adicionar validações visuais inline (mensagens próximas aos campos).
- Adicionar confirmação com toast em vez de alert/confirm.
- Implementar export/import via botões na UI.

Problemas conhecidos
- A aplicação depende do `localStorage` do navegador; limpar cookies/armazenamento remove as tarefas.

Contato
Se quiser que eu adicione export/import por UI ou validações visuais, diga qual recurso prefere que eu implemente primeiro.
