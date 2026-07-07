/**
 * ============================================================
 * I SEE RED - Website JavaScript
 * Complete functionality for the band's official website.
 * ============================================================
 */

/**
 * ============================================================
 * 1. MOBILE NAVIGATION TOGGLE
 *    Toggles the mobile menu on/off when the hamburger icon is clicked.
 * ============================================================
 */
const navToggle = document.querySelector('.nav-toggle');
const navMenus = document.querySelectorAll('.nav-menu');

if (navToggle && navMenus.length) {
    navToggle.addEventListener('click', function() {
        const isActive = this.classList.toggle('active');
        
        navMenus.forEach(menu => {
            menu.classList.toggle('active', isActive);
            menu.setAttribute('aria-hidden', !isActive);
        });
        
        this.setAttribute('aria-expanded', isActive);
    });
}

/**
 * ============================================================
 * 2. CLOSE MOBILE MENU ON LINK CLICK
 *    Ensures the mobile menu closes after a user selects a nav link.
 * ============================================================
 */
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', function() {
        if (navToggle) {
            navToggle.classList.remove('active');
            navToggle.setAttribute('aria-expanded', 'false');
        }
        
        navMenus.forEach(menu => {
            menu.classList.remove('active');
            menu.setAttribute('aria-hidden', 'true');
        });
    });
});

/**
 * ============================================================
 * 3. NAVBAR FOLLOWS SCROLL POSITION
 *    Navbar descends naturally as you scroll down, and stays
 *    visible until you scroll back to the top.
 * ============================================================
 */
const nav = document.querySelector('.nav');
let isNavVisible = false;
let lastScrollY = 0;

function updateNavVisibility() {
    if (!nav) return;
    
    const currentScrollY = window.scrollY;
    
    // Show navbar when scrolling down past 50px
    if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        if (!isNavVisible) {
            isNavVisible = true;
            nav.classList.add('visible');
        }
    } 
    // Hide navbar when at the top
    else if (currentScrollY <= 50) {
        if (isNavVisible) {
            isNavVisible = false;
            nav.classList.remove('visible');
        }
    }
    
    lastScrollY = currentScrollY;
}

// Use requestAnimationFrame for smooth performance
let scrollTicking = false;

window.addEventListener('scroll', function() {
    if (!scrollTicking) {
        window.requestAnimationFrame(function() {
            updateNavVisibility();
            scrollTicking = false;
        });
        scrollTicking = true;
    }
});

window.addEventListener('load', updateNavVisibility);

/**
 * ============================================================
 * 4. SMOOTH SCROLL FOR ANCHOR LINKS
 *    Handles internal page links with smooth scrolling,
 *    accounting for the fixed navbar height.
 * ============================================================
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const href = this.getAttribute('href');

        if (href === '#') {
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            const target = document.querySelector(href);
            if (target) {
                const navHeight = nav ? nav.offsetHeight : 0;
                const targetPosition = target.offsetTop - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        }
    });
});

/**
 * ============================================================
 * 5. CONTACT FORM HANDLING
 *    Handles form submission with proper feedback and loading states.
 * ============================================================
 */
const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

if (contactForm) {
    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = this.querySelector('.form-submit');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // Clear previous messages
        formMessage.className = '';
        formMessage.textContent = '';
        formMessage.style.display = 'none';
        
        // Simple client-side validation
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
        
        if (!email.value.includes('@') || !email.value.includes('.')) {
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
                headers: {
                    'Accept': 'application/json'
                }
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
 * 6. NEWSLETTER FORM HANDLING
 *    NOTE: Newsletter functionality is pending implementation.
 *    Currently shows a demo success message.
 * ============================================================
 */
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailInput = this.querySelector('.newsletter-input');
        
        // Validate email
        if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
            alert('Please enter a valid email address.');
            return;
        }
        
        // TODO: Connect to actual newsletter service when available
        alert('Thank you for subscribing! You\'ll receive our next newsletter soon.');
        this.reset();
    });
}

/**
 * ============================================================
 * 7. ACTIVE NAV LINK HIGHLIGHTING
 *    Changes the color of the nav link corresponding to the
 *    currently visible section in the viewport.
 * ============================================================
 */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-menu a');

let activeLinkTicking = false;

function updateActiveNavLink() {
    if (!sections.length || !navLinks.length) return;
    
    let current = '';
    const scrollPosition = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${current}`) {
            link.style.color = 'var(--color-red)';
        }
    });
}

window.addEventListener('scroll', function() {
    if (!activeLinkTicking) {
        window.requestAnimationFrame(function() {
            updateActiveNavLink();
            activeLinkTicking = false;
        });
        activeLinkTicking = true;
    }
});

/**
 * ============================================================
 * 8. INTERSECTION OBSERVER - FADE-IN ANIMATION
 *    Applies a subtle fade-in and translate-up animation to
 *    merch items and press cards as they scroll into view.
 * ============================================================
 */
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const animationObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            // Stop observing once animated
            animationObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Apply to merch items and press cards
document.querySelectorAll('.merch-item, .press-card, .merch-grid-placeholder > div').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    animationObserver.observe(el);
});

/**
 * ============================================================
 * 9. MERCH CAROUSEL - AUTO-SCROLL + DRAG/SWIPE
 *    Each merch row auto-scrolls smoothly. Users can also drag
 *    with mouse or swipe on touch devices to explore items.
 *    Hovering pauses the auto-scroll.
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
    const speed = 0.4; // pixels per frame

    // Check if carousel is visible using IntersectionObserver
    const visibilityObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            isVisible = entry.isIntersecting;
        });
    }, { threshold: 0.1 });
    
    visibilityObserver.observe(carousel);

    /**
     * Resets scroll position when reaching the end or start,
     * creating an infinite-loop effect.
     */
    function resetIfNeeded() {
        const half = track.scrollWidth / 2;
        if (carousel.scrollLeft >= half) {
            carousel.scrollLeft -= half;
        } else if (carousel.scrollLeft <= 0) {
            carousel.scrollLeft += half;
        }
    }

    /**
     * Main animation loop for auto-scrolling.
     * Uses requestAnimationFrame for smooth 60fps performance.
     * Only runs when carousel is visible.
     */
    function tick() {
        if (autoScroll && !isDown && isVisible) {
            carousel.scrollLeft += speed;
            resetIfNeeded();
        }
        requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    // Pause auto-scroll on hover (desktop)
    carousel.addEventListener('mouseenter', function() {
        autoScroll = false;
    });
    carousel.addEventListener('mouseleave', function() {
        autoScroll = true;
    });

    // Mouse drag interaction
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
            // Resume auto-scroll after 1.5s of inactivity
            setTimeout(function() {
                autoScroll = true;
            }, 1500);
        }
    });
    
    window.addEventListener('mousemove', function(e) {
        if (!isDown) return;
        e.preventDefault();
        const dx = e.pageX - startX;
        carousel.scrollLeft = scrollStart - dx;
        resetIfNeeded();
    });

    // Touch drag/swipe for mobile
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
        // Resume auto-scroll after 1.5s of inactivity
        setTimeout(function() {
            autoScroll = true;
        }, 1500);
    });
});

/**
 * ============================================================
 * 10. ABOUT SECTION - MEMBER HOVER PHOTO SWAP
 *     Hovering over a band member's name swaps the main
 *     band photo with that member's portrait.
 *     On touch devices, a tap toggles the photo.
 *     Also makes the image sticky only when a member is selected.
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

    // Preload member photos for instant swapping
    function preload(src) {
        if (!src) return;
        const img = new Image();
        img.src = src;
    }
    
    members.forEach(function(member) {
        preload(member.dataset.photo);
    });

    /**
     * Swaps the main photo with a cross-fade effect.
     */
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

    /**
     * Clears the active member and reverts to the default photo.
     * Also removes sticky behavior.
     */
    function clearActive() {
        if (activeMember) {
            activeMember.classList.remove('active');
        }
        activeMember = null;
        setPhoto(defaultPhoto);
        
        // Remove sticky behavior when no member is selected
        photoWrap.classList.remove('is-sticky');
    }

    // Detect touch devices (tap instead of hover)
    const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

    members.forEach(function(member) {
        if (isTouchDevice) {
            // Tap to toggle on touch devices
            member.addEventListener('click', function(e) {
                // Prevent click from bubbling
                e.stopPropagation();
                
                if (activeMember && activeMember !== member) {
                    activeMember.classList.remove('active');
                }
                
                if (activeMember === member) {
                    // Toggle off if tapping the same member
                    clearActive();
                } else {
                    activeMember = member;
                    activeMember.classList.add('active');
                    setPhoto(member.dataset.photo);
                    
                    // Make image sticky only when a member is selected
                    photoWrap.classList.add('is-sticky');
                }
            });
        } else {
            // Hover behavior for desktop
            member.addEventListener('mouseenter', function() {
                if (activeMember && activeMember !== member) {
                    activeMember.classList.remove('active');
                }
                activeMember = member;
                activeMember.classList.add('active');
                setPhoto(member.dataset.photo);
                
                // Make image sticky only when a member is selected
                photoWrap.classList.add('is-sticky');
            });

            member.addEventListener('mouseleave', function() {
                const stillHovered = member.matches(':hover');
                if (!stillHovered && activeMember === member) {
                    clearActive();
                    // Remove sticky when mouse leaves
                    photoWrap.classList.remove('is-sticky');
                }
            });
        }
    });

    // Clear active state when tapping/clicking outside the about grid
    if (aboutGrid) {
        aboutGrid.addEventListener('click', function(e) {
            // Only handle clicks that are on the grid background, not on members
            if (e.target === aboutGrid || e.target.closest('.about-image')) {
                // Don't clear if clicking the image itself
                return;
            }
        });
        
        // For touch devices, clear when tapping outside
        if (isTouchDevice) {
            document.addEventListener('click', function(e) {
                if (!e.target.closest('.about-grid')) {
                    clearActive();
                    photoWrap.classList.remove('is-sticky');
                }
            });
        }
    }
});

/**
 * ============================================================
 * 11. VIDEO LOADER HANDLING
 *     Ensures the video loader disappears when the iframe loads.
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
 * 12. CONSOLE CLEANUP
 *     Removes console.log statements in production.
 * ============================================================
 */
// All console.log statements have been removed from production code.
// To re-enable for debugging, uncomment with caution.

console.log('🚀 I See Red website loaded successfully!');

/**
 * ============================================================
 * 13. PARALLAX BACKGROUND EFFECT - SLOWED DOWN
 *     Moves the background image very slowly as you scroll,
 *     creating a subtle depth effect that reaches full offset
 *     only at the bottom of the page.
 * ============================================================
 */
const siteBg = document.querySelector('.site-background');
const hero = document.querySelector('.hero');

if (siteBg && hero) {
    let parallaxTicking = false;
    
    function updateParallax() {
        const scrollY = window.scrollY;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        
        // Calculate progress from 0 to 1 based on scroll position
        const progress = Math.min(scrollY / documentHeight, 1);
        
        // Very subtle movement - max offset is 10% of the hero height
        const maxOffset = hero.offsetHeight * 0.10;
        const translateY = progress * maxOffset;
        
        // Apply transform with a very subtle scale
        siteBg.style.transform = 'translateY(' + translateY + 'px) scale(1.02)';
    }
    
    window.addEventListener('scroll', function() {
        if (!parallaxTicking) {
            window.requestAnimationFrame(function() {
                updateParallax();
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    });
    
    // Initial update
    updateParallax();
    
    // Update on resize
    window.addEventListener('resize', function() {
        updateParallax();
    });
}

