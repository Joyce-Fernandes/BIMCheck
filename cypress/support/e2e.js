// ***********************************************************
// This file can be used to load
// custom commands and Cypress plugins
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively, you can use CommonJS syntax:
// require('./commands')

// Global Cypress settings
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returns false to prevent Cypress from failing the test
  // when there are uncaught exceptions
  return false;
});

// Configuration for handling file uploads
Cypress.Commands.add('uploadFile', (fileName, fileType = '') => {
  cy.fixture(fileName).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: fileType
    });
  });
});

// Command to wait for application loading
Cypress.Commands.add('waitForAppLoad', () => {
  cy.get('#uploadSection', { timeout: 10000 }).should('be.visible');
});

// Command to check if application is working
Cypress.Commands.add('checkAppHealth', () => {
  cy.visit('/');
  cy.get('h1').should('contain', 'BIMCheck');
  cy.get('#uploadSection').should('be.visible');
});

// Command to simulate IFC file upload
Cypress.Commands.add('uploadIFCFile', (fileName = 'sample.ifc') => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });
});

// Command to wait for file processing
Cypress.Commands.add('waitForProcessing', () => {
  cy.get('#progressSection', { timeout: 30000 }).should('not.be.visible');
  cy.get('#resultsSection').should('be.visible');
});

// Command to check validation results
Cypress.Commands.add('checkValidationResults', () => {
  cy.get('#resultsSection').should('be.visible');
  cy.get('#totalElements').should('be.visible');
});

// Command to export report
Cypress.Commands.add('exportReport', () => {
  cy.get('button').contains('Export Excel Report').click();
  cy.wait(2000); // Wait for download
});

// Command to check responsive design
Cypress.Commands.add('checkResponsiveDesign', () => {
  // Desktop
  cy.viewport(1920, 1080);
  cy.get('.container').should('be.visible');
  
  // Tablet
  cy.viewport(768, 1024);
  cy.get('.container').should('be.visible');
  
  // Mobile
  cy.viewport(375, 667);
  cy.get('.container').should('be.visible');
}); 