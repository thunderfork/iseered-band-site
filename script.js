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
 * SMOOTH SCROLL - For anchor links * ============================================================
 */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        if (href === '#') {
            // Close mobile menu before scrolling
            closeMobileMenu();
            setTimeout(function() {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        } else {
            const target = document.querySelector(href);
            if (target) {
                // Close mobile menu FIRST before calculating offset
                closeMobileMenu();
                
                // Now calculate offset with closed navbar
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPos = target.offsetTop - navHeight;
                
                // Small delay to ensure menu is fully closed before scrolling
                setTimeout(function() {
                    window.scrollTo({ top: targetPos, behavior: 'smooth' });
                }, 100);
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

function closeMobileMenu() {
    if (navToggle) {
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
    }
    navMenus.forEach(function(menu) {
        menu.classList.remove('active');
        menu.setAttribute('aria-hidden', 'true');
    });
}

function toggleMobileMenu() {
    const isActive = navToggle.classList.toggle('active');
    navMenus.forEach(function(menu) {
        menu.classList.toggle('active', isActive);
        menu.setAttribute('aria-hidden', !isActive);
    });
    navToggle.setAttribute('aria-expanded', isActive);
}

if (navToggle && navMenus.length) {
    navToggle.addEventListener('click', toggleMobileMenu);
}

// Remove the old link click handler since we handle it in smooth scroll now
// The old document.querySelectorAll('.nav-menu a') handler is no longer needed
// but keep it for redundancy or remove it

/* ============================================================ */
/* === NEWS CAROUSEL START === */
/**
 * ============================================================
 * NEWS CAROUSEL - Dynamic JSON-driven carousel
 * ============================================================
 */

/* === CONFIGURATION === */
// To change slide duration, update this value (milliseconds)
const SLIDE_INTERVAL = 5000; // 5 seconds
const PAUSE_RESUME_DELAY = 5000; // 5 seconds of inactivity before resuming auto-play
const PROGRESS_UPDATE_INTERVAL = 50; // Update progress every 50ms for smooth animation

/* === STATE === */
let newsItems = [];
let currentSlide = 0;
let autoPlayInterval = null;
let isPaused = false;
let isTransitioning = false;
let userInteracted = false;
let interactionTimeout = null;
let isVisible = true;
let activeVideoIframe = null;

/* === PROGRESS BAR STATE === */
let progressBar = null;
let progressTimer = null;
let progressStartTime = 0;
let progressPausedTime = 0;
let progressTotalPaused = 0;
let progressIsPaused = false;
let currentProgress = 0;
let slideDirection = 'next'; // 'next' or 'prev'

/* === DOM REFS === */
const track = document.querySelector('.news-track');
const dotsContainer = document.querySelector('.news-dots');
const prevBtn = document.querySelector('.news-btn-prev');
const nextBtn = document.querySelector('.news-btn-next');
const carousel = document.querySelector('.news-carousel');
const progressTimerDisplay = document.querySelector('.news-progress-timer');

/* === FETCH DATA === */
async function fetchNews() {
    try {
        const response = await fetch('news.json');
        if (!response.ok) throw new Error('Failed to fetch news data');
        const data = await response.json();
        newsItems = data.items || [];
        if (newsItems.length === 0) throw new Error('No news items found');
        renderCarousel();
        initCarousel();
    } catch (error) {
        console.error('Error loading news carousel:', error);
        track.innerHTML = `
            <div class="news-slide" style="grid-template-columns:1fr; text-align:center; padding:3rem;">
                <div style="grid-column:1/-1;">
                    <p style="color:var(--color-red); font-family:var(--font-display); font-size:1.5rem;">
                        <i class="fas fa-exclamation-triangle"></i> Unable to load news
                    </p>
                    <p style="color:var(--color-white-dim);">Please check your connection and try again.</p>
                </div>
            </div>
        `;
    }
}

/* === RENDER CAROUSEL === */
function renderCarousel() {
    // Build slides
    track.innerHTML = newsItems.map((item, index) => {
        const mediaHtml = renderMedia(item.media, index);
        const linksHtml = item.links && item.links.length > 0
            ? item.links.map(link =>
                `<a href="${link.url}" target="_blank" rel="noopener noreferrer" aria-label="${link.name}">${link.name}</a>`
              ).join('')
            : '';

        return `
            <div class="news-slide" role="listitem" aria-label="Slide ${index + 1} of ${newsItems.length}" data-index="${index}">
                <div class="news-media">
                    <span class="release-badge">${item.badge}</span>
                    ${mediaHtml}
                </div>
                <div class="news-info">
                    <p class="news-label">${item.label}</p>
                    <h2 class="news-title">${item.title}</h2>
                    <p class="news-meta">${item.meta}</p>
                    <p class="news-description">${item.description}</p>
                    ${linksHtml ? `<div class="news-links">${linksHtml}</div>` : ''}
                </div>
            </div>
        `;
    }).join('');

    // Build dots
    dotsContainer.innerHTML = newsItems.map((_, index) =>
        `<button class="news-dot${index === 0 ? ' active' : ''}" role="tab" aria-label="Go to slide ${index + 1}" data-index="${index}">
            <span class="dot-progress-ring"></span>
        </button>`
    ).join('');
}

/* === RENDER MEDIA === */
function renderMedia(media, index) {
    if (!media || media.type === 'none') {
        return `
            <div class="news-media-placeholder">
                <div class="placeholder-icon"><i class="fas fa-newspaper"></i></div>
                <div class="placeholder-text">Coming soon</div>
            </div>
        `;
    }

    if (media.type === 'youtube') {
        return `
            <div class="news-video" data-index="${index}">
                <div class="news-video-loader" aria-hidden="true">Loading video...</div>
                <iframe
                    data-src="${media.src}"
                    title="Video for news item ${index + 1}"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                    loading="lazy"
                    class="news-video-iframe"
                    data-loaded="false">
                </iframe>
            </div>
        `;
    }

    if (media.type === 'image') {
        return `<img src="${media.src}" alt="News image" class="news-image" loading="lazy">`;
    }

    return '';
}

/* === INIT CAROUSEL === */
function initCarousel() {
    const slides = track.querySelectorAll('.news-slide');
    if (slides.length === 0) return;

    // Get progress bar reference
    progressBar = document.querySelector('.news-progress-bar');

    // Set initial positions
    updateCarousel(0, false, 'next');

    // Add event listeners
    prevBtn.addEventListener('click', () => goToPrev());
    nextBtn.addEventListener('click', () => goToNext());

    dotsContainer.querySelectorAll('.news-dot').forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.dataset.index);
            const direction = index > currentSlide ? 'next' : 'prev';
            goToSlide(index, direction);
        });
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            goToPrev();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            goToNext();
        }
    });

    // Pause on focus
    carousel.addEventListener('focusin', () => pauseAutoPlay());
    carousel.addEventListener('focusout', () => {
        setTimeout(() => {
            if (!carousel.contains(document.activeElement)) {
                resumeAutoPlay();
            }
        }, 100);
    });

    // Hover pause
    carousel.addEventListener('mouseenter', () => pauseAutoPlay());
    carousel.addEventListener('mouseleave', () => {
        if (!userInteracted) {
            resumeAutoPlay();
        }
    });

    // ============================================================
    // ADD TOUCH SWIPE SUPPORT FOR MOBILE
    // ============================================================
    let touchStartX = 0;
    let touchEndX = 0;
    let isSwiping = false;
    const SWIPE_THRESHOLD = 50; // minimum distance in pixels to trigger a swipe

    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
        touchEndX = 0;
        isSwiping = false;
        // Pause auto-play when user touches the carousel
        pauseAutoPlay();
    }, { passive: true });

    carousel.addEventListener('touchmove', function(e) {
        if (touchStartX) {
            const currentX = e.changedTouches[0].screenX;
            const diff = touchStartX - currentX;
            // If the user has moved more than 10px, consider it a swipe
            if (Math.abs(diff) > 10) {
                isSwiping = true;
            }
        }
    }, { passive: true });

    carousel.addEventListener('touchend', function(e) {
        if (!touchStartX) return;
        
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        
        // Only trigger if it was a swipe (not a tap) and passed the threshold
        if (isSwiping && Math.abs(diff) > SWIPE_THRESHOLD) {
            if (diff > 0) {
                // Swiped left - go to next slide
                goToNext();
            } else {
                // Swiped right - go to previous slide
                goToPrev();
            }
        }
        
        // Reset touch values
        touchStartX = 0;
        touchEndX = 0;
        isSwiping = false;
        
        // Resume auto-play after a delay
        scheduleResume();
    }, { passive: true });

    // ============================================================
    // END TOUCH SWIPE SUPPORT
    // ============================================================

    // Visibility observer
    const visObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
            if (isVisible && !isPaused && !userInteracted) {
                startAutoPlay();
            } else if (!isVisible) {
                pauseAutoPlay();
            }
        });
    }, { threshold: 0.2 });
    visObserver.observe(carousel);

    // Start auto-play
    startAutoPlay();

    // Load first video if applicable
    loadVideoForSlide(0);
}

/* === UPDATE CAROUSEL === */
/* === PROGRESS BAR FIX & SLIDE ANIMATION FIX START === */
function updateCarousel(index, animate = true, direction = 'next') {
    if (isTransitioning) return;
    isTransitioning = true;

    const slides = track.querySelectorAll('.news-slide');
    const totalSlides = slides.length;

    if (index < 0) index = totalSlides - 1;
    if (index >= totalSlides) index = 0;

    // Get current and next slide for animation
    const currentSlideEl = slides[currentSlide];
    const nextSlideEl = slides[index];

    // Store direction for animation
    slideDirection = direction;

    // Remove any existing animation classes
    slides.forEach(slide => {
        slide.classList.remove('slide-exit', 'slide-enter-next', 'slide-enter-prev');
    });

    // Add exit animation class to current slide
    if (currentSlideEl && animate) {
        currentSlideEl.classList.add('slide-exit');
    }

    // Add entry animation class to next slide
    if (nextSlideEl && animate) {
        if (direction === 'next') {
            nextSlideEl.classList.add('slide-enter-next');
        } else {
            nextSlideEl.classList.add('slide-enter-prev');
        }
    }

    currentSlide = index;

    // Update track position
    track.style.transition = animate ? 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none';
    track.style.transform = `translateX(-${index * 100}%)`;

    // Update dots
    dotsContainer.querySelectorAll('.news-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
        dot.setAttribute('aria-selected', i === index);
    });

    // Update ARIA
    slides.forEach((slide, i) => {
        slide.setAttribute('aria-hidden', i !== index);
    });

    // Remove exit animation class after transition
    if (currentSlideEl) {
        setTimeout(() => {
            currentSlideEl.classList.remove('slide-exit');
        }, 600);
    }

    // Remove entry animation classes after transition
    if (nextSlideEl) {
        setTimeout(() => {
            nextSlideEl.classList.remove('slide-enter-next', 'slide-enter-prev');
        }, 600);
    }

    // Load video for this slide
    loadVideoForSlide(index);

    setTimeout(() => {
        isTransitioning = false;
    }, 600);

    // === PROGRESS BAR FIX: Reset progress properly ===
    resetProgressBar();
}
/* === PROGRESS BAR FIX & SLIDE ANIMATION FIX END === */

/* === LOAD/UNLOAD VIDEOS === */
function loadVideoForSlide(index) {
    const slides = track.querySelectorAll('.news-slide');
    const totalSlides = slides.length;

    // Unload all videos
    slides.forEach((slide, i) => {
        const iframe = slide.querySelector('.news-video-iframe');
        if (iframe && i !== index) {
            iframe.src = '';
            iframe.dataset.loaded = 'false';
            const loader = iframe.closest('.news-video')?.querySelector('.news-video-loader');
            if (loader) loader.style.display = 'flex';
            iframe.classList.remove('loaded');
        }
    });

    // Load video for current slide
    const currentSlide = slides[index];
    if (!currentSlide) return;

    const iframe = currentSlide.querySelector('.news-video-iframe');
    if (!iframe) return;

    const loader = currentSlide.querySelector('.news-video-loader');
    const src = iframe.dataset.src;

    if (src && iframe.dataset.loaded === 'false') {
        iframe.src = src;
        iframe.dataset.loaded = 'true';
        iframe.onload = function() {
            if (loader) loader.style.display = 'none';
            this.classList.add('loaded');
        };
    }
}

/* === NAVIGATION === */
/* === PROGRESS BAR FIX START === */
function goToSlide(index, direction = 'next') {
    if (isTransitioning || index === currentSlide) return;
    userInteracted = true;
    pauseAutoPlay();
    clearInteractionTimeout();
    updateCarousel(index, true, direction);
    scheduleResume();
}
/* === PROGRESS BAR FIX END === */

function goToPrev() {
    const total = newsItems.length;
    goToSlide((currentSlide - 1 + total) % total, 'prev');
}

function goToNext() {
    const total = newsItems.length;
    goToSlide((currentSlide + 1) % total, 'next');
}

/* === PROGRESS BAR FIX: Completely rewritten progress system === */
/* === PROGRESS BAR FIX START === */
function startProgressBar() {
    // Clear any existing timer
    if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
    }

    // Reset progress state
    currentProgress = 0;
    progressStartTime = performance.now();
    progressPausedTime = 0;
    progressTotalPaused = 0;
    progressIsPaused = false;

    // Update progress bar
    updateProgressBar();
}

function updateProgressBar() {
    if (!progressBar) return;

    // If paused or transitioning, stop updating
    if (isPaused || isTransitioning || !isVisible) {
        // Continue the loop but don't update progress
        progressTimer = requestAnimationFrame(updateProgressBar);
        return;
    }

    const now = performance.now();
    const elapsed = now - progressStartTime - progressTotalPaused;
    currentProgress = Math.min((elapsed / SLIDE_INTERVAL) * 100, 100);

    // Update progress bar width with smooth transition
    progressBar.style.width = currentProgress + '%';

    // Update timer display
    if (progressTimerDisplay) {
        const remaining = Math.max(0, (SLIDE_INTERVAL - elapsed) / 1000);
        progressTimerDisplay.textContent = Math.ceil(remaining) + 's';
    }

    // Check if we've reached 100%
    if (currentProgress >= 100) {
        // Reset and advance to next slide
        if (!isPaused && !isTransitioning && isVisible && !userInteracted) {
            goToNext();
        }
        return;
    }

    // Continue the animation loop
    progressTimer = requestAnimationFrame(updateProgressBar);
}

function resetProgressBar() {
    // Cancel current animation frame
    if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
    }

    // Reset progress state
    currentProgress = 0;
    progressStartTime = performance.now();
    progressPausedTime = 0;
    progressTotalPaused = 0;
    progressIsPaused = false;

    // Reset bar width immediately (no transition for instant reset)
    if (progressBar) {
        progressBar.style.transition = 'none';
        progressBar.style.width = '0%';
        // Force reflow to ensure the reset takes effect
        void progressBar.offsetHeight;
        progressBar.style.transition = 'width 0.3s linear';
    }

    // Reset timer display
    if (progressTimerDisplay) {
        progressTimerDisplay.textContent = Math.ceil(SLIDE_INTERVAL / 1000) + 's';
    }

    // Restart the progress animation if not paused
    if (!isPaused && isVisible && !userInteracted) {
        startProgressBar();
    }
}

function pauseProgressBar() {
    if (progressIsPaused) return;
    progressIsPaused = true;
    
    // Record the time when paused
    if (progressStartTime > 0) {
        progressPausedTime = performance.now();
    }
}

function resumeProgressBar() {
    if (!progressIsPaused) return;
    progressIsPaused = false;
    
    // Add the paused duration to total paused time
    if (progressPausedTime > 0) {
        progressTotalPaused += performance.now() - progressPausedTime;
        progressPausedTime = 0;
    }
    
    // Resume the animation
    if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
    }
    progressTimer = requestAnimationFrame(updateProgressBar);
}
/* === PROGRESS BAR FIX END === */

/* === AUTO-PLAY === */
function startAutoPlay() {
    if (autoPlayInterval) clearInterval(autoPlayInterval);
    if (newsItems.length <= 1) return;

    // Clear any existing auto-play interval
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }

    // Start progress bar
    if (!isPaused && isVisible) {
        startProgressBar();
    }

    // Set up auto-play interval
    autoPlayInterval = setInterval(() => {
        if (!isPaused && isVisible && !isTransitioning && !userInteracted) {
            goToNext();
        }
    }, SLIDE_INTERVAL);
}

function pauseAutoPlay() {
    isPaused = true;
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    pauseProgressBar();
}

function resumeAutoPlay() {
    if (userInteracted) return;
    isPaused = false;
    if (!autoPlayInterval && newsItems.length > 1) {
        startAutoPlay();
    }
    resumeProgressBar();
}

function scheduleResume() {
    clearInteractionTimeout();
    interactionTimeout = setTimeout(() => {
        userInteracted = false;
        isPaused = false;
        if (!autoPlayInterval && newsItems.length > 1) {
            startAutoPlay();
        }
        resumeProgressBar();
    }, PAUSE_RESUME_DELAY);
}

function clearInteractionTimeout() {
    if (interactionTimeout) {
        clearTimeout(interactionTimeout);
        interactionTimeout = null;
    }
}

/* === CLEANUP === */
function cleanupCarousel() {
    if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        autoPlayInterval = null;
    }
    if (progressTimer) {
        cancelAnimationFrame(progressTimer);
        progressTimer = null;
    }
    clearInteractionTimeout();
}

/* === INIT === */
document.addEventListener('DOMContentLoaded', function() {
    fetchNews();
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanupCarousel);

/* === END NEWS CAROUSEL === */
/**
 * ============================================================ */

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
        const href = link.getAttribute('href');
        
        // Handle Home link (#)
        if (href === '#') {
            // Highlight Home when at the top of the page (no section active)
            if (current === '' && window.scrollY < 200) {
                link.style.color = 'var(--color-red)';
            }
        } else if (href === '#' + current) {
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
 * GALLERY LIGHTBOX
 * ============================================================
 */
(function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('galleryLightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const closeBtn = document.getElementById('lightboxClose');
    const prevBtn = document.getElementById('lightboxPrev');
    const nextBtn = document.getElementById('lightboxNext');
    const counter = document.getElementById('lightboxCounter');
    
    let currentIndex = 0;
    const imageUrls = [];

    // Build image array from gallery
    galleryItems.forEach(item => {
        const img = item.querySelector('img');
        if (img) {
            imageUrls.push(img.src);
        }
    });

    function openLightbox(index) {
        if (!lightbox || !lightboxImg) return;
        currentIndex = index;
        lightboxImg.src = imageUrls[index];
        lightboxImg.alt = galleryItems[index]?.querySelector('img')?.alt || 'Gallery image';
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        updateCounter();
    }

    function closeLightbox() {
        if (!lightbox) return;
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + imageUrls.length) % imageUrls.length;
        lightboxImg.src = imageUrls[currentIndex];
        lightboxImg.alt = galleryItems[currentIndex]?.querySelector('img')?.alt || 'Gallery image';
        updateCounter();
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % imageUrls.length;
        lightboxImg.src = imageUrls[currentIndex];
        lightboxImg.alt = galleryItems[currentIndex]?.querySelector('img')?.alt || 'Gallery image';
        updateCounter();
    }

    function updateCounter() {
        if (counter) {
            counter.textContent = `${currentIndex + 1} / ${imageUrls.length}`;
        }
    }

    // Click to open
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => openLightbox(index));
        // Keyboard accessibility
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openLightbox(index);
            }
        });
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }

    // Nav buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', showPrev);
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', showNext);
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Click outside to close
    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
})();

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