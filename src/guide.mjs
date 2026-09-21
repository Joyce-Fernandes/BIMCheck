import {viewerUrl} from './model-store.mjs';
let panel;
function mount(viewer=false){
  document.body.classList.add('guided-demo');
  panel=document.createElement('section');panel.className='guide-panel';panel.setAttribute('aria-label','Guided demo');
  if(viewer)document.querySelector('.review-sidebar').prepend(panel);
  else document.getElementById('workspace').prepend(panel);
}
function step(n,title,description,label,action){
  panel.replaceChildren();
  const top=document.createElement('div');top.className='guide-top';
  const tag=document.createElement('span');tag.textContent=`GUIDED DEMO · ${n} OF 4`;
  const exit=document.createElement('a');exit.href='index.html';exit.textContent='Exit demo';top.append(tag,exit);
  const heading=document.createElement('h2');heading.textContent=title;heading.tabIndex=-1;
  const text=document.createElement('p');text.textContent=description;
  const track=document.createElement('div');track.className='guide-track';track.setAttribute('aria-hidden','true');
  for(let i=1;i<=4;i++){const dot=document.createElement('span');if(i<=n)dot.className='active';track.append(dot);}
  panel.append(top,track,heading,text);
  if(label){const button=document.createElement('button');button.className='guide-action';button.textContent=label;button.onclick=action;panel.append(button);}
  heading.focus({preventScroll:true});panel.scrollIntoView({block:'nearest'});
}
export function startGuide(load){
  mount();
  step(1,'Meet your sample model.','Two walls. One information gap. Analyse a small IFC, inspect the finding, then prepare a review to share. Your working model and dashboard are kept separate.','Analyse the sample IFC',async()=>{
    panel.querySelector('button').disabled=true;
    await load();
    const button=panel.querySelector('button');if(button)button.disabled=false;
  });
}
export function showGuideFinding(result){
  const issue=result.issues.find(i=>i.ruleId==='material');
  if(!issue){step(1,'The sample needs another look.','The expected material finding was not returned. Exit and restart the demo.');return;}
  step(2,'A wall needs information.',`${result.checkedWalls} walls were checked. A named material was not found for “${issue.element}”. This is an information gap for review, not proof that the wall is unsafe.`,result.viewerAvailable?'Locate the wall in 3D':null,()=>{location.href=viewerUrl(result,issue.id,issue.ruleId);});
  if(!result.viewerAvailable){const hint=document.createElement('p');hint.textContent='3D storage is unavailable in this browser. Allow local storage and restart the demo.';panel.append(hint);}
}
export function viewerGuide(){
  let savedComment=false;
  mount(true);
  // Keep navigation inside the demo until the visitor chooses to exit.
  const back=document.querySelector('.nav>a:last-child');back.href='index.html?demo=1';back.textContent='Restart demo';
  step(3,'Find the wall in context.','The orange wall is the element behind the finding. Drag to orbit, scroll to zoom, or use Isolate wall to inspect it.','Next: add a review',()=>{
    step(3,'Record the next action.','Write a short observation below, optionally choose a responsible person and status, then select Save note. Example: “Please confirm and assign the intended wall material.”');
    document.getElementById('review-text').focus();
    document.getElementById('review-editor').scrollIntoView({block:'nearest'});
  });
  window.addEventListener('review-saved',event=>{
    savedComment=!!event.detail.text.trim();
    if(!savedComment)return;
    step(4,'Share an actionable finding.','Your note is saved. Use Capture snapshot below if you want an image, then Export this finding as BCF. The download includes the element reference and saved review. Camera coordinates are not included.','Go to sharing controls',()=>{
      document.getElementById('capture-bcf').focus();document.getElementById('capture-bcf').scrollIntoView({block:'center'});
    });
  });
  window.addEventListener('bcf-exported',()=>{
    if(!savedComment){step(3,'Add your observation.','The BCF was exported. To complete the guided review, write a comment below, select Save note and export again.');return;}
    step(4,'Your review is ready to share.','The BCF download was requested. You have analysed an IFC, located a finding and exported a review. On a real project, the recipient opens the matching IFC with the BCF in a compatible tool.','Review your own IFC',()=>{location.href='index.html#workspace';});
  });
}
