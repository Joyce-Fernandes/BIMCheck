describe('BIMCheck Main Application Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.wait(2000);
  });

  describe('Application Initialization', () => {
    it('should load main application page successfully', () => {
      cy.get('body').should('be.visible');
      cy.get('#uploadSection').should('be.visible');
      cy.get('h1').should('contain', 'BIMCheck');
      cy.get('.upload-area').should('be.visible');
    });

    it('should render all essential interface components', () => {
      cy.get('#uploadSection').should('be.visible');
      cy.get('#fileInput').should('exist');
      cy.get('.upload-btn').should('be.visible');
      cy.get('.info-section').should('be.visible');
    });
  });

  describe('File Upload Process', () => {
    it('should accept IFC file and show progress', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#progressSection', { timeout: 15000 }).should('be.visible');
      cy.get('.progress-bar').should('be.visible');
    });

    it('should complete validation and show results', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      cy.get('#totalElements').should('be.visible');
      cy.get('#totalIssues').should('be.visible');
      cy.get('#validationStatus').should('be.visible');
    });
  });

  describe('Results Interface', () => {
    it('should display validation results correctly', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      cy.get('#totalElements').should('be.visible');
    });

    it('should enable report export functionality', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      cy.get('button').contains('Export Excel Report').should('be.visible');
    });
  });

  describe('Dashboard Navigation', () => {
    it('should navigate to dashboard successfully', () => {
      cy.get('button').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
      cy.get('.dashboard-container').should('be.visible');
    });
  });
}); 