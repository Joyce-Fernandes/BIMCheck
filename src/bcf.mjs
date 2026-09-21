import {readReview} from './reviews.mjs';

const utf8 = new TextEncoder();
const xml = value => String(value ?? '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));
const doc = content => '<?xml version="1.0" encoding="UTF-8"?>\n'+content;
export const findingKey = (r,i) => JSON.stringify([r.analysisId,i.id,i.globalId||'',i.ruleId||'material']);

// Stable identifiers prevent repeated exports of the same finding creating new topics.
async function guid(text) {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256',utf8.encode(text))).slice(0,16);
  bytes[6]=(bytes[6]&15)|80;bytes[8]=(bytes[8]&63)|128;
  const s=Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');
  return `${s.slice(0,8)}-${s.slice(8,12)}-${s.slice(12,16)}-${s.slice(16,20)}-${s.slice(20)}`;
}

// ZIP STORE keeps exports local and requires no remote dependency.
export function zipFiles(files) {
  const local=[], central=[];let offset=0;
  for(const [name,value] of files) {
    const path=utf8.encode(name), data=typeof value==='string'?utf8.encode(value):value;
    let crc=0xffffffff;
    for(const byte of data){crc^=byte;for(let bit=0;bit<8;bit++)crc=(crc>>>1)^((crc&1)?0xedb88320:0);}
    crc=(crc^0xffffffff)>>>0;
    const h=new Uint8Array(30), v=new DataView(h.buffer);
    v.setUint32(0,0x04034b50,true);v.setUint16(4,20,true);v.setUint16(6,0x800,true);v.setUint16(12,33,true);
    v.setUint32(14,crc,true);v.setUint32(18,data.length,true);v.setUint32(22,data.length,true);v.setUint16(26,path.length,true);
    local.push(h,path,data);
    const c=new Uint8Array(46),w=new DataView(c.buffer);
    w.setUint32(0,0x02014b50,true);w.setUint16(4,20,true);w.setUint16(6,20,true);w.setUint16(8,0x800,true);w.setUint16(14,33,true);
    w.setUint32(16,crc,true);w.setUint32(20,data.length,true);w.setUint32(24,data.length,true);w.setUint16(28,path.length,true);w.setUint32(42,offset,true);
    central.push(c,path);offset+=h.length+path.length+data.length;
  }
  if(files.length>65535)throw new Error('Too many findings for one BCF archive.');
  const size=central.reduce((n,x)=>n+x.length,0),end=new Uint8Array(22),v=new DataView(end.buffer);
  v.setUint32(0,0x06054b50,true);v.setUint16(8,files.length,true);v.setUint16(10,files.length,true);v.setUint32(12,size,true);v.setUint32(16,offset,true);
  return new Blob([...local,...central,end],{type:'application/zip'});
}

export async function buildBCF(result,{storage=localStorage,snapshots=new Map()}={}) {
  if(!result?.analysisId||!result.issues?.length)throw new Error('There are no findings to export.');
  const files=[['bcf.version',doc('<Version VersionId="2.1"/>')]];
  let imageCount=0,unlinked=0;
  for(const issue of result.issues) {
    const key=findingKey(result,issue), topic=await guid(key),view=await guid(key+':view');
    const note=readReview(result,issue,storage), snapshot=snapshots.get(key);
    const linked=/^[0-3][0-9A-Za-z_$]{21}$/.test(issue.globalId||'');
    if(!linked)unlinked++;
    const date=result.analysedAt && Number.isFinite(Date.parse(result.analysedAt))?new Date(result.analysedAt).toISOString():new Date().toISOString();
    const description=[issue.description,issue.recommendation,`Element: ${issue.element}; Express ID: #${issue.id}; GlobalId: ${issue.globalId||'Not provided'}`,result.scope,
      linked?'':'No reliable GlobalId: locate the element manually.',
      snapshot?'Snapshot attached. Camera coordinates are not included.':'No snapshot or camera saved for this finding.',
      'Review status is a human decision and does not change the IFC.'].filter(Boolean).join('\n\n');
    const hasView=linked||!!snapshot;
    files.push([`${topic}/markup.bcf`,doc(`<Markup><Header><File isExternal="true"><Filename>${xml(result.fileName)}</Filename></File></Header><Topic Guid="${topic}" TopicType="Issue" TopicStatus="${xml(note.status)}"><Title>${xml((issue.ruleLabel||'Named material')+' — '+issue.element)}</Title><Labels>${xml(issue.ruleId||'material')}</Labels><CreationDate>${date}</CreationDate><CreationAuthor>BIMCheck</CreationAuthor>${note.assignee?`<AssignedTo>${xml(note.assignee)}</AssignedTo>`:''}<Description>${xml(description)}</Description></Topic>${note.text?`<Comment Guid="${await guid(key+':comment')}"><Date>${xml(note.updatedAt||date)}</Date><Author>BIMCheck local review</Author><Comment>${xml(note.text)}</Comment></Comment>`:''}${hasView?`<Viewpoints Guid="${view}">${linked?'<Viewpoint>viewpoint.bcfv</Viewpoint>':''}${snapshot?'<Snapshot>snapshot.png</Snapshot>':''}</Viewpoints>`:''}</Markup>`)]);
    if(linked)files.push([`${topic}/viewpoint.bcfv`,doc(`<VisualizationInfo Guid="${view}"><Components><Selection><Component IfcGuid="${xml(issue.globalId)}"><OriginatingSystem>BIMCheck</OriginatingSystem><AuthoringToolId>${issue.id}</AuthoringToolId></Component></Selection><Visibility DefaultVisibility="true"/></Components></VisualizationInfo>`)]);
    if(snapshot){files.push([`${topic}/snapshot.png`,new Uint8Array(await snapshot.arrayBuffer())]);imageCount++;}
  }
  return {blob:zipFiles(files),files,imageCount,unlinked};
}

export async function exportBCF(result) {
  const snapshots=new Map();
  for(const issue of result.issues){const image=await loadSnapshot(result,issue);if(image)snapshots.set(findingKey(result,issue),image);}
  const exported=await buildBCF(result,{snapshots});
  const url=URL.createObjectURL(exported.blob),a=document.createElement('a');
  a.href=url;a.download='BIMCheck_Findings.bcfzip';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);
  return `${result.issues.length} ${result.issues.length===1?'finding':'findings'} exported · ${exported.imageCount} ${exported.imageCount===1?'snapshot':'snapshots'}. Camera coordinates are not included.${exported.unlinked?' '+exported.unlinked+' findings have no valid GlobalId.':''}`;
}

function imageStore(mode,operation) {
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open('bimcheck-bcf',1);
    request.onupgradeneeded=()=>request.result.createObjectStore('snapshots');
    request.onerror=()=>reject(request.error);
    request.onsuccess=()=>{const db=request.result,tx=db.transaction('snapshots',mode);let value;
      const action=operation(tx.objectStore('snapshots'));action.onsuccess=()=>{value=action.result;};
      tx.oncomplete=()=>{db.close();resolve(value);};tx.onabort=tx.onerror=()=>{db.close();reject(tx.error||new Error('Snapshot storage unavailable.'));};
    };
  });
}
export const saveSnapshot=(r,i,blob)=>imageStore('readwrite',s=>s.put(blob,findingKey(r,i)));
export const loadSnapshot=(r,i)=>imageStore('readonly',s=>s.get(findingKey(r,i)));
