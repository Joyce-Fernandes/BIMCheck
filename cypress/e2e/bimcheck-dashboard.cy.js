describe('BIMCheck Dashboard Tests', () => {
  beforeEach(() => {
    cy.visit('/dashboard');
    cy.wait(2000);
  });

  describe('Dashboard Initialization', () => {
    it('should load dashboard page successfully', () => {
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.dashboard-header').should('be.visible');
      cy.get('.dashboard-main').should('be.visible');
      cy.screenshot('dashboard-loaded');
    });

    it('should display header elements correctly', () => {
      cy.get('.logo-section h1').should('contain', 'BIMCheck');
      cy.get('.logo-section span').should('contain', 'Advanced Dashboard');
      cy.get('.header-actions').should('be.visible');
      cy.screenshot('dashboard-header');
    });
  });

  describe('Navigation Controls', () => {
    it('should have back button to main application', () => {
      cy.get('.btn-secondary').should('contain', 'Back');
      cy.get('.btn-secondary').should('be.visible');
      cy.screenshot('dashboard-navigation');
    });

    it('should have refresh button', () => {
      cy.get('.btn-primary').should('contain', 'Refresh');
      cy.get('.btn-primary').should('be.visible');
    });
  });

  describe('Metrics Display', () => {
    it('should display metrics section', () => {
      cy.get('.metrics-section').should('be.visible');
      cy.get('.metric-card').should('have.length', 4);
      cy.screenshot('dashboard-metrics');
    });

    it('should show metric cards', () => {
      cy.get('.metric-card').each(($card) => {
        cy.wrap($card).should('be.visible');
        cy.wrap($card).find('.metric-icon').should('be.visible');
        cy.wrap($card).find('.metric-content').should('be.visible');
      });
    });

    it('should display metric values', () => {
      cy.get('#totalElements').should('be.visible');
      cy.get('#conformityRate').should('be.visible');
      cy.get('#totalProblems').should('be.visible');
      cy.get('#processingTime').should('be.visible');
    });
  });

  describe('Charts Section', () => {
    it('should display charts section', () => {
      cy.get('.charts-section').should('be.visible');
      cy.get('.chart-container').should('have.length', 2);
      cy.screenshot('dashboard-charts');
    });

    it('should show chart container', () => {
      cy.get('#problemsChart').should('be.visible');
      cy.get('#elementsChart').should('be.visible');
    });

    it('should display chart headers correctly', () => {
      cy.get('.chart-header h3').first().should('contain', 'Problem Distribution');
      cy.get('.chart-header h3').last().should('contain', 'Element Distribution');
    });

    it('should show chart toggle buttons', () => {
      cy.get('.chart-actions').should('have.length', 2);
      cy.get('.btn-chart').should('have.length', 4); // 2 buttons per chart
    });

    it('should have functional chart toggle buttons', () => {
      // Test problems chart toggle buttons
      cy.get('.chart-container').first().find('.btn-chart').first().should('be.visible');
      cy.get('.chart-container').first().find('.btn-chart').last().should('be.visible');
      
      // Test elements chart toggle buttons
      cy.get('.chart-container').last().find('.btn-chart').first().should('be.visible');
      cy.get('.chart-container').last().find('.btn-chart').last().should('be.visible');
    });

    it('should display chart legends', () => {
      // Wait for charts to load
      cy.wait(3000);
      
      // Check if chart canvases are rendered
      cy.get('#problemsChart').should('be.visible');
      cy.get('#elementsChart').should('be.visible');
      cy.screenshot('dashboard-charts-loaded');
    });
  });

  describe('Analysis Section', () => {
    it('should display analysis section', () => {
      cy.get('.analysis-section').should('be.visible');
      cy.get('.analysis-card').should('have.length', 2);
      cy.screenshot('dashboard-analysis');
    });

    it('should display conformity analysis card', () => {
      cy.get('.analysis-card').first().should('be.visible');
      cy.get('.analysis-header h3').first().should('contain', 'Conformity Analysis');
      cy.get('#conformityFilter').should('be.visible');
    });

    it('should display conformity bar', () => {
      cy.get('.conformity-bar').should('be.visible');
      cy.get('#conformityFill').should('be.visible');
      cy.get('#conformityText').should('be.visible');
    });

    it('should display analysis details', () => {
      cy.get('.analysis-details').should('be.visible');
      cy.get('.detail-item').should('have.length', 4);
      cy.get('#totalValidations').should('be.visible');
      cy.get('#successfulValidations').should('be.visible');
      cy.get('#avgProcessingTime').should('be.visible');
      cy.get('#mostCommonIssue').should('be.visible');
    });

    it('should display validation history timeline', () => {
      cy.get('.analysis-card').last().should('be.visible');
      cy.get('.analysis-header h3').last().should('contain', 'Validation History');
      cy.get('#validationTimeline').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should maintain layout on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.dashboard-header').should('be.visible');
      cy.get('.dashboard-main').should('be.visible');
      cy.screenshot('dashboard-desktop-viewport');
    });

    it('should adapt layout for mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.dashboard-header').should('be.visible');
      cy.get('.dashboard-main').should('be.visible');
      cy.screenshot('dashboard-mobile-viewport');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('.dashboard-container').should('be.visible');
      cy.get('.metrics-section').should('be.visible');
      cy.get('.charts-section').should('be.visible');
      cy.screenshot('dashboard-tablet-viewport');
    });

    it('should show metrics responsively on mobile', () => {
      cy.viewport(375, 667);
      cy.get('.metrics-section').should('be.visible');
      cy.get('.metric-card').should('have.length', 4);
      cy.screenshot('dashboard-mobile-metrics');
    });

    it('should display charts responsively on mobile', () => {
      cy.viewport(375, 667);
      cy.get('.charts-section').should('be.visible');
      cy.get('.chart-container').should('have.length', 2);
      cy.screenshot('dashboard-mobile-charts');
    });

    it('should show analysis section responsively on mobile', () => {
      cy.viewport(375, 667);
      cy.get('.analysis-section').should('be.visible');
      cy.get('.analysis-card').should('have.length', 2);
      cy.screenshot('dashboard-mobile-analysis');
    });

    it('should display navigation controls responsively', () => {
      cy.viewport(375, 667);
      cy.get('.btn-secondary').should('contain', 'Back');
      cy.get('.btn-primary').should('contain', 'Refresh');
      cy.screenshot('dashboard-mobile-navigation');
    });
  });

  describe('Integration with Main App', () => {
    it('should navigate from main app to dashboard', () => {
      // Start from main app
      cy.visit('/');
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      
      // Navigate to dashboard
      cy.get('.btn-secondary').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
      cy.get('.dashboard-container').should('be.visible');
    });

    it('should return to main app from dashboard', () => {
      cy.get('.btn-secondary').contains('Back').click();
      cy.url().should('not.include', '/dashboard');
      cy.get('#uploadSection').should('be.visible');
    });
  });
}); 