import {exportBCF} from './bcf.mjs';
import {readHistory, compareAnalyses} from './comparison.mjs';
import {readReview} from './reviews.mjs';
import {exportWorkbook} from './report.mjs';
import {viewerUrl} from './model-store.mjs';
const $ = id => document.getElementById(id);
const number = value => Number(value).toLocaleString('en-GB');
const labels = {IFCWALL:'Walls',IFCWALLSTANDARDCASE:'Standard walls',IFCWALLELEMENTEDCASE:'Elemented walls',IFCCOVERING:'Coverings',IFCDOOR:'Doors',IFCWINDOW:'Windows',IFCSLAB:'Slabs',IFCBEAM:'Beams',IFCCOLUMN:'Columns',IFCSTAIR:'Stairs',IFCRAILING:'Railings',IFCFLOWSEGMENT:'Flow segments',IFCMEMBER:'Structural members',IFCBUILDINGELEMENTPROXY:'Proxy elements',IFCDISTRIBUTIONELEMENT:'Distribution elements',IFCVIRTUALELEMENT:'Virtual elements',IFCBUILDINGELEMENTPART:'Element parts',IFCBUILDINGSTOREY:'Storeys'};
try {
  const r = JSON.parse(localStorage.getItem('bimcheck_real_result') || 'null');
  if (!r) { $('empty').hidden = false; }
  else {
    if (!Array.isArray(r.issues) || !r.elementCounts || !Number.isFinite(r.checkedWalls)) throw new Error('Invalid result');
    $('content').hidden = false;
    setupComparison(r);
    $('export-bcf').disabled=!r.issues.length;
    $('export-bcf').onclick=async()=>{const b=$('export-bcf');b.disabled=true;try{$('export-feedback').textContent='Preparing BCF…';$('export-feedback').textContent=await exportBCF(r);}catch(e){$('export-feedback').textContent='BCF export failed: '+e.message;}finally{b.disabled=false;}};
    $('export-review').onclick=()=>{try{exportWorkbook(r,window.XLSX);$('export-feedback').textContent='Report exported with saved review notes.';}catch(error){$('export-feedback').textContent=`Export failed: ${error.message}`;}};
    $('filename').textContent = r.fileName;
    $('elements').textContent = number(r.totalElements);
    $('walls').textContent = number(r.checkedWalls);
    $('issue-count').textContent = number(r.issues.length);
    $('time').textContent = `${Number(r.processingTime).toLocaleString('en-GB', {maximumFractionDigits:2})} s`;
    const affected=new Set(r.issues.map(issue=>issue.id)).size;
    const passed = Math.max(0, r.checkedWalls-affected);
    $('passed').textContent = number(passed);
    $('review').textContent = number(affected);
    $('wall-fill').style.width = `${r.checkedWalls ? passed/r.checkedWalls*100 : 0}%`;
    $('wall-bar').hidden = !r.checkedWalls;
    $('wall-bar').setAttribute('aria-label', `${passed} walls pass selected checks and ${affected} require review`);
    $('status').textContent = !r.checkedWalls ? 'No walls to check' : r.issues.length ? 'Some walls need attention' : 'Walls pass selected checks';
    $('wall-summary').textContent = `${number(passed)} of ${number(r.checkedWalls)} walls pass the selected checks. ${r.scope}`;
    const categories = Object.entries(r.elementCounts).sort((a,b) => b[1]-a[1]);
    $('category-count').textContent = `${categories.length} ${categories.length === 1 ? 'category' : 'categories'}`;
    const max = Math.max(1,...categories.map(([,count]) => count));
    for (const [type,count] of categories) {
      const row = document.createElement('div');
      const top = document.createElement('div'); top.className = 'category-top';
      const name = document.createElement('span'); name.className = 'category-name'; name.textContent = labels[type] || type;
      if (labels[type]) {const code = document.createElement('small'); code.textContent = type; name.append(code);}
      const total = document.createElement('strong'); total.textContent = number(count); top.append(name,total);
      const track = document.createElement('div'); track.className = 'category-track'; track.setAttribute('aria-hidden','true');
      const fill = document.createElement('div'); fill.className = 'category-fill'; fill.style.width = `${count/max*100}%`; track.append(fill); row.append(top,track); $('categories').append(row);
    }
    $('review-count').textContent = `${r.issues.length} ${r.issues.length === 1 ? 'issue' : 'issues'}`;
    if (!r.issues.length) { $('table-wrap').hidden=true; $('no-issues').hidden=false; $('no-issues').textContent=r.checkedWalls ? 'No issues found by the selected checks.' : 'There are no walls in this file to check.'; }
    let shown=0;
    const more=document.createElement('button');more.className='button';more.textContent='Show next 100 findings';$('table-wrap').after(more);
    function renderFindings() {
    for (const issue of r.issues.slice(shown,shown+100)) {
      const row = document.createElement('tr');
      for (const value of [`#${issue.id}`,issue.element,issue.ruleLabel||'Named material']) {const cell=document.createElement('td');cell.textContent=value;row.append(cell);}
      const reviewCell=document.createElement('td');
      const updateStatus=()=>{try{const note=r.analysisId?readReview(r,issue):{status:'Open'};reviewCell.textContent=note.status+(note.assignee?' · '+note.assignee:'');}catch{reviewCell.textContent='Unavailable';}};
      updateStatus();window.addEventListener('storage',updateStatus);window.addEventListener('pageshow',updateStatus);row.append(reviewCell);
      const action = document.createElement('td');
      if (r.viewerAvailable && r.analysisId) {
        const link = document.createElement('a'); link.className = 'button'; link.textContent = 'View in 3D'; link.href = viewerUrl(r, issue.id, issue.ruleId); action.append(link);
      } else { action.textContent = 'Run a new analysis to enable 3D'; }
      row.append(action);
      $('issues').append(row);
    }
    shown+=100;more.hidden=shown>=r.issues.length;
    }
    more.onclick=renderFindings;renderFindings();
  }
} catch {
  $('content').hidden = true; $('empty').hidden=false;
  $('empty').textContent = 'The saved analysis could not be read. Return to the validator and analyse the file again.';
}

function setupComparison(current) {
  const select=document.getElementById('baseline');const output=document.getElementById('comparison-results');
  try {
    const history=readHistory().filter(r=>r.analysisId!==current.analysisId);
    for(const prior of history) {const option=document.createElement('option');option.value=prior.analysisId;option.textContent=`${prior.fileName} · ${prior.analysedAt?new Date(prior.analysedAt).toLocaleString('en-GB'):'Earlier analysis'}`;select.append(option);}
    if(!history.length) output.textContent='Run a second version with the same checks to compare results. Up to 10 analysis summaries are kept on this device.';
    select.onchange=()=>{
      output.replaceChildren();if(!select.value)return;
      try {
        const before=history.find(r=>r.analysisId===select.value);const diff=compareAnalyses(before,current);
        const labels={new:'New findings',persisting:'Still present',resolved:'No longer failing',removed:'Removed / ID not found',unmatched:'Cannot match reliably'};
        for(const [key,label] of Object.entries(labels)) {
          const section=document.createElement('details');const title=document.createElement('summary');title.textContent=`${label}: ${diff[key].length}`;section.append(title);
          for(const issue of diff[key]) {const row=document.createElement('p');row.textContent=`${issue.globalId||'No GlobalId'} · ${issue.element} · ${issue.ruleLabel||'Named material'}`;section.append(row);}output.append(section);
        }
      }catch(error){output.textContent=error.message;}
    };
  }catch {output.textContent='Local comparison history is unavailable.';}
}
