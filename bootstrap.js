// Completed stages, not elapsed time or guessed download percentages.
const $=id=>document.getElementById(id);
let app,ready=false;
const warnings=[];
function stage(value,label){$('bootProgress').value=value;$('bootStatus').textContent=label+' · '+value+'/4 στάδια';}
function warn(message){warnings.push(message);$('bootWarning').textContent=warnings.join(' ');$('bootWarning').hidden=false;}
function enter(e){e.stopImmediatePropagation();if(!ready)return;app.enterFromBoot();$('app').hidden=false;$('bootScreen').hidden=true;window.scrollTo(0,0);}
$('bootContinue').addEventListener('click',enter);
$('bootImageStart').addEventListener('click',enter);
$('bootRecovery').addEventListener('click',()=>{try{app.downloadRecoveryData();}catch(e){$('bootStatus').textContent='Η εξαγωγή απέτυχε: '+e.message;}});
async function start(){
 try{
  try{await $('bootArtwork').decode();}catch{warn('Η εικόνα υποδοχής δεν φορτώθηκε. Η εφαρμογή μπορεί να συνεχίσει.');}
  stage(1,'Εικόνα υποδοχής: ο έλεγχος ολοκληρώθηκε');
  app=await import('./app.js?v=20261108-photographic-frame');
  stage(2,'Αρχεία εφαρμογής και λειτουργίες φορτώθηκαν');
  await new Promise(requestAnimationFrame);
  app.initializeWorkspace();
  stage(3,'Τοπικά δεδομένα αναγνώστηκαν και ελέγχθηκαν');
  try{await app.initializeExamStorage();}catch{warn('Η αποθήκη συνημμένων δεν είναι διαθέσιμη. Μπορείτε να συνεχίσετε με τις καταχωρίσεις κειμένου· τα αρχεία εξετάσεων χρειάζονται νέο έλεγχο.');}
  stage(4,warnings.length?'Έτοιμη για είσοδο με τις παραπάνω επισημάνσεις':'Η εφαρμογή είναι έτοιμη για είσοδο');
  ready=true;$('bootContinue').disabled=false;$('bootImageStart').disabled=false;$('bootScreen').classList.add('hero');
 }catch(e){$('bootStatus').textContent='Η εκκίνηση σταμάτησε: '+e.message;$('bootStatus').setAttribute('role','alert');$('bootRetry').hidden=false;if(app)$('bootRecovery').hidden=false;}
}
start();
