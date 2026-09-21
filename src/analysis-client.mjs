export function analyseInWorker(file, rules, onProgress, signal) {
  return new Promise((resolve,reject)=>{
    if(signal?.aborted){reject(new DOMException('Analysis cancelled.','AbortError'));return;}
    const worker=new Worker(new URL('./analysis-worker.js',import.meta.url),{type:'module'});
    const finish=(callback,value)=>{worker.terminate();signal?.removeEventListener('abort',cancel);callback(value);};
    const cancel=()=>finish(reject,new DOMException('Analysis cancelled.','AbortError'));
    signal?.addEventListener('abort',cancel,{once:true});
    worker.onmessage=({data})=>{
      if(data.type==='progress')onProgress(data);
      else if(data.type==='result')finish(resolve,data);
      else if(data.type==='error')finish(reject,new Error(data.message));
    };
    worker.onerror=event=>{event.preventDefault();finish(reject,new Error('The background IFC engine failed. Try a smaller file or reload the page.'));};
    worker.onmessageerror=()=>finish(reject,new Error('The analysis result could not be received.'));
    worker.postMessage({file,rules});
  });
}
