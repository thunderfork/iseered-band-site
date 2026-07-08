/**
 * ============================================================
 * I SEE RED - Website JavaScript
 * ============================================================
 */
(function() {
    'use strict';

/**
 * ============================================================
 * I SEE RED - Website JavaScript
 * ============================================================
 */

/**
 * ============================================================
 * PREVENT SCROLL RESTORATION
 * Forces the page to start at the top on every load
 * ============================================================
 */

// Tell the browser not to restore scroll position
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

// Force scroll to top immediately
window.scrollTo(0, 0);

// After everything loads, ensure we're at the top
window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo(0, 0);
    }, 50);
});

/**
 * ============================================================
 * PAGE LOAD SEQUENCE
 * 1. Background fades in from black over 2 seconds
 * 2. Hero content, social sidebar, and bottom bar fade in together
 * 3. Navbar continues its existing scroll behavior
 * ============================================================
 */
window.addEventListener('load', function() {
    var bg = document.querySelector('.site-background');
    if (bg) {
        bg.classList.add('loaded');
    }

    setTimeout(function() {
        document.body.classList.add('loaded');
    }, 2000);
});

/**
 * ============================================================
 * PAGE LOAD - Reveal content after page loads
 * ============================================================
 */
function revealPage() {
    const pageContent = document.getElementById('page-content');
    if (pageContent) {
        pageContent.classList.add('loaded');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(revealPage, 300);
});

window.addEventListener('load', function() {
    const pageContent = document.getElementById('page-content');
    if (pageContent && !pageContent.classList.contains('loaded')) {
        revealPage();
    }
});

/**
 * ============================================================
 * HERO CONTENT - Fade in on page load (same mechanism as navbar)
 * ============================================================
 */
const heroLogo = document.querySelector('.hero-logo');
const heroSubtitle = document.querySelector('.hero-subtitle');
const heroCta = document.querySelector('.hero-cta');
const heroOverlay = document.querySelector('.hero-overlay');
const socialSidebar = document.querySelector('.social-sidebar');

let heroCurrentOpacity = 0;
let heroTargetOpacity = 0;
let heroIsAnimating = false;

// Set initial state - hidden
if (heroLogo) heroLogo.style.opacity = '0';
if (heroSubtitle) heroSubtitle.style.opacity = '0';
if (heroCta) heroCta.style.opacity = '0';
if (heroOverlay) heroOverlay.style.opacity = '0';
if (socialSidebar) socialSidebar.style.opacity = '0';

function updateHero() {
    heroTargetOpacity = 1;
    if (!heroIsAnimating) {
        heroIsAnimating = true;
        fadeHero();
    }
}

function fadeHero() {
    const diff = heroTargetOpacity - heroCurrentOpacity;
    const speed = 0.005;

    if (Math.abs(diff) < 0.001) {
        heroCurrentOpacity = heroTargetOpacity;
        if (heroLogo) heroLogo.style.opacity = heroTargetOpacity;
        if (heroSubtitle) heroSubtitle.style.opacity = heroTargetOpacity;
        if (heroCta) heroCta.style.opacity = heroTargetOpacity;
        if (heroOverlay) heroOverlay.style.opacity = heroTargetOpacity;
        if (socialSidebar) socialSidebar.style.opacity = heroTargetOpacity;
        heroIsAnimating = false;
        return;
    }

    heroCurrentOpacity += Math.sign(diff) * Math.min(Math.abs(diff), speed);
    if (heroLogo) heroLogo.style.opacity = heroCurrentOpacity;
    if (heroSubtitle) heroSubtitle.style.opacity = heroCurrentOpacity;
    if (heroCta) heroCta.style.opacity = heroCurrentOpacity;
    if (heroOverlay) heroOverlay.style.opacity = heroCurrentOpacity;
    if (socialSidebar) socialSidebar.style.opacity = heroCurrentOpacity;

    requestAnimationFrame(fadeHero);
}
// Trigger hero fade-in after 2 second
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateHero, 1000);
});

// Fallback: if load event fires first
window.addEventListener('load', function() {
    if (heroLogo && heroLogo.style.opacity === '0') {
        updateHero();
    }
});
/**
 * ============================================================
 * NAVBAR - Fade in on scroll (no flash on load)
 * ============================================================
 */
const nav = document.querySelector('.nav');
let currentOpacity = 0;
let targetOpacity = 0;
let isAnimating = false;

// Set initial state - hidden
nav.style.opacity = '0';
nav.style.pointerEvents = 'none';

function updateNav() {
    const scrollY = window.scrollY;
    targetOpacity = scrollY > 50 ? 1 : 0;
    if (!isAnimating) {
        isAnimating = true;
        fadeNav();
    }
}

function fadeNav() {
    const diff = targetOpacity - currentOpacity;
    const speed = 0.02; // ~1 second to fully fade (original speed)

    if (Math.abs(diff) < 0.001) {
        currentOpacity = targetOpacity;
        nav.style.opacity = targetOpacity;
        nav.style.pointerEvents = targetOpacity === 1 ? 'auto' : 'none';
        if (targetOpacity === 1) {
            nav.classList.add('visible');
        } else {
            nav.classList.remove('visible');
        }
        isAnimating = false;
        return;
    }

    currentOpacity += Math.sign(diff) * Math.min(Math.abs(diff), speed);
    nav.style.opacity = currentOpacity;
    nav.style.pointerEvents = 'none';

    requestAnimationFrame(fadeNav);
}

// Initial state on load
window.addEventListener('load', function() {
    currentOpacity = 0;
    nav.style.opacity = '0';
    nav.style.pointerEvents = 'none';
    updateNav();
});

/**
 * ============================================================
 * SMOOTH SCROLL - For anchor links
 * ============================================================
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        if (href === '#') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPos = target.offsetTop - navHeight;
                window.scrollTo({ top: targetPos, behavior: 'smooth' });
            }
        }
    });
});

/**
 * ============================================================
 * MOBILE NAVIGATION TOGGLE
 * ============================================================
 */
const navToggle = document.querySelector('.nav-toggle');
const navMenus = document.querySelectorAll('.nav-menu');

if (navToggle && navMenus.length) {
    navToggle.addEventListener('click', function() {
        const isActive = this.classList.toggle('active');
        navMenus.forEach(function(menu) {
            menu.classList.toggle('active', isActive);
            menu.setAttribute('aria-hidden', !isActive);
        });
        this.setAttribute('aria-expanded', isActive);
    });
}

document.querySelectorAll('.nav-menu a').forEach(function(link) {
    link.addEventListener('click', function() {
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        navMenus.forEach(function(menu) {
            menu.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
        });
    });
});

/**
 * ============================================================
 * CONTACT FORM
 * ============================================================
 */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;

        formMessage.className = '';
        formMessage.textContent = '';
        formMessage.style.display = 'none';

        const name = document.getElementById('name');
        const email = document.getElementById('email');
        const subject = document.getElementById('subject');
        const message = document.getElementById('message');

        if (!name.value.trim() || !email.value.trim() || !subject.value.trim() || !message.value.trim()) {
            formMessage.className = 'error';
            formMessage.textContent = 'Please fill in all required fields.';
            formMessage.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email.value.trim())) {
            formMessage.className = 'error';
            formMessage.textContent = 'Please enter a valid email address.';
            formMessage.style.display = 'block';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            return;
        }

        try {
            const formData = new FormData(this);
            const response = await fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formMessage.className = 'success';
                formMessage.textContent = 'Thank you for your message! We will get back to you within 48 hours.';
                formMessage.style.display = 'block';
                this.reset();
            } else {
                throw new Error('Submission failed');
            }
        } catch (error) {
            formMessage.className = 'error';
            formMessage.textContent = 'Sorry, there was an error sending your message. Please try again or email us directly.';
            formMessage.style.display = 'block';
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

/**
 * ============================================================
 * NEWSLETTER FORM
 * ============================================================
 */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.newsletter-input');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailInput.value.trim())) {
            alert('Please enter a valid email address.');
            return;
        }
        alert('Thank you for subscribing! You\'ll receive our next newsletter soon.');
        this.reset();
    });
}

/**
 * ============================================================
 * ACTIVE NAV LINK HIGHLIGHTING
 * ============================================================
 */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

function updateActiveLink() {
    if (!sections.length || !navLinks.length) return;

    let current = '';
    const scrollPos = window.scrollY + 200;

    sections.forEach(function(section) {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(function(link) {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + current) {
            link.style.color = 'var(--color-red)';
        }
    });
}

/**
 * ============================================================
 * INTERSECTION OBSERVER - Fade in items on scroll
 * ============================================================
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            animObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.merch-item, .press-card, .merch-grid-placeholder > div').forEach(function(el) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    animObserver.observe(el);
});

/**
 * ============================================================
 * MERCH CAROUSEL
 * ============================================================
 */
document.querySelectorAll('.merch-carousel').forEach(function(carousel) {
    const track = carousel.querySelector('.merch-track');
    if (!track) return;

    let isDown = false;
    let startX = 0;
    let scrollStart = 0;
    let autoScroll = true;
    let isVisible = true;
    const speed = 0.4;

    const visObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.1 });

    visObserver.observe(carousel);

    function resetIfNeeded() {
        const half = track.scrollWidth / 2;
        if (carousel.scrollLeft >= half) {
            carousel.scrollLeft -= half;
        } else if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft += half;
        }
    }

    function tick() {
        if (autoScroll && !isDown && isVisible) {
            carousel.scrollLeft += speed;
            resetIfNeeded();
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    carousel.addEventListener('mouseenter', function() { autoScroll = false; });
    carousel.addEventListener('mouseleave', function() { autoScroll = true; });

    carousel.addEventListener('mousedown', function(e) {
        isDown = true;
        autoScroll = false;
        startX = e.pageX;
        scrollStart = carousel.scrollLeft;
        carousel.classList.add('dragging');
    });

    window.addEventListener('mouseup', function() {
        if (isDown) {
            isDown = false;
            carousel.classList.remove('dragging');
            setTimeout(function() { autoScroll = true; }, 1500);
        }
    });

    window.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const dx = e.pageX - startX;
        carousel.scrollLeft = scrollStart - dx;
        resetIfNeeded();
    });

    carousel.addEventListener('touchstart', function(e) {
        isDown = true;
        autoScroll = false;
        startX = e.touches[0].pageX;
        scrollStart = carousel.scrollLeft;
    }, { passive: true });

    carousel.addEventListener('touchmove', function(e) {
        if (!isDown) return;
        const dx = e.touches[0].pageX - startX;
        carousel.scrollLeft = scrollStart - dx;
        resetIfNeeded();
    }, { passive: true });

    carousel.addEventListener('touchend', function() {
        isDown = false;
        setTimeout(function() { autoScroll = true; }, 1500);
    });
});

/**
 * ============================================================
 * ABOUT - MEMBER PHOTO SWAP
 * ============================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    const photo = document.querySelector('.about-img');
    const photoWrap = document.querySelector('.about-image');
    const members = document.querySelectorAll('.about-member.member-hover');
    const aboutGrid = document.querySelector('.about-grid');

    if (!photo || !photoWrap || !members.length) return;

    const defaultPhoto = photo.getAttribute('src');
    let activeMember = null;

    function preload(src) {
        if (!src) return;
        const img = new Image();
        img.src = src;
    }

    members.forEach(function(member) {
        preload(member.dataset.photo);
    });

    function setPhoto(src) {
        if (!src || photo.getAttribute('src') === src) return;
        photoWrap.classList.add('fading');
        const next = new Image();
        next.onload = function() {
            photo.src = src;
            photoWrap.classList.remove('fading');
        };
        next.src = src;
    }

    function clearActive() {
        if (activeMember) {
            activeMember.classList.remove('active');
        }
        activeMember = null;
        setPhoto(defaultPhoto);
        photoWrap.classList.remove('is-sticky');
    }

    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    members.forEach(function(member) {
        if (isTouch) {
            member.addEventListener('click', function(e) {
                e.stopPropagation();
                if (activeMember && activeMember !== member) {
                    activeMember.classList.remove('active');
                }
                if (activeMember === member) {
                    clearActive();
                } else {
                    activeMember = member;
                    activeMember.classList.add('active');
                    setPhoto(member.dataset.photo);
                    photoWrap.classList.add('is-sticky');
                }
            });
        } else {
            member.addEventListener('mouseenter', function() {
                if (activeMember && activeMember !== member) {
                    activeMember.classList.remove('active');
                }
                activeMember = member;
                activeMember.classList.add('active');
                setPhoto(member.dataset.photo);
                photoWrap.classList.add('is-sticky');
            });

            member.addEventListener('mouseleave', function() {
                const stillHovered = member.matches(':hover');
                if (!stillHovered && activeMember === member) {
                    clearActive();
                    photoWrap.classList.remove('is-sticky');
                }
            });
        }
    });

    if (aboutGrid && isTouch) {
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.about-grid')) {
                clearActive();
                photoWrap.classList.remove('is-sticky');
            }
        });
    }
});

/**
 * ============================================================
 * VIDEO LOADER
 * ============================================================
 */
document.querySelectorAll('.release-video iframe').forEach(function(iframe) {
    iframe.addEventListener('load', function() {
        const loader = this.parentElement.querySelector('.video-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        this.style.opacity = '1';
    });
});

/**
 * ============================================================
 * PARALLAX BACKGROUND
 * ============================================================
 */
const siteBg = document.querySelector('.site-background');
const hero = document.querySelector('.hero');

function updateParallax() {
    if (!siteBg || !hero) return;
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = Math.min(scrollY / docHeight, 1);
    const maxOffset = hero.offsetHeight * 0.10;
    const translateY = progress * maxOffset;
    siteBg.style.transform = 'translateY(' + translateY + 'px) scale(1.02)';
}

if (siteBg && hero) {
    updateParallax();
    window.addEventListener('resize', updateParallax);
}

/**
 * ============================================================
 * CONSOLIDATED SCROLL HANDLER
 * Runs nav fade, active-link highlight, and parallax off a
 * single scroll listener / rAF throttle instead of three.
 * ============================================================
 */
let scrollTicking = false;

window.addEventListener('scroll', function() {
    if (!scrollTicking) {
        requestAnimationFrame(function() {
            updateNav();
            updateActiveLink();
            updateParallax();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

/**
 * ============================================================
 * ABOUT IMAGE - MOUSE ZOOM (Desktop Only)
 * ============================================================
 */
document.addEventListener('DOMContentLoaded', function() {
    const aboutImage = document.querySelector('.about-image');
    const aboutImg = document.querySelector('.about-img');
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    if (!aboutImage || !aboutImg || isTouch) return;

    let isHovering = false;
    const zoomLevel = 1.8;

    function updateZoom(e) {
        if (!isHovering) return;
        const rect = aboutImage.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        aboutImg.style.transformOrigin = (x * 100) + '% ' + (y * 100) + '%';
        aboutImg.style.transform = 'scale(' + zoomLevel + ')';
    }

    function resetZoom() {
        isHovering = false;
        aboutImg.style.transform = 'scale(1)';
        aboutImg.style.transformOrigin = 'center center';
    }

    function startZoom() {
        isHovering = true;
    }

    aboutImage.addEventListener('mouseenter', startZoom);
    aboutImage.addEventListener('mouseleave', resetZoom);
    aboutImage.addEventListener('mousemove', updateZoom);
});

console.log('🚀 I See Red website loaded successfully!');

})();