// ***********************************************
// This file can be used to create
// custom Cypress commands
// ***********************************************

// Command to wait for element loading
Cypress.Commands.add('waitForElement', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Command to check if element doesn't exist
Cypress.Commands.add('waitForElementNotExist', (selector, timeout = 10000) => {
  cy.get(selector, { timeout }).should('not.exist');
});

// Command to upload file
Cypress.Commands.add('uploadFile', (fileName, fileType = '') => {
  cy.fixture(fileName).then(fileContent => {
    cy.get('input[type="file"]').attachFile({
      fileContent: fileContent.toString(),
      fileName: fileName,
      mimeType: fileType
    });
  });
});

// Command to check error messages
Cypress.Commands.add('checkErrorMessage', (expectedMessage) => {
  cy.get('.error-message, .alert-danger').should('contain', expectedMessage);
});

// Command to check success messages
Cypress.Commands.add('checkSuccessMessage', (expectedMessage) => {
  cy.get('.success-message, .alert-success').should('contain', expectedMessage);
});

// Command to check if button is enabled
Cypress.Commands.add('checkButtonEnabled', (buttonText) => {
  cy.get('button').contains(buttonText).should('not.be.disabled');
});

// Command to check if button is disabled
Cypress.Commands.add('checkButtonDisabled', (buttonText) => {
  cy.get('button').contains(buttonText).should('be.disabled');
});

// Command to wait for page loading
Cypress.Commands.add('waitForPageLoad', () => {
  cy.get('body').should('be.visible');
  cy.window().its('document').its('readyState').should('eq', 'complete');
});

// Command to check if file was downloaded
Cypress.Commands.add('checkFileDownload', (fileName) => {
  cy.readFile(`cypress/downloads/${fileName}`).should('exist');
});

// Command to clear downloads
Cypress.Commands.add('clearDownloads', () => {
  cy.task('clearDownloads');
});

// Command to check console logs
Cypress.Commands.add('checkConsoleLogs', (expectedLog) => {
  cy.window().then((win) => {
    cy.spy(win.console, 'log').as('consoleLog');
    cy.get('@consoleLog').should('be.calledWith', expectedLog);
  });
});

// Command to check localStorage
Cypress.Commands.add('checkLocalStorage', (key, expectedValue) => {
  cy.window().then((win) => {
    expect(win.localStorage.getItem(key)).to.eq(expectedValue);
  });
});

// Command to simulate typing
Cypress.Commands.add('typeWithDelay', (selector, text, delay = 100) => {
  cy.get(selector).clear().type(text, { delay });
});

// Command to check element attributes
Cypress.Commands.add('checkElementAttribute', (selector, attribute, expectedValue) => {
  cy.get(selector).should('have.attr', attribute, expectedValue);
});

// Command to check CSS classes
Cypress.Commands.add('checkElementClass', (selector, className) => {
  cy.get(selector).should('have.class', className);
});

// Command to check element text
Cypress.Commands.add('checkElementText', (selector, expectedText) => {
  cy.get(selector).should('contain.text', expectedText);
});

// Command to check element count
Cypress.Commands.add('checkElementCount', (selector, expectedCount) => {
  cy.get(selector).should('have.length', expectedCount);
});

// Command to wait for animations
Cypress.Commands.add('waitForAnimation', (selector) => {
  cy.get(selector).should('not.have.class', 'animating');
});

// Command to check if element is visible
Cypress.Commands.add('checkElementVisible', (selector) => {
  cy.get(selector).should('be.visible');
});

// Command to check if element is hidden
Cypress.Commands.add('checkElementHidden', (selector) => {
  cy.get(selector).should('not.be.visible');
});

// Command to check if element is focused
Cypress.Commands.add('checkElementFocused', (selector) => {
  cy.get(selector).should('be.focused');
});

// Command to check if element is enabled
Cypress.Commands.add('checkElementEnabled', (selector) => {
  cy.get(selector).should('not.be.disabled');
});

// Command to check if element is disabled
Cypress.Commands.add('checkElementDisabled', (selector) => {
  cy.get(selector).should('be.disabled');
}); 