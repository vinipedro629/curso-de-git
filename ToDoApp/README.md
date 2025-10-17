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

Novas funcionalidades recentes
- Export/Import via UI (botões na barra superior)
- Import: escolha entre substituir ou mesclar. Ao mesclar, você pode optar por mesclar também por título para evitar duplicatas similares.
- Undo visual: ações de exclusão e limpar concluídas exibem um toast com "Desfazer" e também uma pequena lista de ações pendentes (undo panel) no canto.
- Atalho: pressione Esc para limpar o formulário.

Executar testes (opcional)
- Se tiver Node.js instalado, execute este script de teste rápido para validar a lógica de mesclagem:

	node tests/import_merge_test.js

	O script mostra como a mesclagem funciona por id e por título.

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
