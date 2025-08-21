const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configurações para captura de screenshots e vídeos
    video: true, // Habilitar vídeo para captura
    screenshotOnRunFailure: true,
    screenshotOnRunFailureOnly: false, // Capturar screenshots mesmo em sucesso
    
    // Timeouts otimizados
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    pageLoadTimeout: 20000,
    
    // Configurações de pastas
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    downloadsFolder: 'cypress/downloads',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Configurações de retry otimizadas
    retries: {
      runMode: 1,
      openMode: 0
    },
    
    // Configurações de performance
    numTestsKeptInMemory: 25,
    experimentalMemoryManagement: true,
    
    setupNodeEvents(on, config) {
      // Implementar plugins do node aqui
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
    },
    
    env: {
      // Variáveis de ambiente para testes
      testUser: 'test@bimcheck.com',
      testPassword: 'test123',
      apiUrl: 'http://localhost:3000',
      // Configurações específicas para BIM
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
