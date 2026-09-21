import {startGuide, showGuideFinding} from './guide.mjs';
const demo=new URLSearchParams(location.search).get('demo')==='1';
import {exportBCF} from './bcf.mjs';
import {saveAnalysis} from './comparison.mjs';
import {exportWorkbook} from './report.mjs';
import {analyseInWorker} from './analysis-client.mjs';
import {validateUpload, VIEWER_LIMIT} from './limits.mjs';
import {saveModel, viewerUrl} from './model-store.mjs';
let analysisController;
let busy = false;
let currentResult = null;
let lastFile;
const $ = id => document.getElementById(id);
const statusText = result => result.status === 'not-applicable' ? 'No walls to check' : result.issues.length ? 'Findings require review' : 'Selected checks passed';
function clearResults() {
  currentResult = null;
  $('uploadSection').style.display = 'block';
  $('resultsSection').style.display = 'none';
  $('fileInput').value = '';
}
async function processFile(file) {
  if (busy || !file) return;
  busy = true;
  lastFile=file;
  $('retry-analysis').hidden=true;
  currentResult = null;
  document.querySelectorAll('button').forEach(b => b.disabled = true);
  analysisController=new AbortController();
  $('cancel-analysis').disabled=false;
  $('cancel-analysis').onclick=()=>analysisController.abort();
  $('analysis-feedback').textContent='';
  $('resultsSection').style.display = 'none';
  try {
    validateUpload(file);
    $('progressSection').style.display = 'block';
    $('progressText').textContent = 'Starting background analysis…';
    $('progressFill').removeAttribute('style');
    const rules=Object.fromEntries(['material','classification','fireRating'].map(key=>[key,$('rule-'+key).checked]));
    const start=performance.now();
    const {bytes,result}=await analyseInWorker(file,rules,progress=>{
      $('progressText').textContent=progress.total ? `${progress.stage}: ${progress.completed.toLocaleString('en-GB')} / ${progress.total.toLocaleString('en-GB')}` : progress.stage+'…';
    },analysisController.signal);
    if(analysisController.signal.aborted)throw new DOMException('Analysis cancelled.','AbortError');
    $('cancel-analysis').disabled=true;
    $('progressText').textContent='Saving results on this device…';
    currentResult = {...result, demo, analysisId: crypto.randomUUID(), analysedAt: new Date().toISOString(), viewerAvailable: false, fileSize:file.size, fileName: file.name, processingTime: ((performance.now()-start)/1000).toFixed(2)};
    try {
      if(file.size>VIEWER_LIMIT)throw new Error('3D size limit');
      currentResult.viewerAvailable = true;
      await saveModel(bytes, currentResult);
    } catch { currentResult.viewerAvailable = false; }
    try { if(!demo)localStorage.setItem('bimcheck_real_result', JSON.stringify(currentResult)); } catch { /* Validation works without storage. */ }
    try {if(!demo)saveAnalysis(currentResult);} catch { /* Current result remains usable. */ }
    $('totalElements').textContent = result.totalElements;
    $('totalIssues').textContent = result.issues.length;
    $('validationStatus').textContent = statusText(result);
    $('issuesList').replaceChildren();
    const scope = document.createElement('p');
    scope.textContent = `${result.checkedWalls} walls checked; ${result.affectedWalls} walls require review. ${result.scope}`;
    $('issuesList').append(scope);
    const storageNote = document.createElement('p');
    storageNote.textContent = demo && currentResult.viewerAvailable ? 'This sample is stored separately from your working model.' : currentResult.viewerAvailable ? 'The latest IFC is kept on this device for 3D review. A new analysis replaces it.' : file.size>VIEWER_LIMIT ? 'Information analysis complete. Full 3D review is limited to 50 MiB in this version; export a smaller model for visual review.' : '3D review is unavailable because the model could not be saved in this browser.';
    $('issuesList').append(storageNote);
    let visibleFindings=0;
    function renderNextFindings() {
    for (const issue of result.issues.slice(visibleFindings,visibleFindings+100)) {
      const card = document.createElement('article'); card.className = 'issue-item';
      const title = document.createElement('h4');
      title.textContent = `#${issue.id} — ${issue.element} · ${issue.ruleLabel}`;
      const description = document.createElement('p'); description.textContent = issue.description;
      const recommendation = document.createElement('p'); recommendation.textContent = issue.recommendation;
      card.append(title, description, recommendation);
      if (currentResult.viewerAvailable) {
        const link = document.createElement('a'); link.className = 'btn btn-secondary';
        link.textContent = 'View in 3D'; link.href = viewerUrl(currentResult, issue.id, issue.ruleId); card.append(link);
      } $('issuesList').append(card);
    }
    visibleFindings+=100;
    $('more-findings').hidden=visibleFindings>=result.issues.length;
    }
    $('more-findings').onclick=renderNextFindings;
    renderNextFindings();
    $('uploadSection').style.display = 'none';
    $('resultsSection').style.display = 'block';
    $('resultsSection').scrollIntoView({block:'start'});
    if(demo)showGuideFinding(currentResult);
  } catch (error) {
    $('uploadSection').style.display = 'block';
    $('retry-analysis').hidden=false;
    $('analysis-feedback').textContent=error.name==='AbortError' ? 'Analysis cancelled. You can select another file.' : `Validation could not be completed: ${error.message}`;
  } finally {
    busy = false;
    $('progressSection').style.display = 'none';
    document.querySelectorAll('button').forEach(b => b.disabled = false);
  }
}
async function loadExample(name) {
  if (busy) return;
  try {
    const response = await fetch(new URL(`./examples/${name}`, import.meta.url));
    if (!response.ok) throw new Error('Example file unavailable.');
    await processFile(new File([await response.arrayBuffer()], name));
  } catch (error) { alert(error.message); }
}
function exportReport() {
  if (!currentResult) return;
  try {exportWorkbook(currentResult, XLSX);} catch(error) {alert(`Report could not be exported: ${error.message}`);}
}
$('fileInput').addEventListener('change', e => processFile(e.target.files[0]));
$('uploadArea').addEventListener('click', e => {
  if (!e.target.closest('button,input') && !busy) $('fileInput').click();
});
$('uploadArea').addEventListener('dragover', e => {e.preventDefault(); $('uploadArea').classList.add('dragover');});
$('uploadArea').addEventListener('dragleave', () => $('uploadArea').classList.remove('dragover'));
$('uploadArea').addEventListener('drop', e => {e.preventDefault(); $('uploadArea').classList.remove('dragover'); processFile(e.dataTransfer.files[0]);});
Object.assign(window, {clearResults, loadExample, exportReport});

// Reuse the last check selection on this device; each result records its own rules.
try {
  const saved=JSON.parse(localStorage.getItem('bimcheck_selected_rules')||'null');
  if(saved) for(const key of ['material','classification','fireRating']) if(typeof saved[key]==='boolean')$('rule-'+key).checked=saved[key];
} catch { /* Defaults remain available. */ }
for(const key of ['material','classification','fireRating']) $('rule-'+key).addEventListener('change',()=>{
  try {localStorage.setItem('bimcheck_selected_rules',JSON.stringify(Object.fromEntries(['material','classification','fireRating'].map(name=>[name,$('rule-'+name).checked]))));}catch { /* Check selection still works for this page. */ }
});

$('retry-analysis').onclick=()=>processFile(lastFile);

$('export-bcf').onclick=async()=>{const b=$('export-bcf');b.disabled=true;try{$('bcf-feedback').textContent=await exportBCF(currentResult);}catch(e){$('bcf-feedback').textContent='BCF export failed: '+e.message;}finally{b.disabled=false;}};

if(demo){for(const key of ['material','classification','fireRating']){$('rule-'+key).checked=key==='material';$('rule-'+key).disabled=true;}startGuide(()=>loadExample('geometry_review.ifc'));}
