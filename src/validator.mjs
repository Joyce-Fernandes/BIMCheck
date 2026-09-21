// Shared by the browser and integration tests. No filename-based results.
export const defaultRules = {material:true, classification:false, fireRating:false};
export function validateModel(api, bytes, IFC, options = defaultRules, progress = () => {}) {
  const rules = Object.fromEntries(Object.keys(defaultRules).map(key=>[key, Boolean(options[key])]));
  if (!Object.values(rules).some(Boolean)) throw new Error('Select at least one check.');
  const decoder=new TextDecoder();
  const head=decoder.decode(bytes.subarray(0,4096));
  let end=bytes.length;while(end>0 && [9,10,13,32].includes(bytes[end-1]))end--;
  const tail=decoder.decode(bytes.subarray(Math.max(0,end-64),end));
  if (!/^\s*ISO-10303-21;/i.test(head) || !/END-ISO-10303-21;\s*$/i.test(tail)) {
    throw new Error('Invalid or incomplete IFC STEP file.');
  }
  let model;
  try {
    progress('Parsing IFC structure');
    model = api.OpenModel(bytes);
    if (model < 0) throw new Error('Unable to open IFC model.');
    const ids = type => {
      const vector = api.GetLineIDsWithType(model, type);
      return Array.from({length: vector.size()}, (_, i) => vector.get(i));
    };
    if (!ids(IFC.IFCPROJECT).length) throw new Error('No IfcProject found in the file.');
    const read = id => api.GetLine(model, id);
    const materialPresent = (id, seen = new Set()) => {
      if (!id || seen.has(id)) return false;
      seen.add(id);
      const line = read(id);
      if (!line) return false;
      if (line.type === IFC.IFCMATERIAL) return Boolean(line.Name?.value?.trim());
      // IFC2x3/IFC4 lists, layers, profiles, constituents and usage wrappers.
      return ['Material','Materials','MaterialLayers','ForLayerSet','MaterialProfiles',
        'ForProfileSet','MaterialConstituents'].some(key => {
        const refs = Array.isArray(line[key]) ? line[key] : [line[key]];
        return refs.some(ref => ref && materialPresent(ref.value, new Set(seen)));
      });
    };
    progress('Reading material associations');
    const assigned = new Set();
    for (const id of ids(IFC.IFCRELASSOCIATESMATERIAL)) {
      const rel = read(id);
      if (materialPresent(rel.RelatingMaterial?.value)) {
        for (const ref of rel.RelatedObjects || []) assigned.add(ref.value);
      }
    }
    const inherited = new Set();
    const wallTypes = new Map();
    for (const id of ids(IFC.IFCRELDEFINESBYTYPE)) {
      const rel = read(id);
      for (const ref of rel.RelatedObjects || []) wallTypes.set(ref.value, rel.RelatingType?.value);
      if (assigned.has(rel.RelatingType?.value)) {
        for (const ref of rel.RelatedObjects || []) inherited.add(ref.value);
      }
    }
    const walls = new Set([ ...ids(IFC.IFCWALL), ...ids(IFC.IFCWALLSTANDARDCASE),
      ...(IFC.IFCWALLELEMENTEDCASE ? ids(IFC.IFCWALLELEMENTEDCASE) : []) ]);
    let totalElements = 0;
    const elementCounts = {};
    for (const type of api.GetAllTypesOfModel(model)) {
      if (!api.IsIfcElement(type.typeID)) continue;
      const count = ids(type.typeID).length;
      totalElements += count;
      elementCounts[type.typeName] = count;
    }
    progress('Reading classification and property sets');
    const classified = new Set();
    if (rules.classification) for (const id of ids(IFC.IFCRELASSOCIATESCLASSIFICATION)) {
      const rel=read(id); const ref=rel.RelatingClassification?.value;
      const classification=ref?read(ref):null;
      const code=classification?.Identification?.value ?? classification?.ItemReference?.value;
      if (typeof code==='string' && code.trim()) for(const obj of rel.RelatedObjects||[]) classified.add(obj.value);
    }
    const propertySets = new Map();
    if (rules.fireRating) for(const id of ids(IFC.IFCRELDEFINESBYPROPERTIES)) {
      const rel=read(id);
      for(const obj of rel.RelatedObjects||[]) {
        if(!propertySets.has(obj.value))propertySets.set(obj.value,[]);
        propertySets.get(obj.value).push(rel.RelatingPropertyDefinition?.value);
      }
    }
    function fireValue(sets) {
      for(const id of sets) {
        if(!id)continue;const set=read(id);
        if(set?.Name?.value!=='Pset_WallCommon')continue;
        for(const ref of set.HasProperties||[]) {
          const property=read(ref.value);
          if(property?.Name?.value==='FireRating') return {found:true,value:property.NominalValue?.value};
        }
      }
      return {found:false};
    }
    const issues = [], elements = [];
    const ruleLabels={material:'Named material',classification:'Classification reference',fireRating:'Pset_WallCommon.FireRating'};
    let checked=0;
    progress('Checking walls',0,walls.size);
    for (const id of walls) {
      if(checked++ % 250===0)progress('Checking walls',checked-1,walls.size);
      const wall=read(id);const typeId=wallTypes.get(id);
      const identity={id,globalId:wall.GlobalId?.value||'',element:wall.Name?.value||'Unnamed wall'};
      elements.push(identity);
      const fail=(rule,description)=>issues.push({...identity,ruleId:rule,ruleLabel:ruleLabels[rule],category:rule,severity:'warning',description,recommendation:'Review the required information in the authoring model and re-export the IFC.'});
      if(rules.material && !assigned.has(id) && !inherited.has(id)) fail('material','No named material associated directly or through the wall type.');
      if(rules.classification && !classified.has(id) && !classified.has(typeId)) fail('classification','No classification reference with a code associated directly or through the wall type.');
      if(rules.fireRating) {
        let rating=fireValue(propertySets.get(id)||[]);
        if(!rating.found && typeId)rating=fireValue((read(typeId)?.HasPropertySets||[]).map(ref=>ref.value));
        if(typeof rating.value!=='string' || !rating.value.trim()) fail('fireRating','Pset_WallCommon.FireRating is missing or empty on the wall or its type.');
      }
    }
    progress('Checking walls',walls.size,walls.size);
    const enabled=Object.keys(rules).filter(key=>rules[key]);
    return {totalElements, checkedWalls: walls.size, elementCounts, issues, elements, rules,
      rulesFingerprint:'wall-information-v1:'+enabled.join(','),
      ruleSummary: enabled.map(id=>({id,label:ruleLabels[id],checked:walls.size,failed:issues.filter(issue=>issue.ruleId===id).length})),
      affectedWalls:new Set(issues.map(i=>i.id)).size,
      status: walls.size === 0 ? 'not-applicable' : issues.length ? 'issues' : 'passed',
      scope: 'Wall information checks: '+enabled.map(id=>ruleLabels[id]).join(', ')+'. Presence only; dimensions, geometry and regulatory compliance are not checked.'};
  } finally {
    if (model !== undefined && model >= 0) api.CloseModel(model);
  }
}
