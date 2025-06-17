// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Fade in animation on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Typing animation for hero text
function typeWriter(element, text, speed = 100, deleteSpeed = 50, pauseTime = 2000) {
    let i = 0;
    let isDeleting = false;
    
    function type() {
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
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const typingElement = document.getElementById('typing-name');
    if (typingElement) {
        // Clear initial text and start animation
        typingElement.textContent = '';
        setTimeout(() => {
            typeWriter(typingElement, 'Erika Sy', 200, 100, 3000);
        }, 1000);
    }
});

// Contact form functionality
const contactButtons = document.querySelectorAll('.contact-button');
contactButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        if (button.textContent === 'DOWNLOAD CV') {
            // Add link to your CV here
            window.open('Sy, E. Résumé 2024.pdf', '_blank');
        }
    });
});

// Timeline interaction
const horizontalItems = document.querySelectorAll('.horizontal-timeline-item');
const timelineItems = document.querySelectorAll('.timeline-item');

horizontalItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        // Remove active class from all items
        horizontalItems.forEach(i => i.classList.remove('active'));
        timelineItems.forEach(i => i.style.opacity = '0.3');
        
        // Add active class to current item
        item.classList.add('active');
        
        // Highlight corresponding timeline item
        const correspondingItem = document.querySelector(`[data-timeline-index="${index}"]`);
        if (correspondingItem) {
            correspondingItem.style.opacity = '1';
            correspondingItem.style.transform = 'translateX(10px)';
        }
    });

    item.addEventListener('mouseleave', () => {
        // Reset all items
        horizontalItems.forEach(i => i.classList.remove('active'));
        timelineItems.forEach(i => {
            i.style.opacity = '1';
            i.style.transform = 'translateX(0)';
        });
    });
});

// Timeline dots interaction
const timelineDots = document.querySelectorAll('.timeline-dot');
timelineDots.forEach((dot, index) => {
    dot.addEventListener('mouseenter', () => {
        const correspondingHorizontalItem = document.querySelector(`[data-index="${timelineItems.length - 1 - index}"]`);
        if (correspondingHorizontalItem) {
            correspondingHorizontalItem.classList.add('active');
        }
    });

    dot.addEventListener('mouseleave', () => {
        horizontalItems.forEach(i => i.classList.remove('active'));
    });
});