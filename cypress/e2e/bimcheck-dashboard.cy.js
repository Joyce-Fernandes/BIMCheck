describe('BIMCheck Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.wait(2000);
  });

  describe('Dashboard Initialization', () => {
    it('should load dashboard page successfully', () => {
      cy.get('body').should('be.visible');
      cy.get('.dashboard-container').should('be.visible');
      cy.get('h1').should('contain', 'BIMCheck Dashboard');
    });

    it('should display header elements correctly', () => {
      cy.get('.dashboard-header').should('be.visible');
      cy.get('.dashboard-title').should('contain', 'BIMCheck Dashboard');
      cy.get('.dashboard-subtitle').should('be.visible');
    });
  });

  describe('Navigation Controls', () => {
    it('should have back button to main application', () => {
      cy.get('.btn-secondary').contains('Back').should('be.visible');
      cy.get('.btn-secondary').first().click();
      cy.url().should('not.include', '/dashboard');
    });

    it('should have refresh button', () => {
      cy.get('.btn-secondary').contains('Refresh').should('be.visible');
    });
  });

  describe('Metrics Display', () => {
    it('should display metrics section', () => {
      cy.get('.metrics-section').should('be.visible');
      cy.get('.metric-card').should('have.length.at.least', 1);
    });

    it('should show metric cards', () => {
      cy.get('.metric-card').should('be.visible');
      cy.get('.metric-value').should('be.visible');
    });
  });

  describe('Charts Section', () => {
    it('should display charts section', () => {
      cy.get('.charts-section').should('be.visible');
      cy.get('.chart-container').should('be.visible');
    });

    it('should show chart container', () => {
      cy.get('.chart-container').should('be.visible');
      cy.get('canvas').should('be.visible');
    });
  });
}); 