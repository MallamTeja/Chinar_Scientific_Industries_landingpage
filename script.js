// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Cache DOM elements
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navOverlay = document.querySelector('.nav-overlay');
    const contactForm = document.querySelector('.contact-form');
    
    // State management
    let isMenuOpen = false;
    
    // Toggle menu function
    const toggleMenu = () => {
        isMenuOpen = !isMenuOpen;
        
        // Update ARIA attributes
        mobileMenuBtn.setAttribute('aria-expanded', isMenuOpen);
        
        // Toggle classes
        navLinks.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.classList.toggle('menu-open');
        
        // Update button icon
        const icon = mobileMenuBtn.querySelector('i');
        if (isMenuOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    };
    
    // Close menu function
    const closeMenu = () => {
        if (isMenuOpen) {
            toggleMenu();
        }
    };
    
    // Event Listeners
    mobileMenuBtn.addEventListener('click', toggleMenu);
    navOverlay.addEventListener('click', closeMenu);
    
    // Close menu when clicking links
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Handle ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMenu();
        }
    });
    
    // Handle keyboard navigation for menu button
    mobileMenuBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Close menu if open
                if (isMenuOpen) {
                    closeMenu();
                }
                
                // Smooth scroll to target
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update URL without page reload
                history.pushState(null, null, targetId);
            }
        });
    });
    
    // Form submission handling
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const submitButton = contactForm.querySelector('button[type="submit"]');
            
            try {
                // Add loading state
                submitButton.classList.add('loading');
                submitButton.disabled = true;
                
                // Simulate form submission (replace with actual API call)
                await new Promise(resolve => setTimeout(resolve, 1500));
                
                // Show success message on the button itself
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Thank you, we will reach out to you';
                
                // Revert button text and reset form after a delay
                setTimeout(() => {
                    submitButton.textContent = originalButtonText;
                    contactForm.reset();
                }, 3000); // Message visible for 3 seconds
                
            } catch (error) {
                // Show error message using createToast (or alert if createToast is not defined)
                if (typeof createToast === 'function') {
                    createToast('Sorry, there was an error sending your message. Please try again.', 'error');
                } else {
                    alert('Sorry, there was an error sending your message. Please try again.');
                }
                
            } finally {
                // Remove loading state (only for error case, success handles its own reset)
                if (error) {
                    submitButton.classList.remove('loading');
                    submitButton.disabled = false;
                }
            }
        });
    }
    
    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe only cards within sections
    document.querySelectorAll('section .service-card, section .product-card, section .client-card-link').forEach(element => {
        observer.observe(element);
    });
    
    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Close menu on large screens
            if (window.innerWidth >= 768 && isMenuOpen) {
                closeMenu();
            }
        }, 250);
    });
}); 