// ***********************************************************
// Este arquivo pode ser usado para carregar
// comandos customizados e plugins do Cypress
// ***********************************************************

// Importar comandos.js usando ES2015 syntax:
import './commands';

// Alternativamente, você pode usar CommonJS syntax:
// require('./commands')

// Configurações globais do Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retorna false para evitar que o Cypress falhe no teste
  // quando há exceções não capturadas
  return false;
});

// Configuração para lidar com uploads de arquivo
Cypress.Commands.add('uploadFile', (fileName, fileType = '') => {
  cy.fixture(fileName).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: fileType
    });
  });
});

// Comando para aguardar carregamento da aplicação
Cypress.Commands.add('waitForAppLoad', () => {
  cy.get('#uploadSection', { timeout: 10000 }).should('be.visible');
});

// Comando para verificar se a aplicação está funcionando
Cypress.Commands.add('checkAppHealth', () => {
  cy.visit('/');
  cy.get('h1').should('contain', 'BIMCheck');
  cy.get('#uploadSection').should('be.visible');
});

// Comando para simular upload de arquivo IFC
Cypress.Commands.add('uploadIFCFile', (fileName = 'sample.ifc') => {
  cy.get('input[type="file"]').selectFile(`cypress/fixtures/${fileName}`, { force: true });
});

// Comando para aguardar processamento do arquivo
Cypress.Commands.add('waitForProcessing', () => {
  cy.get('#progressSection', { timeout: 30000 }).should('not.be.visible');
  cy.get('#resultsSection').should('be.visible');
});

// Comando para verificar resultados da validação
Cypress.Commands.add('checkValidationResults', () => {
  cy.get('#resultsSection').should('be.visible');
  cy.get('#totalElements').should('be.visible');
});

// Comando para exportar relatório
Cypress.Commands.add('exportReport', () => {
  cy.get('button').contains('Exportar Relatório Excel').click();
  cy.wait(2000); // Aguarda download
});

// Comando para verificar design responsivo
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