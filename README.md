# BIMCheck - IFC File Validator

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-36%2F36%20passing-brightgreen.svg)](https://github.com/seu-usuario/BIMCheck)
[![Cypress](https://img.shields.io/badge/Cypress-14.5.4-brightgreen.svg)](https://www.cypress.io/)
[![Jest](https://img.shields.io/badge/Jest-29.7.0-yellow.svg)](https://jestjs.io/)

## 📋 Description

BIMCheck is a web application for validating IFC (Industry Foundation Classes) files in BIM (Building Information Modeling) projects. The application imports IFC files, validates mandatory parameters, and generates non-conformity reports in Excel, in addition to offering an advanced dashboard for analysis.

## 🎯 Project Status

✅ **Version 1.0.0 - Complete**
- 100% of functional requirements implemented
- 36/36 automated tests passing
- Modern responsive interface
- Functional advanced dashboard
- Example files with individual data
- Clean project structure

## 🚀 Features

- **IFC file upload**: simple interface (with drag and drop)
- **Example Files**: 3 IFC models for testing and demonstration
- **Automatic validation**: Material, Dimensions and Standard Code
- **Reports**: detailed list of non-conformities and statistics
- **Excel export (.xlsx)**: structured report automatically downloaded
- **Advanced dashboard**: metrics and charts for data analysis
- **Responsive interface**: desktop, tablet and mobile

## 🛠️ Technologies Used

### Frontend
- **HTML5/CSS3**: Responsive structure and styling
- **JavaScript (ES6+)**: Application logic
- **ifc.js**: IFC file processing
- **xlsx**: Excel report generation
- **Chart.js**: Interactive charts in dashboard

### Testing and Quality
- **Jest**: Unit tests with coverage
- **Cypress**: Automated E2E tests
- **k6**: Performance tests (included in project)
- **ESLint/Prettier**: Code quality and formatting

### Infrastructure
- **Node.js**: Local server
- **Git**: Version control

## 📁 Project Structure

```
BIMCheck/
├── src/                        # Application source code
│   ├── index.html              # Main page
│   ├── dashboard.html          # Advanced dashboard
│   ├── style.css               # CSS styles
│   ├── dashboard.css           # Dashboard styles
│   ├── script.js               # JavaScript logic
│   └── examples/               # Example IFC files
│       ├── valid_example.ifc       # Example with successful validation
│       ├── problematic_example.ifc # Example with detected problems
│       └── residential_project.ifc # Residential house model
├── tests/                      # Test scripts
│   ├── performance_tests.js    # Performance tests (k6)
│   ├── setup.js                # Jest configuration
│   └── unit/
│       └── validators.test.js  # Unit tests
├── cypress/                    # E2E tests with Cypress
│   ├── e2e/
│   │   ├── bimcheck-main.cy.js      # Main application tests
│   │   └── bimcheck-dashboard.cy.js # Dashboard tests
│   ├── fixtures/               # Test files (sample.ifc, invalid.txt, corrupted.ifc)
│   ├── screenshots/            # Automatic screenshots
│   └── videos/                 # Automatic videos
├── scripts/                    # Utility scripts
├── server.js                   # Local HTTP server
├── cypress.config.js           # Cypress configuration
├── k6.exe                      # k6 executable for performance tests
├── package.json                # Scripts and dependencies
├── start-server.bat            # Startup script (Windows)
└── README.md                   # This file
```

## 🎬 Demonstration

### Main Features
- **Upload and Validation**: Automatic IFC file processing
- **Example Files**: Test with pre-configured models
- **Excel Reports**: Structured export of results
- **Dashboard**: Advanced analysis with metrics and charts
- **Responsive Interface**: Works on desktop, tablet and mobile

### Screenshots and Videos
- Automatic screenshots: `cypress/screenshots/`
- Execution videos: `cypress/videos/`

## ⚙️ Installation and Usage

### Prerequisites
- **Node.js**: Version 18 or higher
- **Browser**: Chrome, Firefox, Safari or Edge
- **System**: Windows, macOS or Linux

### Installation

1. Clone the repository:
```bash
git clone https://github.com/seu-usuario/BIMCheck.git
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
1. Select an `.ifc` file
2. Wait for validation and view results
3. Export Excel report or navigate to Dashboard

## 🧪 Tests

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
- Screenshots: `cypress/screenshots/`
- Videos: `cypress/videos/`



## 🛠️ Development

### Development Structure
- **Clean Code**: ESLint and Prettier standards
- **Automated Tests**: 100% coverage of critical functionalities
- **Versioning**: Git with semantic commits

### Workflow
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

## 🙏 Acknowledgments

- **BIM Community**: For support and shared knowledge
- **ifc.js**: Open-source library for IFC file processing
- **Cypress**: E2E testing framework that made automation possible
- **Open Source Community**: For all tools and libraries used
- **Mentors and Collaborators**: For support during development

---

**Developed with ❤️ for the BIM community**