// ==========================================================================
// SHARED GOOGLE ANALYTICS (Pulled from both files)
// ==========================================================================
window.addEventListener('load', function() {
    var script = document.createElement('script');
    script.src = "https://www.googletagmanager.com/gtag/js?id=G-2257GJ95MX";
    document.head.appendChild(script);
    
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-2257GJ95MX');
});

// ==========================================================================
// INDEX.HTML SPECIFIC LOGIC
// Isolated within a conditional check so it functions identically without throwing global let/const redeclaration errors
// ==========================================================================
if (document.querySelector('.hero-container')) {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    let lenis = null;
    if (!isTouchDevice) {
        lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true
        });

        function raf(time) {
            if (lenis) lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);
        window.lenis = lenis;
    } else {
        window.lenis = null;
    }

    if (isTouchDevice) {
        const heroEl = document.querySelector('.hero-container');
        if (heroEl) {
            const updateHeroHeight = () => {
                if (window.matchMedia('(orientation: landscape)').matches) {
                    heroEl.style.height = '100dvh';
                } else {
                    heroEl.style.height = window.innerHeight + 'px';
                }
            };
            updateHeroHeight();
            // Removed resize listener to fix mobile viewport height bounce on scroll
            window.addEventListener('orientationchange', () => {
                setTimeout(updateHeroHeight, 100);
            });
        }
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                if (window.lenis) {
                    window.lenis.scrollTo(targetElement, {
                        offset: 0,
                        duration: 1.2
                    });
                } else {
                    /* Native Smooth Scroll Fallback for Mobile Touch Devices */
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    window.highlightEcosystem = function(e) {
        if (e) e.preventDefault();
        const retainersSection = document.getElementById('retainers-section');
        const ecosystemCard = document.getElementById('tier-ecosystem');
        
        if (window.lenis && retainersSection) {
            window.lenis.scrollTo(retainersSection, {
                offset: 0,
                duration: 1.2
            });
        } else if (retainersSection) {
            retainersSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        if (ecosystemCard) {
            setTimeout(() => {
                ecosystemCard.classList.add('highlight-prompt');
                setTimeout(() => {
                    ecosystemCard.classList.remove('highlight-prompt');
                }, 2500);
            }, 800);
        }
    }

    /* --- HERO CAROUSEL --- */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let currentSlide = 0;
    let isPlaying = true;
    let slideTimer;
    const slides = document.querySelectorAll('.hero-slide');
    const pagBars = document.querySelectorAll('.pag-bar');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playIcon = document.getElementById('playIcon');
    const pauseIcon = document.getElementById('pauseIcon');

    window.goToSlide = function(index) {
        slides[currentSlide].classList.remove('active');
        pagBars[currentSlide].classList.remove('active', 'paused');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        pagBars[currentSlide].classList.add('active');
        if (!isPlaying) {
            pagBars[currentSlide].classList.add('paused');
        }

        resetTimer();
    }

    function nextSlide() {
        let next = (currentSlide + 1) % slides.length;
        window.goToSlide(next);
    }

    function resetTimer() {
        clearInterval(slideTimer);
        if (isPlaying) {
            slideTimer = setInterval(nextSlide, 6000);
        }
    }

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', () => {
            isPlaying = !isPlaying;
            if (isPlaying) {
                pauseIcon.style.display = 'block';
                playIcon.style.display = 'none';
                pagBars[currentSlide].classList.remove('paused');
                resetTimer();
            } else {
                pauseIcon.style.display = 'none';
                playIcon.style.display = 'block';
                pagBars[currentSlide].classList.add('paused');
                clearInterval(slideTimer);
            }
        });
    }

    resetTimer();

    /* --- 01 / PROCESS ACCORDION --- */
    window.toggleProcess = function(btn) {
        const panelId = btn.getAttribute('aria-controls');
        const panel = document.getElementById(panelId);
        const row = btn.closest('.process-row');
        const isOpen = btn.getAttribute('aria-expanded') === 'true';

        document.querySelectorAll('.process-trigger').forEach((otherBtn) => {
            if (otherBtn !== btn) {
                otherBtn.setAttribute('aria-expanded', 'false');
                const otherRow = otherBtn.closest('.process-row');
                if (otherRow) otherRow.classList.remove('is-open');
            }
        });

        btn.setAttribute('aria-expanded', String(!isOpen));
        if (row) row.classList.toggle('is-open', !isOpen);
    }

    /* --- KINETIC SCROLL REVEAL --- */
    function initReveal() {
        const items = document.querySelectorAll('.reveal');
        if (reduceMotion || !('IntersectionObserver' in window)) {
            items.forEach(el => el.classList.add('in-view'));
            return;
        }
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
        items.forEach(el => io.observe(el));
    }
    initReveal();

    /* --- COMPACT HEADER LOGO --- */
    function initHeaderShrink() {
        const logo = document.querySelector('.header-logo');
        const hero = document.querySelector('.hero-container');
        if (!logo || !hero || !('IntersectionObserver' in window)) return;
        const io = new IntersectionObserver(([entry]) => {
            const scrolledPast = !entry.isIntersecting && entry.boundingClientRect.top < 0;
            logo.classList.toggle('is-compact', scrolledPast);
        }, { threshold: 0 });
        io.observe(hero);
    }
    initHeaderShrink();

    /* --- FOOTER PARALLAX --- */
    function initFooterParallax() {
        const el = document.getElementById('footerBrand');
        if (!el || reduceMotion) return;
        let ticking = false;
        function update() {
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
            el.style.transform = `translateY(${(1 - progress) * 36}px)`;
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }
    initFooterParallax();

    /* --- TIER DATA STRUCTURE --- */
    const tierData = {
        presence: {
            title: "01 / presence",
            body: `
                <p>perfect for businesses that crave a consistent, professional digital presence but cannot afford massive marketing firm retainers. we handle the creation and posting, so you can handle your business.</p>
                <table>
                    <tr>
                        <td>capture</td>
                        <td>1x monthly shoot day. we will spend hours on-location bulk capturing clean, high-quality footage for the upcoming month.</td>
                    </tr>
                    <tr>
                        <td>deliverables</td>
                        <td>we edit your footage into modern clips designed for platforms like instagram reels and tiktok.</td>
                    </tr>
                    <tr>
                        <td>deployment</td>
                        <td>we deploy 15 static/carousel posts and 15 stories to your instagram per month, plus 2 dedicated tiktoks/reels per week.</td>
                    </tr>
                    <tr>
                        <td>platforms</td>
                        <td>instagram and tiktok.</td>
                    </tr>
                    <tr>
                        <td>the goal</td>
                        <td>to relieve the stress of content creation from the business owner while keeping your brand looking sweet and consistently visible to your local audience.</td>
                    </tr>
                </table>
            `
        },
        momentum: {
            title: "02 / momentum",
            body: `
                <p>a proactive, hands-off approach to managing your social presence. we more than double the frosting and handle the community interaction, acting as your dedicated digital partner.</p>
                <table>
                    <tr>
                        <td>capture</td>
                        <td>2x monthly shoot days. we dedicate hours on-location to build a robust library of engaging content.</td>
                    </tr>
                    <tr>
                        <td>deployment</td>
                        <td>we deploy 30 static/carousel posts and 30 stories across your instagram and facebook per month, plus 4 dedicated tiktoks/reels per week.</td>
                    </tr>
                    <tr>
                        <td>platforms</td>
                        <td>instagram, tiktok, and facebook.</td>
                    </tr>
                    <tr>
                        <td>copywriting</td>
                        <td>we handle all the captions. this includes targeted hashtags and basic seo optimisation so your local customers can find you easier.</td>
                    </tr>
                    <tr>
                        <td>community</td>
                        <td>active comment management. we monitor and reply to comments on your posts to build a genuine connection with your audience.</td>
                    </tr>
                    <tr>
                        <td>paid ads</td>
                        <td>strategic post boosting. we will manage and run targeted ad campaigns to push your best performing posts to a wider local audience.</td>
                    </tr>
                    <tr>
                        <td>strategy</td>
                        <td>1x optional monthly check-in. an optional 30-minute call to discuss your business's upcoming promotions, needs, and overall social direction for the next month.</td>
                    </tr>
                    <tr>
                        <td>the goal</td>
                        <td>to proactively drive audience engagement, local visibility, and brand growth through high-volume daily content, community management, and strategic paid advertising.</td>
                    </tr>
                </table>
            `
        },
        ecosystem: {
            title: "03 / ecosystem",
            body: `
                <p>the ultimate dozen: a complete digital infrastructure. everything included in the momentum tier, plus a fully managed professional website to convert your social media traffic into real business.</p>
                <table>
                    <tr>
                        <td>content engine</td>
                        <td>includes everything from the momentum tier: 2x monthly shoots, 30 monthly posts/stories, 4 weekly tiktoks/reels, active community management and paid ad campaigns.</td>
                    </tr>
                    <tr>
                        <td>platforms</td>
                        <td>instagram, tiktok, and facebook.</td>
                    </tr>
                    <tr>
                        <td>web design</td>
                        <td>we build a bespoke, modern website for your business. clean, responsive, and optimised to turn visitors into booking clients.</td>
                    </tr>
                    <tr>
                        <td>web maintenance</td>
                        <td>we handle the ongoing hosting, regular updates, bug fixes, and changes to your services as your business evolves.</td>
                    </tr>
                    <tr>
                        <td>brand identity</td>
                        <td>basic logo touch-ups and ensuring a unified, professional visual identity across all your platforms and your new website.</td>
                    </tr>
                    <tr>
                        <td>strategy</td>
                        <td>priority direct communication and your optional monthly 30-minute strategy call to align our efforts with your business goals.</td>
                    </tr>
                    <tr>
                        <td>the goal</td>
                        <td>to provide an end-to-end, fully frosted digital infrastructure. this tier combines high-volume social media execution with a bespoke, optimised website designed to convert digital attention into actionable business.</td>
                    </tr>
                </table>
            `
        }
    };

    /* --- APPLE-STYLE BLUR & DISSOLVE MINTMODAL ENGINE --- */
    class MintModal {
        constructor(options = {}) {
            this.overlay = document.getElementById(options.overlayId || 'tierModal');
            this.content = document.getElementById(options.contentId || 'modalContent');
            this.closeBtn = document.getElementById(options.closeBtnId || 'modalCloseBtn');
            this.titleEl = document.getElementById(options.titleId || 'modalTitle');
            this.bodyEl = document.getElementById(options.bodyId || 'modalBody');
            this.primaryCta = document.getElementById(options.ctaId || 'modalPrimaryCta');

            this.isOpen = false;
            this.isAnimating = false;
            this.triggerElement = null;

            this.init();
        }

        init() {
            if (!this.overlay || !this.content) return;

            /* Global touch scroll lock for mobile without needing overflow:hidden jump bugs */
            document.addEventListener('touchmove', (e) => {
                if (this.isOpen) {
                    if (!e.target.closest('.modal-body')) {
                        if (e.cancelable) e.preventDefault();
                    }
                }
            }, { passive: false });

            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) this.close(false);
            });

            if (this.closeBtn) {
                this.closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.close(false);
                });
            }

            if (this.primaryCta) {
                this.primaryCta.addEventListener('click', (e) => {
                    const href = this.primaryCta.getAttribute('href');
                    if (href && href.startsWith('#')) {
                        e.preventDefault();
                        const target = document.querySelector(href);
                        
                        this.close(true);

                        if (target) {
                            requestAnimationFrame(() => {
                                if (window.lenis) {
                                    window.lenis.scrollTo(target, { offset: 0, duration: 1.0 });
                                } else {
                                    /* Mobile / Touch Fallback */
                                    target.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'start'
                                    });
                                }
                            });
                        }
                    }
                });
            }

            document.addEventListener('keydown', (e) => {
                if (!this.isOpen) return;
                if (e.key === 'Escape') this.close(false);
                if (e.key === 'Tab') this.handleFocusTrap(e);
            });
        }

        open(tierKey, triggerEl = null) {
            if (this.isOpen || this.isAnimating) return;
            const data = tierData[tierKey];
            if (!data) return;

            this.triggerElement = triggerEl || document.activeElement;
            this.isAnimating = true;

            if (this.titleEl) this.titleEl.innerText = data.title;
            if (this.bodyEl) this.bodyEl.innerHTML = data.body;

            if (window.lenis) window.lenis.stop();
            
            document.body.classList.add('modal-open');
            document.documentElement.classList.add('modal-open');

            if (this.bodyEl) this.bodyEl.scrollTop = 0;

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    this.overlay.classList.add('active');
                    this.overlay.setAttribute('aria-hidden', 'false');
                    this.isOpen = true;
                    this.isAnimating = false;

                    if (this.closeBtn) this.closeBtn.focus();
                });
            });
        }

        close(fast = false, callback = null) {
            if (!this.isOpen || this.isAnimating) return;
            this.isAnimating = true;

            if (fast) {
                this.overlay.classList.add('fast-dissolve');
            }

            this.overlay.classList.remove('active');

            document.body.classList.remove('modal-open');
            document.documentElement.classList.remove('modal-open');
            if (window.lenis) window.lenis.start();

            const handleTransitionEnd = (e) => {
                if (e && e.target !== this.overlay && e.target !== this.content) return;

                this.overlay.removeEventListener('transitionend', handleTransitionEnd);
                clearTimeout(fallbackTimeout);

                this.overlay.classList.remove('fast-dissolve');
                this.overlay.setAttribute('aria-hidden', 'true');

                this.isOpen = false;
                this.isAnimating = false;

                if (this.triggerElement && typeof this.triggerElement.focus === 'function' && !fast) {
                    this.triggerElement.focus();
                }

                if (typeof callback === 'function') callback();
            };

            this.overlay.addEventListener('transitionend', handleTransitionEnd);
            const fallbackTimeout = setTimeout(() => handleTransitionEnd(), fast ? 220 : 600);
        }

        handleFocusTrap(e) {
            const focusables = this.content.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (!focusables.length) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        }
    }

    let mintModalSystem;
    document.addEventListener('DOMContentLoaded', () => {
        mintModalSystem = new MintModal({
            overlayId: 'tierModal',
            contentId: 'modalContent',
            closeBtnId: 'modalCloseBtn',
            titleId: 'modalTitle',
            bodyId: 'modalBody',
            ctaId: 'modalPrimaryCta'
        });
    });

    window.openModal = function(tierKey) {
        if (mintModalSystem) {
            mintModalSystem.open(tierKey, window.event ? window.event.currentTarget : null);
        }
    }

    window.closeModal = function(event) {
        if (mintModalSystem) {
            mintModalSystem.close(false);
        }
    }

    const agencyForm = document.getElementById('agencyForm');
    if (agencyForm) {
        agencyForm.addEventListener('submit', async function(e) {
            e.preventDefault(); 
            
            const form = e.target;
            const btn = form.querySelector('button');
            const msg = document.getElementById('form-message');
            const err = document.getElementById('form-error');
            
            btn.innerText = 'sending...';
            btn.style.opacity = '0.5';
            btn.style.pointerEvents = 'none';

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok) {
                    btn.style.display = 'none';
                    if (err) err.style.display = 'none';
                    msg.style.display = 'block';
                    form.reset(); 
                } else {
                    throw new Error('Network response was not ok.');
                }
            } catch (error) {
                btn.innerText = 'submit inquiry';
                btn.style.opacity = '1';
                btn.style.pointerEvents = 'auto';
                if (err) err.style.display = 'block';
            }
        });
    }
}

// ==========================================================================
// TERMS.HTML SPECIFIC LOGIC
// Isolated to prevent 'lenis' const redeclaration crashes when combining files
// ==========================================================================
if (document.querySelector('.legal-wrapper')) {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.5
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    window.lenis = lenis;

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                lenis.scrollTo(targetElement, {
                    offset: 0,
                    duration: 1.2
                });
            }
        });
    });

    function initFooterParallax() {
        const el = document.getElementById('footerBrand');
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (!el || reduceMotion) return;
        let ticking = false;
        function update() {
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight || document.documentElement.clientHeight;
            const progress = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
            el.style.transform = `translateY(${(1 - progress) * 36}px)`;
            ticking = false;
        }
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(update);
                ticking = true;
            }
        }, { passive: true });
        update();
    }
    initFooterParallax();
}