# BIMCheck - IFC File Validator

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-36%2F36%20passing-brightgreen.svg)](https://github.com/Joyce-Fernandes/BIMCheck)
[![Cypress](https://img.shields.io/badge/Cypress-14.5.4-brightgreen.svg)](https://www.cypress.io/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-yellow.svg)](https://jestjs.io/)

## 📋 Description

BIMCheck is a web application for validating IFC (Industry Foundation Classes) files in BIM (Building Information Modeling) projects. The application imports IFC files, validates mandatory parameters, and generates non-conformity reports in Excel, in addition to offering an advanced dashboard for analysis.

## 🎯 Project Status

✅ **Version 1.0.0 - Complete**
- 100% of functional requirements implemented
- 36/36 automated tests passing (14 E2E + 22 Unit tests)
- Modern responsive interface with glassmorphism design
- Functional advanced dashboard with dynamic data
- Example files with individual data for testing
- Clean and optimized project structure
- Full English translation (UI, code, documentation)

## 🚀 Features

- **IFC file upload**: Simple interface with drag and drop functionality
- **Example Files**: 3 IFC models for testing and demonstration
- **Automatic validation**: Material, Dimensions and European Standard Codes (EN 1992-1-1, EN 14351-1)
- **Reports**: Detailed list of non-conformities and statistics
- **Excel export (.xlsx)**: Structured report automatically downloaded
- **Advanced dashboard**: Metrics and interactive charts for data analysis
- **Responsive interface**: Optimized for desktop, tablet and mobile
- **Performance testing**: Load, stress and spike tests with k6

## 🛠️ Technologies Used

### Frontend
- **HTML5/CSS3**: Responsive structure and glassmorphism styling
- **JavaScript (ES6+)**: Application logic and IFC processing
- **ifc.js**: IFC file processing and validation
- **xlsx**: Excel report generation
- **Chart.js**: Interactive charts in dashboard

### Testing and Quality
- **Jest**: Unit tests with coverage reporting
- **Cypress**: Automated E2E tests with screenshots and videos
- **k6**: Performance tests (included in project)
- **ESLint/Prettier**: Code quality and formatting

### Infrastructure
- **Node.js**: Local HTTP server
- **Git**: Version control with GitHub integration

## 📁 Project Structure

```
BIMCheck/
├── src/                        # Application source code
│   ├── index.html              # Main application page
│   ├── dashboard.html          # Advanced dashboard page
│   ├── style.css               # Main CSS styles
│   ├── dashboard.css           # Dashboard-specific styles
│   ├── script.js               # Main JavaScript logic
│   ├── dashboard.js            # Dashboard JavaScript logic
│   └── examples/               # Example IFC files
│       ├── valid_example.ifc       # Example with successful validation
│       ├── problematic_example.ifc # Example with detected problems
│       └── residential_project.ifc # Residential house model
├── tests/                      # Test scripts
│   ├── performance_tests.js    # Performance tests (k6)
│   ├── setup.js                # Jest configuration
│   └── unit/
│       └── validators.test.js  # Unit tests (22 tests)
├── cypress/                    # E2E tests with Cypress
│   ├── e2e/
│   │   ├── bimcheck-main.cy.js      # Main application tests (6 tests)
│   │   └── bimcheck-dashboard.cy.js # Dashboard tests (8 tests)
│   ├── fixtures/               # Test files
│   │   ├── sample.ifc              # Sample IFC for tests
│   │   ├── invalid.txt             # Invalid file for testing
│   │   └── corrupted.ifc            # Corrupted IFC for testing
│   ├── screenshots/            # Automatic screenshots
│   └── videos/                 # Automatic videos
├── server.js                   # Local HTTP server
├── cypress.config.js           # Cypress configuration
├── k6.exe                      # k6 executable for performance tests
├── package.json                # Scripts and dependencies
├── start-server.bat            # Startup script (Windows)
├── .gitignore                  # Git ignore rules
└── README.md                   # This file
```

## 🎬 Demonstration

### Main Features
- **Upload and Validation**: Automatic IFC file processing with progress indication
- **Example Files**: Test with pre-configured models (valid, problematic, residential)
- **Excel Reports**: Structured export with detailed validation results
- **Dashboard**: Advanced analysis with metrics, charts and historical data
- **Responsive Interface**: Glassmorphism design working on all devices

### Test Evidence
- **Screenshots**: `cypress/screenshots/` - Visual evidence of test execution
- **Videos**: `cypress/videos/` - Video recordings of test scenarios

## ⚙️ Installation and Usage

### Prerequisites
- **Node.js**: Version 18 or higher
- **Browser**: Chrome, Firefox, Safari or Edge
- **System**: Windows, macOS or Linux

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Joyce-Fernandes/BIMCheck.git
cd BIMCheck
```

2. Install dependencies:
```bash
npm install
```

3. Start the local server:
```bash
npm start
```

4. Access the application at `http://localhost:3000`

### Quick Method (Windows)
- Double-click `start-server.bat`

### How to Use
1. Select an `.ifc` file or use the example files
2. Wait for validation and view results
3. Export Excel report or navigate to Dashboard
4. Explore the advanced dashboard for detailed analysis

## 🧪 Tests

### Test Coverage
- **Total Tests**: 36 tests (100% passing)
- **E2E Tests**: 14 tests (Cypress)
- **Unit Tests**: 22 tests (Jest)
- **Performance Tests**: k6 scenarios

### Main Scripts
```bash
# Development
npm start                    # Start local server
npm run dev                  # Development mode

# Tests
npm run test:unit           # Unit tests (Jest)
npm run test:coverage       # Test coverage
npm run test:e2e:main       # E2E tests - Main application
npm run test:e2e:dashboard  # E2E tests - Dashboard
npm run test:e2e:all        # All E2E tests
npm run test:e2e:open       # Interactive Cypress interface
npm run test:performance    # Performance tests (k6)

# Code Quality
npm run lint                # Check code (ESLint)
npm run lint:fix            # Fix problems automatically
npm run format              # Format code (Prettier)
```

### Test Artifacts
- **Screenshots**: `cypress/screenshots/` - Visual test evidence
- **Videos**: `cypress/videos/` - Test execution recordings

## 🛠️ Development

### Development Standards
- **Clean Code**: ESLint and Prettier standards
- **Automated Tests**: 100% coverage of critical functionalities
- **Versioning**: Git with semantic commits
- **Performance**: k6 performance testing included

### Development Workflow
1. Develop functionality
2. Run tests (`npm run test:e2e:all`)
3. Check quality (`npm run lint`)
4. Commit and push

## 🤝 Contribution

1. Fork the project
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes (`git commit -m 'feat: my feature'`)
4. Push to the branch (`git push origin feature/my-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT license. See [LICENSE](LICENSE) for more details.

## 👨‍💻 Author

**Joyce Fernandes** - Test Engineer and BIM Developer
- LinkedIn: [Joyce Fernandes da Silva](https://www.linkedin.com/in/joyce-fernandes-da-silva/)
- Email: joyce.f.silva@hotmail.com
- GitHub: [Joyce-Fernandes](https://github.com/Joyce-Fernandes)

## 🙏 Acknowledgments

- **BIM Community**: For support and shared knowledge
- **ifc.js**: Open-source library for IFC file processing
- **Cypress**: E2E testing framework that made automation possible
- **k6**: Performance testing tool for load testing
- **Open Source Community**: For all tools and libraries used
- **Mentors and Collaborators**: For support during development

---

**Developed with ❤️ for the BIM community**