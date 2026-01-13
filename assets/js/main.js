// Necrux Guild - Main JavaScript
// Professional Animated Wild Rift Website

// ===================================
// GSAP & ScrollTrigger Setup
// ===================================
gsap.registerPlugin(ScrollTrigger);

// Check for reduced motion preference
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ===================================
// Necromantic Souls Canvas Background
// ===================================
class NecromanticCanvas {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.souls = [];
        this.soulCount = window.innerWidth < 768 ? 20 : 35;
        this.mouse = { x: null, y: null };
        this.resize();
        this.init();
        this.animate();
        this.addEventListeners();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.souls = [];
        for (let i = 0; i < this.soulCount; i++) {
            this.souls.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3 - 0.2, // Drift upward
                size: Math.random() * 15 + 8,
                opacity: Math.random() * 0.5 + 0.3,
                hue: Math.random() > 0.7 ? 60 : 120, // Yellow or green
                phase: Math.random() * Math.PI * 2,
                phaseSpeed: Math.random() * 0.02 + 0.01,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                trail: [],
                maxTrail: Math.floor(Math.random() * 8 + 5),
                pulseSpeed: Math.random() * 0.05 + 0.02,
                type: Math.random() > 0.85 ? 'skull' : 'wisp' // 15% skulls
            });
        }
    }

    drawSoul(soul) {
        // Update position with floating drift
        soul.x += soul.vx + Math.sin(soul.phase) * 0.3;
        soul.y += soul.vy + Math.cos(soul.phase * 1.3) * 0.2;
        soul.phase += soul.phaseSpeed;
        soul.rotation += soul.rotationSpeed;

        // Wrap around edges
        if (soul.x < -50) soul.x = this.canvas.width + 50;
        if (soul.x > this.canvas.width + 50) soul.x = -50;
        if (soul.y < -50) soul.y = this.canvas.height + 50;
        if (soul.y > this.canvas.height + 50) soul.y = -50;

        // Add to trail
        soul.trail.push({ x: soul.x, y: soul.y, opacity: soul.opacity });
        if (soul.trail.length > soul.maxTrail) soul.trail.shift();

        // Pulse opacity
        const pulse = Math.sin(Date.now() * soul.pulseSpeed * 0.001) * 0.15 + soul.opacity;

        // Draw ethereal trail
        for (let i = 0; i < soul.trail.length; i++) {
            const t = soul.trail[i];
            const trailOpacity = (i / soul.trail.length) * pulse * 0.4;
            const trailSize = soul.size * (i / soul.trail.length) * 0.6;
            
            this.ctx.save();
            this.ctx.globalAlpha = trailOpacity;
            const gradient = this.ctx.createRadialGradient(t.x, t.y, 0, t.x, t.y, trailSize);
            gradient.addColorStop(0, `hsla(${soul.hue}, 100%, 60%, ${trailOpacity})`);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(t.x, t.y, trailSize, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }

        this.ctx.save();
        this.ctx.translate(soul.x, soul.y);
        this.ctx.rotate(soul.rotation);
        this.ctx.globalAlpha = pulse;

        if (soul.type === 'skull') {
            // Draw skull shape
            this.ctx.fillStyle = `hsla(${soul.hue}, 100%, 70%, ${pulse})`;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, soul.size * 0.6, soul.size * 0.7, 0, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Eye sockets
            this.ctx.fillStyle = `rgba(0, 0, 0, ${pulse * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(-soul.size * 0.25, -soul.size * 0.15, soul.size * 0.15, 0, Math.PI * 2);
            this.ctx.arc(soul.size * 0.25, -soul.size * 0.15, soul.size * 0.15, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Glow
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = `hsla(${soul.hue}, 100%, 60%, ${pulse})`;
        } else {
            // Draw wisp
            const gradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, soul.size);
            gradient.addColorStop(0, `hsla(${soul.hue}, 100%, 70%, ${pulse * 0.9})`);
            gradient.addColorStop(0.4, `hsla(${soul.hue}, 100%, 60%, ${pulse * 0.6})`);
            gradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = gradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, soul.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Inner bright core
            const coreGradient = this.ctx.createRadialGradient(0, 0, 0, 0, 0, soul.size * 0.4);
            coreGradient.addColorStop(0, `hsla(${soul.hue}, 100%, 90%, ${pulse})`);
            coreGradient.addColorStop(1, 'transparent');
            this.ctx.fillStyle = coreGradient;
            this.ctx.beginPath();
            this.ctx.arc(0, 0, soul.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.shadowBlur = 25;
            this.ctx.shadowColor = `hsla(${soul.hue}, 100%, 60%, ${pulse * 0.8})`;
        }

        this.ctx.restore();

        // Mouse interaction - souls flee
        if (this.mouse.x !== null && this.mouse.y !== null) {
            const dx = soul.x - this.mouse.x;
            const dy = soul.y - this.mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                const force = (150 - distance) / 150;
                soul.x += (dx / distance) * force * 3;
                soul.y += (dy / distance) * force * 3;
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.souls.forEach(soul => this.drawSoul(soul));
        
        requestAnimationFrame(() => this.animate());
    }

    addEventListeners() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        this.canvas.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        this.canvas.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }
}

// ===================================
// Initialize Necromantic Canvas
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('particleCanvas');
    if (canvas && !prefersReducedMotion) {
        new NecromanticCanvas(canvas);
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
// Update with your actual Discord invite link
// Placeholder anchors to Contact so the CTA always does something if no invite is set
const DISCORD_INVITE = '#contact';

// Update all Discord links
const discordLinks = [
    document.getElementById('discordLink'),
    document.getElementById('footerDiscord')
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
    sponsorForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(sponsorForm);
        const name = encodeURIComponent(formData.get('name') || '');
        const company = encodeURIComponent(formData.get('company') || '');
        const email = encodeURIComponent(formData.get('email') || '');
        const message = encodeURIComponent(formData.get('message') || '');

        const subject = encodeURIComponent('Necrux Sponsorship Inquiry');
        const bodyLines = [
            `Name: ${name}`,
            `Company: ${company}`,
            `Email: ${email}`,
            '',
            'Message:',
            message
        ];
        const body = bodyLines.join('%0D%0A');

        window.location.href = `mailto:raphael.kehldorfer@gmail.com?subject=${subject}&body=${body}`;
        sponsorForm.reset();
        closeSponsorModal();
    });
}

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
// Background Audio
// ===================================
const bgAudio = document.getElementById('bgAudio');
const audioToggle = document.getElementById('audioToggle');
let audioInitialized = false;

const setAudioToggleState = (muted) => {
    if (!audioToggle) return;
    audioToggle.classList.toggle('muted', muted);
    audioToggle.setAttribute('aria-pressed', (!muted).toString());
    const label = audioToggle.querySelector('.audio-label');
    const icon = audioToggle.querySelector('.audio-icon');
    if (label) label.textContent = muted ? 'Play Anthem' : 'Mute Anthem';
    if (icon) icon.textContent = muted ? '♫' : '♪';
};

if (audioToggle) setAudioToggleState(true);

const initAudio = () => {
    if (!bgAudio || audioInitialized) return;
    
    // Set volume FIRST while still muted
    bgAudio.volume = 0.05;
    // Small delay to ensure volume is set
    setTimeout(() => {
        bgAudio.muted = false;
        const attemptPlay = bgAudio.play();
        if (attemptPlay) {
            attemptPlay.then(() => {
                audioInitialized = true;
                setAudioToggleState(false);
                console.log('Anthem playing at', bgAudio.volume * 100 + '% volume');
            }).catch((err) => {
                console.log('Autoplay blocked:', err);
                setAudioToggleState(true);
            });
        }
    }, 50);
};

if (audioToggle && bgAudio) {
    audioToggle.addEventListener('click', () => {
        if (!audioInitialized) {
            initAudio();
        } else {
            const willMute = !bgAudio.paused && !bgAudio.muted;
            if (willMute) {
                bgAudio.pause();
                bgAudio.muted = true;
                setAudioToggleState(true);
            } else {
                bgAudio.volume = 0.05; // Force volume
                bgAudio.muted = false;
                bgAudio.play().then(() => {
                    setAudioToggleState(false);
                    console.log('Playing at', bgAudio.volume * 100 + '%');
                });
            }
        }
    });
}

// Auto-play IMMEDIATELY on page ready
if (bgAudio) {
    // Try as soon as DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initAudio();
        });
    } else {
        // DOM already loaded
        initAudio();
    }
}

// Backup: try on window load
window.addEventListener('load', () => {
    if (!audioInitialized && bgAudio) {
        initAudio();
    }
});

// Attempt to start audio on ANY user interaction if autoplay blocked
const startOnInteraction = () => {
    if (!audioInitialized && bgAudio) {
        initAudio();
    }
};

['click', 'touchstart', 'keydown', 'scroll'].forEach(event => {
    document.addEventListener(event, startOnInteraction, { once: true });
});

// ===================================
// Console Message
// ===================================
console.log('%c NECRUX GUILD ', 'background: #00FF00; color: #0A0A0F; font-size: 20px; font-weight: bold; padding: 10px;');
console.log('%c Elite Wild Rift Esports Team ', 'color: #00FF00; font-size: 14px;');
console.log('%c Interested in joining? Visit our Discord! ', 'color: #B8B8C8; font-size: 12px;');
