/**
 * InnoVibe Mobility CTO Portal - Visualization Utility Wrapper (Phase 1 & Software Development Module)
 */

window.portalCharts = {
  // Store chart instances to clear them during routing redraws
  instances: {},

  destroyAll() {
    Object.keys(this.instances).forEach(key => {
      if (this.instances[key]) {
        this.instances[key].destroy();
        this.instances[key] = null;
      }
    });
    this.instances = {};
  },

  initSprintCompletionChart() {
    const ctx = document.getElementById('sprintCompletionChart');
    if (!ctx) return;
    if (this.instances.sprintCompletion) {
      try { this.instances.sprintCompletion.destroy(); } catch(e) {}
    }

    const sprintInsights = {
      'Completed': '23 Stories (82%) completed on schedule in Sprint 43. Delivery velocity is +14% above sprint baseline.',
      'Code Review': '3 Stories (11%) pending PR approval from Tech Leads.',
      'Remaining': '2 Stories (7%) in active development pipeline.'
    };

    this.instances.sprintCompletion = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Code Review', 'Remaining'],
        datasets: [{
          data: [82, 11, 7],
          backgroundColor: ['#0071E3', '#FF9500', '#E5E5EA'],
          hoverBackgroundColor: ['#005BB5', '#E08200', '#D1D1D6'],
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '78%',
        plugins: {
          legend: { display: false },
          tooltip: {
            enabled: true,
            mode: 'nearest',
            intersect: true,
            backgroundColor: 'rgba(29, 29, 31, 0.95)',
            titleColor: '#FFFFFF',
            bodyColor: '#E5E5EA',
            borderColor: 'rgba(0, 113, 227, 0.4)',
            borderWidth: 1.5,
            padding: 12,
            cornerRadius: 10,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
              size: 12,
              weight: '700'
            },
            bodyFont: {
              family: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              size: 11,
              weight: '500'
            },
            callbacks: {
              title: function(context) {
                if (!context || !context.length) return '';
                const label = context[0].label || context[0].chart.data.labels[context[0].dataIndex] || '';
                return 'Sprint Metric: ' + label;
              },
              label: function(context) {
                const label = context.label || context.chart.data.labels[context.dataIndex] || '';
                const val = context.raw;
                const counts = val === 82 ? '23 Stories' : val === 11 ? '3 Stories' : '2 Stories';
                return ' ' + label + ': ' + val + '% (' + counts + ')';
              },
              afterBody: function(context) {
                if (!context || !context.length) return '';
                const label = context[0].label || context[0].chart.data.labels[context[0].dataIndex] || '';
                if (sprintInsights[label]) {
                  return '\nExecutive Trend Insight:\n' + sprintInsights[label];
                }
                return '\nExecutive Baseline: Operating within optimal velocity parameters.';
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: false,
          duration: 1500,
          easing: 'easeInOutQuart'
        }
      }
    });
  },

  initDashboardCharts() {
    this.destroyAll();

    // Chart colors matching the reference video (Apple Blue, Purple, Green, Amber, Red)
    const colors = {
      blue: '#007aff',
      blueLight: 'rgba(0, 122, 255, 0.1)',
      purple: '#af52de',
      purpleLight: 'rgba(175, 82, 222, 0.1)',
      green: '#34c759',
      greenLight: 'rgba(52, 199, 89, 0.1)',
      orange: '#ff9500',
      red: '#ff3b30',
      grey: '#8e8e93',
      grid: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      text: document.documentElement.getAttribute('data-theme') === 'dark' ? '#aeaeb2' : '#636366'
    };

    // 1. Sprint Velocity & Commitment Chart (Dual Bar)
    const ctxVelocity = document.getElementById('sprintVelocityChart');
    if (ctxVelocity) {
      this.instances.velocity = new Chart(ctxVelocity, {
        type: 'bar',
        data: {
          labels: ['Sprint 38', 'Sprint 39', 'Sprint 40', 'Sprint 41', 'Sprint 42'],
          datasets: [
            {
              label: 'Committed Story Points',
              data: [82, 85, 90, 88, 92],
              backgroundColor: colors.purple,
              borderRadius: 4
            },
            {
              label: 'Completed Story Points',
              data: [80, 84, 86, 88, 90],
              backgroundColor: colors.blue,
              borderRadius: 4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: colors.text, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // 2. Code Quality & Security Score (Radar / Doughnut Center)
    const ctxQuality = document.getElementById('codeQualityChart');
    if (ctxQuality) {
      this.instances.quality = new Chart(ctxQuality, {
        type: 'doughnut',
        data: {
          labels: ['Code Maintainability', 'Test Coverage', 'Security Baseline', 'Technical Debt Paydown'],
          datasets: [{
            data: [94, 82, 98, 72],
            backgroundColor: [colors.blue, colors.green, colors.purple, colors.orange],
            borderWidth: 2,
            borderColor: 'transparent'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: {
            legend: { position: 'right', labels: { color: colors.text, boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          }
        }
      });
    }

    // 3. Deployment Timeline (Line Chart)
    const ctxTimeline = document.getElementById('deploymentTimelineChart');
    if (ctxTimeline) {
      this.instances.timeline = new Chart(ctxTimeline, {
        type: 'line',
        data: {
          labels: ['Jul 1', 'Jul 7', 'Jul 14', 'Jul 21', 'Jul 28', 'Aug 2'],
          datasets: [
            {
              label: 'Production Builds',
              data: [12, 18, 14, 22, 19, 24],
              borderColor: colors.green,
              backgroundColor: colors.greenLight,
              tension: 0.3,
              fill: true,
              borderWidth: 2,
              pointRadius: 3
            },
            {
              label: 'Staging Builds',
              data: [25, 30, 28, 35, 32, 38],
              borderColor: colors.blue,
              backgroundColor: colors.blueLight,
              tension: 0.3,
              fill: true,
              borderWidth: 2,
              pointRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: colors.text, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // 4. Bug Trends & SLA Resolution (Stacked Bar)
    const ctxBugs = document.getElementById('bugTrendsChart');
    if (ctxBugs) {
      this.instances.bugs = new Chart(ctxBugs, {
        type: 'bar',
        data: {
          labels: ['Week 27', 'Week 28', 'Week 29', 'Week 30', 'Week 31'],
          datasets: [
            {
              label: 'Critical SLA Bugs',
              data: [6, 4, 3, 5, 2],
              backgroundColor: colors.red,
              borderRadius: 3
            },
            {
              label: 'Medium Severity',
              data: [12, 15, 8, 10, 7],
              backgroundColor: colors.orange,
              borderRadius: 3
            },
            {
              label: 'Resolved Bugs',
              data: [15, 18, 11, 14, 12],
              backgroundColor: colors.green,
              borderRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: colors.text, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }
  },

  // Setup Software Development Module Specific Charts
  initSoftwareDevelopmentCharts() {
    this.destroyAll();

    const colors = {
      blue: '#007aff',
      blueLight: 'rgba(0, 122, 255, 0.1)',
      purple: '#af52de',
      purpleLight: 'rgba(175, 82, 222, 0.1)',
      green: '#34c759',
      greenLight: 'rgba(52, 199, 89, 0.1)',
      orange: '#ff9500',
      orangeLight: 'rgba(255, 149, 0, 0.1)',
      red: '#ff3b30',
      grey: '#8e8e93',
      grid: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      text: document.documentElement.getAttribute('data-theme') === 'dark' ? '#aeaeb2' : '#636366'
    };

    // 1. Development Progress (Line/Area tracking milestones)
    const ctxProgress = document.getElementById('devProgressChart');
    if (ctxProgress) {
      this.instances.devProgress = new Chart(ctxProgress, {
        type: 'line',
        data: {
          labels: ['Sprint 38', 'Sprint 39', 'Sprint 40', 'Sprint 41', 'Sprint 42'],
          datasets: [{
            label: 'Milestone Execution Rate',
            data: [65, 72, 78, 83, 86],
            borderColor: colors.blue,
            backgroundColor: colors.blueLight,
            fill: true,
            tension: 0.3,
            borderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, min: 50, max: 100, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // 2. Engineering Velocity (Dual Bar Chart)
    const ctxVelocity = document.getElementById('engVelocityChart');
    if (ctxVelocity) {
      this.instances.engVelocity = new Chart(ctxVelocity, {
        type: 'bar',
        data: {
          labels: ['Sprint 38', 'Sprint 39', 'Sprint 40', 'Sprint 41', 'Sprint 42'],
          datasets: [
            {
              label: 'Commit Frequency (x10)',
              data: [42, 51, 48, 55, 49],
              backgroundColor: colors.purple,
              borderRadius: 3
            },
            {
              label: 'Features Delivered',
              data: [15, 18, 14, 21, 16],
              backgroundColor: colors.blue,
              borderRadius: 3
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: colors.text, boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // 3. Code Quality (Radar Chart mapping compliance indicators)
    const ctxQuality = document.getElementById('devQualityChart');
    if (ctxQuality) {
      this.instances.devQuality = new Chart(ctxQuality, {
        type: 'radar',
        data: {
          labels: ['Maintainability', 'Security', 'Linting Rules', 'Documentation', 'Test Coverage'],
          datasets: [{
            label: 'Compliance Index',
            data: [92, 98, 90, 86, 82],
            borderColor: colors.green,
            backgroundColor: colors.greenLight,
            borderWidth: 2,
            pointRadius: 3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            r: {
              angleLines: { color: colors.grid },
              grid: { color: colors.grid },
              pointLabels: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } },
              ticks: { display: false }
            }
          }
        }
      });
    }

    // 4. Release Confidence (Gauge / Doughnut Center)
    const ctxConfidence = document.getElementById('releaseConfidenceChart');
    if (ctxConfidence) {
      this.instances.releaseConfidence = new Chart(ctxConfidence, {
        type: 'doughnut',
        data: {
          labels: ['Ready', 'Pending Verification'],
          datasets: [{
            data: [86, 14],
            backgroundColor: [colors.blue, colors.orangeLight],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '75%',
          plugins: { legend: { display: false } }
        }
      });
    }

    // 5. Technical Debt (Trend Line showing unresolved issues)
    const ctxDebt = document.getElementById('techDebtChart');
    if (ctxDebt) {
      this.instances.techDebt = new Chart(ctxDebt, {
        type: 'line',
        data: {
          labels: ['Sprint 38', 'Sprint 39', 'Sprint 40', 'Sprint 41', 'Sprint 42'],
          datasets: [{
            label: 'Unresolved Technical Debt Items',
            data: [28, 25, 29, 24, 21],
            borderColor: colors.red,
            backgroundColor: 'transparent',
            tension: 0.1,
            borderWidth: 2,
            pointRadius: 4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // 6. Code Coverage (Horizontal Bar Chart)
    const ctxCoverage = document.getElementById('codeCoverageChart');
    if (ctxCoverage) {
      this.instances.codeCoverage = new Chart(ctxCoverage, {
        type: 'bar',
        data: {
          labels: ['EVcare.AI', 'Mobile App', 'Web Portal', 'Fleet Platform', 'Office Systems'],
          datasets: [{
            label: 'Code Coverage (%)',
            data: [88, 76, 92, 85, 62],
            backgroundColor: [colors.blue, colors.orange, colors.blue, colors.green, colors.red],
            borderRadius: 3
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: colors.grid }, min: 0, max: 100, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }
  },

  // Setup Reports & Analytics Module Specific Charts
  initReportsCharts(trendType = 'Platform Trends') {
    this.destroyAll();

    const colors = {
      blue: '#007aff',
      blueLight: 'rgba(0, 122, 255, 0.08)',
      orange: '#ff9500',
      text: document.documentElement.getAttribute('data-theme') === 'dark' ? '#aeaeb2' : '#636366',
      grid: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'
    };

    const ctx = document.getElementById('reportsTrendChart');
    if (!ctx) return;

    let chartData = [];
    let baselineData = [];
    let label = '';
    let baselineLabel = '';

    if (trendType === 'Platform Trends') {
      chartData = [99.91, 99.93, 99.96, 99.95, 99.98, 99.99];
      baselineData = [99.90, 99.90, 99.90, 99.90, 99.90, 99.90];
      label = 'System Reliability SLA (%)';
      baselineLabel = 'SLA Target Baseline (99.90%)';
    } else if (trendType === 'Engineering Trends') {
      chartData = [12, 14, 18, 16, 20, 24];
      baselineData = [15, 15, 15, 15, 15, 15];
      label = 'Release Frequency (Weekly)';
      baselineLabel = 'Sprint Commits Baseline';
    } else {
      chartData = [65, 70, 78, 82, 88, 94];
      baselineData = [75, 75, 75, 75, 75, 75];
      label = 'Platform Adoption Rate (%)';
      baselineLabel = 'Enterprise Target';
    }

    this.instances.reportsTrend = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul (Current)'],
        datasets: [
          {
            label: label,
            data: chartData,
            borderColor: colors.blue,
            backgroundColor: colors.blueLight,
            tension: 0.3,
            fill: true,
            borderWidth: 2.5,
            pointRadius: 4,
            pointBackgroundColor: colors.blue
          },
          {
            label: baselineLabel,
            data: baselineData,
            borderColor: colors.orange,
            borderDash: [5, 5],
            fill: false,
            borderWidth: 1.5,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom', labels: { color: colors.text, boxWidth: 12, font: { family: 'Plus Jakarta Sans', size: 11 } } }
        },
        scales: {
          x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
          y: { 
            grid: { color: colors.grid }, 
            ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } }
          }
        }
      }
    });
  },
  initIoTCharts(offlineTrendData) {
    const ctx = document.getElementById('offlineTrendChart');
    if (ctx) {
      const colors = {
        blue: '#007aff',
        blueLight: 'rgba(0, 122, 255, 0.1)',
        grid: document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
        text: document.documentElement.getAttribute('data-theme') === 'dark' ? '#aeaeb2' : '#636366'
      };
      this.instances.offlineTrend = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
          datasets: [{
            label: 'Offline Devices Count',
            data: offlineTrendData || [5, 7, 12, 10, 8, 4, 3],
            borderColor: colors.blue,
            backgroundColor: colors.blueLight,
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }
  },
  initTelemetryCharts() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const colors = {
      blue: '#007aff',
      blueLight: 'rgba(0, 122, 255, 0.1)',
      purple: '#af52de',
      purpleLight: 'rgba(175, 82, 222, 0.1)',
      green: '#34c759',
      greenLight: 'rgba(52, 199, 89, 0.1)',
      grid: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)',
      text: isDark ? '#aeaeb2' : '#636366'
    };

    // Chart 1: Data Ingestion Trend (Area Chart)
    const ctxIngestion = document.getElementById('ingestionTrendChart');
    if (ctxIngestion) {
      if (this.instances.ingestionTrend) this.instances.ingestionTrend.destroy();
      this.instances.ingestionTrend = new Chart(ctxIngestion, {
        type: 'line',
        data: {
          labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
          datasets: [{
            label: 'Ingestion (Million msgs/sec)',
            data: [10.5, 11.2, 14.2, 13.8, 12.9, 14.2],
            borderColor: colors.blue,
            backgroundColor: colors.blueLight,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // Chart 2: Latency Trend (Line Chart)
    const ctxLatency = document.getElementById('latencyTrendChart');
    if (ctxLatency) {
      if (this.instances.latencyTrend) this.instances.latencyTrend.destroy();
      this.instances.latencyTrend = new Chart(ctxLatency, {
        type: 'line',
        data: {
          labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
          datasets: [{
            label: 'Latency (ms)',
            data: [110, 108, 115, 118, 112, 115],
            borderColor: colors.purple,
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            pointRadius: 4,
            tension: 0.2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } }
          }
        }
      });
    }

    // Chart 3: Data Quality Trend (Bar Chart)
    const ctxQuality = document.getElementById('qualityTrendChart');
    if (ctxQuality) {
      if (this.instances.qualityTrend) this.instances.qualityTrend.destroy();
      this.instances.qualityTrend = new Chart(ctxQuality, {
        type: 'bar',
        data: {
          labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
          datasets: [{
            label: 'Valid Signals (%)',
            data: [95, 96, 96, 94, 95, 96],
            backgroundColor: colors.blue,
            borderRadius: 4,
            maxBarThickness: 16
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } }, min: 80, max: 100 }
          }
        }
      });
    }

    // Chart 4: Platform Stability Trend (Line Chart)
    const ctxStability = document.getElementById('telemetryStabilityChart');
    if (ctxStability) {
      if (this.instances.telemetryStability) this.instances.telemetryStability.destroy();
      this.instances.telemetryStability = new Chart(ctxStability, {
        type: 'line',
        data: {
          labels: ['10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM'],
          datasets: [{
            label: 'Availability (%)',
            data: [99.98, 99.99, 99.98, 99.98, 99.97, 99.98],
            borderColor: colors.green,
            backgroundColor: colors.greenLight,
            borderWidth: 2,
            pointRadius: 4,
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 10 } }, min: 99.9, max: 100 }
          }
        }
      });
    }
  },
  initAIDiagnosticsCharts() {
    const colors = {
      blue: '#007aff',
      green: '#34c759',
      purple: '#af52de',
      red: '#ff3b30',
      orange: '#ff9500',
      text: '#8e8e93',
      grid: 'rgba(142, 142, 147, 0.1)',
      blueLight: 'rgba(0, 122, 255, 0.04)',
      greenLight: 'rgba(52, 199, 89, 0.04)',
      purpleLight: 'rgba(175, 82, 222, 0.04)'
    };

    // Chart 1: Prediction Accuracy Trend (diagAccuracyChart)
    const ctxAccuracy = document.getElementById('diagAccuracyChart');
    if (ctxAccuracy) {
      if (this.instances.diagAccuracy) this.instances.diagAccuracy.destroy();
      this.instances.diagAccuracy = new Chart(ctxAccuracy, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Accuracy (%)',
            data: [97.5, 97.9, 98.1, 98.2],
            borderColor: colors.purple,
            backgroundColor: colors.purpleLight,
            borderWidth: 2.5,
            pointRadius: 4,
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } }, min: 95, max: 100 }
          }
        }
      });
    }

    // Chart 2: Confidence Score Trend (diagConfidenceChart)
    const ctxConfidence = document.getElementById('diagConfidenceChart');
    if (ctxConfidence) {
      if (this.instances.diagConfidence) this.instances.diagConfidence.destroy();
      this.instances.diagConfidence = new Chart(ctxConfidence, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Confidence (%)',
            data: [95.2, 95.8, 96.0, 96.2],
            borderColor: colors.blue,
            backgroundColor: colors.blueLight,
            borderWidth: 2.5,
            pointRadius: 4,
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } }, min: 90, max: 100 }
          }
        }
      });
    }

    // Chart 3: Diagnostic Success Rate (diagSuccessChart)
    const ctxSuccess = document.getElementById('diagSuccessChart');
    if (ctxSuccess) {
      if (this.instances.diagSuccess) this.instances.diagSuccess.destroy();
      this.instances.diagSuccess = new Chart(ctxSuccess, {
        type: 'bar',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Success Rate (%)',
            data: [99.95, 99.96, 99.98, 99.98],
            backgroundColor: colors.green,
            borderRadius: 4,
            maxBarThickness: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } }, min: 99.9, max: 100 }
          }
        }
      });
    }

    // Chart 4: Prediction Distribution (diagDistributionChart)
    const ctxDistribution = document.getElementById('diagDistributionChart');
    if (ctxDistribution) {
      if (this.instances.diagDistribution) this.instances.diagDistribution.destroy();
      this.instances.diagDistribution = new Chart(ctxDistribution, {
        type: 'bar',
        data: {
          labels: ['Battery', 'Motor', 'Controller', 'Charging'],
          datasets: [{
            label: 'Predictions Count',
            data: [8, 4, 3, 3],
            backgroundColor: colors.orange,
            borderRadius: 4,
            maxBarThickness: 16
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } }
          }
        }
      });
    }
  },
  initMobileAppCharts() {
    const colors = {
      blue: '#007aff',
      green: '#34c759',
      purple: '#af52de',
      red: '#ff3b30',
      orange: '#ff9500',
      text: '#8e8e93',
      grid: 'rgba(142, 142, 147, 0.1)',
      blueLight: 'rgba(0, 122, 255, 0.04)',
      greenLight: 'rgba(52, 199, 89, 0.04)',
      purpleLight: 'rgba(175, 82, 222, 0.04)'
    };

    const ctxUsers = document.getElementById('mobileUsersChart');
    if (ctxUsers) {
      if (this.instances.mobileUsers) this.instances.mobileUsers.destroy();
      this.instances.mobileUsers = new Chart(ctxUsers, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [
            {
              label: 'Android Users',
              data: [820, 910, 950, 1020],
              borderColor: colors.blue,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.15
            },
            {
              label: 'iOS Users',
              data: [320, 350, 380, 400],
              borderColor: colors.purple,
              backgroundColor: 'transparent',
              borderWidth: 2,
              pointRadius: 3,
              tension: 0.15
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: true, labels: { boxWidth: 10, font: { family: 'Plus Jakarta Sans', size: 9 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } } }
          }
        }
      });
    }
  },
  initWebPortalCharts() {
    const colors = {
      blue: '#007aff',
      green: '#34c759',
      purple: '#af52de',
      red: '#ff3b30',
      orange: '#ff9500',
      text: '#8e8e93',
      grid: 'rgba(142, 142, 147, 0.1)'
    };

    // 1. Traffic Chart
    const ctxTraffic = document.getElementById('portalTrafficChart');
    if (ctxTraffic) {
      if (this.instances.webTraffic) this.instances.webTraffic.destroy();
      this.instances.webTraffic = new Chart(ctxTraffic, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Views',
            data: [320, 380, 410, 452],
            borderColor: colors.blue,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { size: 8 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 8 } } }
          }
        }
      });
    }

    // 2. Engagement Chart
    const ctxEngage = document.getElementById('portalEngagementChart');
    if (ctxEngage) {
      if (this.instances.webEngage) this.instances.webEngage.destroy();
      this.instances.webEngage = new Chart(ctxEngage, {
        type: 'bar',
        data: {
          labels: ['West', 'South', 'North', 'East'],
          datasets: [{
            label: 'Active Users',
            data: [540, 596, 213, 71],
            backgroundColor: colors.purple,
            borderRadius: 4,
            maxBarThickness: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { size: 8 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 8 } } }
          }
        }
      });
    }

    // 3. Booking Chart
    const ctxBooking = document.getElementById('portalBookingChart');
    if (ctxBooking) {
      if (this.instances.webBooking) this.instances.webBooking.destroy();
      this.instances.webBooking = new Chart(ctxBooking, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug'],
          datasets: [{
            label: 'Conversion %',
            data: [90.2, 91.5, 93.0, 94.2],
            borderColor: colors.green,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 2,
            tension: 0.15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { size: 8 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 8 } } }
          }
        }
      });
    }

    // 4. Latency Chart
    const ctxLatency = document.getElementById('portalLatencyChart');
    if (ctxLatency) {
      if (this.instances.webLatency) this.instances.webLatency.destroy();
      this.instances.webLatency = new Chart(ctxLatency, {
        type: 'bar',
        data: {
          labels: ['Home', 'Analytics', 'Booking', 'API'],
          datasets: [{
            label: 'Latency (s)',
            data: [0.8, 1.4, 1.2, 0.4],
            backgroundColor: colors.blue,
            borderRadius: 4,
            maxBarThickness: 12
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { size: 8 } } },
            y: { grid: { color: colors.grid }, ticks: { color: colors.text, font: { size: 8 } } }
          }
        }
      });
    }
  },
  initAIModelCharts() {
    const colors = {
      blue: '#007aff',
      green: '#34c759',
      purple: '#af52de',
      red: '#ff3b30',
      orange: '#ff9500',
      text: '#8e8e93',
      grid: 'rgba(142, 142, 147, 0.1)'
    };

    const ctxEval = document.getElementById('modelEvaluationChart');
    if (ctxEval) {
      if (this.instances.modelEval) this.instances.modelEval.destroy();
      this.instances.modelEval = new Chart(ctxEval, {
        type: 'bar',
        data: {
          labels: ['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC'],
          datasets: [{
            label: 'Score %',
            data: [98.2, 97.9, 98.4, 98.1, 99.2],
            backgroundColor: colors.purple,
            borderRadius: 4,
            maxBarThickness: 14
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: {
              min: 90,
              max: 100,
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 8 } }
            },
            y: {
              grid: { display: false },
              ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 9 } }
            }
          }
        }
      });
    }
  },
  initMLPlatformCharts() {
    const colors = {
      blue: '#007aff',
      green: '#34c759',
      purple: '#af52de',
      red: '#ff3b30',
      orange: '#ff9500',
      text: '#8e8e93',
      grid: 'rgba(142, 142, 147, 0.1)'
    };

    const ctxVal = document.getElementById('mlValidationChart');
    if (ctxVal) {
      if (this.instances.mlVal) this.instances.mlVal.destroy();
      this.instances.mlVal = new Chart(ctxVal, {
        type: 'line',
        data: {
          labels: ['Epoch 10', 'Epoch 20', 'Epoch 30', 'Epoch 40', 'Epoch 50'],
          datasets: [{
            label: 'Validation Accuracy',
            data: [94.1, 96.5, 97.8, 98.1, 98.6],
            borderColor: colors.green,
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 3,
            tension: 0.15
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 8 } } },
            y: {
              min: 90,
              max: 100,
              grid: { color: colors.grid },
              ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 8 } }
            }
          }
        }
      });
    }
  },
  initExecutiveDashboardCharts() {
    const palette = {
      blue: '#2563EB',
      indigo: '#4F46E5',
      emerald: '#10B981',
      amber: '#F59E0B',
      rose: '#EF4444',
      teal: '#14B8A6',
      purple: '#8B5CF6',
      slate: '#64748B',
      grid: 'rgba(100, 116, 139, 0.1)'
    };

    // 1. Engineering Delivery Performance (Bar/Line Combo)
    const ctx1 = document.getElementById('techEngChart');
    if (ctx1) {
      if (this.instances.techEng) this.instances.techEng.destroy();
      const chartCtx = ctx1.getContext('2d');
      const gradBlue = chartCtx.createLinearGradient(0, 0, 0, 150);
      gradBlue.addColorStop(0, 'rgba(37, 99, 235, 0.8)');
      gradBlue.addColorStop(1, 'rgba(37, 99, 235, 0.1)');

      this.instances.techEng = new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Sprint 38', 'Sprint 39', 'Sprint 40', 'Sprint 41', 'Sprint 42'],
          datasets: [
            { type: 'bar', label: 'Velocity %', data: [88, 90, 92, 93, 94.2], backgroundColor: gradBlue, borderRadius: 5 },
            { type: 'line', label: 'Release Success %', data: [98, 98.5, 99.1, 99.2, 99.4], borderColor: palette.emerald, strokeWidth: 2, tension: 0.3, fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { family: 'Plus Jakarta Sans', size: 9 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 } } },
            y: { grid: { color: palette.grid }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }

    // 2. Code Quality & Engineering Excellence (Horizontal Bar)
    const ctx2 = document.getElementById('techQualityChart');
    if (ctx2) {
      if (this.instances.techQuality) this.instances.techQuality.destroy();
      this.instances.techQuality = new Chart(ctx2, {
        type: 'bar',
        data: {
          labels: ['Code Quality', 'Coverage %', 'Maintainability', 'Tech Debt %'],
          datasets: [
            { label: 'Score %', data: [92.4, 88.5, 95.0, 4.2], backgroundColor: [palette.indigo, palette.blue, palette.emerald, palette.amber], borderRadius: 4 }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          indexAxis: 'y',
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { color: palette.grid }, ticks: { font: { size: 8 } } },
            y: { grid: { display: false }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }

    // 3. Connected Vehicle Health (Line Gradient)
    const ctx3 = document.getElementById('techMobilityChart');
    if (ctx3) {
      if (this.instances.techMobility) this.instances.techMobility.destroy();
      const chartCtx = ctx3.getContext('2d');
      const gradEmerald = chartCtx.createLinearGradient(0, 0, 0, 150);
      gradEmerald.addColorStop(0, 'rgba(16, 185, 129, 0.35)');
      gradEmerald.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      this.instances.techMobility = new Chart(ctx3, {
        type: 'line',
        data: {
          labels: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
          datasets: [
            { label: 'Connected EVs', data: [32000, 36000, 39500, 42000, 44100, 45200], borderColor: palette.emerald, backgroundColor: gradEmerald, fill: true, tension: 0.35 },
            { label: 'Daily Active', data: [27000, 30500, 33200, 35400, 37200, 38400], borderColor: palette.blue, tension: 0.35, fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { family: 'Plus Jakarta Sans', size: 9 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 } } },
            y: { grid: { color: palette.grid }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }

    // 4. AI Intelligence & Model Performance (Multi-Line Gradient)
    const ctx4 = document.getElementById('techAIChart');
    if (ctx4) {
      if (this.instances.techAI) this.instances.techAI.destroy();
      const chartCtx = ctx4.getContext('2d');
      const gradPurple = chartCtx.createLinearGradient(0, 0, 0, 150);
      gradPurple.addColorStop(0, 'rgba(139, 92, 246, 0.30)');
      gradPurple.addColorStop(1, 'rgba(139, 92, 246, 0.0)');

      this.instances.techAI = new Chart(ctx4, {
        type: 'line',
        data: {
          labels: ['W1', 'W2', 'W3', 'W4'],
          datasets: [
            { label: 'Accuracy %', data: [96.2, 97.1, 97.8, 98.2], borderColor: palette.purple, backgroundColor: gradPurple, fill: true, tension: 0.3 },
            { label: 'Inferences (M)', data: [9.8, 10.5, 11.8, 12.5], borderColor: palette.teal, tension: 0.3, fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { family: 'Plus Jakarta Sans', size: 9 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 } } },
            y: { grid: { color: palette.grid }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }

    // 5. Platform Reliability & Infrastructure (Bar)
    const ctx5 = document.getElementById('techReliabilityChart');
    if (ctx5) {
      if (this.instances.techRel) this.instances.techRel.destroy();
      this.instances.techRel = new Chart(ctx5, {
        type: 'bar',
        data: {
          labels: ['Uptime SLA %', 'API Latency (ms)', 'DB Health %', 'Cloud Util %'],
          datasets: [{ data: [99.98, 12, 99.99, 64], backgroundColor: [palette.teal, palette.blue, palette.emerald, palette.purple], borderRadius: 4 }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 8 } } },
            y: { grid: { color: palette.grid }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }

    // 6. Business Growth & Customer Experience (Line Gradient)
    const ctx6 = document.getElementById('techBusinessChart');
    if (ctx6) {
      if (this.instances.techBus) this.instances.techBus.destroy();
      const chartCtx = ctx6.getContext('2d');
      const gradGreen = chartCtx.createLinearGradient(0, 0, 0, 150);
      gradGreen.addColorStop(0, 'rgba(16, 185, 129, 0.30)');
      gradGreen.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

      this.instances.techBus = new Chart(ctx6, {
        type: 'line',
        data: {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          datasets: [
            { label: 'MRR ($M)', data: [1.1, 1.22, 1.35, 1.42], borderColor: palette.emerald, backgroundColor: gradGreen, fill: true, tension: 0.3 },
            { label: 'Enterprise Fleets', data: [110, 122, 134, 142], borderColor: palette.indigo, tension: 0.3, fill: false }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'bottom', labels: { boxWidth: 8, font: { family: 'Plus Jakarta Sans', size: 9 } } } },
          scales: {
            x: { grid: { display: false }, ticks: { font: { size: 9 } } },
            y: { grid: { color: palette.grid }, ticks: { font: { size: 9 } } }
          }
        }
      });
    }
  }
};
