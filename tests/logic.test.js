import {test} from 'node:test';
import assert from 'node:assert/strict';
import {filterTasks,monthCells,localDate,addDays,escapeHtml} from '../logic.js';
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
