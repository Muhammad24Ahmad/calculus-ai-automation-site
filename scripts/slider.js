// Image Slider Functionality
class ImageSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.hero-slide');
        this.currentIndex = 0;
        this.autoSlide = options.autoSlide !== false;
        this.slideInterval = options.slideInterval || 1000;
        this.isPlaying = this.autoSlide;
        
        this.init();
    }
    
    init() {
        if (this.slides.length <= 1) return;
        
        // Set first slide as active
        this.showSlide(0);
        
        // Start auto-sliding if enabled
        if (this.autoSlide) {
            this.startAutoSlide();
        }
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.resume());
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.slides[index].classList.add('active');
        
        this.currentIndex = index;
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
        this.showSlide(prevIndex);
    }
    
    startAutoSlide() {
        this.timer = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
        this.isPlaying = true;
    }
    
    stopAutoSlide() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isPlaying = false;
    }
    
    pause() {
        if (this.isPlaying) {
            this.stopAutoSlide();
        }
    }
    
    resume() {
        if (this.autoSlide && !this.isPlaying) {
            this.startAutoSlide();
        }
    }
    
    destroy() {
        this.stopAutoSlide();
    }
}

// Career Slider Class (for careers page)
class CareerSlider {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        this.slides = this.container.querySelectorAll('.career-slide');
        this.currentIndex = 0;
        this.autoSlide = options.autoSlide !== false;
        this.slideInterval = options.slideInterval || 3000;
        this.isPlaying = this.autoSlide;
        
        this.init();
    }
    
    init() {
        if (this.slides.length <= 1) return;
        
        // Set first slide as active
        this.showSlide(0);
        
        // Start auto-sliding if enabled
        if (this.autoSlide) {
            this.startAutoSlide();
        }
        
        // Add navigation dots
        this.createDots();
        
        // Pause on hover
        this.container.addEventListener('mouseenter', () => this.pause());
        this.container.addEventListener('mouseleave', () => this.resume());
    }
    
    showSlide(index) {
        // Remove active class from all slides
        this.slides.forEach(slide => slide.classList.remove('active'));
        
        // Add active class to current slide
        this.slides[index].classList.add('active');
        
        // Update dots
        this.updateDots(index);
        
        this.currentIndex = index;
    }
    
    createDots() {
        if (this.slides.length <= 1) return;
        
        const dotsContainer = document.createElement('div');
        dotsContainer.className = 'slider-dots';
        
        this.slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'slider-dot';
            if (index === 0) dot.classList.add('active');
            
            dot.addEventListener('click', () => {
                this.showSlide(index);
                if (this.autoSlide) {
                    this.stopAutoSlide();
                    this.startAutoSlide(); // Restart timer
                }
            });
            
            dotsContainer.appendChild(dot);
        });
        
        this.container.appendChild(dotsContainer);
        this.dots = dotsContainer.querySelectorAll('.slider-dot');
    }
    
    updateDots(activeIndex) {
        if (!this.dots) return;
        
        this.dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    nextSlide() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        this.showSlide(nextIndex);
    }
    
    startAutoSlide() {
        this.timer = setInterval(() => {
            this.nextSlide();
        }, this.slideInterval);
        this.isPlaying = true;
    }
    
    stopAutoSlide() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.isPlaying = false;
    }
    
    pause() {
        if (this.isPlaying) {
            this.stopAutoSlide();
        }
    }
    
    resume() {
        if (this.autoSlide && !this.isPlaying) {
            this.startAutoSlide();
        }
    }
}

// Initialize sliders when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero slider (1 second interval)
    if (document.getElementById('heroSlider')) {
        window.heroSlider = new ImageSlider('heroSlider', {
            autoSlide: true,
            slideInterval: 1000
        });
    }
    
    // Initialize career slider (3 second interval)
    if (document.getElementById('careerSlider')) {
        window.careerSlider = new ImageSlider('careerSlider', {
            autoSlide: true,
            slideInterval: 3000
        });
    }
});

// CSS for slider dots (add to components.css)
const sliderDotsCSS = `
.slider-dots {
    position: absolute;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 0.5rem;
    z-index: 20;
}

.slider-dot {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    border: none;
    background-color: rgba(255, 255, 255, 0.5);
    cursor: pointer;
    transition: all 0.3s ease;
}

.slider-dot.active {
    background-color: white;
    transform: scale(1.2);
}

.slider-dot:hover {
    background-color: rgba(255, 255, 255, 0.8);
}
`;

// Inject CSS for slider dots
if (!document.getElementById('slider-dots-css')) {
    const style = document.createElement('style');
    style.id = 'slider-dots-css';
    style.textContent = sliderDotsCSS;
    document.head.appendChild(style);
}