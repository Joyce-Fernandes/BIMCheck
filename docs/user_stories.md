# User Stories - BIMCheck

**Complete documentation of User Stories for the BIMCheck project, including functional requirements, acceptance criteria, and usage scenarios.**

---

## 📋 Overview

The **User Stories** of BIMCheck define the functional requirements of the system from the end users' perspective. Each story describes a specific functionality that adds value to the user, following the standard format: "As [type of user], I want [functionality] so that [benefit]."

---

## 🎯 Methodology

### **User Stories Format**
```
As [Type of User]
I want [Functionality]
So that [Benefit/Objective]

Acceptance Criteria:
- [ ] Criterion 1
- [ ] Criterion 2
- [ ] Criterion 3

Test Scenarios:
- Scenario 1: [Description]
- Scenario 2: [Description]

Priority: [High/Medium/Low]
Estimate: [Hours]
Status: [To Do/In Progress/Done]
```

### **User Types**
- **Civil Engineer**: Professional who validates BIM models
- **Architect**: Professional who creates and reviews projects
- **BIM Coordinator**: Responsible for quality management
- **Student**: Learning about BIM validation
- **Client**: Stakeholder who receives reports

---

## 📋 Implemented User Stories

### **US-001: IFC File Upload**
```
As Civil Engineer
I want to upload IFC files for validation
So that I can verify BIM model compliance

Acceptance Criteria:
- [ ] System accepts only files with .ifc extension
- [ ] System validates maximum size of 50MB
- [ ] System displays progress bar during upload
- [ ] System shows error message for invalid files
- [ ] System processes file after successful upload

Test Scenarios:
- Scenario 1: Upload of valid IFC file
- Scenario 2: Attempt to upload file with incorrect extension
- Scenario 3: Upload of file larger than 50MB
- Scenario 4: Upload of corrupted file

Priority: High
Estimate: 8 hours
Status: Done
```

### **US-002: Progress Visualization**
```
As Civil Engineer
I want to visualize validation progress in real time
So that I know how much time is left to complete the process

Acceptance Criteria:
- [ ] System displays progress bar during validation
- [ ] System shows completion percentage
- [ ] System displays current process step
- [ ] System allows canceling validation in progress
- [ ] System notifies when validation is completed

Test Scenarios:
- Scenario 1: Validation of small file (fast progress)
- Scenario 2: Validation of large file (slow progress)
- Scenario 3: Cancellation of validation in progress
- Scenario 4: Validation with error (interrupted progress)

Priority: High
Estimate: 6 hours
Status: Done
```

### **US-003: Results Visualization**
```
As Civil Engineer
I want to see validation results with problem details
So that I can identify and fix model inconsistencies

Acceptance Criteria:
- [ ] System displays list of found problems
- [ ] System classifies problems by severity
- [ ] System shows problem location in model
- [ ] System provides detailed description of each problem
- [ ] System displays correction recommendations

Test Scenarios:
- Scenario 1: Validation with critical problems
- Scenario 2: Validation with minor problems
- Scenario 3: Validation without problems (valid model)
- Scenario 4: Validation with multiple problem types

Priority: High
Estimate: 10 hours
Status: Done
```

### **US-004: Report Export**
```
As BIM Coordinator
I want to export validation reports in Excel format
So that I can share results with team and clients

Acceptance Criteria:
- [ ] System generates report in .xlsx format
- [ ] Report contains executive summary
- [ ] Report lists detailed problems
- [ ] Report includes correction recommendations
- [ ] System allows automatic report download

Test Scenarios:
- Scenario 1: Report generation with problems
- Scenario 2: Report generation without problems
- Scenario 3: Report with multiple sheets
- Scenario 4: Report with professional formatting

Priority: High
Estimate: 8 hours
Status: Done
```

### **US-005: Advanced Dashboard**
```
As BIM Coordinator
I want to access a dashboard with metrics and validation history
So that I can monitor project quality over time

Acceptance Criteria:
- [ ] System displays compliance metrics
- [ ] System shows interactive charts
- [ ] System lists validation history
- [ ] System allows filtering by date and type
- [ ] System displays quality trends

Test Scenarios:
- Scenario 1: Dashboard with historical data
- Scenario 2: Dashboard with multiple projects
- Scenario 3: Filtering by specific period
- Scenario 4: Dashboard data export

Priority: Medium
Estimate: 12 hours
Status: Done
```

### **US-006: Example Files**
```
As Student
I want to load example files to learn about validation
So that I can understand how the system works without needing real files

Acceptance Criteria:
- [ ] System offers pre-loaded example files
- [ ] System allows loading examples with one click
- [ ] System includes valid and problematic examples
- [ ] System explains what each example demonstrates
- [ ] System allows comparing different scenarios

Test Scenarios:
- Scenario 1: Loading valid example
- Scenario 2: Loading problematic example
- Scenario 3: Comparison between examples
- Scenario 4: Learning with educational examples

Priority: Medium
Estimate: 4 hours
Status: Done
```

### **US-007: Responsive Interface**
```
As Architect
I want to use the application on mobile devices and tablets
So that I can validate BIM models anywhere

Acceptance Criteria:
- [ ] Interface works on smartphones (375px+)
- [ ] Interface works on tablets (768px+)
- [ ] Interface works on desktops (1280px+)
- [ ] Elements adapt to screen size
- [ ] Navigation is intuitive on all devices

Test Scenarios:
- Scenario 1: Use on Android smartphone
- Scenario 2: Use on iPad tablet
- Scenario 3: Use on Windows desktop
- Scenario 4: Use on Mac laptop

Priority: Medium
Estimate: 8 hours
Status: Done
```

### **US-008: Material Validation**
```
As Civil Engineer
I want the system to validate if all elements have defined materials
So that I ensure the BIM model is complete

Acceptance Criteria:
- [ ] System checks if elements have defined material
- [ ] System validates material properties
- [ ] System identifies missing materials
- [ ] System suggests appropriate materials
- [ ] System classifies material problems by severity

Test Scenarios:
- Scenario 1: Elements with valid materials
- Scenario 2: Elements without defined material
- Scenario 3: Materials with incomplete properties
- Scenario 4: Unrecognized materials

Priority: High
Estimate: 15 hours
Status: Done
```

### **US-009: Dimension Validation**
```
As Civil Engineer
I want the system to validate element dimensions
So that I ensure measurements are correct and realistic

Acceptance Criteria:
- [ ] System checks if dimensions are positive
- [ ] System validates if dimensions are realistic (0.01m - 1000m)
- [ ] System identifies extreme dimensions
- [ ] System checks adequate proportions
- [ ] System suggests corrections for incorrect dimensions

Test Scenarios:
- Scenario 1: Valid and realistic dimensions
- Scenario 2: Negative or zero dimensions
- Scenario 3: Extremely large dimensions
- Scenario 4: Inadequate proportions

Priority: High
Estimate: 15 hours
Status: Done
```

### **US-010: Technical Standards Validation**
```
As Civil Engineer
I want the system to validate if elements follow European standards
So that I ensure compliance with technical standards

Acceptance Criteria:
- [ ] System checks standard codes (EN)
- [ ] System validates specific standards by element type
- [ ] System identifies missing or invalid standards
- [ ] System suggests appropriate standards
- [ ] System maintains standards updates

Test Scenarios:
- Scenario 1: Elements with valid standards
- Scenario 2: Elements without defined standard
- Scenario 3: Unrecognized standards
- Scenario 4: Outdated standards

Priority: High
Estimate: 15 hours
Status: Done
```

### **US-011: Page Navigation**
```
As User
I want to navigate easily between main page and dashboard
So that I can access different system functionalities

Acceptance Criteria:
- [ ] System allows navigation between pages
- [ ] System maintains data during navigation
- [ ] System displays breadcrumbs for orientation
- [ ] System allows returning to previous page
- [ ] System loads pages quickly

Test Scenarios:
- Scenario 1: Navigation from main page to dashboard
- Scenario 2: Navigation from dashboard to main page
- Scenario 3: Navigation with cached data
- Scenario 4: Navigation with history

Priority: Low
Estimate: 4 hours
Status: Done
```

### **US-012: Interactive Charts**
```
As BIM Coordinator
I want to visualize data through interactive charts in the dashboard
So that I can analyze trends and quality patterns

Acceptance Criteria:
- [ ] System displays pie charts for problem distribution
- [ ] System displays bar charts for elements by type
- [ ] System allows switching between chart types
- [ ] System shows tooltips with details
- [ ] System updates charts in real time

Test Scenarios:
- Scenario 1: Problem chart visualization
- Scenario 2: Switching between chart types
- Scenario 3: Interaction with tooltips
- Scenario 4: Dynamic data update

Priority: Medium
Estimate: 10 hours
Status: Done
```

### **US-013: Validation History**
```
As BIM Coordinator
I want to visualize complete history of performed validations
So that I can monitor project quality evolution

Acceptance Criteria:
- [ ] System maintains validation history
- [ ] System displays date and time of each validation
- [ ] System shows results of previous validations
- [ ] System allows comparing validations
- [ ] System allows clearing history

Test Scenarios:
- Scenario 1: Complete history visualization
- Scenario 2: Validation comparison
- Scenario 3: History clearing
- Scenario 4: Data persistence

Priority: Medium
Estimate: 8 hours
Status: Done
```

### **US-014: Compliance Analysis**
```
As Civil Engineer
I want to see detailed compliance analysis of the model
So that I can understand overall project quality

Acceptance Criteria:
- [ ] System calculates compliance rate
- [ ] System classifies compliance by levels
- [ ] System displays compliance progress bar
- [ ] System details evaluation criteria
- [ ] System suggests improvements to increase compliance

Test Scenarios:
- Scenario 1: Model with high compliance
- Scenario 2: Model with low compliance
- Scenario 3: Detailed criteria analysis
- Scenario 4: Improvement suggestions

Priority: Medium
Estimate: 8 hours
Status: Done
```

### **US-015: Validation Timeline**
```
As BIM Coordinator
I want to visualize a timeline of performed validations
So that I can monitor temporal evolution of projects

Acceptance Criteria:
- [ ] System displays chronological timeline
- [ ] System shows validation events
- [ ] System allows filtering by period
- [ ] System displays details when clicking on events
- [ ] System allows timeline navigation

Test Scenarios:
- Scenario 1: Complete timeline visualization
- Scenario 2: Filtering by specific period
- Scenario 3: Event details
- Scenario 4: Temporal navigation

Priority: Low
Estimate: 6 hours
Status: Done
```

---

## 📊 Prioritization Matrix

### **High Priority (Critical)**
| US | Title | Estimate | Status |
|----|-------|----------|--------|
| US-001 | IFC File Upload | 8h | Done |
| US-002 | Progress Visualization | 6h | Done |
| US-003 | Results Visualization | 10h | Done |
| US-004 | Report Export | 8h | Done |
| US-008 | Material Validation | 15h | Done |
| US-009 | Dimension Validation | 15h | Done |
| US-010 | Technical Standards Validation | 15h | Done |

### **Medium Priority (Important)**
| US | Title | Estimate | Status |
|----|-------|----------|--------|
| US-005 | Advanced Dashboard | 12h | Done |
| US-006 | Example Files | 4h | Done |
| US-007 | Responsive Interface | 8h | Done |
| US-012 | Interactive Charts | 10h | Done |
| US-013 | Validation History | 8h | Done |
| US-014 | Compliance Analysis | 8h | Done |

### **Low Priority (Desirable)**
| US | Title | Estimate | Status |
|----|-------|----------|--------|
| US-011 | Page Navigation | 4h | Done |
| US-015 | Validation Timeline | 6h | Done |

---

## 📈 Implementation Metrics

### **General Summary**
- **Total User Stories**: 15
- **Implemented**: 15 (100%)
- **In Progress**: 0 (0%)
- **Pending**: 0 (0%)

### **By Priority**
- **High**: 7 stories (100% implemented)
- **Medium**: 6 stories (100% implemented)
- **Low**: 2 stories (100% implemented)

### **By User Type**
- **Civil Engineer**: 8 stories
- **BIM Coordinator**: 5 stories
- **Architect**: 1 story
- **Student**: 1 story

### **Total Estimate**
- **Total Estimated Time**: 138 hours
- **Actual Time**: ~120 hours
- **Efficiency**: 87%

---

## 🎯 Global Acceptance Criteria

### **Functionality**
- [x] System validates IFC files correctly
- [x] System generates Excel reports
- [x] System displays dashboard with metrics
- [x] System works on mobile devices
- [x] System maintains validation history

### **Usability**
- [x] Intuitive and responsive interface
- [x] Clear navigation between pages
- [x] Visual feedback during operations
- [x] Clear error messages
- [x] Fast page loading

### **Quality**
- [x] Accurate material validation
- [x] Accurate dimension validation
- [x] Accurate standards validation
- [x] Correct problem classification
- [x] Complete and detailed reports

### **Performance**
- [x] File upload < 10MB in < 30s
- [x] File validation < 10MB in < 60s
- [x] Report generation in < 10s
- [x] Dashboard loading in < 5s
- [x] Responsive interface on all devices

---

## 🔄 Development Process

### **Methodology Used**
- **Agile/Scrum**: Iterative development
- **User-Centered Design**: User focus
- **Test-Driven Development**: Automated tests
- **Continuous Integration**: Continuous integration

### **Tools Used**
- **Management**: GitHub Issues
- **Development**: VS Code, Node.js
- **Testing**: Jest, Cypress, k6
- **Documentation**: Markdown, README

### **Development Cycle**
1. **Analysis**: Requirements understanding
2. **Design**: Prototyping and interface design
3. **Development**: Feature implementation
4. **Testing**: Validation and automated tests
5. **Deploy**: Implementation and validation
6. **Feedback**: User feedback collection

---

## 📋 Future User Stories (Future Versions)

### **US-016: User Authentication**
```
As BIM Coordinator
I want to login to the system with secure credentials
So that I can access restricted functionalities and maintain privacy
```

### **US-017: Real-time Collaboration**
```
As Civil Engineer
I want to share validation results with the team
So that we can work collaboratively on projects
```

### **US-018: BIM Tools Integration**
```
As Architect
I want to integrate the system with CAD/BIM tools
So that I can validate models directly from design software
```

### **US-019: Cost Analysis**
```
As BIM Coordinator
I want to analyze costs based on model elements
So that I can estimate project budgets
```

### **US-020: Sustainability Validation**
```
As Civil Engineer
I want to validate material sustainability criteria
So that I can ensure environmentally responsible projects
```

---

## 🎯 User Stories Benefits

### **✅ For Users:**
- **Clarity**: Well-defined and understandable requirements
- **Participation**: Involvement in development process
- **Validation**: Confirmation that functionalities meet needs
- **Feedback**: Opportunity to suggest improvements
- **Satisfaction**: Product that meets expectations

### **✅ For Development:**
- **Focus**: User value-oriented development
- **Prioritization**: Decisions based on importance and urgency
- **Estimation**: More accurate time and resource planning
- **Testing**: Clear criteria for validation
- **Quality**: Product that meets real needs

### **✅ For the Project:**
- **Success**: Higher probability of user acceptance
- **Efficiency**: More directed development
- **Flexibility**: Adaptation to requirement changes
- **Transparency**: Progress visibility
- **Collaboration**: More effective teamwork

---

**Document created by**: Joyce Fernandes  
**Email**: joyce.f.silva@hotmail.com  
**LinkedIn**: https://www.linkedin.com/in/joyce-fernandes-da-silva/  
**Date**: 20/08/2025  
**Version**: 1.0  
**Status**: ✅ User Stories Implemented and Functional