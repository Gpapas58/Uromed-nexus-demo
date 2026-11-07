// Fixed separators remain part of the value, including when digit slots are cleared.
const templates={date:'  /  /    ',time:'  :  '};
export function formatMask(value,kind){
 const template=templates[kind];if(!template)throw Error('Unknown input mask');
 const text=String(value??'');
 if(text.length===template.length&&[...template].every((c,i)=>c===' '?/[0-9 ]/.test(text[i]):text[i]===c))return text;
 const digits=text.replace(/[^0-9]/g,'');let n=0;
 return [...template].map(c=>c===' '?(digits[n++]||' '):c).join('');
}
export function editMask(value,kind,start,end,text='',backward=false){
 const chars=[...formatMask(value,kind)],template=templates[kind];
 const slots=[...template].flatMap((c,i)=>c===' '?[i]:[]);
 start=Math.max(0,Math.min(template.length,start??0));end=Math.max(start,end??start);
 const selected=slots.filter(i=>i>=start&&i<end);for(const i of selected)chars[i]=' ';
 const digits=String(text).replace(/[^0-9]/g,'');let caret=start;
 if(digits){const targets=slots.filter(i=>i>=start);for(let n=0;n<Math.min(digits.length,targets.length);n++){chars[targets[n]]=digits[n];caret=targets[n]+1;}caret=slots.find(i=>i>=caret)??template.length;}
 else if(!selected.length&&start===end){const target=backward?slots.filter(i=>i<start).at(-1):slots.find(i=>i>=start);if(target!==undefined){chars[target]=' ';caret=target;}}
 return {value:chars.join(''),caret};
}
export function installMasks(doc){
 const masked=el=>el?.matches?.('input[data-mask]');
 function apply(el,text,backward=false){const r=editMask(el.value,el.dataset.mask,el.selectionStart,el.selectionEnd,text,backward);el.value=r.value;el.setSelectionRange(r.caret,r.caret);el.dispatchEvent(new Event('input',{bubbles:true}));}
 doc.addEventListener('beforeinput',e=>{const el=e.target;if(!masked(el)||e.isComposing)return;
  if(e.inputType.startsWith('delete')){e.preventDefault();apply(el,'',e.inputType.includes('Backward'));}
  else if(e.inputType.startsWith('insert')&&e.data!==null){e.preventDefault();if(/[0-9]/.test(e.data))apply(el,e.data);}
 });
 doc.addEventListener('paste',e=>{if(!masked(e.target))return;e.preventDefault();const text=e.clipboardData.getData('text');if(/[0-9]/.test(text))apply(e.target,text);});
 doc.addEventListener('input',e=>{if(!masked(e.target))return;const el=e.target,formatted=formatMask(el.value,el.dataset.mask);if(el.value!==formatted){el.value=formatted;const caret=formatted.search(/ /);el.setSelectionRange(caret<0?formatted.length:caret,caret<0?formatted.length:caret);}},true);
 doc.addEventListener('focusin',e=>{if(masked(e.target)&&!/[0-9]/.test(e.target.value))e.target.setSelectionRange(0,0);});
}
