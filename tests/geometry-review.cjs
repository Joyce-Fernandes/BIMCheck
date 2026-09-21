const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const IFC=require('web-ifc');
let api,geometry,validate;
const bytes=new Uint8Array(fs.readFileSync('src/examples/geometry_review.ifc'));
test.before(async()=>{api=new IFC.IfcAPI();await api.Init();geometry=await import('../src/ifc-geometry.mjs');validate=(await import('../src/validator.mjs')).validateModel;});
test('3D fixture finds only the wall without material',()=>{const r=validate(api,bytes,IFC);assert.equal(r.totalElements,2);assert.deepEqual(r.issues.map(i=>i.id),[2]);});
test('geometry keeps distinct IFC IDs and world placements',()=>{
 const model=api.OpenModel(bytes);const parts=[];
 try {geometry.extractGeometry(api,model,p=>parts.push(p));}finally{api.CloseModel(model);}
 assert.deepEqual([...new Set(parts.map(p=>p.expressID))].sort(),[2,3]);
 assert(parts.every(p=>p.vertices.length>0&&p.indices.length>0));
 assert.notDeepEqual(parts.find(p=>p.expressID===2).transform,parts.find(p=>p.expressID===3).transform);
 assert(parts.every(p=>p.vertices.every(Number.isFinite)));
});
test('selection rejects IDs not in the report and mismatched GlobalIds',()=>{
 const r=validate(api,bytes,IFC);assert.equal(geometry.findIssue(r,2).id,2);
 assert.throws(()=>geometry.findIssue(r,3));assert.throws(()=>geometry.findIssue(r,NaN));
 const m=api.OpenModel(bytes);
 try {geometry.verifyIssue(api,m,r.issues[0]);assert.throws(()=>geometry.verifyIssue(api,m,{id:2,globalId:'wrong'}));}finally{api.CloseModel(m);}
});
test('data-only IFC produces no geometry rather than a fabricated wall',()=>{
 const m=api.OpenModel(new Uint8Array(fs.readFileSync('src/examples/problematic_example.ifc')));
 try {assert.equal(geometry.extractGeometry(api,m,()=>assert.fail('Unexpected geometry')),0);}finally{api.CloseModel(m);}
});
test('composite wall selection includes its parts but not neighbouring walls',()=>{
 const content=Buffer.from(bytes).toString().replace(/\r\n/g, '\n').replace('ENDSEC;\nEND-ISO',"#40=IFCWALL('0000000000000000000040',$,'Composite wall',$,$,$,$,$,.NOTDEFINED.);\n#41=IFCRELAGGREGATES('0000000000000000000041',$,$,$,#40,(#2));\nENDSEC;\nEND-ISO");
 const m=api.OpenModel(new Uint8Array(Buffer.from(content)));
 try{const map=geometry.issueGeometryIds(api,m,[{id:40}],IFC);assert.deepEqual([...map.get(40)],[40,2]);assert(!map.get(40).has(3));}finally{api.CloseModel(m);}
});
