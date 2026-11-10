// Educational local data store. No real patient information.
const patientStatuses=['active','followup','review','inactive'];
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
  {id:'seed-3',name:'Πέτρος Υποδείγματος',age:43,phone:'',notes:'Εικονική πρώτη επίσκεψη'}],appointments:[],visits:[],settings:{hospital:true,clinicLocationsVersion:1,modules:{statistics:true,feedback:true,programPrint:true,email:true},clinicNames:{'clinic-1':'Ιατρείο Σέρρες','clinic-2':'Ιατρείο Τούζλα',hospital:'Νοσοκομείο Σέρρες'},travelMinutes:0},updatedAt:new Date().toISOString()};
}
const string = (s,max=Infinity) => typeof s === 'string' && s.length <= max;
export const EXAM_TYPES={ultrasound:'Υπερηχογράφημα',ct:'Αξονική τομογραφία',mri:'Μαγνητική τομογραφία',blood:'Γενική αίματος',biochem:'Βιοχημικές εξετάσεις',psa:'PSA',xray:'Απλή ακτινογραφία',otherImaging:'Άλλη απεικόνιση',prescription:'Αντίγραφο συνταγής · χειροκίνητη εισαγωγή',other:'Άλλη εξέταση'};
export const CLINICAL_FIELDS={familyHistory:'Οικογενειακό ιστορικό',medications:'Φάρμακα',allergies:'Αλλεργίες · τεκμηρίωση / αντίδραση',diagnoses:'Διαγνώσεις',urologyHistory:'Ουρολογικό ιστορικό',andrologyHistory:'Ανδρολογικό ιστορικό',luts:'Ιστορικό LUTS · συμπτώματα ούρησης'};
export const emptyClinical=()=>({smoking:'unknown',...Object.fromEntries(Object.keys(CLINICAL_FIELDS).map(k=>[k,'']))});
export const FINDING_FIELDS={general:'Γενική κατάσταση',systolic:'Συστολική πίεση · mmHg',diastolic:'Διαστολική πίεση · mmHg',pulse:'Σφύξεις / λεπτό',bmi:'BMI · kg/m²',abdomen:'Κοιλιά',renal:'Νεφρικές χώρες',bladder:'Ψηλάφηση κύστεως',dre:'Δακτυλική εξέταση',qmax:'Qmax · mL/sec',pvr:'Υπόλειμμα ούρων · mL',urologyNotes:'Ουρολογικές παρατηρήσεις'};
export const findingsText=v=>Object.entries(v.findings||{}).filter(([,value])=>value).map(([key,value])=>(FINDING_FIELDS[key]||key)+': '+value).join('\n');
export function validate(s) {
 if (!s || s.schema!==1 || !Array.isArray(s.patients)||!Array.isArray(s.appointments)||!Array.isArray(s.visits)|| typeof s.settings?.hospital !== 'boolean') throw Error('Μη υποστηριζόμενη μορφή δεδομένων.');
 const unique = list => list.every(x=>x&&string(x.id,100)&&x.id) && new Set(list.map(x=>x.id)).size===list.length;
 if (![s.patients,s.appointments,s.visits].every(unique)) throw Error('Διπλοί ή μη έγκυροι κωδικοί εγγραφών.');
 const patients = new Set(s.patients.map(p=>p.id));
 if(s.patients.some(p=>(p.status!==undefined&&!patientStatuses.includes(p.status))||(p.favourite!==undefined&&typeof p.favourite!=='boolean')||(p.sex!==undefined&&!['unknown','male','female','other'].includes(p.sex))||(p.assignedClinic!==undefined&&!['','clinic-1','clinic-2','hospital'].includes(p.assignedClinic))||['email','address','occupation','insurance','contact'].some(k=>p[k]!==undefined&&!string(p[k],500))||['clinicalUpdatedAt','notesUpdatedAt'].some(k=>p[k]!==undefined&&(!string(p[k],100)||!eventDate(p[k])))))throw Error('Μη έγκυρα δημογραφικά στοιχεία ή κατάσταση ασθενή.');

 if(!s.patients.every(p=>(p.lastName===undefined||string(p.lastName,150))&&(p.firstName===undefined||string(p.firstName,150))&&(p.clinical===undefined||p.clinical&&['unknown','never','current','former'].includes(p.clinical.smoking)&&Object.keys(CLINICAL_FIELDS).every(k=>string(p.clinical[k])))))throw Error('Μη έγκυρα κλινικά στοιχεία ασθενή.');
 if(s.examinations!==undefined&&(!Array.isArray(s.examinations)||!unique(s.examinations)||!s.examinations.every(e=>patients.has(e.patientId)&&Object.hasOwn(EXAM_TYPES,e.category)&&validDate(e.date)&&string(e.title,200)&&e.title.trim()&&string(e.result)&&string(e.referenceRange)&&string(e.notes)&&Array.isArray(e.files)&&e.files.every(f=>f&&string(f.id,100)&&f.id&&string(f.name,255)&&string(f.type,150)&&Number.isInteger(f.size)&&f.size>0&&f.size<=20*1024*1024))))throw Error('Μη έγκυρες εξετάσεις ή συνημμένα.');
 if((s.examinations||[]).some(e=>(e.comparisonNote!==undefined&&!string(e.comparisonNote))||(e.imagingRevisions!==undefined&&(!Array.isArray(e.imagingRevisions)||e.imagingRevisions.some(r=>!r||!string(r.at,100)||!string(r.author,100)||!string(r.result)||!string(r.notes)||!string(r.comparisonNote))))))throw Error('Μη έγκυρο ιστορικό απεικονιστικών ευρημάτων.');
 const fileIds=(s.examinations||[]).flatMap(e=>e.files.map(f=>f.id));if(new Set(fileIds).size!==fileIds.length)throw Error('Διπλοί κωδικοί συνημμένων.');

 if (!s.patients.every(p=>string(p.name,150)&&p.name.trim()&&Number.isInteger(p.age)&&p.age>=0&&p.age<=120&&(p.amka===undefined||typeof p.amka==='string'&&/^(?:[0-9]{11})?$/.test(p.amka))&&string(p.phone,60)&&(p.phone2===undefined||string(p.phone2,60))&&string(p.notes))) throw Error('Μη έγκυρα στοιχεία ασθενών.');
 if (!s.appointments.every(a=>patients.has(a.patientId)&&validDate(a.date)&&validTime(a.time)&&Number.isInteger(a.duration)&&a.duration>=5&&a.duration<=240&&minutes(a.time)+a.duration<=1440&&['clinic-1','clinic-2','hospital'].includes(a.clinic)&&['scheduled','cancelled','completed','no-show'].includes(a.status))) throw Error('Μη έγκυρα ραντεβού.');
 const findingsValid=f=>f===undefined||f&&typeof f==='object'&&!Array.isArray(f)&&Object.entries(f).every(([k,v])=>Object.hasOwn(FINDING_FIELDS,k)&&string(v,500)&&(!['systolic','diastolic','pulse','bmi','qmax','pvr'].includes(k)||v===''||Number.isFinite(Number(v))&&Number(v)>=0&&Number(v)<=10000));
 const visitValid = v => findingsValid(v.findings)&&patients.has(v.patientId)&&validDate(v.date)&&['clinic-1','clinic-2','hospital'].includes(v.clinic)&&['draft','final'].includes(v.status)&&['reason','history','exam','assessment','plan'].every(k=>string(v[k]))&&string(v.author,100)&&string(v.updatedAt,100)&&Array.isArray(v.revisions);
 if (!s.visits.every(v=>visitValid(v)&&v.revisions.every(r=>r&&string(r.reason,500)&&string(r.author,100)&&string(r.at,100)&&r.snapshot&&findingsValid(r.snapshot.findings)&&['reason','history','exam','assessment','plan'].every(k=>string(r.snapshot[k]))))) throw Error('Μη έγκυρες επισκέψεις.');
 if (s.settings.modules && (typeof s.settings.modules!=='object'||Array.isArray(s.settings.modules)||Object.entries(s.settings.modules).some(([k,v])=>!Object.hasOwn(MODULES,k)||typeof v!=='boolean'))) throw Error('Μη έγκυρες ρυθμίσεις λειτουργιών.');
 if (s.settings.clinicNames && !['clinic-1','clinic-2','hospital'].every(k=>string(s.settings.clinicNames[k],80)&&s.settings.clinicNames[k].trim())) throw Error('Μη έγκυρες ονομασίες χώρων.');
 if (s.settings.travelMinutes!==undefined && (!Number.isInteger(s.settings.travelMinutes)||s.settings.travelMinutes<0||s.settings.travelMinutes>180)) throw Error('Ο χρόνος μετακίνησης πρέπει να είναι 0–180 λεπτά.');
 if (s.feedback!==undefined && (!Array.isArray(s.feedback)||!unique(s.feedback)||!s.feedback.every(f=>string(f.title,150)&&string(f.details,5000)&&string(f.author,100)&&string(f.page,100)&&string(f.createdAt,100)&&['open','done'].includes(f.status)))) throw Error('Μη έγκυρες παρατηρήσεις δοκιμής.');
 return s;
}
export function normalize(s) {
 validate(s);
 const defaults=fresh().settings;
 const locationNames={...defaults.clinicNames,...s.settings.clinicNames};
 if(!s.settings.clinicLocationsVersion){for(const [id,old] of Object.entries({'clinic-1':'Ιατρείο 1','clinic-2':'Ιατρείο 2',hospital:'Νοσοκομείο'})){if(locationNames[id]===old)locationNames[id]=defaults.clinicNames[id];}}
 const locationSettings={clinicNames:locationNames,clinicLocationsVersion:1,hospital:s.settings.clinicLocationsVersion?s.settings.hospital:true};
 return {...s,patients:s.patients.map(p=>({...p,status:p.status||'active',favourite:p.favourite||false,sex:p.sex||'unknown',assignedClinic:p.assignedClinic||'',email:p.email||'',phone2:p.phone2||'',address:p.address||'',occupation:p.occupation||'',insurance:p.insurance||'',contact:p.contact||'',amka:p.amka||'',lastName:p.lastName||'',firstName:p.firstName||'',clinical:p.clinical||emptyClinical()})),examinations:s.examinations||[],feedback:s.feedback||[],settings:{...defaults,...s.settings,modules:{...defaults.modules,...s.settings.modules},...locationSettings}};
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

// Search tolerates Greek accents and preserves leading zeroes in fictional AMKA.
export const searchText = value => String(value??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('el').trim().replace(/ς/g,'σ');
export function matchesPatient(p,query,{history=false}={}) {
 const q=searchText(query);if(!q)return true;
 if(/^[0-9]+$/.test(q))return (!history&&String(p.age)===q)||(p.amka||'').startsWith(q)||(!history&&(p.phone||'').includes(q));
 if(history&&q.length<2)return false;
 const name=searchText(history&&p.lastName?p.lastName:p.name);
 return history?name.split(/\s+/).some(part=>part.startsWith(q)):name.includes(q);
}

export const PATIENT_STATUSES={active:'Ενεργός',followup:'Υπό παρακολούθηση',review:'Επανέλεγχος',inactive:'Μη ενεργός'};
export function patientLastVisit(s,id){return s.visits.filter(v=>v.patientId===id&&v.status==='final').sort((a,b)=>b.date.localeCompare(a.date))[0];}
export function patientClinics(s,p){return [...new Set([p.assignedClinic,...s.visits.filter(v=>v.patientId===p.id).map(v=>v.clinic),...s.appointments.filter(a=>a.patientId===p.id).map(a=>a.clinic)].filter(Boolean))];}
export function timelineEvents(s,id){
 const p=s.patients.find(p=>p.id===id);if(!p)return [];
 const events=[...s.visits.filter(v=>v.patientId===id).map(v=>({id:'visit:'+v.id,sourceId:v.id,type:'visits',date:v.date,title:v.reason||'Προσχέδιο επίσκεψης',text:[v.history,v.exam,findingsText(v),v.assessment,v.plan].filter(Boolean).join('\n'),status:v.status,clinic:v.clinic})),...(s.examinations||[]).filter(e=>e.patientId===id).map(e=>({id:'exam:'+e.id,sourceId:e.id,type:['ultrasound','ct','mri','xray','otherImaging'].includes(e.category)?'imaging':'exams',date:e.date,title:e.title,text:[e.result,e.notes,e.comparisonNote].filter(Boolean).join('\n')})),...s.appointments.filter(a=>a.patientId===id).map(a=>({id:'appointment:'+a.id,sourceId:a.id,type:'appointments',date:a.date,title:'Ραντεβού · '+a.time,text:({scheduled:'Προγραμματισμένο',completed:'Πραγματοποιημένο',cancelled:'Ακυρωμένο','no-show':'Μη προσέλευση'})[a.status],clinic:a.clinic}))];
 if(p.clinicalUpdatedAt&&eventDate(p.clinicalUpdatedAt))events.push({id:'profile:'+id,sourceId:id,type:'profile',date:eventDate(p.clinicalUpdatedAt),title:'Τελευταία ενημέρωση ιατρικού ιστορικού',text:[p.clinical?.diagnoses,p.clinical?.medications,p.clinical?.luts].filter(Boolean).join('\n')});
 if(p.notesUpdatedAt&&eventDate(p.notesUpdatedAt))events.push({id:'notes:'+id,sourceId:id,type:'notes',date:eventDate(p.notesUpdatedAt),title:'Τελευταία ενημέρωση σημειώσεων φακέλου',text:p.notes});
 return events.sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));
}
export function psaValues(s,id){return (s.examinations||[]).filter(e=>e.patientId===id&&e.category==='psa').flatMap(e=>{const match=e.result.match(/^\s*(\d+(?:[.,]\d+)?)\s*ng\s*\/\s*ml\s*$/i);const value=match?Number(match[1].replace(',','.')):NaN;return Number.isFinite(value)?[{id:e.id,date:e.date,value}]:[];}).sort((a,b)=>a.date.localeCompare(b.date));}
export function patientsCSV(patients){const cell=value=>{let s=String(value??'');if(/^\s*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';};return '\uFEFF'+[['Επίθετο','Όνομα','Παλαιό ενιαίο όνομα','Ηλικία','Α.Μ.Κ.Α.','Τηλέφωνο','Email','Κατάσταση'],...patients.map(p=>[p.lastName||'',p.firstName||'',p.lastName?'':p.name,p.age,p.amka||'',p.phone,p.email||'',PATIENT_STATUSES[p.status||'active']])].map(row=>row.map(cell).join(',')).join('\r\n');}

function eventDate(value){if(typeof value!=='string')return '';if(/^\d{4}-\d{2}-\d{2}$/.test(value))return validDate(value)?value:'';const date=new Date(value);if(isNaN(date))return '';const parts=Object.fromEntries(new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Athens',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(date).map(p=>[p.type,p.value]));return `${parts.year}-${parts.month}-${parts.day}`;}
