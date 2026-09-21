export const ANALYSIS_LIMIT = 100 * 1024 * 1024;
export const VIEWER_LIMIT = 50 * 1024 * 1024;
export function validateUpload(file) {
  if (!file || !/\.ifc$/i.test(file.name)) throw new Error('Please select an IFC file.');
  if (!file.size || file.size > ANALYSIS_LIMIT) throw new Error('Select a non-empty IFC file up to 100 MiB (104,857,600 bytes).');
}
