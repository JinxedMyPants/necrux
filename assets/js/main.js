// Necrux Guild - Main JavaScript
// Professional Animated Wild Rift Website

// ===================================
// GSAP & ScrollTrigger Setup
// ===================================
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================================
// Particle Canvas Background
// ===================================
class ParticleCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = window.innerWidth < 768 ? 30 : 50;
        this.mouse = { x: null, y: null };
        this.resize();
        this.init();
        this.animate();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                trail: [], // For wisp tail effect
                trailLength: 10,
                age: 0, // For flickering effect
                lifespan: Math.random() * 100 + 50
            });
        }
    }

    drawParticles() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw particles
        this.particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.age++;

            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            // Add to trail for wisp effect
            particle.trail.push({ x: particle.x, y: particle.y });
            if (particle.trail.length > particle.trailLength) {
                particle.trail.shift();
            }

            // Draw wisp tail (translucent trail)
            for (let j = 0; j < particle.trail.length; j++) {
                const opacity = (j / particle.trail.length) * 0.3;
                    this.ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`;
                this.ctx.beginPath();
                const tailRadius = (particle.radius * (j / particle.trail.length)) * 0.7;
                this.ctx.arc(particle.trail[j].x, particle.trail[j].y, Math.max(0.5, tailRadius), 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Flickering glow effect
            const flicker = Math.sin(particle.age * 0.1) * 0.3 + 0.7;
            
            // Draw particle with undead color mix
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(0, 255, 0, ${0.6 * flicker})`;
            this.ctx.fill();
            
            // Add undead glow halo
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius + 2, 0, Math.PI * 2);
                this.ctx.strokeStyle = `rgba(0, 255, 0, ${0.4 * flicker})`;
            this.ctx.lineWidth = 1.5;
            this.ctx.stroke();

            // Draw connections with mixed red/green
            this.particles.slice(i + 1).forEach(particle2 => {
                const dx = particle.x - particle2.x;
                const dy = particle.y - particle2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 120) {
                    const alpha = 0.2 * (1 - distance / 120);
                    this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 255, 0, ${alpha * 0.6})`;
                    this.ctx.lineWidth = 1;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(particle2.x, particle2.y);
                    this.ctx.stroke();
                }
            });

            // Mouse interaction - souls drawn to cursor
            if (this.mouse.x !== null && this.mouse.y !== null) {
                const dx = particle.x - this.mouse.x;
                const dy = particle.y - this.mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150) {
                    this.ctx.beginPath();
                        this.ctx.strokeStyle = `rgba(0, 255, 0, ${0.4 * (1 - distance / 150)})`;
                    this.ctx.lineWidth = 2;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(this.mouse.x, this.mouse.y);
                    this.ctx.stroke();
                }
            }
        });
    }

    animate() {
        this.drawParticles();
        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ===================================
// Initialize Particle Canvas
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas && !prefersReducedMotion) {
        new ParticleCanvas(canvas);
    }
});

// ===================================
// Navigation
// ===================================
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', !isExpanded);
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// GSAP Animations
// ===================================
if (!prefersReducedMotion) {
    // Hero animations
    gsap.from('.hero-logo', {
        duration: 1,
        opacity: 0,
        scale: 0.8,
        ease: 'back.out(1.7)',
        delay: 0.2
    });

    gsap.from('.hero-title', {
        duration: 1,
        opacity: 0,
        y: 50,
        ease: 'power3.out',
        delay: 0.5
    });

    gsap.from('.hero-subtitle', {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: 'power3.out',
        delay: 0.7
    });

    gsap.from('.hero-tagline', {
        duration: 1,
        opacity: 0,
        y: 30,
        ease: 'power3.out',
        delay: 0.9
    });

    gsap.from('.hero-cta .btn', {
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.2,
        ease: 'power3.out',
        delay: 1.1
    });

    gsap.from('.scroll-indicator', {
        duration: 1,
        opacity: 0,
        ease: 'power2.out',
        delay: 1.5
    });

    // Section fade-in animations
    gsap.utils.toArray('.section').forEach((section) => {
        gsap.from(section.querySelectorAll('.section-title, .section-subtitle'), {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                toggleActions: 'play none none none'
            },
                immediateRender: false,
            duration: 0.8,
            opacity: 0,
            y: 50,
            stagger: 0.2,
            ease: 'power3.out'
        });
    });

    // About section animations
    gsap.from('.about-content', {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 70%'
        },
            immediateRender: false,
        duration: 1,
        opacity: 0,
        x: -50,
        ease: 'power3.out'
    });

    gsap.from('.stat-card', {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.15,
        ease: 'back.out(1.7)'
    });

    // Roster cards animation
    gsap.from('.player-card', {
        scrollTrigger: {
            trigger: '.roster-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 0.8,
        opacity: 0,
        y: 50,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Match cards animation
    gsap.from('.match-card', {
        scrollTrigger: {
            trigger: '.schedule-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 0.8,
        opacity: 0,
        x: -50,
        stagger: 0.15,
        ease: 'power3.out'
    });

    // Achievement cards animation
    gsap.from('.achievement-card', {
        scrollTrigger: {
            trigger: '.achievements-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 0.8,
        opacity: 0,
        scale: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)'
    });

    // Sponsor cards animation
    gsap.from('.sponsor-card', {
        scrollTrigger: {
            trigger: '.sponsors-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 0.8,
        opacity: 0,
        y: 30,
        stagger: 0.1,
        ease: 'power3.out'
    });

    // Contact section animation
    gsap.from('.contact-info', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 1,
        opacity: 0,
        x: -50,
        ease: 'power3.out'
    });

    gsap.from('.contact-form-container', {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 80%'
        },
            immediateRender: false,
        duration: 1,
        opacity: 0,
        x: 50,
        ease: 'power3.out'
    });
}

// ===================================
// Glitch Effect on Hero Title
// ===================================
const glitchElement = document.querySelector('.glitch');
if (glitchElement && !prefersReducedMotion) {
    setInterval(() => {
        glitchElement.style.animation = 'none';
        setTimeout(() => {
            glitchElement.style.animation = 'glitch 0.3s ease-in-out';
        }, 10);
    }, 5000);
}

// ===================================
// Animated Stats Counter
// ===================================
const statNumbers = document.querySelectorAll('.stat-number');

const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    updateCounter();
};

// Trigger counters when in view
if (!prefersReducedMotion) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
}

// ===================================
// Roster Filter
// ===================================
const filterButtons = document.querySelectorAll('.filter-btn');
const playerCards = document.querySelectorAll('.player-card');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const role = button.getAttribute('data-role');
        
        // Update active button
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter cards
        playerCards.forEach(card => {
            const cardRole = card.getAttribute('data-role');
            
            if (role === 'all' || cardRole === role) {
                card.style.display = 'block';
                if (!prefersReducedMotion) {
                    gsap.from(card, {
                        duration: 0.5,
                        opacity: 0,
                        scale: 0.8,
                        ease: 'back.out(1.7)'
                    });
                }
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// ===================================
// Contact Form
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        console.log('Form submitted:', data);
        
        // Show success message (you can customize this)
        alert('Thank you for your interest! We will review your application and get back to you soon. Join our Discord for faster response!');
        
        // Reset form
        contactForm.reset();
    });
}

// ===================================
// Back to Top Button
// ===================================
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===================================
// Discord Link Management
// ===================================
// Update these with your actual Discord invite link
const DISCORD_INVITE = 'https://discord.gg/your-invite-code';

// Update all Discord links
const discordLinks = [
    document.getElementById('discordLink'),
    document.getElementById('heroCTA'),
    document.getElementById('footerDiscord')
];

discordLinks.forEach(link => {
    if (link) {
        link.setAttribute('href', DISCORD_INVITE);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// ===================================
// Image Lazy Loading Enhancement
// ===================================
if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.src = img.dataset.src || img.src;
    });
} else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
}

// ===================================
// Performance Optimizations
// ===================================
// Debounce function for resize events
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

// Optimized resize handler
const handleResize = debounce(() => {
    // Add any resize-specific logic here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', handleResize);

// ===================================
// Accessibility Enhancements
// ===================================
// Add keyboard navigation for cards
const interactiveCards = document.querySelectorAll('.player-card, .achievement-card, .match-card');

interactiveCards.forEach(card => {
    card.setAttribute('tabindex', '0');
    
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });
});

// ===================================
// Console Message
// ===================================
console.log('%c NECRUX GUILD ', 'background: #00FF00; color: #0A0A0F; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Elite Wild Rift Esports Team ', 'color: #00FF00; font-size: 14px;');
console.log('%c Interested in joining? Visit our Discord! ', 'color: #B8B8C8; font-size: 12px;');
