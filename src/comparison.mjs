export function compareAnalyses(before, after) {
  if(!before.rulesFingerprint || before.rulesFingerprint!==after.rulesFingerprint) throw new Error('Use the same checks for both versions. Reanalyse both files with matching rules.');
  if(!Array.isArray(before.elements)||!Array.isArray(after.elements))throw new Error('These analyses need to be run again to support version comparison.');
  const index = result => {
    const counts=new Map();for(const e of result.elements) if(e.globalId) counts.set(e.globalId,(counts.get(e.globalId)||0)+1);
    const usable=new Set([...counts].filter(([,n])=>n===1).map(([id])=>id));
    const issues=new Map();for(const i of result.issues) if(usable.has(i.globalId))issues.set(JSON.stringify([i.globalId,i.ruleId||'material']),i);
    return {counts,usable,issues,unmatched:result.issues.filter(i=>!usable.has(i.globalId))};
  };
  const old=index(before),current=index(after);
  const ambiguous=new Set([...old.counts,...current.counts].filter(([,n])=>n>1).map(([id])=>id));
  for(const side of [old,current])for(const [key,issue] of side.issues)if(ambiguous.has(issue.globalId)){side.issues.delete(key);side.unmatched.push(issue);}
  const result={new:[],persisting:[],resolved:[],removed:[],unmatched:[...old.unmatched,...current.unmatched]};
  for(const [key,issue] of current.issues) {
    if(old.issues.has(key))result.persisting.push(issue);else result.new.push(issue);
  }
  for(const [key,issue] of old.issues) {
    if(current.issues.has(key))continue;
    if(current.usable.has(issue.globalId))result.resolved.push(issue);
    else result.removed.push(issue);
  }
  return result;
}
export function saveAnalysis(result,storage=localStorage) {
  const list=JSON.parse(storage.getItem('bimcheck_history')||'[]');
  storage.setItem('bimcheck_history',JSON.stringify([result,...list.filter(r=>r.analysisId!==result.analysisId)].slice(0,10)));
}
export function readHistory(storage=localStorage) {return JSON.parse(storage.getItem('bimcheck_history')||'[]');}
