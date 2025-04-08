import { authService } from '../services/auth.js';

class AboutPage {
  constructor() {
    this.init();
  }

  init() {
    this.initCounters();
  }

  initCounters() {
    // Animate counters
    this.animateCounter('donor-count', 250);
    this.animateCounter('donation-count', 500);
    this.animateCounter('lives-saved', 1500);
    this.animateCounter('cities-count', 20);
  }

  // Counter animation function
  animateCounter(id, target) {
    const counter = document.getElementById(id);
    if (!counter) return;
    
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      counter.textContent = Math.floor(current);

      if (current >= target) {
        counter.textContent = target;
        clearInterval(timer);
      }
    }, stepTime);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new AboutPage();
});

export default AboutPage;
