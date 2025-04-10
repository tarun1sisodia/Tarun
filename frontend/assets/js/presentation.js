/**
 * BloodConnect Technical Presentation
 * Controls slide navigation and animations
 */

class Presentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = document.querySelectorAll('.slide').length;
        this.slides = document.querySelectorAll('.slide');
        this.progressBar = document.getElementById('progress-bar');
        this.prevButton = document.getElementById('prev-slide');
        this.nextButton = document.getElementById('next-slide');
        this.isAnimating = false;

        this.init();
    }

    init() {
        // Show first slide
        this.showSlide(this.currentSlide);

        // Update progress bar
        this.updateProgress();

        // Add event listeners
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }

        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight' || e.key === ' ') {
                this.nextSlide();
            } else if (e.key === 'ArrowLeft') {
                this.prevSlide();
            }
        });

        // Mouse wheel navigation
        document.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;

            if (e.deltaY > 0) {
                this.nextSlide();
            } else if (e.deltaY < 0) {
                this.prevSlide();
            }
        }, { passive: true });

        // Touch swipe navigation
        let touchStartX = 0;
        let touchEndX = 0;

        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    handleSwipe(touchStartX, touchEndX) {
        if (touchEndX < touchStartX - 50) {
            this.nextSlide();
        } else if (touchEndX > touchStartX + 50) {
            this.prevSlide();
        }
    }

    showSlide(slideNumber) {
        // Hide all slides
        this.slides.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show the current slide
        const currentSlide = document.querySelector(`.slide[data-slide="${slideNumber}"]`);
        if (currentSlide) {
            currentSlide.classList.add('active');

            // Trigger slide-specific animations
            this.triggerSlideAnimations(slideNumber);
        }
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides) return;

        this.isAnimating = true;
        this.currentSlide++;
        this.showSlide(this.currentSlide);
        this.updateProgress();

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    prevSlide() {
        if (this.isAnimating || this.currentSlide <= 1) return;

        this.isAnimating = true;
        this.currentSlide--;
        this.showSlide(this.currentSlide);
        this.updateProgress();

        setTimeout(() => {
            this.isAnimating = false;
        }, 500);
    }

    updateProgress() {
        if (!this.progressBar) return;

        const progress = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progress}%`;

        // Update navigation buttons
        if (this.prevButton) {
            if (this.currentSlide === 1) {
                this.prevButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                this.prevButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }

        if (this.nextButton) {
            if (this.currentSlide === this.totalSlides) {
                this.nextButton.classList.add('opacity-50', 'cursor-not-allowed');
            } else {
                this.nextButton.classList.remove('opacity-50', 'cursor-not-allowed');
            }
        }
    }

    triggerSlideAnimations(slideNumber) {
        switch (slideNumber) {
            case 1:
                // Title slide animations
                this.animateTitleSlide();
                break;
            case 2:
                // Problem statement animations
                this.animateProblemSlide();
                break;
            case 3:
                // Tech stack animations
                this.animateTechStackSlide();
                break;
            case 4:
                // Architecture animations
                this.animateArchitectureSlide();
                break;
            case 5:
                // Auth flow animations
                this.animateAuthFlowSlide();
                break;
            case 6:
                // Data flow animations
                this.animateDataFlowSlide();
                break;
            // Add more slide-specific animations as needed
        }
    }

    animateTitleSlide() {
        const title = document.querySelector('.slide[data-slide="1"] h1');
        const subtitle = document.querySelector('.slide[data-slide="1"] p');
        const buttons = document.querySelectorAll('.slide[data-slide="1"] a');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
            );
        }

        if (subtitle) {
            gsap.fromTo(subtitle,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power2.out" }
            );
        }

        if (buttons && buttons.length > 0) {
            gsap.fromTo(buttons,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.6, stagger: 0.2, ease: "power2.out" }
            );
        }
    }

    animateProblemSlide() {
        const title = document.querySelector('.slide[data-slide="2"] h2');
        const cards = document.querySelectorAll('.slide[data-slide="2"] .problem-card');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        if (cards && cards.length > 0) {
            gsap.fromTo(cards,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.3, stagger: 0.2, ease: "power2.out" }
            );
        }
    }

    animateTechStackSlide() {
        const title = document.querySelector('.slide[data-slide="3"] h2');
        const techItems = document.querySelectorAll('.slide[data-slide="3"] .tech-item');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        if (techItems && techItems.length > 0) {
            gsap.fromTo(techItems,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, delay: 0.3, stagger: 0.1, ease: "back.out(1.7)" }
            );
        }

        // Initialize 3D tech stack visualization if function exists
        if (typeof initTechStackVisualization === 'function') {
            initTechStackVisualization();
        }
    }

    animateArchitectureSlide() {
        const title = document.querySelector('.slide[data-slide="4"] h2');
        const elements = document.querySelectorAll('.architecture-element');
        const connections = document.querySelectorAll('.architecture-connection');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        // Animate architecture elements one by one
        if (elements && elements.length > 0) {
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('active');
                }, 500 + (index * 300));
            });
        }

        // Animate connections after elements
        if (connections && connections.length > 0) {
            connections.forEach((connection, index) => {
                setTimeout(() => {
                    connection.classList.add('active');
                }, 1500 + (index * 300));
            });
        }
    }

    animateAuthFlowSlide() {
        const title = document.querySelector('.slide[data-slide="5"] h2');
        const codeBlock = document.querySelector('.slide[data-slide="5"] pre');
        const authFlowSteps = document.querySelectorAll('.auth-flow-step');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        if (codeBlock) {
            gsap.fromTo(codeBlock,
                { opacity: 0, x: 30 },
                { opacity: 1, x: 0, duration: 0.5, delay: 0.3, ease: "power2.out" }
            );
        }

        // Animate auth flow steps
        if (authFlowSteps && authFlowSteps.length > 0) {
            authFlowSteps.forEach((step, index) => {
                setTimeout(() => {
                    step.classList.add('active');
                }, 800 + (index * 400));
            });
        }
    }

    animateDataFlowSlide() {
        const title = document.querySelector('.slide[data-slide="6"] h2');
        const cards = document.querySelectorAll('.slide[data-slide="6"] .bg-gray-800');

        if (title) {
            gsap.fromTo(title,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
        }

        if (cards && cards.length > 0) {
            gsap.fromTo(cards,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.5, delay: 0.3, stagger: 0.2, ease: "power2.out" }
            );
        }

        // Initialize 3D data flow visualization if function exists
        if (typeof initDataFlowVisualization === 'function') {
            initDataFlowVisualization();
        }
    }
}

// Initialize presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing presentation');
    const presentation = new Presentation();

    // Initialize code highlighting
    if (window.hljs) {
        console.log('Initializing code highlighting');
        try {
            hljs.highlightAll();
        } catch (e) {
            console.error('Error in code highlighting:', e);
        }
    } else {
        console.warn('Highlight.js not loaded');
    }
});
