/**
 * Advanced Dashboard - BIMCheck
 * Data analysis and visualization features
 */

// Dashboard data - loaded dynamically
let dashboardData = {
  totalElements: 0,
  conformityRate: 0,
  totalProblems: 0,
  processingTime: 0,
  problemsByCategory: {
    'Material': 0,
    'Dimensions': 0,
    'Standard Code': 0
  },
  elementsByCategory: {
    'Walls': 0,
    'Doors': 0,
    'Windows': 0,
    'Floors': 0,
    'Ceiling': 0,
    'Structure': 0
  },
  recentValidations: [],
  validationHistory: []
};

// Global variables for charts
let problemsChart = null;
let elementsChart = null;
let currentProblemsChartView = 'pie';
let currentElementsChartView = 'doughnut';

// Dashboard initialization
document.addEventListener('DOMContentLoaded', function() {
  initializeDashboard();
  loadCharts();
  loadRecentValidations();
  loadValidationHistory();
  updateMetrics();
  
  // Add event listeners for analysis filters
  const conformityFilter = document.getElementById('conformityFilter');
  if (conformityFilter) {
    conformityFilter.addEventListener('change', filterAnalysis);
  }
});

/**
 * Initialize the dashboard
 */
function initializeDashboard() {
  console.log('Dashboard initialized');
  
  // Load saved data from localStorage
  loadDashboardData();
  
  // Add listeners for interactivity
  document.addEventListener('keydown', function(e) {
    if (e.key === 'F5') {
      e.preventDefault();
      refreshDashboard();
    }
  });
}

/**
 * Load dashboard data from localStorage
 */
function loadDashboardData() {
  try {
    const savedData = localStorage.getItem('bimcheck_dashboard_data');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      dashboardData = { ...dashboardData, ...parsedData };
      console.log('Dashboard data loaded:', dashboardData);
    } else {
      console.log('No saved data found, using default data');
      // Create default data for demonstration
      dashboardData = {
        totalElements: 150,
        conformityRate: 85,
        totalProblems: 12,
        processingTime: 3.2,
        problemsByCategory: {
          'Material': 5,
          'Dimensions': 4,
          'Standard Code': 3
        },
        elementsByCategory: {
          'Walls': 45,
          'Doors': 12,
          'Windows': 18,
          'Floors': 25,
          'Ceiling': 20,
          'Structure': 30
        },
        recentValidations: [
          {
            id: 1,
            date: '2024-01-15 14:30',
            title: 'Residential Project A',
            description: 'Validation completed successfully',
            status: 'success',
            elements: 150,
            problems: 5
          },
          {
            id: 2,
            date: '2024-01-14 16:45',
            title: 'Commercial Building B',
            description: 'Some issues found in materials',
            status: 'warning',
            elements: 200,
            problems: 12
          },
          {
            id: 3,
            date: '2024-01-13 10:20',
            title: 'Industrial Complex C',
            description: 'Multiple validation errors detected',
            status: 'error',
            elements: 300,
            problems: 25
          }
        ],
        validationHistory: [
          {
            date: '2024-01-15',
            title: 'Residential Project A',
            description: '150 elements validated, 5 issues found'
          },
          {
            date: '2024-01-14',
            title: 'Commercial Building B',
            description: '200 elements validated, 12 issues found'
          },
          {
            date: '2024-01-13',
            title: 'Industrial Complex C',
            description: '300 elements validated, 25 issues found'
          },
          {
            date: '2024-01-12',
            title: 'Office Building D',
            description: '180 elements validated, 8 issues found'
          },
          {
            date: '2024-01-11',
            title: 'Shopping Center E',
            description: '250 elements validated, 15 issues found'
          }
        ]
      };
    }
  } catch (error) {
    console.error('Error loading dashboard data:', error);
  }
}

/**
 * Update metrics display
 */
function updateMetrics() {
  document.getElementById('totalElements').textContent = dashboardData.totalElements;
  document.getElementById('conformityRate').textContent = `${dashboardData.conformityRate}%`;
  document.getElementById('totalProblems').textContent = dashboardData.totalProblems;
  document.getElementById('processingTime').textContent = `${dashboardData.processingTime}s`;
  
  // Update analysis section
  updateAnalysisSection();
}

/**
 * Load and initialize charts
 */
function loadCharts() {
  loadProblemsChart();
  loadElementsChart();
}

/**
 * Load problems distribution chart
 */
function loadProblemsChart() {
  const ctx = document.getElementById('problemsChart').getContext('2d');
  
  const data = {
    labels: Object.keys(dashboardData.problemsByCategory),
    datasets: [{
      data: Object.values(dashboardData.problemsByCategory),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const config = {
    type: currentProblemsChartView,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  };

  if (problemsChart) {
    problemsChart.destroy();
  }
  
  problemsChart = new Chart(ctx, config);
}

/**
 * Load elements distribution chart
 */
function loadElementsChart() {
  const ctx = document.getElementById('elementsChart').getContext('2d');
  
  const data = {
    labels: Object.keys(dashboardData.elementsByCategory),
    datasets: [{
      data: Object.values(dashboardData.elementsByCategory),
      backgroundColor: [
        '#4BC0C0',
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#9966FF',
        '#FF9F40'
      ],
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  const config = {
    type: currentElementsChartView,
    data: data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 20,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.parsed;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
              return `${label}: ${value} (${percentage}%)`;
            }
          }
        }
      }
    }
  };

  if (elementsChart) {
    elementsChart.destroy();
  }
  
  elementsChart = new Chart(ctx, config);
}

/**
 * Toggle chart view (pie/bar)
 */
function toggleChartView(type) {
  currentProblemsChartView = type;
  loadProblemsChart();
}

/**
 * Toggle element chart view (doughnut/bar)
 */
function toggleElementChartView(type) {
  currentElementsChartView = type;
  loadElementsChart();
}

/**
 * Load recent validations
 */
function loadRecentValidations() {
  const container = document.getElementById('recentValidations');
  
  if (!dashboardData.recentValidations || dashboardData.recentValidations.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-inbox"></i>
        <h4>No recent validations</h4>
        <p>Start validating IFC files to see results here</p>
      </div>
    `;
    return;
  }

  const validationsHTML = dashboardData.recentValidations.map(validation => `
    <div class="recent-item">
      <div class="recent-info">
        <div class="recent-icon ${validation.status}">
          <i class="fas ${getStatusIcon(validation.status)}"></i>
        </div>
        <div class="recent-details">
          <h4>${validation.title}</h4>
          <p>${validation.description}</p>
        </div>
      </div>
      <div class="recent-status ${validation.status}">
        ${validation.elements} elements, ${validation.problems} issues
      </div>
    </div>
  `).join('');

  container.innerHTML = validationsHTML;
}

/**
 * Load validation history
 */
function loadValidationHistory() {
  const container = document.getElementById('validationTimeline');
  
  if (!dashboardData.validationHistory || dashboardData.validationHistory.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-history"></i>
        <h4>No validation history</h4>
        <p>Validation history will appear here</p>
      </div>
    `;
    return;
  }

  const timelineHTML = dashboardData.validationHistory.map(item => `
    <div class="timeline-item">
      <div class="timeline-date">${item.date}</div>
      <div class="timeline-title">${item.title}</div>
      <div class="timeline-description">${item.description}</div>
    </div>
  `).join('');

  container.innerHTML = timelineHTML;
}

/**
 * Get status icon
 */
function getStatusIcon(status) {
  const icons = {
    'success': 'fa-check-circle',
    'warning': 'fa-exclamation-triangle',
    'error': 'fa-times-circle',
    'info': 'fa-info-circle'
  };
  return icons[status] || 'fa-info-circle';
}

/**
 * Refresh dashboard
 */
function refreshDashboard() {
  console.log('Refreshing dashboard...');
  
  // Reload data
  loadDashboardData();
  
  // Update displays
  updateMetrics();
  loadCharts();
  loadRecentValidations();
  loadValidationHistory();
  
  // Show refresh feedback
  const refreshBtn = document.querySelector('.btn-primary');
  const originalText = refreshBtn.innerHTML;
  
  refreshBtn.innerHTML = '<i class="fas fa-check"></i> Refreshed';
  refreshBtn.classList.add('success');
  
  setTimeout(() => {
    refreshBtn.innerHTML = originalText;
    refreshBtn.classList.remove('success');
  }, 2000);
}

/**
 * Clear validation history
 */
function clearHistory() {
  if (confirm('Are you sure you want to clear all validation history? This action cannot be undone.')) {
    dashboardData.recentValidations = [];
    dashboardData.validationHistory = [];
    
    // Save to localStorage
    localStorage.setItem('bimcheck_dashboard_data', JSON.stringify(dashboardData));
    
    // Update displays
    loadRecentValidations();
    loadValidationHistory();
    
    console.log('Validation history cleared');
  }
}

/**
 * Export dashboard data
 */
function exportDashboardData() {
  try {
    const dataStr = JSON.stringify(dashboardData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `bimcheck_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    console.log('Dashboard data exported');
  } catch (error) {
    console.error('Error exporting dashboard data:', error);
    alert('Error exporting dashboard data. Please try again.');
  }
}

/**
 * Update analysis section
 */
function updateAnalysisSection() {
  // Update conformity bar
  const conformityFill = document.getElementById('conformityFill');
  const conformityText = document.getElementById('conformityText');
  
  if (conformityFill && conformityText) {
    conformityFill.style.width = `${dashboardData.conformityRate}%`;
    conformityText.textContent = `${dashboardData.conformityRate}% Conformity`;
  }
  
  // Update analysis details
  const stats = getDashboardStats();
  
  const totalValidationsEl = document.getElementById('totalValidations');
  const successfulValidationsEl = document.getElementById('successfulValidations');
  const avgProcessingTimeEl = document.getElementById('avgProcessingTime');
  const mostCommonIssueEl = document.getElementById('mostCommonIssue');
  
  if (totalValidationsEl) totalValidationsEl.textContent = stats.totalValidations;
  if (successfulValidationsEl) successfulValidationsEl.textContent = stats.successfulValidations;
  if (avgProcessingTimeEl) avgProcessingTimeEl.textContent = `${dashboardData.processingTime}s`;
  
  // Find most common issue
  const issues = dashboardData.problemsByCategory;
  const mostCommonIssue = Object.keys(issues).reduce((a, b) => issues[a] > issues[b] ? a : b);
  if (mostCommonIssueEl) mostCommonIssueEl.textContent = mostCommonIssue;
}

/**
 * Filter analysis data
 */
function filterAnalysis() {
  const filter = document.getElementById('conformityFilter').value;
  console.log('Filtering analysis by:', filter);
  
  // Here you can implement different filtering logic based on the selected filter
  // For now, we'll just update the display
  updateAnalysisSection();
}

/**
 * Get dashboard statistics
 */
function getDashboardStats() {
  const totalValidations = dashboardData.recentValidations.length;
  const successfulValidations = dashboardData.recentValidations.filter(v => v.status === 'success').length;
  const averageConformity = totalValidations > 0 
    ? (dashboardData.recentValidations.reduce((sum, v) => sum + (v.elements - v.problems) / v.elements * 100, 0) / totalValidations).toFixed(1)
    : 0;
  
  return {
    totalValidations,
    successfulValidations,
    averageConformity,
    totalElements: dashboardData.totalElements,
    totalProblems: dashboardData.totalProblems
  };
}

// Export functions for global use
window.refreshDashboard = refreshDashboard;
window.clearHistory = clearHistory;
window.exportDashboardData = exportDashboardData;
window.toggleChartView = toggleChartView;
window.toggleElementChartView = toggleElementChartView; 