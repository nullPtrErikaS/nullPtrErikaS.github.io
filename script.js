// Configuration and Constants
const CONFIG = {
    TYPING_SPEED: 200,
    DELETE_SPEED: 100,
    PAUSE_TIME: 3000,
    OBSERVER_THRESHOLD: 0.1,
    OBSERVER_ROOT_MARGIN: '0px 0px -50px 0px',
    NAVBAR_SCROLL_THRESHOLD: 50
};

// Updated timeline mapping for new experiences
const TIMELINE_MAPPING = {
    0: 5, // KPMG (horizontal index 0) -> timeline index 5 (last chronologically)
    1: 4, // AbbVie 2024 (horizontal index 1) -> timeline index 4
    2: 3, // Snap Inc (horizontal index 2) -> timeline index 3
    3: 2, // UW Research (horizontal index 3) -> timeline index 2
    4: 1, // NASA NPWEE (horizontal index 4) -> timeline index 1
    5: 0  // AbbVie Current (horizontal index 5) -> timeline index 0 (first chronologically - current)
};

// DOM Elements Cache
const elements = {
    navToggle: document.querySelector('.nav-toggle'),
    navMenu: document.querySelector('.nav-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    navbar: document.querySelector('.navbar'),
    typingElement: document.getElementById('typing-name'),
    contactButtons: document.querySelectorAll('.contact-button'),
    horizontalItems: document.querySelectorAll('.horizontal-timeline-item'),
    timelineItems: document.querySelectorAll('.timeline-item'),
    timelineDots: document.querySelectorAll('.timeline-dot'),
    fadeInElements: document.querySelectorAll('.fade-in')
};

// Utility Functions
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const addEventListeners = (elements, event, handler) => {
    elements.forEach(element => element.addEventListener(event, handler));
};

// Navigation Functions
const initializeNavigation = () => {
    // Mobile navigation toggle
    elements.navToggle?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on a link
    addEventListeners(elements.navLinks, 'click', closeMobileMenu);
    
    // Smooth scrolling for navigation links
    addEventListeners(document.querySelectorAll('a[href^="#"]'), 'click', handleSmoothScroll);
    
    // Navbar background change on scroll
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
};

const toggleMobileMenu = () => {
    elements.navMenu?.classList.toggle('active');
};

const closeMobileMenu = () => {
    elements.navMenu?.classList.remove('active');
};

const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
        targetElement.scrollIntoView({
            behavior: 'smooth'
        });
    }
};

const handleNavbarScroll = () => {
    if (!elements.navbar) return;
    
    const scrollY = window.scrollY;
    
    if (scrollY > CONFIG.NAVBAR_SCROLL_THRESHOLD) {
        elements.navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        elements.navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        elements.navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        elements.navbar.style.boxShadow = 'none';
    }
};

// Typing Animation
const initializeTypingAnimation = () => {
    if (!elements.typingElement) return;
    
    // Clear initial text and start animation after page load
    elements.typingElement.textContent = '';
    setTimeout(() => {
        typeWriter(elements.typingElement, 'Erika Sy');
    }, 1000);
};

const typeWriter = (element, text, speed = CONFIG.TYPING_SPEED, deleteSpeed = CONFIG.DELETE_SPEED, pauseTime = CONFIG.PAUSE_TIME) => {
    let i = 0;
    let isDeleting = false;
    
    const type = () => {
        if (!isDeleting && i < text.length) {
            // Typing
            element.textContent = text.substring(0, i + 1);
            i++;
            setTimeout(type, speed);
        } else if (!isDeleting && i === text.length) {
            // Pause before deleting
            setTimeout(() => {
                isDeleting = true;
                type();
            }, pauseTime);
        } else if (isDeleting && i > 0) {
            // Deleting
            element.textContent = text.substring(0, i - 1);
            i--;
            setTimeout(type, deleteSpeed);
        } else if (isDeleting && i === 0) {
            // Start typing again
            isDeleting = false;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Scroll Animations
const initializeScrollAnimations = () => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: CONFIG.OBSERVER_THRESHOLD,
            rootMargin: CONFIG.OBSERVER_ROOT_MARGIN
        }
    );

    elements.fadeInElements.forEach(el => observer.observe(el));
};

// Timeline Interactions
const initializeTimeline = () => {
    // Duration bar interactions
    const durationBars = document.querySelectorAll('.duration-bar');
    durationBars.forEach(bar => {
        bar.addEventListener('click', handleDurationBarClick);
        bar.addEventListener('mouseenter', handleDurationBarHover);
    });

    // Timeline dots interaction
    elements.timelineDots.forEach((dot, timelineIndex) => {
        dot.addEventListener('mouseenter', () => handleTimelineDotHover(timelineIndex, true));
        dot.addEventListener('mouseleave', () => handleTimelineDotHover(timelineIndex, false));
        
        // Keyboard support
        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleTimelineDotHover(timelineIndex, true);
            }
        });
        
        dot.addEventListener('blur', () => handleTimelineDotHover(timelineIndex, false));
    });
};

const handleDurationBarClick = (e) => {
    const tooltip = e.currentTarget.querySelector('.duration-tooltip');
    const tooltipText = tooltip ? tooltip.textContent : '';
    
    // Updated position mapping for new experiences
    const positionMapping = {
        'KPMG Seasonal Advisory Intern': 5,
        'AbbVie Technology Intern (2024)': 4,
        'Snap Inc AR Extern': 3,
        'UW Research Assistant (Current)': 2,
        'NASA Lead Software Engineer': 1,
        'AbbVie Technology Intern (Current)': 0,
        // Leadership positions will scroll to leadership section
        'Various Leadership Roles': 'leadership'
    };
    
    const targetIndex = positionMapping[tooltipText];
    
    if (targetIndex === 'leadership') {
        // Scroll to leadership section
        const leadershipSection = document.querySelector('#leadership');
        if (leadershipSection) {
            leadershipSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    } else if (typeof targetIndex === 'number') {
        // Scroll to specific timeline item
        const targetItem = document.querySelector(`[data-timeline-index="${targetIndex}"]`);
        if (targetItem) {
            // Add highlight effect
            highlightTimelineItem(targetIndex);
            
            // Scroll to the timeline item
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }
};

const handleDurationBarHover = (e) => {
    const bar = e.currentTarget;
    const tooltip = bar.querySelector('.duration-tooltip');
    
    // Add a subtle glow effect
    bar.style.boxShadow = '0 4px 20px rgba(255, 115, 0, 0.3)';
    
    // Remove glow on mouse leave
    bar.addEventListener('mouseleave', () => {
        bar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    }, { once: true });
};

const highlightTimelineItem = (timelineIndex) => {
    // Reset all timeline items
    elements.timelineItems.forEach(item => {
        item.style.opacity = '0.4';
        item.style.transform = 'translateX(0)';
        item.classList.remove('highlighted');
    });
    
    // Highlight target item
    const targetItem = document.querySelector(`[data-timeline-index="${timelineIndex}"]`);
    if (targetItem) {
        targetItem.style.opacity = '1';
        targetItem.style.transform = 'translateX(15px)';
        targetItem.classList.add('highlighted');
        
        // Reset after 3 seconds
        setTimeout(() => {
            elements.timelineItems.forEach(item => {
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
                item.classList.remove('highlighted');
            });
        }, 3000);
    }
};

const handleHorizontalItemHover = (horizontalIndex, isHovering) => {
    if (isHovering) {
        // Remove active class from all items
        elements.horizontalItems.forEach(i => i.classList.remove('active'));
        elements.timelineItems.forEach(i => {
            i.style.opacity = '0.3';
            i.style.transform = 'translateX(0)';
            i.classList.remove('highlighted');
        });
        
        // Add active class to current item
        elements.horizontalItems[horizontalIndex]?.classList.add('active');
        
        // Highlight corresponding timeline item
        const timelineIndex = TIMELINE_MAPPING[horizontalIndex];
        const correspondingItem = document.querySelector(`[data-timeline-index="${timelineIndex}"]`);
        if (correspondingItem) {
            correspondingItem.style.opacity = '1';
            correspondingItem.style.transform = 'translateX(10px)';
            correspondingItem.classList.add('highlighted');
        }
    } else {
        // Reset all items
        elements.horizontalItems.forEach(i => i.classList.remove('active'));
        elements.timelineItems.forEach(i => {
            i.style.opacity = '1';
            i.style.transform = 'translateX(0)';
            i.classList.remove('highlighted');
        });
    }
};

const handleTimelineDotHover = (timelineIndex, isHovering) => {
    if (isHovering) {
        // Find the corresponding horizontal item
        const horizontalIndex = Object.keys(TIMELINE_MAPPING).find(key => TIMELINE_MAPPING[key] === timelineIndex);
        const correspondingHorizontalItem = document.querySelector(`[data-index="${horizontalIndex}"]`);
        if (correspondingHorizontalItem) {
            correspondingHorizontalItem.classList.add('active');
        }
    } else {
        elements.horizontalItems.forEach(i => i.classList.remove('active'));
    }
};

const scrollToTimelineItem = (horizontalIndex) => {
    const timelineIndex = TIMELINE_MAPPING[horizontalIndex];
    const targetItem = document.querySelector(`[data-timeline-index="${timelineIndex}"]`);
    
    if (targetItem) {
        // Add a brief highlight effect
        handleHorizontalItemHover(horizontalIndex, true);
        
        // Scroll to the timeline item
        targetItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        
        // Remove highlight after scroll
        setTimeout(() => {
            handleHorizontalItemHover(horizontalIndex, false);
        }, 2000);
    }
};

// Contact Form Functions
const initializeContactButtons = () => {
    elements.contactButtons.forEach(button => {
        button.addEventListener('click', handleContactButtonClick);
    });
};

const handleContactButtonClick = (e) => {
    const button = e.target;
    
    if (button.textContent === 'DOWNLOAD RESUME') {
        // Update with actual CV file path
        try {
            window.open('Sy, E. Résumé 2025.pdf', '_blank');
        } catch (error) {
            console.warn('CV file not found. Please ensure the CV file exists in the root directory.');
            // Fallback: Could show a message to user or redirect to contact
        }
    }
};

// Leadership Card Interactions
const initializeLeadershipCards = () => {
    const leadershipItems = document.querySelectorAll('.leadership-item');
    
    leadershipItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0) scale(1)';
        });
    });
};

// Portfolio Carousel Functions
let currentSlide = 0;
const totalProjects = 8; // Updated to match new project count
let projectsPerSlide = 3; // This will change based on screen size
let totalSlides = Math.ceil(totalProjects / projectsPerSlide);

const getProjectsPerSlide = () => {
    if (window.innerWidth <= 768) {
        return 1; // 1 project per slide on mobile
    } else if (window.innerWidth <= 1024) {
        return 2; // 2 projects per slide on tablet
    } else {
        return 3; // 3 projects per slide on desktop
    }
};

const updateCarouselSettings = () => {
    projectsPerSlide = getProjectsPerSlide();
    totalSlides = Math.ceil(totalProjects / projectsPerSlide);
    
    // Reset to first slide if current slide is now out of bounds
    if (currentSlide >= totalSlides) {
        currentSlide = totalSlides - 1;
    }
    
    // Update indicators
    updateCarouselIndicators();
};

const updateCarouselIndicators = () => {
    const indicatorsContainer = document.getElementById('carousel-indicators');
    if (!indicatorsContainer) return;
    
    // Clear existing indicators
    indicatorsContainer.innerHTML = '';
    
    // Create new indicators based on current totalSlides
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = `carousel-dot ${i === currentSlide ? 'active' : ''}`;
        dot.addEventListener('click', () => {
            currentSlide = i;
            updateCarousel();
        });
        indicatorsContainer.appendChild(dot);
    }
};

const initializePortfolioCarousel = () => {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const track = document.getElementById('portfolio-track');
    
    if (!track) return;
    
    // Update settings based on screen size
    updateCarouselSettings();
    
    // Button event listeners
    prevBtn?.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        }
    });
    
    nextBtn?.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateCarousel();
        }
    });
    
    // Touch/swipe support
    let startX = 0;
    let isDragging = false;
    
    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });
    
    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) { // Minimum swipe distance
            if (diffX > 0 && currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            } else if (diffX < 0 && currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            }
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.portfolio-carousel')) {
            if (e.key === 'ArrowLeft' && currentSlide > 0) {
                currentSlide--;
                updateCarousel();
            } else if (e.key === 'ArrowRight' && currentSlide < totalSlides - 1) {
                currentSlide++;
                updateCarousel();
            }
        }
    });
    
    // Initialize
    updateCarousel();
};

const updateCarousel = () => {
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const indicators = document.querySelectorAll('.carousel-dot');
    const counter = document.getElementById('carousel-counter');
    
    if (!track) return;
    
    // Calculate responsive slide width
    const slideWidth = getSlideWidth();
    const translateX = currentSlide * slideWidth;
    
    // Move the track
    track.style.transform = `translateX(-${translateX}%)`;
    
    // Update button states
    if (prevBtn) {
        prevBtn.disabled = currentSlide === 0;
    }
    if (nextBtn) {
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Update indicators
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Update counter
    if (counter) {
        const startProject = currentSlide * projectsPerSlide + 1;
        const endProject = Math.min((currentSlide + 1) * projectsPerSlide, totalProjects);
        counter.textContent = `${startProject}-${endProject} of ${totalProjects} projects`;
    }
};

const getSlideWidth = () => {
    // Responsive slide width based on screen size and projects per slide
    if (window.innerWidth <= 768) {
        return 100; // 1 project per slide, so 100% per slide
    } else if (window.innerWidth <= 1024) {
        return 100; // 2 projects per slide, but we move 100% to show next 2
    } else {
        return 100; // 3 projects per slide, move 100% to show next 3
    }
};

// Handle window resize
window.addEventListener('resize', debounce(() => {
    updateCarouselSettings();
    updateCarousel();
}, 250));

// Error Handling
const handleErrors = () => {
    window.addEventListener('error', (e) => {
        console.error('JavaScript error:', e.error);
    });
    
    // Handle missing elements gracefully
    Object.entries(elements).forEach(([key, element]) => {
        if (!element && key !== 'typingElement') {
            console.warn(`Element ${key} not found`);
        }
    });
};

// Performance Optimizations
const optimizeAnimations = () => {
    // Reduce motion for users who prefer it
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.documentElement.style.setProperty('--transition', 'none');
        
        // Disable typing animation
        if (elements.typingElement) {
            elements.typingElement.textContent = 'Erika Sy';
        }
    }
};

// Accessibility Enhancements
const enhanceAccessibility = () => {
    // Add ARIA labels for screen readers
    const timelineItems = document.querySelectorAll('.horizontal-timeline-item');
    timelineItems.forEach((item, index) => {
        if (!item.getAttribute('aria-label')) {
            const company = item.querySelector('.horizontal-flag')?.textContent;
            item.setAttribute('aria-label', `${company} experience timeline item`);
        }
    });
    
    // Add keyboard navigation for timeline
    document.addEventListener('keydown', (e) => {
        if (e.target.closest('.horizontal-timeline-item') || e.target.closest('.timeline-dot')) {
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                navigateTimeline(e.key === 'ArrowRight' ? 1 : -1);
            }
        }
    });
};

const navigateTimeline = (direction) => {
    const focusedElement = document.activeElement;
    const timelineItems = Array.from(elements.horizontalItems);
    const currentIndex = timelineItems.indexOf(focusedElement);
    
    if (currentIndex !== -1) {
        const newIndex = Math.max(0, Math.min(timelineItems.length - 1, currentIndex + direction));
        timelineItems[newIndex]?.focus();
    }
};

// SEO and Meta Tag Updates
const updatePageMeta = () => {
    // Update page title based on current section
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                const titles = {
                    'home': 'Erika Sy - Computer Science Student',
                    'about': 'About - Erika Sy',
                    'experience': 'Experience - Erika Sy',
                    'portfolio': 'Portfolio - Erika Sy',
                    'leadership': 'Leadership - Erika Sy',
                    'contact': 'Contact - Erika Sy'
                };
                
                if (titles[sectionId]) {
                    document.title = titles[sectionId];
                }
            }
        });
    }, { threshold: 0.5 });
    
    document.querySelectorAll('section[id]').forEach(section => {
        observer.observe(section);
    });
};

// Main Initialization
const init = () => {
    try {
        // Core functionality
        initializeNavigation();
        initializeScrollAnimations();
        initializeTimeline();
        initializeContactButtons();
        
        // Enhanced interactions
        initializeLeadershipCards();
        initializePortfolioCarousel();
        
        // Enhanced features
        enhanceAccessibility();
        optimizeAnimations();
        updatePageMeta();
        handleErrors();
        
        console.log('Portfolio website initialized successfully');
    } catch (error) {
        console.error('Error initializing portfolio:', error);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// Initialize typing animation after page load
window.addEventListener('load', () => {
    initializeTypingAnimation();
});

// Service Worker Registration for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        typeWriter,
        debounce,
        handleNavbarScroll,
        TIMELINE_MAPPING,
        CONFIG
    };
}