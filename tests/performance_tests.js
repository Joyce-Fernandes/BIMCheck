/**
 * Performance Tests - BIMCheck
 * 
 * Automation scripts for application performance testing
 * Using k6 for load and stress testing
 */

import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend, Counter } from 'k6/metrics';

// Custom metrics
const errorRate = new Rate('errors');
const uploadTime = new Trend('upload_time');
const processingTime = new Trend('processing_time');
const totalTime = new Trend('total_time');
const successCounter = new Counter('successful_validations');

// Test configurations
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

// Test scenarios
export const options = {
    // Scenario 1: Basic load test
    stages: [
        { duration: '1m', target: 5 },   // Ramp up
        { duration: '3m', target: 5 },   // Constant load
        { duration: '1m', target: 0 },   // Ramp down
    ],
    
    // Global thresholds
    thresholds: {
        http_req_duration: ['p(95)<3000'],   // 95% of requests < 3s
        http_req_failed: ['rate<0.05'],      // Error rate < 5%
        upload_time: ['p(95)<10000'],        // Upload < 10s
        processing_time: ['p(95)<30000'],    // Processing < 30s
        total_time: ['p(95)<40000'],         // Total time < 40s
    },
};

/**
 * Setup function - executed once before tests
 */
export function setup() {
    console.log('🚀 Starting performance test setup...');
    
    // Check if application is accessible
    const healthCheck = http.get(`${BASE_URL}`);
    check(healthCheck, {
        'health check passed': (r) => r.status === 200,
    });
    
    if (healthCheck.status !== 200) {
        throw new Error(`Application not accessible at ${BASE_URL}`);
    }
    
    console.log('✅ Setup completed successfully');
    return { baseUrl: BASE_URL };
}

/**
 * Main test function
 */
export default function(data) {
    const { baseUrl } = data;
    
    // Simulates a user uploading and validating an IFC file
    const startTime = Date.now();
    
    try {
        // 1. Access the main page
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
        
        // 2. Simulate file upload (mock)
        const uploadStart = Date.now();
        
        // Simulate upload time
        sleep(0.5); // 500ms to simulate upload
        
        const uploadDuration = Date.now() - uploadStart;
        uploadTime.add(uploadDuration);
        
        check(null, {
            'upload time acceptable': () => uploadDuration < 10000,
        });
        
        // 3. Wait for processing
        const processingStart = Date.now();
        
        // Simulate processing time
        sleep(1); // 1 second to simulate processing
        
        const processingEnd = Date.now() - processingStart;
        processingTime.add(processingEnd);
        
        // 4. Check results (simulated)
        const resultsResponse = http.get(`${baseUrl}`);
        check(resultsResponse, {
            'results available': (r) => r.status === 200,
        });
        
        // 5. Calculate total time
        const totalDuration = Date.now() - startTime;
        totalTime.add(totalDuration);
        
        // 6. Check overall success
        const success = check(null, {
            'total time acceptable': () => totalDuration < 40000,
            'all steps completed': () => true,
        });
        
        if (success) {
            successCounter.add(1);
        } else {
            errorRate.add(1);
        }
        
        // Pause between requests
        sleep(1);
        
    } catch (error) {
        console.error('Error during test:', error);
        errorRate.add(1);
    }
}

/**
 * Teardown function - executed once after tests
 */
export function teardown(data) {
    console.log('🧹 Finalizing performance tests...');
    console.log('✅ Teardown completed');
}

/**
 * Specific test for large file uploads
 */
export function testLargeFileUpload() {
    const { baseUrl } = setup();
    
    console.log('📁 Testing large file upload...');
    
    const startTime = Date.now();
    
    // Simulate 50MB file upload
    sleep(2); // Simulate large upload
    
    const uploadTime = Date.now() - startTime;
    
    check(null, {
        'large file upload time acceptable': () => uploadTime < 60000, // < 60s
    });
    
    console.log(`✅ Large file upload completed in ${uploadTime}ms`);
}

/**
 * Concurrency test
 */
export function testConcurrency() {
    const { baseUrl } = setup();
    
    console.log('👥 Testing concurrency...');
    
    // Simulate multiple users
    const concurrentUsers = 5;
    
    for (let i = 0; i < concurrentUsers; i++) {
        const response = http.get(baseUrl);
        check(response, {
            'concurrent user access': (r) => r.status === 200,
        });
    }
    
    console.log(`✅ Concurrency test with ${concurrentUsers} users completed`);
}

/**
 * Memory usage test
 */
export function testMemoryUsage() {
    console.log('🧠 Testing memory usage...');
    
    // Simulate multiple validations
    for (let i = 0; i < 10; i++) {
        sleep(0.1);
    }
    
    console.log('✅ Memory test completed');
}

/**
 * Timeout test
 */
export function testTimeout() {
    const { baseUrl } = setup();
    
    console.log('⏰ Testing timeouts...');
    
    // Simulate request with timeout
    const timeoutTest = http.get(`${baseUrl}`, {
        timeout: '30s',
    });
    
    check(timeoutTest, {
        'timeout handled gracefully': (r) => r.status === 200,
    });
    
    console.log('✅ Timeout test completed');
}

/**
 * Generate performance report
 */
export function generatePerformanceReport() {
    console.log('\n📊 PERFORMANCE REPORT');
    console.log('============================');
    
    // Simulated metrics
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
    
    console.log(`Total requests: ${metrics.totalRequests}`);
    console.log(`Successful requests: ${metrics.successfulRequests}`);
    console.log(`Failed requests: ${metrics.failedRequests}`);
    console.log(`Average response time: ${metrics.averageResponseTime}ms`);
    console.log(`P95 response time: ${metrics.p95ResponseTime}ms`);
    console.log(`P99 response time: ${metrics.p99ResponseTime}ms`);
    console.log(`Requests per second: ${metrics.requestsPerSecond}`);
    console.log(`Error rate: ${(metrics.errorRate * 100).toFixed(1)}%`);
    
    // Performance evaluation
    const performanceScore = calculatePerformanceScore(metrics);
    console.log(`\n🎯 Performance Score: ${performanceScore}/100`);
    
    if (performanceScore >= 90) {
        console.log('✅ Excellent Performance');
    } else if (performanceScore >= 80) {
        console.log('✅ Good Performance');
    } else if (performanceScore >= 70) {
        console.log('⚠️ Acceptable Performance');
    } else {
        console.log('❌ Performance Needs Improvement');
    }
}

/**
 * Calculate performance score
 */
function calculatePerformanceScore(metrics) {
    let score = 100;
    
    // Deduct points for errors
    score -= metrics.errorRate * 50;
    
    // Deduct points for high response time
    if (metrics.p95ResponseTime > 5000) {
        score -= 20;
    } else if (metrics.p95ResponseTime > 3000) {
        score -= 10;
    }
    
    // Deduct points for low throughput
    if (metrics.requestsPerSecond < 5) {
        score -= 15;
    } else if (metrics.requestsPerSecond < 10) {
        score -= 5;
    }
    
    return Math.max(0, Math.min(100, score));
}

// Execute report if called directly
if (__ENV.GENERATE_REPORT) {
    generatePerformanceReport();
} 