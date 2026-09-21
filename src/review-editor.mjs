import {readReview,saveReview} from './reviews.mjs';
export function createReviewEditor() {
  const root=document.getElementById('review-editor');
  const text=document.getElementById('review-text');
  const assignee=document.getElementById('review-assignee');
  const status=document.getElementById('review-status');
  const feedback=document.getElementById('review-feedback');
  const save=document.getElementById('save-review');
  const drafts=new Map();
  let current;
  const draftKey=(r,i)=>JSON.stringify([r.analysisId,i.id,i.globalId||'',i.ruleId||'material']);
  const edited=()=>{
    if(!current)return;
    drafts.set(draftKey(current.result,current.issue),{text:text.value,status:status.value,assignee:assignee.value});
    feedback.textContent='Unsaved changes — select Save note to keep them.';
  };
  assignee.addEventListener('input',edited);text.addEventListener('input',edited);status.addEventListener('change',edited);
  root.addEventListener('submit',event=>{
    event.preventDefault();if(!current)return;
    try {
      const note=saveReview(current.result,current.issue,{text:text.value,status:status.value,assignee:assignee.value});
      drafts.delete(draftKey(current.result,current.issue));
      window.dispatchEvent(new CustomEvent('review-saved',{detail:{text:note.text}}));
      feedback.textContent=`Saved on this device · ${new Date(note.updatedAt).toLocaleString('en-GB')}`;
    } catch(error){feedback.textContent=`Not saved: ${error.message}`;}
  });
  window.addEventListener('beforeunload',event=>{if(drafts.size){event.preventDefault();event.returnValue='';}});
  return (result,issue)=>{
    current={result,issue};root.hidden=false;assignee.disabled=false;save.disabled=false;text.disabled=false;status.disabled=false;
    document.getElementById('review-target').textContent=`For #${issue.id} — ${issue.element} · ${issue.ruleLabel||'Named material'}`;
    try {
      const draft=drafts.get(draftKey(result,issue));const note=draft||readReview(result,issue);
      text.value=note.text;status.value=note.status;assignee.value=note.assignee||'';
      feedback.textContent=draft?'Unsaved changes for this element.':note.updatedAt?`Last saved · ${new Date(note.updatedAt).toLocaleString('en-GB')}`:'No saved review yet.';
    } catch(error){text.value='';assignee.value='';assignee.disabled=true;status.value='Open';save.disabled=true;text.disabled=true;status.disabled=true;feedback.textContent=`Review unavailable: ${error.message}`;}
  };
}
