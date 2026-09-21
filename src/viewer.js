import {viewerGuide} from './guide.mjs';
import {saveSnapshot,exportBCF} from './bcf.mjs';
import {createReviewEditor} from './review-editor.mjs';
import * as THREE from './vendor/three.module.js';
import {OrbitControls} from './vendor/OrbitControls.js';
import * as IFC from './vendor/web-ifc-api.js';
import {readModel} from './model-store.mjs';
import {extractGeometry, findIssue, verifyIssue, issueGeometryIds} from './ifc-geometry.mjs';
const $ = id => document.getElementById(id);
const params = new URLSearchParams(location.search);
const showReview = createReviewEditor();
const viewport = $('viewport');
let renderer, controls, observer, scene, camera, group, selectedId;
const parts = new Map();
let issueIds = new Map();
function selectedParts() {return [...(issueIds.get(selectedId)||[])].flatMap(id=>parts.get(id)||[]);}
const contextMaterial = new THREE.MeshPhongMaterial({color:0xa8b1c8,side:THREE.DoubleSide,transparent:true,opacity:0.14,depthWrite:false});
const highlight = new THREE.MeshPhongMaterial({color:0xee9634,emissive:0x000000,side:THREE.DoubleSide,depthTest:false});
let isolated = false;
function message(text) { $('message').textContent = text; $('message').hidden = !text; }
function draw() { if(renderer) renderer.render(scene,camera); }
function fit(box) {
  if (box.isEmpty()) return;
  const center = box.getCenter(new THREE.Vector3());
  const radius = Math.max(box.getSize(new THREE.Vector3()).length()/2,0.2);
  const halfFov = Math.min(THREE.MathUtils.degToRad(camera.fov/2), Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov/2))*camera.aspect));
  const distance = radius/Math.sin(halfFov)*1.3;
  const direction = camera.position.clone().sub(controls.target).normalize();
  if (!direction.length()) direction.set(1,0.7,1).normalize();
  controls.target.copy(center); camera.position.copy(center).addScaledVector(direction,distance);
  camera.near=Math.max(distance/10000,0.001);camera.far=Math.max(distance*100,1000);camera.updateProjectionMatrix();
  controls.update(); draw();
}
function selectionBounds() {
  const box = new THREE.Box3();
  for(const mesh of selectedParts()) box.union(new THREE.Box3().setFromObject(mesh));
  return box;
}
function updateAppearance() {
  group.traverse(mesh => {
    if (!mesh.isMesh) return;
    const selected=issueIds.get(selectedId)?.has(mesh.userData.expressID);
    mesh.visible=!isolated||selected;
    mesh.material=selected?highlight:contextMaterial;
    mesh.renderOrder=selected?2:0;
  });
  draw();
}
function selectIssue(result, id, rule) {
  const issue = findIssue(result,id,rule); selectedId=id;
  $('issue-select').value=`${id}|${issue.ruleId||'material'}`;
  $('finding-rule').textContent=issue.ruleLabel||'Named material';
  $('finding-description').textContent=issue.description;
  $('element-name').textContent=issue.element;
  $('express-id').textContent=`#${id}`;
  $('global-id').textContent=issue.globalId||'Not provided';
  showReview(result,issue);
  $('bcf-feedback').textContent='';
  $('export-bcf').disabled=false;
  $('capture-bcf').disabled=!selectedParts().length;
  $('capture-bcf').onclick=async()=>{
    const button=$('capture-bcf');button.disabled=true;
    try {
      draw();
      const blob=await new Promise(resolve=>renderer.domElement.toBlob(resolve,'image/png'));
      if(!blob)throw new Error('Snapshot could not be captured.');
      await saveSnapshot(result,issue,blob);
      $('bcf-feedback').textContent='Snapshot saved for this finding. Capture again to replace it.';
    }catch(e){$('bcf-feedback').textContent='Snapshot not saved: '+e.message;}finally{button.disabled=false;}
  };
  $('export-bcf').onclick=async()=>{
    const button=$('export-bcf');button.disabled=true;
    try{$('bcf-feedback').textContent=await exportBCF({...result,issues:[issue]});window.dispatchEvent(new Event('bcf-exported'));}
    catch(e){$('bcf-feedback').textContent='BCF export failed: '+e.message;}finally{button.disabled=false;}
  };
  const available=selectedParts().length>0;
  $('part-note').textContent = (issueIds.get(id)?.size||0)>1 ? 'The highlight includes the parts linked to this wall by IFC decomposition relationships.' : '';
  if (!available) isolated=false;
  $('isolate').setAttribute('aria-pressed',String(isolated));
  $('focus').disabled=!available; $('isolate').disabled=!available;
  updateAppearance();
  renderer.domElement.setAttribute('aria-label', available ? 'IFC model with selected wall highlighted in orange' : 'IFC model; selected wall has no renderable geometry');
  if (available) {message('');fit(selectionBounds());}
  else {message('This wall has no renderable geometry. Its validation finding is still available in the report.');fit(new THREE.Box3().setFromObject(group));}
  params.set('id',String(id)); params.set('rule',issue.ruleId||'material'); history.replaceState(null,'',`?${params}`);
}
function dispose() {
  observer?.disconnect();controls?.dispose();
  group?.traverse(mesh=>{if(mesh.isMesh)mesh.geometry.dispose();});
  contextMaterial.dispose();highlight.dispose();renderer?.dispose();
}
async function start() {
  const analysisId=params.get('analysis');
  if(!analysisId) throw new Error('Open this view using a View in 3D button after analysing an IFC.');
  const saved=await readModel(analysisId, params.get('demo')==='1');
  if(!saved) throw new Error('This analysis is no longer stored on this device. Analyse the IFC again, then use View in 3D.');
  const {bytes,result}=saved;
  const requested=findIssue(result,Number(params.get('id')),params.get('rule'));
  $('file-name').textContent=result.fileName;
  for(const issue of result.issues) {
    const option=document.createElement('option');option.value=`${issue.id}|${issue.ruleId||'material'}`;option.textContent=`#${issue.id} — ${issue.ruleLabel||'Named material'}`;$('issue-select').append(option);
  }
  renderer=new THREE.WebGLRenderer({antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));
  renderer.setClearColor(0xf0f2f8);viewport.append(renderer.domElement);
  renderer.domElement.setAttribute('aria-label','IFC model with selected wall highlighted in orange');
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(45,1,0.01,10000);camera.position.set(12,9,12);
  controls=new OrbitControls(camera,renderer.domElement);controls.addEventListener('change',draw);
  scene.add(new THREE.HemisphereLight(0xffffff,0x7c849d,0.7));
  const light=new THREE.DirectionalLight(0xffffff,0.45);light.position.set(10,30,20);scene.add(light);
  group=new THREE.Group();scene.add(group);
  observer=new ResizeObserver(()=>{const w=viewport.clientWidth,h=viewport.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();});observer.observe(viewport);
  message('Building 3D geometry… Large models may take a moment.');
  await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
  const api=new IFC.IfcAPI();api.SetWasmPath(new URL('./vendor/',import.meta.url).href,true);await api.Init();
  let model;
  try {
    model=api.OpenModel(bytes,{COORDINATE_TO_ORIGIN:true});
    if(model<0)throw new Error('The IFC could not be opened for 3D review.');
    for(const issue of result.issues)verifyIssue(api,model,issue);
    issueIds=issueGeometryIds(api,model,result.issues,IFC);
    extractGeometry(api,model,part=>{
      const geo=new THREE.BufferGeometry();
      const buffer=new THREE.InterleavedBuffer(part.vertices,6);
      geo.setAttribute('position',new THREE.InterleavedBufferAttribute(buffer,3,0));
      geo.setAttribute('normal',new THREE.InterleavedBufferAttribute(buffer,3,3));
      geo.setIndex(new THREE.BufferAttribute(part.indices,1));
      const mesh=new THREE.Mesh(geo,contextMaterial);
      mesh.applyMatrix4(new THREE.Matrix4().fromArray(part.transform));mesh.userData.expressID=part.expressID;
      group.add(mesh);
      if(!parts.has(part.expressID))parts.set(part.expressID,[]);
      parts.get(part.expressID).push(mesh);
    });
  } finally {if(model!==undefined&&model>=0)api.CloseModel(model);}
  if(group.children.length) {
    const center=new THREE.Box3().setFromObject(group).getCenter(new THREE.Vector3());group.position.sub(center);group.updateMatrixWorld(true);
  }
  $('fit').disabled=!group.children.length;$('issue-select').disabled=false;
  $('focus').onclick=()=>fit(selectionBounds());
  $('fit').onclick=()=>{isolated=false;$('isolate').setAttribute('aria-pressed','false');updateAppearance();fit(new THREE.Box3().setFromObject(group));};
  $('isolate').onclick=()=>{isolated=!isolated;$('isolate').setAttribute('aria-pressed',String(isolated));updateAppearance();};
  $('context').onchange=()=>{contextMaterial.opacity=$('context').checked?0.14:1;contextMaterial.transparent=$('context').checked;contextMaterial.depthWrite=!$('context').checked;contextMaterial.needsUpdate=true;draw();};
  $('issue-select').onchange=()=>{const [id,rule]=$('issue-select').value.split('|');selectIssue(result,Number(id),rule);};
  selectIssue(result,requested.id,requested.ruleId||'material');
  if(result.demo)viewerGuide();
}
window.addEventListener('pagehide',dispose,{once:true});
start().catch(error=>{message(error.message||'3D review could not be loaded.');$('element-name').textContent='Review unavailable';dispose();});
