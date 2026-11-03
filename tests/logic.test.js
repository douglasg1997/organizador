import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterTasks,monthCells,localDate,addDays,escapeHtml,parseCapture} from '../logic.js';
const task=(id,attrs={})=>({id,title:'Análise',description:'',next_action:'',priority:'medium',status:'todo',created_at:'2026-01-01',...attrs});
test('Meu dia reúne plano, vencimento e atraso, excluindo concluídas e outras datas',()=>{
 const tasks=[task('plan',{planned_date:'2026-11-03'}),task('due',{due_date:'2026-11-03'}),task('late',{due_date:'2026-11-02'}),task('future',{due_date:'2026-11-04'}),task('done',{due_date:'2026-11-01',status:'done'})];
 assert.deepEqual(new Set(filterTasks(tasks,{view:'today',today:'2026-11-03'}).map(t=>t.id)),new Set(['plan','due','late']));
});
test('Pendências reúne espera e atraso, com filtros combinados',()=>{
 const tasks=[task('a',{status:'waiting',project_id:'p',priority:'high'}),task('b',{due_date:'2026-11-01',project_id:'q'}),task('c',{status:'done',due_date:'2026-11-01'})];
 assert.equal(filterTasks(tasks,{view:'pending',today:'2026-11-03'}).length,2);
 assert.equal(filterTasks(tasks,{view:'pending',project:'p',priority:'high',search:'ANÁLISE'})[0].id,'a');
});
test('Calendário alinha segunda-feira e mantém fevereiro bissexto',()=>{
 const feb=monthCells(2028,1);assert.equal(feb[0],null);assert.equal(feb[1],'2028-02-01');assert.equal(feb.at(-1),'2028-02-29');assert.equal(monthCells(2026,10).filter(Boolean).length,30);
});
test('Datas locais e virada de mês não usam conversão UTC',()=>{assert.equal(localDate(new Date(2026,10,3,0,10)),'2026-11-03');assert.equal(addDays('2026-12-31',1),'2027-01-01');});
test('Texto de tarefas e atributos são escapados',()=>{assert.equal(escapeHtml('<img src=x onerror="alert(1)">'), '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');});
test('Captura extrai intenção com data local, prioridade e projeto sem perder o título',()=>{
 assert.deepEqual(parseCapture('Revisar boletim amanhã !alta #cisc',[{id:'p1',name:'CISC'}],'2026-12-31'),{title:'Revisar boletim',priority:'high',project_id:'p1',planned_date:'2027-01-01',due_date:null,warning:''});
});
test('Prazo e dia de trabalho são distintos e a data impossível bloqueia captura',()=>{
 const t=parseCapture('Conferir tabelas até 28/02/2028 depois de amanhã',[],'2028-02-20');
 assert.equal(t.due_date,'2028-02-28');assert.equal(t.planned_date,'2028-02-22');assert.equal(t.title,'Conferir tabelas');
 assert.ok(parseCapture('Revisar até 31/02/2026').warning);
});
test('Captura preserva projeto desconhecido e não interpreta palavras no meio da frase',()=>{
 assert.equal(parseCapture('Estudar hoje os dados #desconhecido',[],'2026-11-03').title,'Estudar hoje os dados #desconhecido');
 assert.equal(parseCapture('Criar resumo #saude-clima',[{id:'p',name:'Saúde / Clima'}]).project_id,'p');
});
