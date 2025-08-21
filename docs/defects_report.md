# Defect Report

**Modeling, Documentation and Test Execution**  
**With Júlio de Lima**

Based on ISO-29119-3 and defect management tools.

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-001 |
| **Title** | IFC file validation not fully implemented |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:30 |
| **Expected Result** | System should validate real IFC files using web-ifc library |
| **Actual Result** | Validation is simulated with mock data, does not process real IFC files |
| **Evidence** | Function `validateIFCFile()` in `src/script.js` uses simulation based on filename |
| **Priority** | High |
| **Severity** | High |
| **Software Information** | BIMCheck v1.0.0, Node.js, JavaScript ES6+ |
| **Traceability** | Test Case TC-001 (IFC File Validation) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-002 |
| **Title** | Inadequate error handling in file processing |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:35 |
| **Expected Result** | System should capture and handle all types of errors during processing |
| **Actual Result** | Only basic errors are handled, specific IFC errors are not captured |
| **Evidence** | Generic try-catch in `processFile()` does not handle specific IFC parsing errors |
| **Priority** | Medium |
| **Severity** | Medium |
| **Software Information** | BIMCheck v1.0.0, web-ifc@0.0.44 |
| **Traceability** | Test Case TC-002 (Error Handling) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-003 |
| **Title** | File size limit not configurable |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:40 |
| **Expected Result** | File limit should be configurable via interface or configuration |
| **Actual Result** | Fixed 50MB limit hardcoded in code |
| **Evidence** | `const maxSize = 50 * 1024 * 1024;` in `src/script.js` line 138 |
| **Priority** | Low |
| **Severity** | Low |
| **Software Information** | BIMCheck v1.0.0, Web Interface |
| **Traceability** | Test Case TC-003 (System Configuration) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-004 |
| **Title** | Dashboard data does not persist after page reload |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:45 |
| **Expected Result** | Dashboard data should persist using localStorage or backend |
| **Actual Result** | Data is lost when page is reloaded |
| **Evidence** | Dashboard uses mock data, localStorage not fully implemented |
| **Priority** | Medium |
| **Severity** | Medium |
| **Software Information** | BIMCheck v1.0.0, Dashboard Analytics |
| **Traceability** | Test Case TC-004 (Data Persistence) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-005 |
| **Title** | Technical standards validation limited to European standards |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:50 |
| **Expected Result** | System should validate multiple international standards (EN, ISO, ASTM, ABNT) |
| **Actual Result** | Only EN standards are validated, other standards are rejected |
| **Evidence** | Function `validateNormCode()` in `tests/unit/validators.test.js` line 47 |
| **Priority** | Medium |
| **Severity** | Medium |
| **Software Information** | BIMCheck v1.0.0, Standards Validation |
| **Traceability** | Test Case TC-005 (Standards Validation) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-006 |
| **Title** | Excel reports do not include complete IFC file metadata |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 14:55 |
| **Expected Result** | Report should include complete IFC file information (version, author, date) |
| **Actual Result** | Report contains only basic validation data |
| **Evidence** | Function `exportReport()` in `src/script.js` line 451 |
| **Priority** | Low |
| **Severity** | Low |
| **Software Information** | BIMCheck v1.0.0, Report Generation |
| **Traceability** | Test Case TC-006 (Detailed Reports) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-007 |
| **Title** | Performance not optimized for large IFC files |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 15:00 |
| **Expected Result** | System should process large files efficiently |
| **Actual Result** | Synchronous processing can freeze interface for large files |
| **Evidence** | Function `simulateFileProcessing()` uses fixed delays, not optimized |
| **Priority** | Medium |
| **Severity** | Medium |
| **Software Information** | BIMCheck v1.0.0, Performance |
| **Traceability** | Test Case TC-007 (Performance) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-008 |
| **Title** | Lack of IFC file integrity validation |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 15:05 |
| **Expected Result** | System should verify integrity and structure of IFC file |
| **Actual Result** | Only extension and size are validated |
| **Evidence** | Function `validateIFCContent()` in `tests/unit/validators.test.js` is mock |
| **Priority** | High |
| **Severity** | High |
| **Software Information** | BIMCheck v1.0.0, File Validation |
| **Traceability** | Test Case TC-008 (File Integrity) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-009 |
| **Title** | Interface not responsive on small mobile devices |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 15:10 |
| **Expected Result** | Interface should work perfectly on small screens |
| **Actual Result** | Elements may overlap or be cut off on mobile |
| **Evidence** | Limited responsive CSS in `src/style.css` and `src/dashboard.css` |
| **Priority** | Low |
| **Severity** | Low |
| **Software Information** | BIMCheck v1.0.0, Responsive Interface |
| **Traceability** | Test Case TC-009 (Responsiveness) |
| **Status** | Open |

---

| Field | Description |
|-------|-------------|
| **ID** | DEF-010 |
| **Title** | Lack of authentication and access control |
| **Tester** | Joyce Fernandes |
| **Date and Time** | 2024-01-15 15:15 |
| **Expected Result** | System should have authentication for access control |
| **Actual Result** | Application is public, without user control |
| **Evidence** | No authentication system implemented |
| **Priority** | Medium |
| **Severity** | Medium |
| **Software Information** | BIMCheck v1.0.0, Security |
| **Traceability** | Test Case TC-010 (Security) |
| **Status** | Open |

---

## Defects Summary

**Total Defects Found:** 10  
**High Priority Defects:** 3 (DEF-001, DEF-008)  
**Medium Priority Defects:** 5 (DEF-002, DEF-004, DEF-005, DEF-007, DEF-010)  
**Low Priority Defects:** 2 (DEF-003, DEF-006, DEF-009)  

**High Severity Defects:** 3  
**Medium Severity Defects:** 5  
**Low Severity Defects:** 2  

**Status:** All defects are **OPEN** and awaiting analysis and prioritization for correction.