// Test de mesclagem de import (node script)
// Este script simula mesclagem por id e por título

function mergeTasks(existing, incoming, byTitle=false){
  const existingIds = new Set(existing.map(t=>t.id));
  const existingTitles = new Set(existing.map(t=>t.title.toLowerCase()));
  const toAdd = incoming.filter(a=>{
    if(existingIds.has(a.id)) return false;
    if(byTitle && existingTitles.has((a.title||'').toLowerCase())) return false;
    return true;
  });
  return existing.concat(toAdd);
}

// Exemplo
const existing = [ {id:'a1', title:'Comprar pão'}, {id:'b2', title:'Pagar contas'} ];
const incoming = [ {id:'a1', title:'Comprar pão'}, {id:'c3', title:'Comprar Pão'}, {id:'d4', title:'Estudar'} ];

console.log('Merge by id:');
console.log(mergeTasks(existing, incoming, false));
console.log('Merge by title:');
console.log(mergeTasks(existing, incoming, true));

// Instruções: execute com node tests/import_merge_test.js (se tiver Node)
