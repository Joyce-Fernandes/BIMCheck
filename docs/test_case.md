# Modeling, Documentation and Test Execution

**With Júlio de Lima**

# Test Case

**Based on ISO-29119-3.**

---

## Test Case Details

| Field | Description |
|-------|-------------|
| **ID** | Unique identifier for this test case |
| **Title** | Objective the tester has when executing this test |
| **Priority** | What would be the execution order of this test among others |
| **Traceability** | This test was created to test which requirements |
| **Pre-Conditions** | What needs to be prepared before executing this test case |

---

## Test Steps

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | First action to be performed | Expected result for this action |
| **Step 2** | Second action to be performed | Expected result for this action |
| **Step 3** | Third action to be performed | Expected result for this action |

---

## Post-Conditions

**Post-Conditions**: What else will happen after executing this test case

---

## Test Case Examples for BIMCheck Project

### Test Case TC-BIM-001: Valid IFC File Upload Validation

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-001 |
| **Title** | Validate valid IFC file upload |
| **Priority** | High |
| **Traceability** | RF001 - IFC file upload |
| **Pre-Conditions** | Web browser open, local server running, valid_example.ifc file available |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page (http://localhost:3000) | Main page loads with upload interface |
| **Step 2** | Click "Choose file" button | File selection dialog opens |
| **Step 3** | Select valid_example.ifc file | File is selected and name appears |
| **Step 4** | Click "Upload and Validate" button | Upload starts and progress bar appears |
| **Step 5** | Wait for processing completion | Validation results are displayed |

**Post-Conditions**: File is processed and validation results are available for viewing and export

---

### Test Case TC-BIM-002: Invalid File Upload Validation

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-002 |
| **Title** | Validate rejection of invalid files |
| **Priority** | High |
| **Traceability** | RF002 - File type validation |
| **Pre-Conditions** | Web browser open, local server running, test.txt file available |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page (http://localhost:3000) | Main page loads with upload interface |
| **Step 2** | Click "Choose file" button | File selection dialog opens |
| **Step 3** | Select test.txt file (non-IFC) | File is selected but warning appears |
| **Step 4** | Click "Upload and Validate" button | Error message: "Only IFC files are accepted" |
| **Step 5** | Verify no processing occurs | No progress bar or validation results |

**Post-Conditions**: Invalid file is rejected and system remains in initial state

---

### Test Case TC-BIM-003: Large File Size Validation

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-003 |
| **Title** | Validate file size limit enforcement |
| **Priority** | Medium |
| **Traceability** | RF003 - File size validation |
| **Pre-Conditions** | Web browser open, local server running, large_file.ifc (>50MB) available |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page (http://localhost:3000) | Main page loads with upload interface |
| **Step 2** | Click "Choose file" button | File selection dialog opens |
| **Step 3** | Select large_file.ifc (>50MB) | File is selected |
| **Step 4** | Click "Upload and Validate" button | Error message: "File too large. Maximum 50MB allowed" |
| **Step 5** | Verify no processing occurs | No progress bar or validation results |

**Post-Conditions**: Large file is rejected and system displays appropriate error message

---

### Test Case TC-BIM-004: Dashboard Navigation

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-004 |
| **Title** | Validate navigation to advanced dashboard |
| **Priority** | Medium |
| **Traceability** | RF004 - Dashboard access |
| **Pre-Conditions** | Web browser open, local server running, validation completed |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Complete a file validation (TC-BIM-001) | Validation results are displayed |
| **Step 2** | Click "Advanced Dashboard" button | Dashboard page loads |
| **Step 3** | Verify dashboard elements | Metrics, charts, and history are visible |
| **Step 4** | Click "Back to Main" button | Returns to main page |
| **Step 5** | Verify data persistence | Previous validation data is still available |

**Post-Conditions**: Dashboard is accessible and navigation works correctly

---

### Test Case TC-BIM-005: Excel Report Generation

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-005 |
| **Title** | Validate Excel report export functionality |
| **Priority** | High |
| **Traceability** | RF005 - Report generation |
| **Pre-Conditions** | Web browser open, local server running, validation completed with problems |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Complete validation with problematic_example.ifc | Validation results show problems |
| **Step 2** | Click "Export Report" button | Excel file download starts |
| **Step 3** | Open downloaded Excel file | File opens with Summary and Detailed Problems sheets |
| **Step 4** | Verify Summary sheet content | Contains metrics: total elements, conformity rate, problem counts |
| **Step 5** | Verify Detailed Problems sheet | Contains problem list with descriptions and recommendations |

**Post-Conditions**: Excel report is generated and contains accurate validation data

---

### Test Case TC-BIM-006: Responsive Design Mobile

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-006 |
| **Title** | Validate responsive design on mobile devices |
| **Priority** | Medium |
| **Traceability** | RNF001 - Mobile responsiveness |
| **Pre-Conditions** | Mobile device or browser with mobile emulation, local server running |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page on mobile (375x667) | Page adapts to mobile viewport |
| **Step 2** | Verify interface elements | All buttons and sections are accessible |
| **Step 3** | Test file upload on mobile | Upload functionality works correctly |
| **Step 4** | Navigate to dashboard on mobile | Dashboard adapts to mobile layout |
| **Step 5** | Test all interactive elements | Charts and buttons work on touch interface |

**Post-Conditions**: Application is fully functional on mobile devices

---

### Test Case TC-BIM-007: Example File Loading

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-007 |
| **Title** | Validate example file loading functionality |
| **Priority** | Low |
| **Traceability** | RF006 - Example files |
| **Pre-Conditions** | Web browser open, local server running, example files available |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page (http://localhost:3000) | Main page loads with examples section |
| **Step 2** | Click "Valid Example" button | Example file loads automatically |
| **Step 3** | Verify validation results | Results show high conformity rate |
| **Step 4** | Click "Problematic Example" button | Different example loads |
| **Step 5** | Verify different results | Results show problems and lower conformity |

**Post-Conditions**: Example files demonstrate different validation scenarios

---

### Test Case TC-BIM-008: Chart Interaction Dashboard

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-008 |
| **Title** | Validate interactive chart functionality in dashboard |
| **Priority** | Medium |
| **Traceability** | RF007 - Interactive charts |
| **Pre-Conditions** | Web browser open, dashboard loaded with data |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Navigate to dashboard page | Dashboard loads with charts |
| **Step 2** | Click "Toggle Chart" button for problems | Chart switches between pie and bar |
| **Step 3** | Click "Toggle Chart" button for elements | Chart switches between pie and bar |
| **Step 4** | Hover over chart elements | Tooltips show detailed information |
| **Step 5** | Verify chart responsiveness | Charts adapt to window resize |

**Post-Conditions**: Charts are interactive and provide detailed data visualization

---

### Test Case TC-BIM-009: Performance Large File

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-009 |
| **Title** | Validate performance with large valid IFC file |
| **Priority** | Medium |
| **Traceability** | RNF002 - Performance requirements |
| **Pre-Conditions** | Web browser open, large valid IFC file (30-45MB) available |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Access main page (http://localhost:3000) | Main page loads normally |
| **Step 2** | Upload large valid IFC file | Upload completes within reasonable time |
| **Step 3** | Monitor processing time | Validation completes within 30 seconds |
| **Step 4** | Verify system responsiveness | Interface remains responsive during processing |
| **Step 5** | Check memory usage | Memory usage stays within acceptable limits |

**Post-Conditions**: System handles large files efficiently without performance degradation

---

### Test Case TC-BIM-010: Cross-Browser Compatibility

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-010 |
| **Title** | Validate application functionality across different browsers |
| **Priority** | Medium |
| **Traceability** | RNF003 - Browser compatibility |
| **Pre-Conditions** | Chrome, Firefox, Safari, and Edge browsers available, local server running |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | Test application in Chrome | All functionalities work correctly |
| **Step 2** | Test application in Firefox | All functionalities work correctly |
| **Step 3** | Test application in Safari | All functionalities work correctly |
| **Step 4** | Test application in Edge | All functionalities work correctly |
| **Step 5** | Compare visual consistency | Interface appears consistent across browsers |

**Post-Conditions**: Application works consistently across all major browsers

---

## Template for New Test Cases

### Test Case TC-BIM-XXX: [Test Objective]

| Field | Description |
|-------|-------------|
| **ID** | TC-BIM-XXX |
| **Title** | [Clear description of what is being tested] |
| **Priority** | [High/Medium/Low] |
| **Traceability** | [Related requirement ID] |
| **Pre-Conditions** | [What needs to be set up before testing] |

| Steps | Action | Expected Results |
|-------|--------|-----------------|
| **Step 1** | [First action to perform] | [Expected outcome] |
| **Step 2** | [Second action to perform] | [Expected outcome] |
| **Step 3** | [Third action to perform] | [Expected outcome] |
| **Step N** | [Additional steps as needed] | [Expected outcome] |

**Post-Conditions**: [What should be the state after test execution]

---

## Naming Conventions

### Test Case ID Format
- **TC-BIM-XXX**: Test Case - BIMCheck - Sequential Number
- **Example**: TC-BIM-001, TC-BIM-002, TC-BIM-003

### Priority Levels
- **High**: Critical functionality, blocking issues
- **Medium**: Important functionality, affects user experience
- **Low**: Nice-to-have functionality, minor issues

### Requirement Traceability
- **RF**: Functional Requirement
- **RNF**: Non-Functional Requirement
- **Example**: RF001, RNF001

---

## Evidence and Documentation

### Required Evidence
- **Screenshots**: Key steps and results
- **Videos**: Complete test execution for complex scenarios
- **Logs**: System logs for debugging issues
- **Reports**: Test execution reports with pass/fail status

### Documentation Standards
- **Clear Steps**: Each step should be unambiguous
- **Expected Results**: Specific and measurable outcomes
- **Traceability**: Link to requirements and user stories
- **Maintainability**: Easy to update and modify

---

## Execution and Reporting

### Test Execution Process
1. **Preparation**: Set up test environment and data
2. **Execution**: Follow test steps exactly as documented
3. **Observation**: Record actual results
4. **Comparison**: Compare actual vs expected results
5. **Reporting**: Document pass/fail status and issues

### Reporting Format
- **Test Case ID**: TC-BIM-XXX
- **Execution Date**: YYYY-MM-DD
- **Tester**: [Tester Name]
- **Status**: PASS/FAIL/BLOCKED
- **Comments**: Additional observations
- **Defects**: Link to any defects found

---

**Document created by**: Joyce Fernandes  
**Email**: joyce.f.silva@hotmail.com  
**LinkedIn**: https://www.linkedin.com/in/joyce-fernandes-da-silva/  
**Date**: 20/08/2025  
**Version**: 1.0  
**Based on**: ISO-29119-3