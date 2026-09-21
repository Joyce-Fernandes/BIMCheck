// Copy geometry out of WASM before closing the model; retain its IFC element ID.
export function extractGeometry(api, model, onPart) {
  let count = 0;
  api.StreamAllMeshes(model, flat => {
    for (let i = 0; i < flat.geometries.size(); i++) {
      const placed = flat.geometries.get(i);
      const geometry = api.GetGeometry(model, placed.geometryExpressID);
      try {
        const vertices = api.GetVertexArray(geometry.GetVertexData(), geometry.GetVertexDataSize()).slice();
        const indices = api.GetIndexArray(geometry.GetIndexData(), geometry.GetIndexDataSize()).slice();
        if (!vertices.length || !indices.length) continue;
        onPart({expressID:flat.expressID, vertices, indices, transform:Array.from(placed.flatTransformation)});
        count++;
      } finally { geometry.delete(); }
    }
  });
  return count;
}
export function findIssue(result, id, rule) {
  if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Invalid element identifier.');
  const issue = result.issues.find(item => item.id === id && (!rule || (item.ruleId||'material')===rule));
  if (!issue) throw new Error('This element is not an issue in the saved analysis.');
  return issue;
}
export function verifyIssue(api, model, issue) {
  const line = api.GetLine(model, issue.id);
  if (!line || (issue.globalId && line.GlobalId?.value !== issue.globalId)) {
    throw new Error('The selected element does not match the saved analysis. Analyse the file again.');
  }
}

// Composite walls may have geometry on their decomposed parts.
export function issueGeometryIds(api, model, issues, IFC) {
  const children = new Map();
  for (const type of [IFC.IFCRELAGGREGATES, IFC.IFCRELNESTS]) {
    const ids = api.GetLineIDsWithType(model, type);
    for (let i=0;i<ids.size();i++) {
      const relation = api.GetLine(model, ids.get(i));
      const parent = relation.RelatingObject?.value;
      if (!parent) continue;
      if (!children.has(parent)) children.set(parent, []);
      children.get(parent).push(...(relation.RelatedObjects || []).map(ref=>ref.value));
    }
  }
  return new Map(issues.map(issue=>{
    const included = new Set();
    const visit = id => {if(included.has(id))return;included.add(id);for(const child of children.get(id)||[])visit(child);};
    visit(issue.id);
    return [issue.id, included];
  }));
}
