export const STATUS = {todo:'A fazer',doing:'Em andamento',waiting:'Aguardando',review:'Em revisão',done:'Concluído'};
export const PRIORITY = {urgent:'Urgente',high:'Alta',medium:'Média',low:'Baixa'};
export function localDate(date=new Date()){return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;}
export function addDays(value,n){const d=new Date(`${value}T12:00:00`);d.setDate(d.getDate()+n);return localDate(d);}
export function isOverdue(t,today=localDate()){return t.status!=='done' && !!t.due_date && t.due_date<today;}
export function filterTasks(tasks,{view='all',today=localDate(),search='',project='',priority='',status=''}={}){
 const needle=search.trim().toLocaleLowerCase('pt-BR');
 return tasks.filter(t=>{
  if(view==='today' && (t.status==='done'||!(t.planned_date===today||t.due_date===today||isOverdue(t,today))))return false;
  if(view==='pending' && !(isOverdue(t,today)||t.status==='waiting'))return false;
  return (!needle||`${t.title} ${t.description} ${t.next_action}`.toLocaleLowerCase('pt-BR').includes(needle))&&(!project||t.project_id===project)&&(!priority||t.priority===priority)&&(!status||t.status===status);
 }).sort((a,b)=>(a.status==='done')-(b.status==='done') || (Object.keys(PRIORITY).indexOf(a.priority)-Object.keys(PRIORITY).indexOf(b.priority)) || (a.due_date||'9999').localeCompare(b.due_date||'9999') || a.created_at.localeCompare(b.created_at));
}
export function monthCells(year,month){const offset=(new Date(year,month,1).getDay()+6)%7;const count=new Date(year,month+1,0).getDate();return [...Array(offset).fill(null),...Array.from({length:count},(_,i)=>`${year}-${String(month+1).padStart(2,'0')}-${String(i+1).padStart(2,'0')}`)];}
export function escapeHtml(value=''){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function projectSlug(name){return name.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');}
// Reconhece apenas atalhos documentados; não há modelo de IA ou envio a terceiros.
export function parseCapture(input,projects=[],today=localDate()){
 let title=input.trim(),priority='medium',project_id=null,planned_date=null,due_date=null;
 title=title.replace(/(?:^|\s)!(urgente|alta|media|média|baixa)(?=\s|$)/gi,(_,v)=>{priority=({urgente:'urgent',alta:'high',media:'medium','média':'medium',baixa:'low'})[v.toLowerCase()];return ' ';});
 title=title.replace(/(?:^|\s)#([\w-]+)(?=\s|$)/g,(whole,slug)=>{const p=projects.find(p=>projectSlug(p.name)===slug.toLowerCase());if(!p)return whole;project_id=p.id;return ' ';});
 let warning='';
 title=title.replace(/(?:^|\s)até (\d{2})\/(\d{2})(?:\/(\d{4}))?(?=\s|$)/gi,(whole,dd,mm,yyyy)=>{const value=`${yyyy||today.slice(0,4)}-${mm}-${dd}`;const d=new Date(value+'T12:00:00');if(Number.isNaN(d.getTime())||localDate(d)!==value){warning='Prazo inválido. Corrija a data antes de adicionar.';return whole;}due_date=value;return ' ';});
 title=title.trim().replace(/(?:^|\s)(depois de amanhã|amanhã|hoje)\s*$/i,(_,v)=>{planned_date=addDays(today,v.toLowerCase()==='hoje'?0:v.toLowerCase()==='amanhã'?1:2);return '';}).trim().replace(/\s{2,}/g,' ');
 return {title,priority,project_id,planned_date,due_date,warning};
}
