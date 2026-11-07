// Educational local data store. No real patient information.
export const DATA_KEY = 'uromed-nexus-suite-v03-workspace';
export const MODULES = {statistics:'Ιστορικό & Στατιστικά',feedback:'Παρατηρήσεις δοκιμής',programPrint:'Εκτύπωση προγράμματος',email:'E-MAIL αναφοράς'};
export const LEGACY_PATIENTS = 'uromed-nexus-demo-v0.3-patients';
export const LEGACY_APPOINTMENTS = 'uromed-nexus-demo-v0.2-appointments';
export const uid = () => crypto.randomUUID();
export const today = () => {
 const parts = Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Athens',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date()).map(p=>[p.type,p.value]));
 return `${parts.year}-${parts.month}-${parts.day}`;
};
export function validDate(s) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false;
  const d = new Date(s+'T12:00:00Z'); return !isNaN(d) && d.toISOString().slice(0,10) === s;
}
export function isoDate(s) { const parts = s.split('/'); const value = parts.length === 3 ? parts.reverse().join('-') : s; return validDate(value) ? value : ''; }
export const displayDate = s => validDate(s) ? s.split('-').reverse().join('/') : '—';
export const validTime = s => /^([01]\d|2[0-3]):[0-5]\d$/.test(s);
export const minutes = s => Number(s.slice(0,2))*60+Number(s.slice(3));
export function fresh() {
 return {schema:1,patients:[
  {id:'seed-1',name:'Αλέξανδρος Δοκιμής',age:52,phone:'',notes:'Εικονική προληπτική επίσκεψη'},
  {id:'seed-2',name:'Νικόλαος Παραδείγματος',age:64,phone:'',notes:'Εικονικός επανέλεγχος'},
  {id:'seed-3',name:'Πέτρος Υποδείγματος',age:43,phone:'',notes:'Εικονική πρώτη επίσκεψη'}],appointments:[],visits:[],settings:{hospital:false,modules:{statistics:true,feedback:true,programPrint:true,email:true},clinicNames:{'clinic-1':'Ιατρείο 1','clinic-2':'Ιατρείο 2',hospital:'Νοσοκομείο'},travelMinutes:0},updatedAt:new Date().toISOString()};
}
const string = (s,max=10000) => typeof s === 'string' && s.length <= max;
export function validate(s) {
 if (!s || s.schema!==1 || !Array.isArray(s.patients)||!Array.isArray(s.appointments)||!Array.isArray(s.visits)|| typeof s.settings?.hospital !== 'boolean') throw Error('Μη υποστηριζόμενη μορφή δεδομένων.');
 const unique = list => list.every(x=>x&&string(x.id,100)&&x.id) && new Set(list.map(x=>x.id)).size===list.length;
 if (![s.patients,s.appointments,s.visits].every(unique)) throw Error('Διπλοί ή μη έγκυροι κωδικοί εγγραφών.');
 const patients = new Set(s.patients.map(p=>p.id));
 if (!s.patients.every(p=>string(p.name,150)&&p.name.trim()&&Number.isInteger(p.age)&&p.age>=0&&p.age<=120&&string(p.phone,60)&&string(p.notes))) throw Error('Μη έγκυρα στοιχεία ασθενών.');
 if (!s.appointments.every(a=>patients.has(a.patientId)&&validDate(a.date)&&validTime(a.time)&&Number.isInteger(a.duration)&&a.duration>=5&&a.duration<=240&&minutes(a.time)+a.duration<=1440&&['clinic-1','clinic-2','hospital'].includes(a.clinic)&&['scheduled','cancelled','completed','no-show'].includes(a.status))) throw Error('Μη έγκυρα ραντεβού.');
 const visitValid = v => patients.has(v.patientId)&&validDate(v.date)&&['clinic-1','clinic-2','hospital'].includes(v.clinic)&&['draft','final'].includes(v.status)&&['reason','history','exam','assessment','plan'].every(k=>string(v[k]))&&string(v.author,100)&&string(v.updatedAt,100)&&Array.isArray(v.revisions);
 if (!s.visits.every(v=>visitValid(v)&&v.revisions.every(r=>r&&string(r.reason,500)&&string(r.author,100)&&string(r.at,100)&&r.snapshot&&['reason','history','exam','assessment','plan'].every(k=>string(r.snapshot[k]))))) throw Error('Μη έγκυρες επισκέψεις.');
 if (s.settings.modules && (typeof s.settings.modules!=='object'||Array.isArray(s.settings.modules)||Object.entries(s.settings.modules).some(([k,v])=>!Object.hasOwn(MODULES,k)||typeof v!=='boolean'))) throw Error('Μη έγκυρες ρυθμίσεις λειτουργιών.');
 if (s.settings.clinicNames && !['clinic-1','clinic-2','hospital'].every(k=>string(s.settings.clinicNames[k],80)&&s.settings.clinicNames[k].trim())) throw Error('Μη έγκυρες ονομασίες χώρων.');
 if (s.settings.travelMinutes!==undefined && (!Number.isInteger(s.settings.travelMinutes)||s.settings.travelMinutes<0||s.settings.travelMinutes>180)) throw Error('Ο χρόνος μετακίνησης πρέπει να είναι 0–180 λεπτά.');
 if (s.feedback!==undefined && (!Array.isArray(s.feedback)||!unique(s.feedback)||!s.feedback.every(f=>string(f.title,150)&&string(f.details,5000)&&string(f.author,100)&&string(f.page,100)&&string(f.createdAt,100)&&['open','done'].includes(f.status)))) throw Error('Μη έγκυρες παρατηρήσεις δοκιμής.');
 return s;
}
export function normalize(s) {
 validate(s);
 const defaults=fresh().settings;
 return {...s,feedback:s.feedback||[],settings:{...defaults,...s.settings,modules:{...defaults.modules,...s.settings.modules},clinicNames:{...defaults.clinicNames,...s.settings.clinicNames}}};
}
export function demoState() {
 const s=normalize(fresh());
 const surnames=['Δείγματος','Εκπαίδευσης','Σεναρίου','Άσκησης','Πρωτοτύπου','Επίδειξης','Μελέτης','Παραδείγματος Β','Δοκιμής Β','Ελέγχου','Συνθετικού','Φανταστικού'];
 surnames.forEach((name,i)=>s.patients.push({id:'demo-'+(i+4),name:'Εικονικός '+name,age:30+i*3,phone:'',notes:'Πλήρως συνθετικό εκπαιδευτικό περιστατικό. Δεν αντιστοιχεί σε πραγματικό άνθρωπο.'}));
 s.patients.slice(0,3).forEach((p,i)=>{for(let n=0;n<2;n++)s.visits.push({id:'demo-visit-'+i+'-'+n,patientId:p.id,date:today(),clinic:i%2?'clinic-2':'clinic-1',status:n?'draft':'final',reason:'Συνθετική επίσκεψη επίδειξης '+(n+1),history:'Εκπαιδευτικό κείμενο για δοκιμή πλοήγησης.',exam:'Δεν περιλαμβάνονται πραγματικά ευρήματα.',assessment:'Παράδειγμα καταχώρισης, όχι ιατρική εκτίμηση.',plan:'Δοκιμή προγραμματισμού επανελέγχου.',author:'doctor',updatedAt:new Date().toISOString(),revisions:[]});});
 s.appointments=[{id:'demo-appt-1',patientId:'seed-1',date:today(),time:'09:30',duration:30,clinic:'clinic-1',status:'scheduled'},{id:'demo-appt-2',patientId:'seed-2',date:today(),time:'11:00',duration:30,clinic:'clinic-2',status:'scheduled'}];
 return validate(s);
}
export function visitStats(state,from,to,clinic='') {
 const visits=state.visits.filter(v=>v.status==='final'&&v.date>=from&&v.date<=to&&(!clinic||v.clinic===clinic));
 const counts=new Map();for(const v of visits)counts.set(v.date,(counts.get(v.date)||0)+1);
 return {visits:visits.length,patients:new Set(visits.map(v=>v.patientId)).size,days:[...counts].sort(([a],[b])=>a.localeCompare(b))};
}
export function load(storage) {
 const raw = storage.getItem(DATA_KEY);
 if (raw!==null) return normalize(JSON.parse(raw));
 const s = fresh();
 const pRaw = storage.getItem(LEGACY_PATIENTS), aRaw = storage.getItem(LEGACY_APPOINTMENTS);
 const ps = pRaw===null?[]:JSON.parse(pRaw), as = aRaw===null?[]:JSON.parse(aRaw);
 if (!Array.isArray(ps)||!Array.isArray(as)) throw Error('Αδυναμία ανάγνωσης παλιών καταχωρίσεων.');
 for (const p of ps) {
  if (!p||!string(p.name,150)||!Number.isInteger(p.age)||!string(p.notes)) throw Error('Μη έγκυρη παλιά εγγραφή ασθενή.');
  s.patients.push({id:uid(),name:p.name,age:p.age,phone:'',notes:p.notes});
 }
 for (const a of as) {
  if (!a||!string(a.name,150)) throw Error('Μη έγκυρο παλιό ραντεβού.');
  let p = s.patients.find(p=>p.name===a.name);
  if (!p) {p={id:uid(),name:a.name,age:0,phone:'',notes:'Μεταφέρθηκε από παλιό δοκιμαστικό ραντεβού. Η ηλικία χρειάζεται επιβεβαίωση.'};s.patients.push(p);}
  s.appointments.push({id:uid(),patientId:p.id,date:a.d,time:a.t,duration:30,clinic:a.c==='Ιατρείο 1'?'clinic-1':a.c==='Ιατρείο 2'?'clinic-2':'invalid',status:'scheduled'});
 }
 // Old keys stay untouched; a failed write must not replace them.
 const migrated=normalize(s); storage.setItem(DATA_KEY,JSON.stringify(migrated)); return migrated;
}
export function save(storage,state) {validate(state); storage.setItem(DATA_KEY,JSON.stringify(state));return state;}
export function conflicts(state,a) {
 const occupied = status => ['scheduled','completed'].includes(status);
 if(!occupied(a.status))return false;
 return state.appointments.some(b=>{
  if(b.id===a.id||!occupied(b.status)||b.date!==a.date)return false;
  const gap=b.clinic===a.clinic?0:(state.settings.travelMinutes||0);
  return minutes(a.time)<minutes(b.time)+b.duration+gap&&minutes(b.time)<minutes(a.time)+a.duration+gap;
 });
}
