export const reviewStatuses = ['Open', 'In review', 'Resolved'];
function key(result, issue) {
  if (!result.analysisId || !Number.isSafeInteger(issue.id)) throw new Error('Analyse the file again before saving a review.');
  const base=[result.analysisId, issue.id, issue.globalId || ''];
  if(issue.ruleId && issue.ruleId!=='material')base.push(issue.ruleId);
  return 'bimcheck_review:' + JSON.stringify(base);
}
export function readReview(result, issue, storage = localStorage) {
  const raw = storage.getItem(key(result, issue));
  if (!raw) return {status:'Open', text:'', assignee:'', updatedAt:null};
  const value = JSON.parse(raw);
  if (!reviewStatuses.includes(value.status) || typeof value.text !== 'string') throw new Error('The saved review could not be read.');
  return value;
}
export function saveReview(result, issue, value, storage = localStorage) {
  if (!reviewStatuses.includes(value.status)) throw new Error('Choose a valid review status.');
  if (typeof value.text !== 'string' || value.text.length > 5000) throw new Error('Notes must be 5,000 characters or fewer.');
  if(typeof (value.assignee||'') !== 'string' || (value.assignee||'').length>120)throw new Error('Assignee must be 120 characters or fewer.');
  const note = {assignee:value.assignee||'',status:value.status, text:value.text, updatedAt:new Date().toISOString()};
  storage.setItem(key(result, issue), JSON.stringify(note));
  return note;
}
export function reviewRows(result, storage = localStorage) {
  return [['Express ID','Global ID','Name','Issue','Recommendation','Review status','Review notes','Last updated (UTC)','Assignee','Rule'],
    ...result.issues.map(issue => {
      const note = result.analysisId ? readReview(result, issue, storage) : {status:'Open',text:'',updatedAt:null};
      return [issue.id,issue.globalId,issue.element,issue.description,issue.recommendation,note.status,note.text,note.updatedAt||'',note.assignee||'',issue.ruleLabel||'Named material'];
    })];
}
