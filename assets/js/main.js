// Necrux Guild - Main JavaScript
// Professional Animated Wild Rift Website

// ===================================
// GSAP & ScrollTrigger Setup
// ===================================
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Keep a reference for global resize handlers
let necromanticCanvasInstance = null;

// ===================================
// Fire Canvas Background (Procedural Flame)
// ===================================
class FireCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.buffer = document.createElement('canvas');
        this.bufferCtx = this.buffer.getContext('2d', { willReadFrequently: true });
        this.palette = this.buildPalette();
        this.ashParticles = [];
        this.resize();
        this.init();
        this.animate();
    }

    buildPalette() {
        const palette = new Array(256);
        for (let i = 0; i < 256; i++) {
            let r = 0;
            let g = 0;
            let b = 0;

            if (i < 90) {
                g = Math.floor(i * 2.6);
                r = Math.floor(i * 0.6);
            } else if (i < 180) {
                g = 200 + Math.floor((i - 90) * 0.6);
                r = 60 + Math.floor((i - 90) * 0.7);
                b = Math.floor((i - 90) * 0.2);
            } else {
                g = 255;
                r = 140 + Math.floor((i - 180) * 0.9);
                b = 40 + Math.floor((i - 180) * 0.5);
            }

            palette[i] = [
                Math.min(255, r),
                Math.min(255, g),
                Math.min(160, b),
                Math.min(210, i + 20)
            ];
        }
        return palette;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.scale = window.innerWidth < 768 ? 4 : 3;
        this.fireWidth = Math.max(120, Math.floor(this.canvas.width / this.scale));
        this.fireHeight = Math.max(60, Math.floor(this.canvas.height / this.scale / 2.4));
        this.buffer.width = this.fireWidth;
        this.buffer.height = this.fireHeight;
        this.imageData = this.bufferCtx.createImageData(this.fireWidth, this.fireHeight);
        this.fire = new Uint8Array(this.fireWidth * this.fireHeight);
        // Reduce flame height cap on mobile to prevent cutoff by viewport height constraints
        const heightCap = window.innerWidth < 768 ? Math.floor(this.canvas.height * 0.35) : Math.floor(this.canvas.height * 0.38);
        this.maxFlameHeightPx = Math.max(300, heightCap);
    }

    init() {
        this.fire.fill(0);
        this.initAsh();
    }

    initAsh() {
        const count = window.innerWidth < 768 ? 45 : 80;
        this.ashParticles = Array.from({ length: count }, () => ({
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            radius: Math.random() * 1.8 + 0.6,
            speed: Math.random() * 0.25 + 0.15,
            drift: (Math.random() - 0.5) * 0.25,
            opacity: Math.random() * 0.35 + 0.2
        }));
    }

    seedFire() {
        const base = (this.fireHeight - 1) * this.fireWidth;
        for (let x = 0; x < this.fireWidth; x++) {
            this.fire[base + x] = 200 + (Math.random() * 55) | 0;
        }
    }

    updateFire() {
        this.seedFire();
        for (let y = 1; y < this.fireHeight; y++) {
            for (let x = 0; x < this.fireWidth; x++) {
                const src = y * this.fireWidth + x;
                const below = src + this.fireWidth;
                const decay = (Math.random() * 3) | 0;
                const dstX = Math.min(this.fireWidth - 1, Math.max(0, x + decay - 1));
                const dst = (y - 1) * this.fireWidth + dstX;
                const intensity = this.fire[below] - decay * 6;
                this.fire[dst] = intensity > 0 ? intensity : 0;
            }
        }
    }

    renderFire() {
        const data = this.imageData.data;
        for (let i = 0; i < this.fire.length; i++) {
            const intensity = this.fire[i];
            const [r, g, b, a] = this.palette[intensity];
            const index = i * 4;
            data[index] = r;
            data[index + 1] = g;
            data[index + 2] = b;
            data[index + 3] = a;
        }
        this.bufferCtx.putImageData(this.imageData, 0, 0);

        const targetHeight = Math.min(this.fireHeight * this.scale, this.maxFlameHeightPx);
        const targetY = this.canvas.height - targetHeight;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        this.ctx.globalAlpha = 1.0;
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.drawImage(this.buffer, 0, targetY, this.canvas.width, targetHeight);
        this.ctx.restore();

        // Ultra-smooth fade out upper edge - extended gradient for seamless transition
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'destination-out';
        const fadeHeight = Math.min(300, targetHeight * 0.65);
        const fadeGradient = this.ctx.createLinearGradient(0, targetY, 0, targetY + fadeHeight);
        fadeGradient.addColorStop(0, 'rgba(0, 0, 0, 0.95)');
        fadeGradient.addColorStop(0.08, 'rgba(0, 0, 0, 0.85)');
        fadeGradient.addColorStop(0.15, 'rgba(0, 0, 0, 0.7)');
        fadeGradient.addColorStop(0.25, 'rgba(0, 0, 0, 0.5)');
        fadeGradient.addColorStop(0.35, 'rgba(0, 0, 0, 0.35)');
        fadeGradient.addColorStop(0.5, 'rgba(0, 0, 0, 0.2)');
        fadeGradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.1)');
        fadeGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.03)');
        fadeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        this.ctx.fillStyle = fadeGradient;
        this.ctx.fillRect(0, targetY, this.canvas.width, fadeHeight);
        this.ctx.restore();
    }

    renderAsh() {
        const ctx = this.ctx;
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(210, 220, 210, 0.25)';

        this.ashParticles.forEach((particle) => {
            particle.y -= particle.speed;
            particle.x += particle.drift;
            particle.opacity += (Math.random() - 0.5) * 0.02;
            particle.opacity = Math.max(0.15, Math.min(0.5, particle.opacity));

            if (particle.y < -10) {
                particle.y = this.canvas.height + 10;
                particle.x = Math.random() * this.canvas.width;
            }

            if (particle.x < -10) particle.x = this.canvas.width + 10;
            if (particle.x > this.canvas.width + 10) particle.x = -10;

            ctx.globalAlpha = particle.opacity;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fill();
        });

        ctx.restore();
    }

    animate() {
        const now = performance.now();
        if (!this.lastUpdate) this.lastUpdate = now;
        const delta = now - this.lastUpdate;
        if (delta > 32) {
            this.updateFire();
            this.lastUpdate = now;
        }
        this.renderFire();
        this.renderAsh();
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// Initialize Necromantic Canvas
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas && !prefersReducedMotion) {
        necromanticCanvasInstance = new FireCanvas(canvas);
    }
});

// ===================================
// 3D Tilt Effects (Hero Logo + Cards)
// ===================================
if (!prefersReducedMotion) {
    const createTilt = (element, maxTilt = 12, perspective = 900) => {
        const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

        const handleMove = (event) => {
            const rect = element.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const midX = rect.width / 2;
            const midY = rect.height / 2;
            const tiltX = clamp(((y - midY) / midY) * -maxTilt, -maxTilt, maxTilt);
            const tiltY = clamp(((x - midX) / midX) * maxTilt, -maxTilt, maxTilt);

            element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
        };

        const reset = () => {
            element.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
        };

        element.addEventListener('mousemove', handleMove);
        element.addEventListener('mouseleave', reset);
        element.addEventListener('blur', reset);
    };

    const heroLogo = document.querySelector('.hero-logo');
    if (heroLogo) {
        createTilt(heroLogo, 18, 700);
    }

    document.querySelectorAll('.player-card').forEach((card) => {
        createTilt(card, 20, 800);
    });
}

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
    anchor.addEventListener('click', function () {
        const href = this.getAttribute('href');
        if (href === '#' || !href) return;
        const target = document.querySelector(href);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const offset = Math.max(navHeight - 24, 0);
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Parallax effect for hero background and content
if (!prefersReducedMotion) {
    const heroBg = document.querySelector('.hero-background');
    const heroContent = document.querySelector('.hero-content');
    let ticking = false;

    const handleParallax = () => {
        if (!heroBg || !heroContent) return;
        const scrollY = window.scrollY;
        const offset = Math.min(scrollY * 0.5, 200);
        const contentOffset = Math.min(scrollY * 0.15, 60);
        heroBg.style.transform = `translateY(${offset}px)`;
        heroContent.style.transform = `translateY(${contentOffset * -0.5}px) scale(${1 - scrollY * 0.0002})`;
        ticking = false;
    };

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(handleParallax);
            ticking = true;
        }
    });
}

// ===================================
// GSAP Animations
// ===================================
if (!prefersReducedMotion) {
    // Hero animations (faster, immediate feel)
    gsap.fromTo('.hero-logo', { opacity: 0, scale: 0.9 }, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        ease: 'back.out(1.4)',
        delay: 0.05
    });

    gsap.fromTo('.hero-title', { opacity: 0, y: 24 }, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        delay: 0.12
    });

    gsap.fromTo('.hero-subtitle', { opacity: 0, y: 18 }, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        delay: 0.18
    });

    gsap.fromTo('.hero-tagline', { opacity: 0, y: 18 }, {
        duration: 0.6,
        opacity: 1,
        y: 0,
        ease: 'power3.out',
        delay: 0.24
    });


    gsap.fromTo('.scroll-indicator', { opacity: 0 }, {
        duration: 0.5,
        opacity: 1,
        ease: 'power2.out',
        delay: 0.4
    });

    // Roster filter buttons
    gsap.fromTo('.roster-filter .filter-btn', { opacity: 0, y: 12 }, {
        duration: 0.4,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out',
        delay: 0.32
    });

    // Section fade-in animations (visible by default; quick transitions)
    gsap.utils.toArray('.section').forEach((section) => {
        gsap.fromTo(section.querySelectorAll('.section-title, .section-subtitle'),
                { opacity: 0.95, y: 12 },
            {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                },
                immediateRender: false,
                duration: 0.4,
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: 'power2.out'
            }
        );
    });

    // About section animations
    gsap.fromTo('.about-content', { opacity: 0.95, x: -14 }, {
        scrollTrigger: {
            trigger: '.about-section',
            start: 'top 80%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        x: 0,
        ease: 'power2.out'
    });

    gsap.fromTo('.stat-card', { opacity: 0.95, y: 14 }, {
        scrollTrigger: {
            trigger: '.about-stats',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: 'back.out(1.4)'
    });

    // Programs cards
    gsap.fromTo('.offer-card', { opacity: 0.95, y: 14 }, {
        scrollTrigger: {
            trigger: '.offerings-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Roster cards animation
    gsap.fromTo('.player-card', { opacity: 0.95, y: 14 }, {
        scrollTrigger: {
            trigger: '.roster-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // Match cards animation
    gsap.fromTo('.match-card', { opacity: 0.95, x: -16 }, {
        scrollTrigger: {
            trigger: '.schedule-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        x: 0,
        stagger: 0.1,
        ease: 'power2.out'
    });

    // Highlight cards animation
    gsap.fromTo('.highlight-card', { opacity: 0.95, y: 14 }, {
        scrollTrigger: {
            trigger: '.highlights-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // Achievement cards animation
    gsap.fromTo('.achievement-card', { opacity: 0.95, scale: 0.96 }, {
        scrollTrigger: {
            trigger: '.achievements-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        scale: 1,
        stagger: 0.08,
        ease: 'back.out(1.4)'
    });

    // Community proof + testimonials
    gsap.fromTo('.proof-card', { opacity: 0.95, y: 12 }, {
        scrollTrigger: {
            trigger: '.proof-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // Only animate endorsement cards if they exist
    if (document.querySelector('.endorsement-card')) {
        gsap.fromTo('.endorsement-card', { opacity: 0.95, y: 12 }, {
            scrollTrigger: {
                trigger: '.endorsement-grid',
                start: 'top 85%'
            },
            immediateRender: false,
            duration: 0.5,
            opacity: 1,
            y: 0,
            stagger: 0.08,
            ease: 'power2.out'
        });
    }

    // Sponsor cards animation
    gsap.fromTo('.sponsor-card', { opacity: 0.95, y: 12 }, {
        scrollTrigger: {
            trigger: '.sponsors-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // FAQ items
    gsap.fromTo('.faq-item', { opacity: 0.95, y: 12 }, {
        scrollTrigger: {
            trigger: '.faq-list',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.45,
        opacity: 1,
        y: 0,
        stagger: 0.06,
        ease: 'power2.out'
    });

    // Requirements list
    gsap.fromTo('.requirements-list li', { opacity: 0.9, x: -12 }, {
        scrollTrigger: {
            trigger: '.requirements-list',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.45,
        opacity: 1,
        x: 0,
        stagger: 0.06,
        ease: 'power2.out'
    });

    // Footer columns
    gsap.fromTo('.footer-column', { opacity: 0.9, y: 10 }, {
        scrollTrigger: {
            trigger: '.footer-content',
            start: 'top 90%'
        },
        immediateRender: false,
        duration: 0.45,
        opacity: 1,
        y: 0,
        stagger: 0.08,
        ease: 'power2.out'
    });

    // Contact section animation
    gsap.fromTo('.contact-info', { opacity: 0.95, x: -14 }, {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        x: 0,
        ease: 'power2.out'
    });

    gsap.fromTo('.contact-form-container', { opacity: 0.95, x: 14 }, {
        scrollTrigger: {
            trigger: '.contact-grid',
            start: 'top 85%'
        },
        immediateRender: false,
        duration: 0.5,
        opacity: 1,
        x: 0,
        ease: 'power2.out'
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
    const target = Number.parseInt(element.getAttribute('data-target'), 10);
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
// Contact Form (Web3Forms)
// ===================================
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.innerHTML = '<span class="btn-text">✓ Sent!</span>';
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.innerHTML = '<span class="btn-text">Error - Try Again</span>';
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
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
const DISCORD_INVITE = 'https://discord.gg/XNR3be2t';

// Update all Discord links
const discordLinks = [
    document.getElementById('discordLink')
];

discordLinks.forEach(link => {
    if (link) {
        link.setAttribute('href', DISCORD_INVITE);
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    }
});

// Sponsor modal
const sponsorCta = document.getElementById('sponsorCta');
const sponsorModal = document.getElementById('sponsorModal');
const sponsorModalClose = document.getElementById('sponsorModalClose');
const sponsorModalBackdrop = document.getElementById('sponsorModalBackdrop');
const sponsorForm = document.getElementById('sponsorForm');

const openSponsorModal = () => {
    if (sponsorModal) {
        sponsorModal.classList.add('open');
        sponsorModal.setAttribute('aria-hidden', 'false');
        if (!prefersReducedMotion) {
            gsap.fromTo('.modal-content', { opacity: 0, scale: 0.94 }, {
                duration: 0.3,
                opacity: 1,
                scale: 1,
                ease: 'power2.out'
            });
        }
    }
};

const closeSponsorModal = () => {
    if (sponsorModal) {
        sponsorModal.classList.remove('open');
        sponsorModal.setAttribute('aria-hidden', 'true');
    }
};

if (sponsorCta) sponsorCta.addEventListener('click', openSponsorModal);
if (sponsorModalClose) sponsorModalClose.addEventListener('click', closeSponsorModal);
if (sponsorModalBackdrop) sponsorModalBackdrop.addEventListener('click', closeSponsorModal);

if (sponsorForm) {
    sponsorForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = sponsorForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            const formData = new FormData(sponsorForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                submitBtn.textContent = '✓ Sent!';
                sponsorForm.reset();
                setTimeout(() => {
                    closeSponsorModal();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 2000);
            } else {
                throw new Error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            submitBtn.textContent = 'Error - Try Again';
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }, 3000);
        }
    });
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
    if (!necromanticCanvasInstance) return;
    necromanticCanvasInstance.resize();
    necromanticCanvasInstance.init();
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
            card.click();
        }
    });
});

// ===================================
// Background Audio
// ===================================
const bgAudio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
const volumeSlider = document.getElementById('volumeSlider');
const volumeControl = document.querySelector('.volume-control');
const volumeLabel = document.querySelector('.volume-label');

const updateAudioUI = (isPlaying) => {
    if (!audioToggle) return;
    const label = audioToggle.querySelector('.audio-label');
    const icon = audioToggle.querySelector('.audio-icon');
    
    if (isPlaying) {
        audioToggle.classList.remove('muted');
        audioToggle.setAttribute('aria-pressed', 'true');
        volumeControl?.classList.add('visible');
        if (label) label.textContent = 'Mute Anthem';
        if (icon) icon.textContent = '♪';
    } else {
        audioToggle.classList.add('muted');
        audioToggle.setAttribute('aria-pressed', 'false');
        volumeControl?.classList.remove('visible');
        if (label) label.textContent = 'Play Anthem';
        if (icon) icon.textContent = '♫';
    }
};

if (audioToggle) updateAudioUI(false);

if (bgAudio) {
    bgAudio.volume = 0.3;

    if (volumeSlider) volumeSlider.value = '30';
    if (volumeLabel) volumeLabel.textContent = '30%';
    
    if (audioToggle) {
        audioToggle.addEventListener('click', () => {
            if (bgAudio.paused) {
                bgAudio.play().catch(() => {});
                updateAudioUI(true);
            } else {
                bgAudio.pause();
                updateAudioUI(false);
            }
        });
    }

    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            const percentage = Number.parseInt(e.target.value, 10);
            bgAudio.volume = percentage / 100;
            if (volumeLabel) volumeLabel.textContent = percentage + '%';
        });
    }
}

// ===================================
// Console Message
// ===================================
if (!window.location.hostname.includes('localhost')) {
    console.log('%c NECRUX GUILD ', 'background: #00FF00; color: #0A0A0F; font-size: 20px; font-weight: bold; padding: 10px;');
    console.log('%c Elite Wild Rift Esports Team ', 'color: #00FF00; font-size: 14px;');
    console.log('%c Join our Discord at necrux.org ', 'color: #B8B8C8; font-size: 12px;');
}
