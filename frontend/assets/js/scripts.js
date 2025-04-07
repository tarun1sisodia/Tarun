// Common JavaScript utilities for BloodConnect

// Toggle mobile menu
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.classList.toggle('hidden');
    }
  }
  
  // Format date to readable string
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  
  // Format time elapsed (e.g., "2 days ago")
  function timeElapsed(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? '1 year ago' : `${interval} years ago`;
    }
    
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? '1 month ago' : `${interval} months ago`;
    }
    
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? '1 day ago' : `${interval} days ago`;
    }
    
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? '1 hour ago' : `${interval} hours ago`;
    }
    
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? '1 minute ago' : `${interval} minutes ago`;
    }
    
    return 'Just now';
  }
  
  // Get blood type compatibility
  function getCompatibleBloodTypes(bloodType) {
    const compatibilityChart = {
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'A-': ['A-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'], // AB+ can receive from all
      'AB-': ['A-', 'B-', 'AB-', 'O-'],
      'O+': ['O+', 'O-'],
      'O-': ['O-'] // O- can only receive O-
    };
    
    return compatibilityChart[bloodType] || [];
  }
  
  // Get urgency level class
  function getUrgencyClass(urgency) {
    switch (urgency) {
      case 'critical':
        return 'bg-red-600 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      case 'low':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }
  
  // Get status badge class
  function getStatusBadgeClass(status) {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'fulfilled':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
  
  // Animate count up (for statistics)
  function animateCountUp(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      element.textContent = Math.floor(current);
      
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      }
    }, 16);
  }
  
  // Initialize statistics animation
  function initStatisticsAnimation() {
    const statElements = document.querySelectorAll('.stat-number');
    
    if (statElements.length > 0) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'), 10);
            animateCountUp(entry.target, target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.5 });
      
      statElements.forEach(el => {
        observer.observe(el);
      });
    }
  }
  
  // Initialize tooltips
  function initTooltips() {
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('mouseenter', () => {
        const text = tooltip.getAttribute('data-tooltip');
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'absolute z-50 px-2 py-1 text-xs text-white bg-gray-800 rounded shadow-lg';
        tooltipEl.textContent = text;
        tooltipEl.style.bottom = '100%';
        tooltipEl.style.left = '50%';
        tooltipEl.style.transform = 'translateX(-50%) translateY(-5px)';
        tooltip.style.position = 'relative';
        tooltip.appendChild(tooltipEl);
        
        tooltip.addEventListener('mouseleave', () => {
          tooltipEl.remove();
        });
      });
    });
  }
  
  // Document ready function
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize statistics animation
    initStatisticsAnimation();
    
    // Initialize tooltips
    initTooltips();
    
    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    if (mobileMenuButton) {
      mobileMenuButton.addEventListener('click', toggleMobileMenu);
    }
  });
  