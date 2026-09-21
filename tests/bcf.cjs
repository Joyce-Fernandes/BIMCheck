const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const os=require('node:os');
const extract=require('extract-zip');
const {JSDOM}=require('jsdom');
const parser=new (new JSDOM('').window.DOMParser)();
const parse=text=>{const doc=parser.parseFromString(text,'application/xml');assert.equal(doc.querySelector('parsererror'),null);return doc;};
const storage={getItem:()=>JSON.stringify({status:'In review',text:'Check <wall> & "material" — revisão',assignee:'Joyce & Team',updatedAt:'2026-09-17T12:00:00.000Z'})};
const issue={id:2,globalId:'0Zx4cqrajBR8O5_p97fE50',element:'Wall <A>',ruleId:'material',ruleLabel:'Named material',description:'Missing & unknown',recommendation:'Review'};
const result={analysisId:'test-bcf',fileName:'Model.ifc',analysedAt:'2026-09-17T12:00:00.000Z',scope:'Presence only',issues:[issue,{...issue,ruleId:'fireRating'}]};
test('BCF archive round trip: notes, identity, stable topics, rule isolation and selection',async()=>{
 const {buildBCF}=await import('../src/bcf.mjs');
 const a=await buildBCF(result,{storage});const b=await buildBCF(result,{storage});
 assert.deepEqual(a.files.map(x=>x[0]),b.files.map(x=>x[0]));
 assert.equal(new Set(a.files.filter(x=>x[0].endsWith('markup.bcf')).map(x=>x[0])).size,2);
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'bimcheck-bcf-'));
 fs.writeFileSync(path.join(dir,'test.bcfzip'),Buffer.from(await a.blob.arrayBuffer()));
 await extract(path.join(dir,'test.bcfzip'),{dir:path.join(dir,'unzipped')});
 for(const [name,value] of a.files){assert.equal(fs.readFileSync(path.join(dir,'unzipped',name),'utf8'),value);const doc=parse(value);
 if(name.endsWith('markup.bcf')){assert.equal(doc.querySelector('AssignedTo').textContent,'Joyce & Team');assert.equal(doc.querySelector('Comment > Comment').textContent,'Check <wall> & "material" — revisão');assert.equal(doc.querySelector('Topic').getAttribute('TopicStatus'),'In review');}
 if(name.endsWith('.bcfv'))assert.equal(doc.querySelector('Component').getAttribute('IfcGuid'),issue.globalId);
 }
 // Fixture for independent XSD validation and external BCF reader tests.
 fs.mkdirSync('tests/bcf-output',{recursive:true});fs.writeFileSync('tests/bcf-output/test.bcfzip',Buffer.from(await a.blob.arrayBuffer()));
});
test('snapshot reference, PNG and absent camera are explicit',async()=>{
 const {buildBCF,findingKey}=await import('../src/bcf.mjs');
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 const r={...result,issues:[issue]};const a=await buildBCF(r,{storage,snapshots:new Map([[findingKey(r,issue),new Blob([png])]])});
 assert.equal(a.imageCount,1);assert.ok(a.files.some(x=>x[0].endsWith('snapshot.png')));assert.ok(a.files[1][1].includes('<Snapshot>snapshot.png</Snapshot>'));assert.ok(!a.files.some(x=>typeof x[1]==='string'&&x[1].includes('<PerspectiveCamera>')));
});
test('invalid GlobalId does not create a misleading component reference',async()=>{
 const {buildBCF}=await import('../src/bcf.mjs');const a=await buildBCF({...result,issues:[{...issue,globalId:'invalid'}]},{storage});assert.equal(a.unlinked,1);assert.equal(a.files.length,2);parse(a.files[1][1]);
});
test('empty findings and corrupt reviews fail clearly',async()=>{
 const {buildBCF}=await import('../src/bcf.mjs');await assert.rejects(buildBCF({...result,issues:[]},{storage}),/no findings/);await assert.rejects(buildBCF(result,{storage:{getItem:()=>'{'}}));
});
