import {reviewRows} from './reviews.mjs';
export function exportWorkbook(result, XLSX) {
  // Read saved notes at export time, including edits from a different page.
  const rows = reviewRows(result);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book,XLSX.utils.aoa_to_sheet([
    ['File',result.fileName],['Analysis ID',result.analysisId || ''],
    ['Elements (IfcElement)',result.totalElements],['Walls checked',result.checkedWalls],
    ['Findings',result.issues.length],['Affected walls',new Set(result.issues.map(i=>i.id)).size],['Scope',result.scope],
    ['Review scope','Review status records a human decision. It does not change the IFC or the validation findings. Reanalyse the corrected file to verify changes.']
  ]),'Summary');
  const sheet=XLSX.utils.aoa_to_sheet(rows);
  sheet['!cols']=[{wch:14},{wch:26},{wch:30},{wch:55},{wch:55},{wch:16},{wch:65},{wch:26}];
  XLSX.utils.book_append_sheet(book,sheet,'Findings');
  XLSX.writeFile(book,'BIMCheck_Report.xlsx');
}
