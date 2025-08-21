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
      cy.screenshot('main-app-loaded');
    });

    it('should render all essential interface components', () => {
      cy.get('#uploadSection').should('be.visible');
      cy.get('#fileInput').should('exist');
      cy.get('.upload-btn').should('be.visible');
      cy.get('.info-section').should('be.visible');
      cy.screenshot('interface-components');
    });
  });

  describe('Examples Section', () => {
    it('should display examples section correctly', () => {
      cy.get('.examples-section').should('be.visible');
      cy.get('.examples-container h3').should('contain', 'Example Files');
      cy.get('.examples-grid').should('be.visible');
      cy.get('.example-item').should('have.length', 3);
      cy.screenshot('examples-section');
    });

    it('should load valid example correctly', () => {
      cy.get('.example-item').first().find('.btn-example').click();
      cy.get('#progressSection', { timeout: 10000 }).should('be.visible');
      cy.get('#resultsSection', { timeout: 15000 }).should('be.visible');
      cy.get('#totalElements').should('contain', '25');
      cy.get('#totalIssues').should('contain', '0');
      cy.get('#validationStatus').should('contain', 'Approved');
      cy.screenshot('valid-example-results');
    });

    it('should load problematic example correctly', () => {
      cy.get('.example-item').eq(1).find('.btn-example').click();
      cy.get('#progressSection', { timeout: 10000 }).should('be.visible');
      cy.get('#resultsSection', { timeout: 15000 }).should('be.visible');
      cy.get('#totalElements').should('contain', '18');
      cy.get('#totalIssues').should('contain', '5');
      cy.get('#validationStatus').should('contain', 'Issues Found');
      cy.screenshot('problematic-example-results');
    });

    it('should load residential example correctly', () => {
      cy.get('.example-item').last().find('.btn-example').click();
      cy.get('#progressSection', { timeout: 10000 }).should('be.visible');
      cy.get('#resultsSection', { timeout: 15000 }).should('be.visible');
      cy.get('#totalElements').should('contain', '35');
      cy.get('#totalIssues').should('contain', '2');
      cy.get('#validationStatus').should('contain', 'Issues Found');
      cy.screenshot('residential-example-results');
    });

    it('should navigate to dashboard with example data', () => {
      // Load valid example
      cy.get('.example-item').first().find('.btn-example').click();
      cy.get('#resultsSection', { timeout: 15000 }).should('be.visible');
      
      // Navigate to dashboard
      cy.get('.btn-secondary').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
      cy.get('.dashboard-container').should('be.visible');
      
      // Verify example data is in dashboard
      cy.get('.metric-card').should('be.visible');
      cy.screenshot('dashboard-from-example');
    });
  });

  describe('File Upload Process', () => {
    it('should accept IFC file and show progress', () => {
      // Upload file
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      
      // Verify processing started
      cy.get('#progressSection', { timeout: 15000 }).should('be.visible');
      cy.get('.progress-bar').should('be.visible');
      cy.screenshot('file-upload-progress');
    });

    it('should complete validation and show results', () => {
      // Upload and wait for results
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      
      // Verify basic result elements
      cy.get('#totalElements').should('be.visible');
      cy.get('#totalIssues').should('be.visible');
      cy.get('#validationStatus').should('be.visible');
      cy.screenshot('file-validation-results');
    });
  });

  describe('Results Interface', () => {
    beforeEach(() => {
      // Prepare validation
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
    });

    it('should display validation results correctly', () => {
      cy.get('#resultsSection').should('be.visible');
      cy.get('#totalElements').should('be.visible');
      cy.get('#totalIssues').should('be.visible');
      cy.get('#validationStatus').should('be.visible');
    });

    it('should enable report export functionality', () => {
      cy.get('.btn-primary').should('be.visible');
      cy.get('.btn-primary').should('contain', 'Export Excel Report');
    });

    it('should allow starting new validation', () => {
      cy.get('.btn-secondary').first().should('contain', 'New Validation');
      cy.get('.btn-secondary').first().click();
      cy.get('#uploadSection').should('be.visible');
    });
  });

  describe('Dashboard Navigation', () => {
    beforeEach(() => {
      // Prepare validation to have access to Dashboard button
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
    });

    it('should navigate to dashboard successfully', () => {
      cy.get('.btn-secondary').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
      cy.get('.dashboard-container').should('be.visible');
    });
  });

  describe('Responsive Design', () => {
    it('should maintain functionality on desktop viewport', () => {
      cy.viewport(1920, 1080);
      cy.get('#uploadSection').should('be.visible');
      cy.get('.upload-area').should('be.visible');
      cy.screenshot('desktop-viewport');
    });

    it('should maintain functionality on mobile viewport', () => {
      cy.viewport(375, 667);
      cy.get('#uploadSection').should('be.visible');
      cy.get('.upload-area').should('be.visible');
      cy.screenshot('mobile-viewport');
    });

    it('should display correctly on tablet viewport', () => {
      cy.viewport(768, 1024);
      cy.get('#uploadSection').should('be.visible');
      cy.get('.upload-area').should('be.visible');
      cy.get('.examples-section').should('be.visible');
      cy.screenshot('tablet-viewport');
    });

    it('should show responsive navigation on mobile', () => {
      cy.viewport(375, 667);
      cy.get('body').should('be.visible');
      cy.get('h1').should('contain', 'BIMCheck');
      cy.get('.upload-area').should('be.visible');
      cy.screenshot('mobile-navigation');
    });

    it('should display examples section responsively', () => {
      cy.viewport(375, 667);
      cy.get('.examples-section').should('be.visible');
      cy.get('.examples-container h3').should('contain', 'Example Files');
      cy.get('.examples-grid').should('be.visible');
      cy.screenshot('mobile-examples-section');
    });

    it('should show info section responsively', () => {
      cy.viewport(375, 667);
      cy.get('.info-section').should('be.visible');
      cy.get('.info-grid').should('be.visible');
      cy.get('.info-item').should('have.length', 3);
      cy.screenshot('mobile-info-section');
    });
  });

  describe('Progress Tracking', () => {
    it('should show progress bar during file processing', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      
      // Verify progress section
      cy.get('#progressSection').should('be.visible');
      cy.get('.progress-bar').should('be.visible');
      cy.get('.progress-fill').should('be.visible');
    });

    it('should update progress text during processing', () => {
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      
      // Verify progress text
      cy.get('#progressText').should('be.visible');
      cy.get('#progressText').should('not.be.empty');
    });
  });

  describe('Error Handling', () => {
    it('should handle file upload errors gracefully', () => {
      // Test with invalid file
      cy.get('#fileInput').selectFile('cypress/fixtures/invalid.txt', { force: true });
      
      // Wait a bit to see if there's processing
      cy.wait(2000);
      
      // Verify application doesn't break - may be in progress or results
      cy.get('body').should('be.visible');
    });

    it('should handle corrupted files gracefully', () => {
      // Test with corrupted file
      cy.get('#fileInput').selectFile('cypress/fixtures/corrupted.ifc', { force: true });
      
      // Wait a bit to see if there's processing
      cy.wait(2000);
      
      // Verify application doesn't break - may be in progress or results
      cy.get('body').should('be.visible');
    });
  });

  describe('User Interface Elements', () => {
    it('should display upload area correctly', () => {
      cy.get('.upload-area').should('be.visible');
      cy.get('.upload-icon').should('be.visible');
      cy.get('.upload-btn').should('be.visible');
    });

    it('should display info section with validation parameters', () => {
      cy.get('.info-section').should('be.visible');
      cy.get('.info-grid').should('be.visible');
      cy.get('.info-item').should('have.length', 3);
    });

    it('should show validation parameters correctly', () => {
      cy.get('.info-item').each(($item) => {
        cy.wrap($item).find('h4').should('be.visible');
        cy.wrap($item).find('p').should('be.visible');
      });
    });
  });

  describe('Navigation Flow', () => {
    it('should complete full validation workflow', () => {
      // 1. Upload file
      cy.get('#fileInput').selectFile('cypress/fixtures/sample.ifc', { force: true });
      
      // 2. Wait for processing
      cy.get('#progressSection', { timeout: 15000 }).should('be.visible');
      
      // 3. Wait for results
      cy.get('#resultsSection', { timeout: 30000 }).should('be.visible');
      
      // 4. Verify results
      cy.get('#totalElements').should('not.contain', '0');
      cy.get('#totalIssues').should('be.visible');
      
      // 5. Navigate to dashboard
      cy.get('.btn-secondary').contains('Dashboard').click();
      cy.url().should('include', '/dashboard');
      
      // 6. Return to main application
      cy.visit('/');
      cy.get('#uploadSection').should('be.visible');
    });
  });
}); 