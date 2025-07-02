class ModernCarousel {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 4;
        this.isPlaying = true;
        this.slideInterval = null;
        this.slideDuration = 5000; // 5 seconds
        this.progressInterval = null;
        
        this.carousel = document.getElementById('carousel');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelectorAll('.dot');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progressFill = document.getElementById('progressFill');
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.startAutoPlay();
        this.startProgressBar();
        this.handleVideoSlides();
        
        // Touch/swipe support
        this.addTouchSupport();
        
        // Show that auto-play is active
        console.log('Carousel initialized with auto-play enabled');
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn.addEventListener('click', () => this.prevSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Play/pause button
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        
        // Dot indicators
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            switch(e.key) {
                case 'ArrowLeft':
                    this.prevSlide();
                    break;
                case 'ArrowRight':
                    this.nextSlide();
                    break;
                case ' ':
                    e.preventDefault();
                    this.togglePlayPause();
                    break;
            }
        });
        
        // Pause on hover
        this.carousel.addEventListener('mouseenter', () => {
            if (this.isPlaying) {
                this.pauseAutoPlay();
                this.pauseProgressBar();
            }
        });
        
        this.carousel.addEventListener('mouseleave', () => {
            if (this.isPlaying) {
                this.startAutoPlay();
                this.startProgressBar();
            }
        });
        
        // Handle visibility change (pause when tab is not active)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
                this.pauseProgressBar();
            } else if (this.isPlaying) {
                this.startAutoPlay();
                this.startProgressBar();
            }
        });
    }
    
    goToSlide(index) {
        // Remove active class from current slide and dot
        this.slides[this.currentSlide].classList.remove('active');
        this.dots[this.currentSlide].classList.remove('active');
        
        // Pause current video if it's a video slide
        this.pauseCurrentVideo();
        
        // Update current slide
        this.currentSlide = index;
        
        // Add active class to new slide and dot
        this.slides[this.currentSlide].classList.add('active');
        this.dots[this.currentSlide].classList.add('active');
        
        // Play new video if it's a video slide
        this.playCurrentVideo();
        
        // Reset progress bar
        this.resetProgressBar();
        
        // Restart autoplay if it's playing
        if (this.isPlaying) {
            this.startAutoPlay();
        }
        
        console.log(`Switched to slide ${index + 1}`);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.goToSlide(nextIndex);
    }
    
    prevSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.goToSlide(prevIndex);
    }
    
    startAutoPlay() {
        this.clearAutoPlay();
        this.slideInterval = setInterval(() => {
            console.log('Auto-advancing to next slide');
            this.nextSlide();
        }, this.slideDuration);
    }
    
    pauseAutoPlay() {
        this.clearAutoPlay();
    }
    
    clearAutoPlay() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
            this.slideInterval = null;
        }
    }
    
    togglePlayPause() {
        this.isPlaying = !this.isPlaying;
        
        const playIcon = this.playPauseBtn.querySelector('.play-icon');
        const pauseIcon = this.playPauseBtn.querySelector('.pause-icon');
        
        if (this.isPlaying) {
            playIcon.classList.remove('hidden');
            pauseIcon.classList.add('hidden');
            this.startAutoPlay();
            this.startProgressBar();
            console.log('Auto-play resumed');
        } else {
            playIcon.classList.add('hidden');
            pauseIcon.classList.remove('hidden');
            this.pauseAutoPlay();
            this.pauseProgressBar();
            console.log('Auto-play paused');
        }
    }
    
    startProgressBar() {
        this.clearProgressBar();
        this.progressFill.style.width = '0%';
        
        let progress = 0;
        const increment = 100 / (this.slideDuration / 50); // Update every 50ms
        
        this.progressInterval = setInterval(() => {
            progress += increment;
            if (progress >= 100) {
                progress = 100;
                this.clearProgressBar();
            }
            this.progressFill.style.width = progress + '%';
        }, 50);
    }
    
    pauseProgressBar() {
        this.clearProgressBar();
    }
    
    resetProgressBar() {
        this.clearProgressBar();
        this.progressFill.style.width = '0%';
        if (this.isPlaying) {
            this.startProgressBar();
        }
    }
    
    clearProgressBar() {
        if (this.progressInterval) {
            clearInterval(this.progressInterval);
            this.progressInterval = null;
        }
    }
    
    handleVideoSlides() {
        this.slides.forEach((slide, index) => {
            const video = slide.querySelector('video');
            if (video) {
                video.addEventListener('loadeddata', () => {
                    if (index === this.currentSlide) {
                        video.play().catch(e => console.log('Video autoplay failed:', e));
                    }
                });
                
                video.addEventListener('ended', () => {
                    if (index === this.currentSlide && this.isPlaying) {
                        this.nextSlide();
                    }
                });
            }
        });
    }
    
    playCurrentVideo() {
        const currentSlideElement = this.slides[this.currentSlide];
        const video = currentSlideElement.querySelector('video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(e => console.log('Video play failed:', e));
        }
    }
    
    pauseCurrentVideo() {
        const currentSlideElement = this.slides[this.currentSlide];
        const video = currentSlideElement.querySelector('video');
        if (video) {
            video.pause();
        }
    }
    
    addTouchSupport() {
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        this.carousel.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        this.carousel.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;
            
            // Only handle horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    this.prevSlide();
                } else {
                    this.nextSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    // Cleanup method
    destroy() {
        this.clearAutoPlay();
        this.clearProgressBar();
        
        // Pause all videos
        this.slides.forEach(slide => {
            const video = slide.querySelector('video');
            if (video) {
                video.pause();
            }
        });
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const carousel = new ModernCarousel();
    
    // Expose carousel instance globally for debugging
    window.carousel = carousel;
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
        carousel.destroy();
    });
    
    // Log initialization
    console.log('Carousel auto-play started - slides will change every 5 seconds');
});

// Handle reduced motion preference
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--animation-duration', '0.1s');
    document.documentElement.style.setProperty('--transition-duration', '0.1s');
}

// Add error handling for media loading
document.querySelectorAll('img, video').forEach(media => {
    media.addEventListener('error', (e) => {
        console.warn('Media failed to load:', e.target.src);
    });
});