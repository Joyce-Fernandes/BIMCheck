# Business Rules - BIMCheck

**Complete documentation of business rules implemented in the BIMCheck project, including validations, processes, and business logic.**

---

## 📋 Overview

The **Business Rules** of BIMCheck define the criteria, validations, and processes that ensure quality and compliance of IFC (Industry Foundation Classes) files in Building Information Modeling (BIM) projects. These rules are fundamental to ensure that BIM models meet established technical and regulatory standards.

---

## 🎯 Business Rules Objectives

### **✅ Primary Objectives:**
1. **Ensure Compliance**: Validate IFC files against established standards
2. **Standardization**: Establish consistent validation criteria
3. **Quality**: Ensure BIM data quality
4. **Traceability**: Document validation processes
5. **Automation**: Automate manual verifications

### **📊 Benefits:**
- **Error Reduction**: Minimization of model inconsistencies
- **Efficiency**: Automated validation process
- **Compliance**: Adherence to technical standards
- **Quality**: Improvement in BIM data quality
- **Standardization**: Consistency between projects

---

## 🏗️ Business Rules Structure

### **Validation Layers**
```
┌─────────────────────────────────────────────────────────────┐
│                    Business Rules                           │
├─────────────────────────────────────────────────────────────┤
│  File Validation                                            │
│  ├── File Type                                              │
│  ├── File Size                                              │
│  └── File Integrity                                         │
├─────────────────────────────────────────────────────────────┤
│  IFC Structure Validation                                   │
│  ├── IFC Version                                            │
│  ├── Data Structure                                         │
│  └── BIM Elements                                           │
├─────────────────────────────────────────────────────────────┤
│  Parameter Validation                                       │
│  ├── Materials                                              │
│  ├── Dimensions                                             │
│  └── Technical Standards                                    │
├─────────────────────────────────────────────────────────────┤
│  Compliance Validation                                      │
│  ├── Project Standards                                      │
│  ├── European Standards                                     │
│  └── Specific Requirements                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 📋 File Validation Rules

### **BR-001: File Type Validation**
```javascript
// Rule: Only IFC files are accepted
function validateFileType(file) {
  const allowedExtensions = ['.ifc'];
  const fileExtension = path.extname(file.name).toLowerCase();
  
  return allowedExtensions.includes(fileExtension);
}

// Criteria:
// - Extension must be .ifc
// - File must be a valid IFC file
// - Reject files with incorrect extensions
```

### **BR-002: File Size Validation**
```javascript
// Rule: Maximum limit of 50MB per file
function validateFileSize(file) {
  const maxSize = 50 * 1024 * 1024; // 50MB in bytes
  
  return file.size <= maxSize;
}

// Criteria:
// - Maximum size: 50MB
// - Reject files that are too large
// - Alert about files close to the limit
```

### **BR-003: Integrity Validation**
```javascript
// Rule: File must have valid IFC structure
function validateFileIntegrity(file) {
  // Check if file is not corrupted
  // Check if contains valid IFC data
  return file.size > 0 && hasValidIFCStructure(file);
}

// Criteria:
// - File cannot be empty
// - Must contain basic IFC structure
// - Verify data integrity
```

---

## 🏗️ IFC Structure Validation Rules

### **BR-004: IFC Version Validation**
```javascript
// Rule: Support for IFC2x3 and IFC4 versions
function validateIFCVersion(ifcData) {
  const supportedVersions = ['IFC2X3', 'IFC4', 'IFC4X3'];
  const fileVersion = extractIFCVersion(ifcData);
  
  return supportedVersions.includes(fileVersion);
}

// Criteria:
// - Supported versions: IFC2x3, IFC4, IFC4x3
// - Reject unsupported versions
// - Alert about outdated versions
```

### **BR-005: BIM Elements Validation**
```javascript
// Rule: File must contain essential BIM elements
function validateBIMElements(ifcData) {
  const requiredElements = [
    'IfcWall',
    'IfcBeam',
    'IfcColumn',
    'IfcSlab',
    'IfcDoor',
    'IfcWindow'
  ];
  
  const foundElements = extractElements(ifcData);
  return requiredElements.some(element => foundElements.includes(element));
}

// Criteria:
// - Must contain at least one structural element
// - Essential elements: walls, beams, columns, slabs
// - Opening elements: doors, windows
```

---

## 🔧 Parameter Validation Rules

### **BR-006: Material Validation**
```javascript
// Rule: All elements must have defined material
function validateMaterials(elements) {
  return elements.every(element => {
    const material = element.material;
    return material && 
           material.name && 
           material.name.trim().length > 0 &&
           material.properties && 
           material.properties.length > 0;
  });
}

// Criteria:
// - Material must be defined
// - Material name cannot be empty
// - Material properties must be present
// - Material must be valid and recognized
```

### **BR-007: Dimension Validation**
```javascript
// Rule: Dimensions must be positive and realistic
function validateDimensions(element) {
  const { width, height, depth } = element.dimensions;
  
  // Dimensions must be positive
  const positiveDimensions = width > 0 && height > 0 && depth > 0;
  
  // Dimensions must be realistic (maximum 1000m)
  const realisticDimensions = width <= 1000 && height <= 1000 && depth <= 1000;
  
  // Proportions must be reasonable
  const reasonableProportions = validateProportions(width, height, depth);
  
  return positiveDimensions && realisticDimensions && reasonableProportions;
}

// Criteria:
// - All dimensions must be positive
// - Maximum dimensions: 1000m
// - Proportions must be realistic
// - Reject zero or negative dimensions
```

### **BR-008: Technical Standards Validation**
```javascript
// Rule: Elements must follow European standards
function validateNormCodes(elements) {
  const europeanNorms = [
    'EN 1992-1-1', // Eurocode 2 - Concrete structures
    'EN 1993-1-1', // Eurocode 3 - Steel structures
    'EN 1995-1-1', // Eurocode 5 - Timber structures
    'EN 1996-1-1', // Eurocode 6 - Masonry structures
    'EN 14351-1',  // Windows and doors
    'EN 771-1',    // Masonry units
    'EN 845-1'     // Specifications for masonry components
  ];
  
  return elements.every(element => {
    const normCode = element.normCode;
    return normCode && europeanNorms.some(norm => normCode.includes(norm));
  });
}

// Criteria:
// - Must follow European standards (EN)
// - Specific standards by element type
// - Standard codes must be valid
// - Reject unrecognized standards
```

---

## ✅ Compliance Validation Rules

### **BR-009: Project Standards Validation**
```javascript
// Rule: Elements must follow project standards
function validateProjectStandards(elements) {
  const standards = {
    naming: validateNamingConvention(elements),
    classification: validateClassification(elements),
    properties: validateRequiredProperties(elements),
    relationships: validateElementRelationships(elements)
  };
  
  return Object.values(standards).every(valid => valid);
}

// Criteria:
// - Consistent naming convention
// - Adequate element classification
// - Required properties present
// - Valid element relationships
```

### **BR-010: Specific Requirements Validation**
```javascript
// Rule: Specific validation by element type
function validateSpecificRequirements(elements) {
  return elements.every(element => {
    switch(element.type) {
      case 'IfcWall':
        return validateWallRequirements(element);
      case 'IfcBeam':
        return validateBeamRequirements(element);
      case 'IfcColumn':
        return validateColumnRequirements(element);
      case 'IfcSlab':
        return validateSlabRequirements(element);
      case 'IfcDoor':
        return validateDoorRequirements(element);
      case 'IfcWindow':
        return validateWindowRequirements(element);
      default:
        return true;
    }
  });
}

// Specific criteria by element:
// - Walls: minimum thickness, maximum height
// - Beams: minimum section, maximum span
// - Columns: minimum section, maximum height
// - Slabs: minimum thickness, maximum area
// - Doors: standard dimensions, opening type
// - Windows: standard dimensions, glass type
```

---

## 📊 Problem Classification Rules

### **BR-011: Severity Classification**
```javascript
// Rule: Classify problems by severity
function classifyProblemSeverity(problem) {
  const severityLevels = {
    CRITICAL: {
      criteria: ['material_missing', 'dimensions_invalid', 'norm_missing'],
      description: 'Critical problem that prevents compliance'
    },
    HIGH: {
      criteria: ['material_incomplete', 'dimensions_extreme', 'norm_invalid'],
      description: 'Important problem that affects quality'
    },
    MEDIUM: {
      criteria: ['naming_inconsistent', 'properties_missing', 'classification_incorrect'],
      description: 'Moderate problem that should be corrected'
    },
    LOW: {
      criteria: ['metadata_incomplete', 'optional_properties_missing'],
      description: 'Minor problem that can be improved'
    }
  };
  
  return determineSeverity(problem, severityLevels);
}

// Classification Criteria:
// - CRITICAL: Problems that prevent compliance
// - HIGH: Problems that significantly affect quality
// - MEDIUM: Problems that should be corrected
// - LOW: Minor improvement problems
```

### **BR-012: Correction Prioritization**
```javascript
// Rule: Prioritize corrections based on severity and impact
function prioritizeCorrections(problems) {
  return problems.sort((a, b) => {
    const severityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
    const severityDiff = severityOrder[b.severity] - severityOrder[a.severity];
    
    if (severityDiff !== 0) return severityDiff;
    
    // In case of tie, prioritize by impact
    return b.impact - a.impact;
  });
}

// Prioritization Criteria:
// - Problem severity
// - Project impact
// - Occurrence frequency
// - Correction ease
```

---

## 📈 Report Generation Rules

### **BR-013: Report Structure**
```javascript
// Rule: Report must have standardized structure
function generateReportStructure(results) {
  return {
    summary: {
      totalElements: results.totalElements,
      validElements: results.validElements,
      invalidElements: results.invalidElements,
      conformityRate: calculateConformityRate(results),
      criticalProblems: countProblemsBySeverity(results, 'CRITICAL'),
      highProblems: countProblemsBySeverity(results, 'HIGH'),
      mediumProblems: countProblemsBySeverity(results, 'MEDIUM'),
      lowProblems: countProblemsBySeverity(results, 'LOW')
    },
    detailedProblems: results.problems.map(problem => ({
      elementId: problem.elementId,
      elementType: problem.elementType,
      problemType: problem.problemType,
      severity: problem.severity,
      description: problem.description,
      recommendation: problem.recommendation,
      location: problem.location
    })),
    recommendations: generateRecommendations(results),
    metadata: {
      validationDate: new Date().toISOString(),
      fileInfo: results.fileInfo,
      validationRules: results.validationRules
    }
  };
}

// Report Criteria:
// - Executive summary with metrics
// - Detailed problems with classification
// - Specific recommendations
// - Validation metadata
```

### **BR-014: Output Format**
```javascript
// Rule: Report must be generated in Excel format
function generateExcelReport(reportData) {
  const workbook = XLSX.utils.book_new();
  
  // Summary Sheet
  const summarySheet = createSummarySheet(reportData.summary);
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
  
  // Detailed Problems Sheet
  const problemsSheet = createProblemsSheet(reportData.detailedProblems);
  XLSX.utils.book_append_sheet(workbook, problemsSheet, 'Detailed Problems');
  
  // Recommendations Sheet
  const recommendationsSheet = createRecommendationsSheet(reportData.recommendations);
  XLSX.utils.book_append_sheet(workbook, recommendationsSheet, 'Recommendations');
  
  return workbook;
}

// Format Criteria:
// - Excel format (.xlsx)
// - Multiple organized sheets
// - Professional formatting
// - Structured and readable data
```

---

## 🔄 Validation Process Rules

### **BR-015: Validation Flow**
```javascript
// Rule: Validation process must follow specific sequence
function validationProcess(file) {
  const steps = [
    { name: 'File Validation', function: validateFile },
    { name: 'IFC Structure Validation', function: validateIFCStructure },
    { name: 'Element Extraction', function: extractElements },
    { name: 'Parameter Validation', function: validateParameters },
    { name: 'Conformity Validation', function: validateConformity },
    { name: 'Problem Classification', function: classifyProblems },
    { name: 'Report Generation', function: generateReport }
  ];
  
  return executeValidationSteps(file, steps);
}

// Process Criteria:
// - Mandatory validation sequence
// - Interruption in case of critical failure
// - Logging of each step
// - Rollback in case of error
```

### **BR-016: Error Handling**
```javascript
// Rule: Standardized error handling
function handleValidationError(error, context) {
  const errorTypes = {
    FILE_ERROR: {
      action: 'Reject file',
      message: 'Invalid or corrupted file',
      severity: 'CRITICAL'
    },
    STRUCTURE_ERROR: {
      action: 'Stop validation',
      message: 'Invalid IFC structure',
      severity: 'CRITICAL'
    },
    PARAMETER_ERROR: {
      action: 'Continue with warnings',
      message: 'Invalid parameters detected',
      severity: 'HIGH'
    },
    CONFORMITY_ERROR: {
      action: 'Continue validation',
      message: 'Compliance problems found',
      severity: 'MEDIUM'
    }
  };
  
  return processError(error, errorTypes[error.type] || errorTypes.PARAMETER_ERROR);
}

// Handling Criteria:
// - Error type classification
// - Specific actions by type
// - Clear messages for user
// - Detailed logging for debugging
```

---

## 📊 Metrics and KPIs Rules

### **BR-017: Compliance Calculation**
```javascript
// Rule: Compliance metric based on valid elements
function calculateConformityRate(results) {
  const { totalElements, validElements } = results;
  
  if (totalElements === 0) return 0;
  
  const conformityRate = (validElements / totalElements) * 100;
  
  // Compliance classification
  if (conformityRate >= 95) return { rate: conformityRate, level: 'EXCELLENT' };
  if (conformityRate >= 85) return { rate: conformityRate, level: 'GOOD' };
  if (conformityRate >= 70) return { rate: conformityRate, level: 'ACCEPTABLE' };
  if (conformityRate >= 50) return { rate: conformityRate, level: 'POOR' };
  return { rate: conformityRate, level: 'CRITICAL' };
}

// Compliance Criteria:
// - EXCELLENT: ≥ 95% of valid elements
// - GOOD: ≥ 85% of valid elements
// - ACCEPTABLE: ≥ 70% of valid elements
// - POOR: ≥ 50% of valid elements
// - CRITICAL: < 50% of valid elements
```

### **BR-018: Quality Indicators**
```javascript
// Rule: BIM model quality KPIs
function calculateQualityKPIs(results) {
  return {
    completeness: calculateCompleteness(results),
    accuracy: calculateAccuracy(results),
    consistency: calculateConsistency(results),
    compliance: calculateCompliance(results),
    overallScore: calculateOverallScore(results)
  };
}

// Quality Criteria:
// - Completeness: Required elements present
// - Accuracy: Correct and precise data
// - Consistency: Standards applied uniformly
// - Compliance: Adherence to standards
// - Overall Score: Weighted average of indicators
```

---

## 🔧 Configuration and Customization Rules

### **BR-019: Rules Configuration**
```javascript
// Rule: Rules must be configurable
function configureValidationRules(config) {
  return {
    fileValidation: {
      maxFileSize: config.maxFileSize || 50 * 1024 * 1024,
      allowedExtensions: config.allowedExtensions || ['.ifc'],
      validateIntegrity: config.validateIntegrity !== false
    },
    parameterValidation: {
      validateMaterials: config.validateMaterials !== false,
      validateDimensions: config.validateDimensions !== false,
      validateNorms: config.validateNorms !== false,
      minDimension: config.minDimension || 0.01,
      maxDimension: config.maxDimension || 1000
    },
    conformityValidation: {
      strictMode: config.strictMode || false,
      customRules: config.customRules || [],
      ignoreWarnings: config.ignoreWarnings || false
    }
  };
}

// Configuration Criteria:
// - Configurable parameters
// - Safe default values
// - Optional strict mode
// - Customizable rules
```

### **BR-020: Report Customization**
```javascript
// Rule: Reports must be customizable
function customizeReport(reportData, customization) {
  return {
    ...reportData,
    summary: customizeSummary(reportData.summary, customization.summary),
    detailedProblems: customizeProblems(reportData.detailedProblems, customization.problems),
    recommendations: customizeRecommendations(reportData.recommendations, customization.recommendations),
    branding: customization.branding || defaultBranding,
    language: customization.language || 'en'
  };
}

// Customization Criteria:
// - Configurable content
// - Custom branding
// - Multiple languages
// - Flexible format
```

---

## 📋 Audit and Traceability Rules

### **BR-021: Validation Logging**
```javascript
// Rule: All validations must be logged
function logValidation(validationData) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    fileInfo: validationData.fileInfo,
    validationRules: validationData.validationRules,
    results: validationData.results,
    duration: validationData.duration,
    user: validationData.user,
    session: validationData.session
  };
  
  return saveValidationLog(logEntry);
}

// Logging Criteria:
// - Timestamp of each validation
// - File information
// - Applied rules
// - Obtained results
// - Process duration
// - User and session
```

### **BR-022: Validation History**
```javascript
// Rule: Maintain validation history
function maintainValidationHistory(validationData) {
  const historyEntry = {
    id: generateUniqueId(),
    date: new Date().toISOString(),
    fileName: validationData.fileName,
    fileSize: validationData.fileSize,
    conformityRate: validationData.conformityRate,
    problemCount: validationData.problemCount,
    criticalProblems: validationData.criticalProblems,
    status: validationData.status
  };
  
  return addToHistory(historyEntry);
}

// History Criteria:
// - Unique ID for each validation
// - Date and time of validation
// - File information
// - Compliance metrics
// - Problem count
// - Validation status
```

---

## 🎯 Business Rules Benefits

### **✅ Implemented Advantages:**
- **Standardization**: Consistent validation criteria
- **Automation**: Automated and efficient process
- **Quality**: BIM data quality assurance
- **Compliance**: Adherence to technical standards
- **Traceability**: Complete validation history

### **✅ Technical Characteristics:**
- **Configurable**: Rules adaptable to different projects
- **Scalable**: Support for different element types
- **Robust**: Adequate error handling
- **Flexible**: Report customization
- **Auditable**: Complete logging and traceability

---

## 📊 Effectiveness Metrics

### **Performance Indicators:**
- **Compliance Rate**: ≥ 85% in standard projects
- **Validation Time**: < 30 seconds for files < 10MB
- **Accuracy**: ≥ 95% problem detection
- **Coverage**: 100% of required elements
- **Satisfaction**: ≥ 90% user approval

### **Quality Metrics:**
- **Completeness**: ≥ 90% elements with complete data
- **Accuracy**: ≥ 95% correct data
- **Consistency**: ≥ 85% applied standards
- **Compliance**: ≥ 80% adherence to standards
- **Usability**: Intuitive and responsive interface

---

**Document created by**: Joyce Fernandes  
**Email**: joyce.f.silva@hotmail.com  
**LinkedIn**: https://www.linkedin.com/in/joyce-fernandes-da-silva/  
**Date**: 20/08/2025  
**Version**: 1.0  
**Status**: ✅ Business Rules Implemented and Functional