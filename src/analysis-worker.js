import * as IFC from './vendor/web-ifc-api.js';
import {validateModel} from './validator.mjs';
import {validateUpload, VIEWER_LIMIT} from './limits.mjs';
self.onmessage = async ({data}) => {
  try {
    validateUpload(data.file);
    const send=(stage, completed, total)=>self.postMessage({type:'progress',stage,completed,total});
    send('Reading IFC file');
    const bytes=new Uint8Array(await data.file.arrayBuffer());
    send('Starting IFC engine');
    const api=new IFC.IfcAPI();
    api.SetWasmPath(new URL('./vendor/',import.meta.url).href,true);
    await api.Init();
    const result=validateModel(api,bytes,IFC,data.rules,send);
    if(bytes.byteLength<=VIEWER_LIMIT)self.postMessage({type:'result',result,bytes},[bytes.buffer]);
    else self.postMessage({type:'result',result});
  } catch(error) {self.postMessage({type:'error',message:error.message||'IFC processing failed.'});}
};
