// ***********************************************
// Este arquivo pode ser usado para criar
// comandos customizados do Cypress
// ***********************************************

// Comando para aguardar carregamento de elementos
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Comando para verificar se elemento não existe
Cypress.Commands.add('waitForElementNotExist', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('not.exist');
});

// Comando para fazer upload de arquivo
Cypress.Commands.add('uploadFile', (fileName, fileType = '') => {
  cy.fixture(fileName).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: fileType
    });
  });
});

// Comando para verificar mensagens de erro
Cypress.Commands.add('checkErrorMessage', (expectedMessage) => {
  cy.get('.error-message, .alert-danger').should('contain', expectedMessage);
});

// Comando para verificar mensagens de sucesso
Cypress.Commands.add('checkSuccessMessage', (expectedMessage) => {
  cy.get('.success-message, .alert-success').should('contain', expectedMessage);
});

// Comando para verificar se botão está habilitado
Cypress.Commands.add('checkButtonEnabled', (buttonText) => {
  cy.get('button').contains(buttonText).should('not.be.disabled');
});

// Comando para verificar se botão está desabilitado
Cypress.Commands.add('checkButtonDisabled', (buttonText) => {
  cy.get('button').contains(buttonText).should('be.disabled');
});

// Comando para aguardar carregamento da página
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

// Comando para verificar se arquivo foi baixado
Cypress.Commands.add('checkFileDownload', (fileName) => {
  cy.readFile(`cypress/downloads/${fileName}`).should('exist');
});

// Comando para limpar downloads
Cypress.Commands.add('clearDownloads', () => {
  cy.task('clearDownloads');
});

// Comando para verificar console logs
Cypress.Commands.add('checkConsoleLogs', (expectedLog) => {
  cy.window().then((win) => {
    cy.spy(win.console, 'log').as('consoleLog');
    cy.get('@consoleLog').should('be.calledWith', expectedLog);
  });
});

// Comando para verificar localStorage
Cypress.Commands.add('checkLocalStorage', (key, expectedValue) => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem(key)).to.eq(expectedValue);
  });
});

// Comando para simular teclas
Cypress.Commands.add('typeWithDelay', (selector, text, delay = 100) => {
  cy.get(selector).clear().type(text, { delay });
});

// Comando para verificar atributos de elementos
Cypress.Commands.add('checkElementAttribute', (selector, attribute, expectedValue) => {
  cy.get(selector).should('have.attr', attribute, expectedValue);
});

// Comando para verificar classes CSS
Cypress.Commands.add('checkElementClass', (selector, className) => {
  cy.get(selector).should('have.class', className);
});

// Comando para verificar texto de elementos
Cypress.Commands.add('checkElementText', (selector, expectedText) => {
  cy.get(selector).should('contain.text', expectedText);
});

// Comando para verificar contagem de elementos
Cypress.Commands.add('checkElementCount', (selector, expectedCount) => {
  cy.get(selector).should('have.length', expectedCount);
});

// Comando para aguardar animações
Cypress.Commands.add('waitForAnimation', (selector) => {
  cy.get(selector).should('not.have.class', 'animating');
});

// Comando para verificar se elemento está visível
Cypress.Commands.add('checkElementVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

// Comando para verificar se elemento está oculto
Cypress.Commands.add('checkElementHidden', (selector) => {
  cy.get(selector).should('not.be.visible');
});

// Comando para verificar se elemento está focado
Cypress.Commands.add('checkElementFocused', (selector) => {
  cy.get(selector).should('be.focused');
});

// Comando para verificar se elemento está habilitado
Cypress.Commands.add('checkElementEnabled', (selector) => {
  cy.get(selector).should('not.be.disabled');
});

// Comando para verificar se elemento está desabilitado
Cypress.Commands.add('checkElementDisabled', (selector) => {
  cy.get(selector).should('be.disabled');
});