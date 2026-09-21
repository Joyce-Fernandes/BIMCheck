// Keep only the latest analysed model, on this device. No upload is involved.
function database() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('bimcheck-models', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('models');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error('Model storage is unavailable.'));
  });
}
export async function saveModel(bytes, result) {
  const db = await database();
  try { await new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readwrite');
    tx.objectStore('models').put({bytes, result}, result.demo ? 'demo' : 'latest');
    tx.oncomplete = resolve; tx.onerror = () => reject(tx.error); tx.onabort = () => reject(tx.error);
  }); } finally { db.close(); }
}
export async function readModel(analysisId, demo = false) {
  const db = await database();
  try { return await new Promise((resolve, reject) => {
    const tx = db.transaction('models', 'readonly');
    const request = tx.objectStore('models').get(demo ? 'demo' : 'latest');
    request.onsuccess = () => {
      const value = request.result;
      resolve(value?.result.analysisId === analysisId ? value : null);
    };
    request.onerror = () => reject(request.error);
  }); } finally { db.close(); }
}
export function viewerUrl(result, id, rule = 'material') {
  const params = new URLSearchParams({analysis:result.analysisId, id:String(id), rule});
  if(result.demo)params.set('demo','1');
  return `viewer.html?${params}`;
}
