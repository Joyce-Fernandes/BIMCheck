# Test Heuristics - BIMCheck

**Based on Test Obsessed material, Test Heuristics Cheat Sheet Heuristics & Frameworks, with ideas from Elisabeth Hendrickson, James Lyndsay, and Dale Emery.**

---

## Data Type Attacks

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Valid IFC Files** | Test with standard IFC files, different versions (IFC2x3, IFC4) |
| **Invalid IFC Files** | Test with corrupted files, incorrect extensions (.txt, .pdf) |
| **Empty Files** | Test uploading files with no content |
| **Very Large Files** | Test with files > 50MB to check limits |
| **Very Small Files** | Test with files < 1KB |
| **Multiple Files** | Test simultaneous selection of multiple files |
| **Extreme Validation Data** | Test materials with extreme values (0, negative, very large) |
| **Invalid Standards** | Test non-existent or malformed standard codes |

---

## String Tests

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Special Character Filenames** | Test with special characters: `file@#$%.ifc` |
| **Long Filenames** | Test with names of 255+ characters |
| **Filenames with Spaces** | Test: `my ifc file.ifc` |
| **Unicode Filenames** | Test with accented characters: `archivé-ção.ifc` |
| **Empty Strings** | Test input fields with empty strings |
| **Very Long Strings** | Test with texts of 1000+ characters |
| **Script Injection** | Test with: `<script>alert('test')</script>` |
| **SQL Injection** | Test with: `'; DROP TABLE users; --` |
| **XSS** | Test with: `<img src=x onerror=alert(1)>` |

---

## UI Tests

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Back Button** | Test navigation between main page ↔ dashboard |
| **Page Refresh** | Test F5/Ctrl+R during upload and validation |
| **URL Manipulation** | Test direct access to `/dashboard` without validation |
| **Disable JavaScript** | Test functionality without JavaScript enabled |
| **HTML and CSS Validation** | Check valid HTML structure and responsive CSS |
| **Page Zoom** | Test with zoom 50%, 100%, 200% |
| **Keyboard Navigation** | Test Tab, Enter, Escape, arrows |
| **Drag & Drop** | Test dragging files to upload area |
| **File Selection** | Test clicking "Choose file" |
| **Disabled Buttons** | Test states during processing |
| **Error Messages** | Check clarity and actionability |
| **Loading States** | Test progress indicators |
| **Responsiveness** | Test on desktop, tablet, mobile |

---

## Test Wisdom

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Tests as experiments** | Formulate hypotheses: "If I do X, then Y should happen" |
| **Clustered failures** | If you find one problem, look for similar problems |
| **Adopt contrary approach** | Think about what could go wrong and test it |
| **Test what shouldn't work** | Try uploading non-IFC files |
| **Test limits and edges** | Minimum, maximum, and extreme values |
| **Test unexpected scenarios** | Interrupt upload, close browser during processing |
| **Test real data** | Use IFC files from real projects |
| **Test integration** | Check if dashboard reflects validation data |
| **Test performance** | Check response time with large files |

---

## General Heuristics

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **CRUD** | **Create**: File upload<br>**Read**: View results<br>**Update**: Re-upload same file<br>**Delete**: Clear history |
| **Follow the Data** | Track data from upload → validation → dashboard → report |
| **Interruptions** | Test during upload: close browser, lose connection, restart |
| **Application States** | Test transitions: idle → uploading → processing → results |
| **Concurrency** | Multiple simultaneous uploads |
| **Persistence** | Check if data persists after refresh |
| **Configuration** | Test different browser configurations |
| **Environment** | Test on different operating systems |
| **Network** | Test with slow, unstable connection |

---

## BIMCheck Specific Heuristics

### IFC File Validation

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **IFC Structure** | Check if file has valid IFC structure |
| **IFC Versions** | Test IFC2x3, IFC4, IFC4x3 |
| **BIM Elements** | Validate presence of materials, dimensions, standards |
| **Geometry** | Test files with complex/simple geometry |
| **Properties** | Check mandatory properties |
| **Relationships** | Test relationships between elements |

### Dashboard and Reports

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Interactive Charts** | Test switching between chart types |
| **Real-time Data** | Check automatic updates |
| **Excel Export** | Test report generation and download |
| **History** | Check persistence of previous validations |
| **Filters** | Test filters by date, type, status |
| **Metrics** | Check accuracy of displayed metrics |

### Performance and Scalability

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Upload Time** | Measure time for different file sizes |
| **Validation Time** | Check validation performance |
| **Memory Usage** | Monitor memory consumption |
| **CPU** | Check processor usage |
| **Multiple Users** | Test load with several simultaneous users |
| **Large Files** | Test limits with files > 100MB |

---

## Security Heuristics

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Type Validation** | Check if only .ifc files are accepted |
| **Sanitization** | Test with malicious filenames |
| **Secure Upload** | Check if files are validated before processing |
| **Direct Access** | Try accessing files directly via URL |
| **Sessions** | Test session expiration |
| **Logs** | Check if actions are logged |

---

## Accessibility Heuristics

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Contrast** | Check color contrast |
| **Font Size** | Test with large/small fonts |
| **Keyboard Navigation** | Check if everything is accessible via keyboard |
| **Screen Readers** | Test with screen readers |
| **Alt Text** | Check alternative texts in images |
| **Visual Focus** | Test focus indicators |

---

## Compatibility Heuristics

| Heuristic Name | Description/Example |
|----------------|-------------------|
| **Browsers** | Test Chrome, Firefox, Safari, Edge |
| **Versions** | Test old and new versions |
| **Devices** | Test desktop, tablet, mobile |
| **Resolutions** | Test different screen resolutions |
| **Operating Systems** | Test Windows, macOS, Linux |
| **Plugins** | Test with plugins enabled/disabled |

---

## Application Process

### 1. **Planning**
- Identify critical areas based on heuristics
- Prioritize heuristics by risk and impact
- Define time for each category

### 2. **Execution**
- Apply heuristics systematically
- Document findings and problems
- Capture evidence (screenshots, videos)

### 3. **Analysis**
- Group similar problems
- Identify patterns and trends
- Prioritize corrections

### 4. **Improvement**
- Refine heuristics based on learning
- Add new specific heuristics
- Share knowledge with team

---

## Practical Examples

### **Scenario 1: File Upload**
1. **Data Attacks**: Try .txt file with extension renamed to .ifc
2. **Strings**: Name with special characters: `file@#$%.ifc`
3. **UI**: Test drag & drop, selection button
4. **Wisdom**: Interrupt upload midway
5. **CRUD**: Check if file appears in history

### **Scenario 2: Dashboard**
1. **UI**: Test responsiveness on mobile
2. **Data**: Check if metrics reflect real validation
3. **Performance**: Measure loading time
4. **Interruptions**: Refresh page during loading
5. **Accessibility**: Navigate only with keyboard

---

## Quality Metrics

### **Heuristics Coverage**
- **Data Attacks**: 100% of types tested
- **Strings**: 100% of input scenarios
- **UI**: 100% of interactive elements
- **Wisdom**: 100% of critical scenarios
- **General**: 100% of main flows

### **Effectiveness**
- **Problems Found**: Quantity and severity
- **Discovery Time**: Speed of identification
- **Code Coverage**: Percentage of code tested
- **Software Quality**: Defect reduction

---

**Document created by**: Joyce Fernandes  
**Email**: joyce.f.silva@hotmail.com  
**LinkedIn**: https://www.linkedin.com/in/joyce-fernandes-da-silva/  
**Date**: 20/08/2025  
**Version**: 1.0  
**Based on**: Test Obsessed, Test Heuristics Cheat Sheet Heuristics & Frameworks