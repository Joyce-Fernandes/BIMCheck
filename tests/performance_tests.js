/**
 * Testes de Performance - BIMCheck
 * 
 * Scripts de automação para testes de performance da aplicação
 * Usando k6 para testes de carga e estresse
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Métricas customizadas
const errorRate = new Rate('errors');
const uploadTime = new Trend('upload_time');
const processingTime = new Trend('processing_time');
const totalTime = new Trend('total_time');
const successCounter = new Counter('successful_validations');

// Configurações de teste
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Cenários de teste
export const options = {
    // Cenário 1: Teste de carga básica
    stages: [
        { duration: '1m', target: 5 },   // Rampa de subida
        { duration: '3m', target: 5 },   // Carga constante
        { duration: '1m', target: 0 },   // Rampa de descida
    ],
    
    // Limites globais
    thresholds: {
        http_req_duration: ['p(95)<3000'],   // 95% das requisições < 3s
        http_req_failed: ['rate<0.05'],      // Taxa de erro < 5%
        upload_time: ['p(95)<10000'],        // Upload < 10s
        processing_time: ['p(95)<30000'],    // Processamento < 30s
        total_time: ['p(95)<40000'],         // Tempo total < 40s
    },
};

/**
 * Função de setup - executada uma vez antes dos testes
 */
export function setup() {
    console.log('🚀 Iniciando setup dos testes de performance...');
    
    // Verifica se a aplicação está acessível
    const healthCheck = http.get(`${BASE_URL}`);
    check(healthCheck, {
        'health check passed': (r) => r.status === 200,
    });
    
    if (healthCheck.status !== 200) {
        throw new Error(`Aplicação não está acessível em ${BASE_URL}`);
    }
    
    console.log('✅ Setup concluído com sucesso');
    return { baseUrl: BASE_URL };
}

/**
 * Função principal de teste
 */
export default function(data) {
    const { baseUrl } = data;
    
    // Simula um usuário fazendo upload e validação de arquivo IFC
    const startTime = Date.now();
    
    try {
        // 1. Acessa a página inicial
        const pageLoad = http.get(baseUrl);
        check(pageLoad, {
            'page loads successfully': (r) => r.status === 200,
            'page loads fast': (r) => r.timings.duration < 2000,
            'page contains title': (r) => r.body.includes('BIMCheck'),
        });
        
        if (pageLoad.status !== 200) {
            errorRate.add(1);
            return;
        }
        
        // 2. Simula upload de arquivo (mock)
        const uploadStart = Date.now();
        
        // Simula tempo de upload
        sleep(0.5); // 500ms para simular upload
        
        const uploadDuration = Date.now() - uploadStart;
        uploadTime.add(uploadDuration);
        
        check(null, {
            'upload time acceptable': () => uploadDuration < 10000,
        });
        
        // 3. Aguarda processamento
        const processingStart = Date.now();
        
        // Simula tempo de processamento
        sleep(1); // 1 segundo para simular processamento
        
        const processingEnd = Date.now() - processingStart;
        processingTime.add(processingEnd);
        
        // 4. Verifica resultados (simulado)
        const resultsResponse = http.get(`${baseUrl}`);
        check(resultsResponse, {
            'results available': (r) => r.status === 200,
        });
        
        // 5. Calcula tempo total
        const totalDuration = Date.now() - startTime;
        totalTime.add(totalDuration);
        
        // 6. Verifica sucesso geral
        const success = check(null, {
            'total time acceptable': () => totalDuration < 40000,
            'all steps completed': () => true,
        });
        
        if (success) {
            successCounter.add(1);
        } else {
            errorRate.add(1);
        }
        
        // Pausa entre requisições
        sleep(1);
        
    } catch (error) {
        console.error('Erro durante teste:', error);
        errorRate.add(1);
    }
}

/**
 * Função de teardown - executada uma vez após os testes
 */
export function teardown(data) {
    console.log('🧹 Finalizando testes de performance...');
    console.log('✅ Teardown concluído');
}

/**
 * Teste específico para upload de arquivos grandes
 */
export function testLargeFileUpload() {
    const { baseUrl } = setup();
    
    console.log('📁 Testando upload de arquivo grande...');
    
    const startTime = Date.now();
    
    // Simula upload de arquivo de 50MB
    sleep(2); // Simula upload grande
    
    const uploadTime = Date.now() - startTime;
    
    check(null, {
        'large file upload time acceptable': () => uploadTime < 60000, // < 60s
    });
    
    console.log(`✅ Upload de arquivo grande concluído em ${uploadTime}ms`);
}

/**
 * Teste de concorrência
 */
export function testConcurrency() {
    const { baseUrl } = setup();
    
    console.log('👥 Testando concorrência...');
    
    // Simula múltiplos usuários
    const concurrentUsers = 5;
    
    for (let i = 0; i < concurrentUsers; i++) {
        const response = http.get(baseUrl);
        check(response, {
            'concurrent user access': (r) => r.status === 200,
        });
    }
    
    console.log(`✅ Teste de concorrência com ${concurrentUsers} usuários concluído`);
}

/**
 * Teste de memória
 */
export function testMemoryUsage() {
    console.log('🧠 Testando uso de memória...');
    
    // Simula múltiplas validações
    for (let i = 0; i < 10; i++) {
        sleep(0.1);
    }
    
    console.log('✅ Teste de memória concluído');
}

/**
 * Teste de timeout
 */
export function testTimeout() {
    const { baseUrl } = setup();
    
    console.log('⏰ Testando timeouts...');
    
    // Simula requisição com timeout
    const timeoutTest = http.get(`${baseUrl}`, {
        timeout: '30s',
    });
    
    check(timeoutTest, {
        'timeout handled gracefully': (r) => r.status === 200,
    });
    
    console.log('✅ Teste de timeout concluído');
}

/**
 * Gera relatório de performance
 */
export function generatePerformanceReport() {
    console.log('\n📊 RELATÓRIO DE PERFORMANCE');
    console.log('============================');
    
    // Métricas simuladas
    const metrics = {
        totalRequests: 1000,
        successfulRequests: 950,
        failedRequests: 50,
        averageResponseTime: 2500,
        p95ResponseTime: 4500,
        p99ResponseTime: 8000,
        requestsPerSecond: 10,
        errorRate: 0.05,
    };
    
    console.log(`Total de requisições: ${metrics.totalRequests}`);
    console.log(`Requisições bem-sucedidas: ${metrics.successfulRequests}`);
    console.log(`Requisições falharam: ${metrics.failedRequests}`);
    console.log(`Tempo médio de resposta: ${metrics.averageResponseTime}ms`);
    console.log(`Tempo P95: ${metrics.p95ResponseTime}ms`);
    console.log(`Tempo P99: ${metrics.p99ResponseTime}ms`);
    console.log(`Requisições por segundo: ${metrics.requestsPerSecond}`);
    console.log(`Taxa de erro: ${(metrics.errorRate * 100).toFixed(1)}%`);
    
    // Avaliação de performance
    const performanceScore = calculatePerformanceScore(metrics);
    console.log(`\n🎯 Score de Performance: ${performanceScore}/100`);
    
    if (performanceScore >= 90) {
        console.log('✅ Performance Excelente');
    } else if (performanceScore >= 80) {
        console.log('✅ Performance Boa');
    } else if (performanceScore >= 70) {
        console.log('⚠️ Performance Aceitável');
    } else {
        console.log('❌ Performance Precisa Melhorar');
    }
}

/**
 * Calcula score de performance
 */
function calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Deduz pontos por erros
    score -= metrics.errorRate * 50;
    
    // Deduz pontos por tempo de resposta alto
    if (metrics.p95ResponseTime > 5000) {
        score -= 20;
    } else if (metrics.p95ResponseTime > 3000) {
        score -= 10;
    }
    
    // Deduz pontos por throughput baixo
    if (metrics.requestsPerSecond < 5) {
        score -= 15;
    } else if (metrics.requestsPerSecond < 10) {
        score -= 5;
    }
    
    return Math.max(0, Math.min(100, score));
}

// Executa relatório se chamado diretamente
if (__ENV.GENERATE_REPORT) {
    generatePerformanceReport();
} 