const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const IFC = require('web-ifc');
let api, validateModel;
test.before(async () => {api = new IFC.IfcAPI(); await api.Init(); ({validateModel} = await import('../src/validator.mjs'));});
const bytes = name => new Uint8Array(fs.readFileSync('src/examples/'+name+'.ifc'));
test('counts real elements and flags missing wall material', () => {
 const r=validateModel(api,bytes('problematic_example'),IFC);
 assert.equal(r.totalElements,1); assert.equal(r.checkedWalls,1); assert.equal(r.issues[0].id,2);
});
test('recognizes a direct material', () => {assert.equal(validateModel(api,bytes('valid_example'),IFC).issues.length,0);});
test('recognizes inherited type material', () => {assert.equal(validateModel(api,bytes('residential_project'),IFC).issues.length,0);});
test('material layer set usage is followed', () => {
 const s=Buffer.from(bytes('valid_example')).toString().replace(/\r\n/g, '\n').replace('(#2),#3);','(#2),#7);').replace('ENDSEC;\nEND-ISO',"#5=IFCMATERIALLAYER(#3,0.2,$,$,$,$,$);\n#6=IFCMATERIALLAYERSET((#5),'Layers',$);\n#7=IFCMATERIALLAYERSETUSAGE(#6,.AXIS2.,.POSITIVE.,0.,$);\nENDSEC;\nEND-ISO");
 assert.equal(validateModel(api,new Uint8Array(Buffer.from(s)),IFC).issues.length,0);
});
test('empty material name does not pass', () => {
 const s=Buffer.from(bytes('valid_example')).toString().replace(/\r\n/g, '\n').replace("'Concrete'","''");
 assert.equal(validateModel(api,new Uint8Array(Buffer.from(s)),IFC).issues.length,1);
});
test('no walls is not a passing wall check', () => {
 const s=Buffer.from(bytes('problematic_example')).toString().replace(/\r\n/g, '\n').replace(/^#2=.*\n/m,'');
 assert.equal(validateModel(api,new Uint8Array(Buffer.from(s)),IFC).status,'not-applicable');
});
test('rejects corrupt and truncated data', () => {
 assert.throws(()=>validateModel(api,new Uint8Array(Buffer.from('not IFC')),IFC));
 assert.throws(()=>validateModel(api,bytes('valid_example').slice(0,150),IFC));
});
test('repeated validation is deterministic and models close', () => {
 const data=bytes('problematic_example');
 assert.deepEqual(validateModel(api,data,IFC),validateModel(api,data,IFC));
});

