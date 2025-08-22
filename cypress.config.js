const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Screenshot and video capture settings
    video: true, // Enable video capture
    screenshotOnRunFailure: true,
    screenshotOnRunFailureOnly: false, // Capture screenshots even on success
    
    // Optimized timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 20000,
    
    // Folder settings
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Optimized retry settings
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    // Performance settings
    numTestsKeptInMemory: 25,
    experimentalMemoryManagement: true,
    
    setupNodeEvents(on, config) {
      // Implement node plugins here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },
    
    env: {
      // Environment variables for tests
      testUser: 'test@bimcheck.com',
      testPassword: 'test123',
      apiUrl: 'http://localhost:3000',
      // BIM-specific settings
      maxFileSize: 50 * 1024 * 1024, // 50MB
      supportedFormats: ['.ifc', '.IFC'],
      validationTimeout: 30000,
    },
  },
  component: {
    devServer: {
      framework: 'create-react-app',
      bundler: 'webpack',
    },
  },
});
