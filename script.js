// Configuration and Constants
const CONFIG = {
    TYPING_SPEED: 200,
    DELETE_SPEED: 100,
    PAUSE_TIME: 3000,
    OBSERVER_THRESHOLD: 0.1,
    OBSERVER_ROOT_MARGIN: '0px 0px -50px 0px',
    NAVBAR_SCROLL_THRESHOLD: 50
};

const TIMELINE_MAPPING = {
    0: 4, // KPMG (horizontal index 0) -> timeline index 4 (last in chronological)
    1: 3, // UIC Research (horizontal index 1) -> timeline index 3
    2: 2, // AbbVie (horizontal index 2) -> timeline index 2
    3: 1, // Snap Inc (horizontal index 3) -> timeline index 1
    4: 0  // UW Research (horizontal index 4) -> timeline index 0 (first in chronological)
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
    // Horizontal timeline interactions
    elements.horizontalItems.forEach((item, horizontalIndex) => {
        item.addEventListener('mouseenter', () => handleHorizontalItemHover(horizontalIndex, true));
        item.addEventListener('mouseleave', () => handleHorizontalItemHover(horizontalIndex, false));
        
        // Keyboard support
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleHorizontalItemHover(horizontalIndex, true);
            }
        });
        
        item.addEventListener('blur', () => handleHorizontalItemHover(horizontalIndex, false));
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

const handleHorizontalItemHover = (horizontalIndex, isHovering) => {
    if (isHovering) {
        // Remove active class from all items
        elements.horizontalItems.forEach(i => i.classList.remove('active'));
        elements.timelineItems.forEach(i => {
            i.style.opacity = '0.3';
            i.style.transform = 'translateX(0)';
        });
        
        // Add active class to current item
        elements.horizontalItems[horizontalIndex]?.classList.add('active');
        
        // Highlight corresponding timeline item
        const timelineIndex = TIMELINE_MAPPING[horizontalIndex];
        const correspondingItem = document.querySelector(`[data-timeline-index="${timelineIndex}"]`);
        if (correspondingItem) {
            correspondingItem.style.opacity = '1';
            correspondingItem.style.transform = 'translateX(10px)';
        }
    } else {
        // Reset all items
        elements.horizontalItems.forEach(i => i.classList.remove('active'));
        elements.timelineItems.forEach(i => {
            i.style.opacity = '1';
            i.style.transform = 'translateX(0)';
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

// Contact Form Functions
const initializeContactButtons = () => {
    elements.contactButtons.forEach(button => {
        button.addEventListener('click', handleContactButtonClick);
    });
};

const handleContactButtonClick = (e) => {
    const button = e.target;
    
    if (button.textContent === 'DOWNLOAD CV') {
        // Update with actual CV file path
        try {
            window.open('Sy, E. Résumé 2024.pdf', '_blank');
        } catch (error) {
            console.warn('CV file not found. Please ensure the CV file exists in the root directory.');
            // Fallback: Could show a message to user or redirect to contact
        }
    }
};

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