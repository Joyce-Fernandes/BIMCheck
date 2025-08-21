# Test Plan and Strategy - BIMCheck

**Based on ISO-29119-3.**

---

## 1. Epic and General Testing Effort Estimation

### Main Epic: BIM Validation System
**Description**: Development of a complete web application for validating IFC (Industry Foundation Classes) files with responsive interface, advanced dashboard, and Excel report generation.

**General Testing Effort Estimation**: 120 testing hours
- **Unit Tests**: 20 hours
- **E2E Tests**: 40 hours
- **Performance Tests**: 15 hours
- **Exploratory Tests**: 25 hours
- **Responsiveness Tests**: 10 hours
- **Documentation and Evidence**: 10 hours

---

## 2. User Stories and Testing Effort Estimation

| Code | Description | Effort |
|------|-------------|--------|
| **US-001** | As a user, I want to upload IFC files for validation | 8h |
| **US-002** | As a user, I want to visualize validation progress in real time | 6h |
| **US-003** | As a user, I want to see validation results with problem details | 10h |
| **US-004** | As a user, I want to export reports in Excel format | 8h |
| **US-005** | As a user, I want to access a dashboard with metrics and history | 12h |
| **US-006** | As a user, I want to load example files for demonstration | 4h |
| **US-007** | As a user, I want to navigate the application on mobile devices | 8h |
| **US-008** | As a user, I want the application to validate materials, dimensions, and standards | 15h |
| **US-009** | As a user, I want to visualize interactive charts in the dashboard | 10h |
| **US-010** | As a user, I want the application to be responsive at different resolutions | 8h |

---

## 3. Test Conditions and Layers

### US-001: IFC file upload

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| TC-001-01 | Valid IFC file upload | File accepted and processing started | E2E |
| TC-001-02 | Upload file with incorrect extension | Error message displayed | E2E |
| TC-001-03 | Empty file upload | Error message displayed | E2E |
| TC-001-04 | Very large file upload (>50MB) | Error message displayed | E2E |
| TC-001-05 | File drag & drop | File accepted via drag & drop | E2E |
| TC-001-06 | Multiple file selection | Only first file processed | E2E |

### US-002: Progress visualization

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| TC-002-01 | Processing start | Progress bar visible | E2E |
| TC-002-02 | Processing in progress | Progress updated in real time | E2E |
| TC-002-03 | Processing completion | 100% progress and results displayed | E2E |
| TC-002-04 | Error during processing | Error message and interrupted progress | E2E |

### US-003: Validation results

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| TC-003-01 | Successful validation | Problem list displayed | E2E |
| TC-003-02 | Validation without problems | Success message displayed | E2E |
| TC-003-03 | Problem details | Complete problem information | E2E |
| TC-003-04 | Element count | Total validated elements | E2E |
| TC-003-05 | Compliance status | General status (Approved/Rejected) | E2E |

### US-004: Report export

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| TC-004-01 | Excel report generation | .xlsx file downloaded | E2E |
| TC-004-02 | Report content | Correct data in Summary and Detailed Problems sheets | E2E |
| TC-004-03 | Report formatting | Professional and readable layout | E2E |
| TC-004-04 | Report without problems | Only Summary sheet generated | E2E |

### US-005: Advanced dashboard

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| TC-005-01 | Dashboard loading | Metrics and charts displayed | E2E |
| TC-005-02 | Interactive charts | Switching between chart types | E2E |
| TC-005-03 | Validation history | Recent validations list | E2E |
| TC-005-04 | Compliance analysis | Updated compliance bar | E2E |
| TC-005-05 | Validation timeline | Chronological history displayed | E2E |

---

## 4. Exploratory Testing Missions

### Mission 1: Main Interface Exploration
**Objective**: Discover usability and functionality problems on the main page
**Time**: 90 minutes
**Scope**: Upload, validation, results, and navigation
**Charter**: Explore all main interface functionalities, testing different usage scenarios and identifying UX/UI problems.

### Mission 2: Dashboard Exploration
**Objective**: Validate functionality and usability of the advanced dashboard
**Time**: 60 minutes
**Scope**: Charts, metrics, history, and navigation
**Charter**: Explore all dashboard functionalities, testing chart interactivity and data accuracy.

### Mission 3: Responsiveness Exploration
**Objective**: Identify layout problems on different devices
**Time**: 45 minutes
**Scope**: Desktop, tablet, and mobile
**Charter**: Test the application on different resolutions and devices, identifying layout and usability problems.

### Mission 4: Performance Exploration
**Objective**: Identify performance and scalability problems
**Time**: 60 minutes
**Scope**: Large file upload, multiple validations
**Charter**: Test application performance limits, including large files and simultaneous operations.

---

## 5. Non-Functional Tests

| Type | Test | Expected Result |
|------|------|-----------------|
| **Performance** | Upload response time | < 5 seconds for files < 10MB |
| **Performance** | Validation time | < 10 seconds for medium files |
| **Performance** | Report generation | < 3 seconds |
| **Performance** | Dashboard loading | < 2 seconds |
| **Load** | Multiple simultaneous users | Support for 10+ users |
| **Stress** | Very large files | Graceful error handling |
| **Usability** | Responsive interface | Functioning on desktop, tablet, and mobile |
| **Compatibility** | Browsers | Chrome, Firefox, Safari, Edge |
| **Accessibility** | Keyboard navigation | All functionalities accessible |
| **Security** | File upload | Type and size validation |

---

## 6. Test Automation

| ID | Condition | Expected Result | Layer |
|----|-----------|----------------|-------|
| **AT-001** | Main page loading | Interface loaded correctly | E2E |
| **AT-002** | Valid file upload | Processing started | E2E |
| **AT-003** | Complete validation | Results displayed | E2E |
| **AT-004** | Report export | Excel file generated | E2E |
| **AT-005** | Dashboard navigation | Dashboard loaded | E2E |
| **AT-006** | Desktop responsiveness | Correct layout at 1920x1080 | E2E |
| **AT-007** | Mobile responsiveness | Correct layout at 375x667 | E2E |
| **AT-008** | Example loading | Example data loaded | E2E |
| **AT-009** | Material validation | Validation function returns correct result | Unit |
| **AT-010** | Dimension validation | Validation function returns correct result | Unit |
| **AT-011** | Standards validation | Validation function returns correct result | Unit |
| **AT-012** | Upload performance | Response time < 5 seconds | Performance |
| **AT-013** | Validation performance | Response time < 10 seconds | Performance |
| **AT-014** | Multiple user load | Support for 10 simultaneous users | Performance |

---

## 7. Test Data Mapping

| Data | Type | Responsible | Status |
|------|------|-------------|--------|
| **Valid IFC files** | Test files | Development Team | ✅ Ready |
| **Invalid IFC files** | Test files | Test Team | ✅ Ready |
| **Example files** | Demo files | Development Team | ✅ Ready |
| **Validation data** | Data set | Test Team | ✅ Ready |
| **Browser configurations** | Test environments | Test Team | ✅ Ready |
| **Mobile devices** | Test hardware | Test Team | ✅ Ready |
| **Performance data** | Test metrics | Test Team | ✅ Ready |
| **Test evidence** | Screenshots and videos | Test Team | ✅ Ready |

---

## 8. Known Defects

| ID | Defect | Layer |
|----|---------|-------|
| **DEF-001** | IFC file validation not fully implemented | Backend |
| **DEF-002** | Lack of IFC file integrity validation | Backend |
| **DEF-003** | Interface not fully responsive at extreme resolutions | Frontend |
| **DEF-004** | Degraded performance with very large files | Performance |
| **DEF-005** | Lack of visual feedback during long processing | UX |
| **DEF-006** | Excel reports don't include all information | Backend |
| **DEF-007** | Dashboard doesn't update data in real time | Frontend |
| **DEF-008** | Lack of security validation on upload | Security |
| **DEF-009** | Limited accessibility for users with disabilities | Accessibility |
| **DEF-010** | Lack of detailed logs for debugging | Infrastructure |

---

## 9. Execution Strategy

### Phase 1: Unit Tests (Week 1)
- Jest unit test execution
- Minimum 80% coverage
- Critical function validation

### Phase 2: E2E Tests (Week 2)
- Cypress test execution
- Main flow coverage
- Responsiveness validation

### Phase 3: Performance Tests (Week 3)
- k6 test execution
- Performance limit validation
- Load and stress tests

### Phase 4: Exploratory Tests (Week 4)
- Structured exploratory sessions
- Additional problem discovery
- Usability validation

---

## 10. Acceptance Criteria

### Functionality
- ✅ All unit tests passing
- ✅ All E2E tests passing
- ✅ Main functionalities operational

### Performance
- ✅ Response time within limits
- ✅ Expected load support
- ✅ Efficient resource usage

### Quality
- ✅ Code coverage ≥ 80%
- ✅ Defect rate ≤ 5%
- ✅ Complete documentation

### Usability
- ✅ Responsive interface
- ✅ Intuitive navigation
- ✅ Adequate visual feedback

---

**Document created by**: Joyce Fernandes  
**Email**: joyce.f.silva@hotmail.com  
**LinkedIn**: https://www.linkedin.com/in/joyce-fernandes-da-silva/  
**Date**: 20/08/2025  
**Version**: 1.0  
**Based on**: ISO-29119-3