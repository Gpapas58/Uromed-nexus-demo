// Local DEMO credentials only. This does not enforce server-side access control.
export const ACCOUNTS = [
 {username:'doctor',role:'doctor',label:'Γιατρός',name:'ΠΑΠΑΔΟΠΟΥΛΟΣ ΒΑΣΙΛΕΙΟΣ',demoPassword:'DoctorDemo!2026'},
 {username:'reception',role:'reception',label:'Γραμματεία',name:'Γραμματεία · Demo',demoPassword:'ReceptionDemo!2026'},
 {username:'ADMIN',role:'admin',label:'Administration',name:'ΠΑΠΑΔΟΠΟΥΛΟΣ ΓΕΩΡΓΙΟΣ',demoPassword:'AdminDemo!2026'}
];
const AUTH_KEY='uromed-demo-device-auth-v1';
const bytes = s => Uint8Array.from(atob(s),c=>c.charCodeAt(0));
const base64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const equal = (a,b) => a.length===b.length && a.every((v,i)=>v===b[i]);
function read() {const s=JSON.parse(localStorage.getItem(AUTH_KEY)||'{}');if(!s||typeof s!=='object'||Array.isArray(s))throw Error('Μη έγκυρες τοπικές ρυθμίσεις εισόδου.');return s;}
async function derive(value,salt) {
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(value),'PBKDF2',false,['deriveBits']);
 return base64(await crypto.subtle.deriveBits({name:'PBKDF2',salt:bytes(salt),iterations:120000,hash:'SHA-256'},key,256));
}
export async function check(username,method,value) {
 const account=ACCOUNTS.find(a=>a.username.toLowerCase()===username.trim().toLowerCase());
 if (!account) throw Error('Ελέγξτε το όνομα χρήστη και τα στοιχεία εισόδου.');
 if (method==='password') {if(value!==account.demoPassword)throw Error('Ελέγξτε το όνομα χρήστη και τον δοκιμαστικό κωδικό.');}
 else if (method==='pin') {
  const pin=read()[account.username]?.pin;
  if(!pin)throw Error('Δεν έχει οριστεί PIN για αυτόν τον δοκιμαστικό λογαριασμό σε αυτόν τον browser. Μπείτε πρώτα με Password.');
  if(await derive(value,pin.salt)!==pin.hash)throw Error('Λανθασμένο PIN.');
 } else throw Error('Μη έγκυρη μέθοδος εισόδου.');
 return account;
}
export async function setPin(account,pin) {
 if(!/^\d{6}$/.test(pin))throw Error('Το PIN πρέπει να έχει ακριβώς 6 ψηφία.');
 const all=read(),salt=base64(crypto.getRandomValues(new Uint8Array(16)));
 all[account.username]={...all[account.username],pin:{salt,hash:await derive(pin,salt)}};
 localStorage.setItem(AUTH_KEY,JSON.stringify(all));
}
export async function biometricAvailable() {
 try {return !!(isSecureContext&&window.PublicKeyCredential&&await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());}catch{return false;}
}
export async function registerBiometric(account) {
 if(/^\d+\.\d+\.\d+\.\d+$/.test(location.hostname))throw Error('Για βιομετρική πρόσβαση ανοίξτε την εφαρμογή μέσω localhost ή ονόματος HTTPS, όχι αριθμητικής IP.');
 if(!await biometricAvailable())throw Error('Δεν βρέθηκε διαθέσιμο βιομετρικό/Windows Hello σε ασφαλή σύνδεση αυτής της συσκευής.');
 const credential=await navigator.credentials.create({publicKey:{challenge:crypto.getRandomValues(new Uint8Array(32)),rp:{name:'UroMed · τοπικό εκπαιδευτικό demo'},user:{id:new TextEncoder().encode('uromed-demo-'+account.username),name:account.username,displayName:account.label+' · Demo'},pubKeyCredParams:[{type:'public-key',alg:-7}],authenticatorSelection:{authenticatorAttachment:'platform',userVerification:'required'},timeout:60000,attestation:'none'}});
 const pub=credential.response.getPublicKey?.();
 if(!pub||credential.response.getPublicKeyAlgorithm?.()!==-7)throw Error('Ο browser δεν διαθέτει τον απαραίτητο τρόπο τοπικής επαλήθευσης. Δεν ολοκληρώθηκε η εγγραφή.');
 const all=read();all[account.username]={...all[account.username],biometric:{id:base64(credential.rawId),publicKey:base64(pub)}};
 localStorage.setItem(AUTH_KEY,JSON.stringify(all));
}
// WebAuthn uses ASN.1 DER ECDSA signatures; WebCrypto expects r||s.
function rawSignature(input) {
 const s=new Uint8Array(input);let pos=2;if(s[1]&128)pos=2+(s[1]&127);
 if(s[pos++]!==2)throw Error('Μη έγκυρη υπογραφή.');const r=s.slice(pos+1,pos+1+s[pos]);pos+=1+s[pos];
 if(s[pos++]!==2)throw Error('Μη έγκυρη υπογραφή.');const t=s.slice(pos+1,pos+1+s[pos]);
 const out=new Uint8Array(64);out.set(r.slice(-32),32-Math.min(32,r.length));out.set(t.slice(-32),64-Math.min(32,t.length));return out;
}
export async function checkBiometric(username) {
 const account=ACCOUNTS.find(a=>a.username.toLowerCase()===username.trim().toLowerCase());
 const saved=account&&read()[account.username]?.biometric;
 if(!saved)throw Error('Μπείτε πρώτα με Password και καταχωρίστε βιομετρική πρόσβαση από τις Ρυθμίσεις αυτής της συσκευής.');
 const challenge=crypto.getRandomValues(new Uint8Array(32));
 const c=await navigator.credentials.get({publicKey:{challenge,allowCredentials:[{type:'public-key',id:bytes(saved.id)}],userVerification:'required',timeout:60000}});
 const r=c.response,client=JSON.parse(new TextDecoder().decode(r.clientDataJSON)),auth=new Uint8Array(r.authenticatorData);
 const urlChallenge=base64(challenge).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
 const rpHash=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(location.hostname)));
 if(!equal(new Uint8Array(c.rawId),bytes(saved.id))||client.type!=='webauthn.get'||client.challenge!==urlChallenge||client.origin!==location.origin||client.crossOrigin===true||!equal(auth.slice(0,32),rpHash)||(auth[32]&5)!==5)throw Error('Απέτυχε η επαλήθευση βιομετρικής πρόσβασης.');
 const digest=new Uint8Array(await crypto.subtle.digest('SHA-256',r.clientDataJSON));const signed=new Uint8Array(auth.length+digest.length);signed.set(auth);signed.set(digest,auth.length);
 const key=await crypto.subtle.importKey('spki',bytes(saved.publicKey),{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
 if(!await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,rawSignature(r.signature),signed))throw Error('Απέτυχε η επαλήθευση υπογραφής.');
 return account;
}
