// Main JavaScript for Modern Navbar & Carousel

class ModernNavbarCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = document.querySelectorAll('.carousel-slide');
    this.indicators = document.querySelectorAll('.indicator');
    this.totalSlides = this.slides.length;
    this.autoSlideInterval = null;
    this.slideTransitionTime = 8000; // 8 seconds per slide
    this.isTransitioning = false;
    
    this.init();
  }

  init() {
    this.setupNavbar();
    this.setupMobileMenu();
    this.setupDropdowns();
    this.setupCarousel();
    this.startAutoSlide();
    this.setupVideoEvents();
  }

  // Navbar functionality
  setupNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const navbarBrand = document.getElementById('navbarBrand');
    
    // Handle navbar scroll effect
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = anchor.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Mobile menu functionality
  setupMobileMenu() {
    const navbarToggler = document.getElementById('navbarToggler');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-links a');

    // Toggle mobile menu
    navbarToggler.addEventListener('click', () => {
      navbarToggler.classList.toggle('active');
      mobileMenuOverlay.classList.toggle('active');
      document.body.style.overflow = mobileMenuOverlay.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu
    mobileMenuClose.addEventListener('click', () => {
      this.closeMobileMenu();
    });

    // Close mobile menu when clicking overlay
    mobileMenuOverlay.addEventListener('click', (e) => {
      if (e.target === mobileMenuOverlay) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu when clicking nav links (except dropdown toggles)
    mobileNavLinks.forEach(link => {
      if (!link.classList.contains('mobile-dropdown-toggle')) {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
        this.closeMobileMenu();
      }
    });
  }

  // Setup mobile dropdowns
  setupDropdowns() {
    const mobileDropdownToggles = document.querySelectorAll('.mobile-dropdown-toggle');
    
    mobileDropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const dropdown = toggle.closest('.mobile-dropdown');
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.mobile-dropdown').forEach(dd => {
          dd.classList.remove('active');
        });
        
        // Toggle current dropdown
        if (!isActive) {
          dropdown.classList.add('active');
        }
      });
    });
  }

  closeMobileMenu() {
    const navbarToggler = document.getElementById('navbarToggler');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    
    navbarToggler.classList.remove('active');
    mobileMenuOverlay.classList.remove('active');
    document.body.style.overflow = '';
    
    // Close all mobile dropdowns
    document.querySelectorAll('.mobile-dropdown').forEach(dropdown => {
      dropdown.classList.remove('active');
    });
  }

  // Carousel functionality
  setupCarousel() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    // Navigation buttons
    prevBtn.addEventListener('click', () => {
      this.prevSlide();
    });

    nextBtn.addEventListener('click', () => {
      this.nextSlide();
    });

    // Indicator buttons
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        this.goToSlide(index);
      });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.prevSlide();
      } else if (e.key === 'ArrowRight') {
        this.nextSlide();
      }
    });

    // Pause on hover
    const carouselSection = document.getElementById('heroCarousel');
    carouselSection.addEventListener('mouseenter', () => {
      this.pauseAutoSlide();
    });

    carouselSection.addEventListener('mouseleave', () => {
      this.startAutoSlide();
    });
  }

  // Video event handling
  setupVideoEvents() {
    this.slides.forEach((slide, index) => {
      const video = slide.querySelector('.background-video');
      if (video) {
        video.addEventListener('loadedmetadata', () => {
          // Video duration is now available
          console.log(`Video ${index + 1} duration: ${video.duration} seconds`);
        });

        video.addEventListener('ended', () => {
          // Video has ended, move to next slide
          this.nextSlide();
        });

        video.addEventListener('error', (e) => {
          console.error(`Video ${index + 1} error:`, e);
        });
      }
    });
  }

  // Slide navigation methods
  nextSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
    this.updateSlide();
    this.resetAutoSlide();
  }

  prevSlide() {
    if (this.isTransitioning) return;
    
    this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlide();
    this.resetAutoSlide();
  }

  goToSlide(index) {
    if (this.isTransitioning || index === this.currentSlide) return;
    
    this.currentSlide = index;
    this.updateSlide();
    this.resetAutoSlide();
  }

  updateSlide() {
    this.isTransitioning = true;

    // Update slides
    this.slides.forEach((slide, index) => {
      slide.classList.toggle('active', index === this.currentSlide);
    });

    // Update indicators
    this.indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === this.currentSlide);
    });

    // Handle video playback
    this.handleVideoPlayback();

    // Reset transition flag
    setTimeout(() => {
      this.isTransitioning = false;
    }, 500);
  }

  handleVideoPlayback() {
    this.slides.forEach((slide, index) => {
      const video = slide.querySelector('.background-video');
      if (video) {
        if (index === this.currentSlide) {
          video.currentTime = 0;
          video.play().catch(e => {
            console.error('Video play error:', e);
          });
        } else {
          video.pause();
        }
      }
    });
  }

  // Auto-slide functionality
  startAutoSlide() {
    this.pauseAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, this.slideTransitionTime);
  }

  pauseAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resetAutoSlide() {
    this.startAutoSlide();
  }

  // Utility methods
  getCurrentSlideVideo() {
    const currentSlideElement = this.slides[this.currentSlide];
    return currentSlideElement.querySelector('.background-video');
  }

  // Animation utilities
  animateText(element, animationType, delay = 0) {
    setTimeout(() => {
      element.classList.add(animationType);
    }, delay);
  }

  // Responsive utilities
  handleResize() {
    // Handle any responsive adjustments
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // Mobile-specific adjustments
      this.slideTransitionTime = 6000; // Shorter transitions on mobile
    } else {
      // Desktop-specific adjustments
      this.slideTransitionTime = 8000;
    }
    
    // Close mobile menu if window is resized to desktop
    if (window.innerWidth > 991) {
      this.closeMobileMenu();
    }
  }
}

// Intersection Observer for animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const element = entry.target;
      
      // Add animation classes based on data attributes
      if (element.classList.contains('fade-in')) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
      
      if (element.classList.contains('slide-up')) {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
      }
    }
  });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize the main application
  const app = new ModernNavbarCarousel();
  
  // Set up resize handler
  window.addEventListener('resize', () => {
    app.handleResize();
  });
  
  // Set up intersection observer for animations
  document.querySelectorAll('.fade-in, .slide-up').forEach(el => {
    observer.observe(el);
  });
  
  // Handle video autoplay issues
  document.addEventListener('click', () => {
    const videos = document.querySelectorAll('.background-video');
    videos.forEach(video => {
      if (video.paused) {
        video.play().catch(e => {
          console.log('Video autoplay prevented:', e);
        });
      }
    });
  }, { once: true });
});

// Performance optimization
window.addEventListener('beforeunload', () => {
  // Clean up any intervals or event listeners
  const videos = document.querySelectorAll('.background-video');
  videos.forEach(video => {
    video.pause();
    video.src = '';
  });
});

// Export for potential module use
export { ModernNavbarCarousel };