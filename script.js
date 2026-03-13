// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAnimations();
    initAudio();
    initAutoscroll();
});

/* =========================================
   PARTICLE SYSTEM
========================================= */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;

    // Resize handler
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // State to interpolate colors based on scroll
    const state = {
        r: 59,  // default cold blue start #3b82f6 (59, 130, 246)
        g: 130,
        b: 246,
        density: 100 // default number of particles
    };

    // Adjust density based on screen size
    if (width < 768) state.density = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -1 - 0.1; // float up
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around edges
            if (this.y < 0) {
                this.y = height;
                this.x = Math.random() * width;
            }
            if (this.x > width) this.x = 0;
            if (this.x < 0) this.x = width;
        }

        draw() {
            ctx.fillStyle = `rgba(${state.r}, ${state.g}, ${state.b}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    const particles = Array.from({ length: state.density }, () => new Particle());

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // Color transition animation linked to scroll
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
        onUpdate: (self) => {
            // Transition from Cold Blue (59, 130, 246) to Vibrant Purple (168, 85, 247)
            state.r = Math.floor(59 + (168 - 59) * self.progress);
            state.g = Math.floor(130 + (85 - 130) * self.progress);
            state.b = Math.floor(246 + (247 - 246) * self.progress);
        }
    });
}

/* =========================================
   GSAP STORY ANIMATIONS
========================================= */
function initAnimations() {
    // 0. Progress Bar
    gsap.to("#progress-bar", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: "body",
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });

    // 1. Hero Reveal & Year Spin
    const tlHero = gsap.timeline();

    // Text fade in
    tlHero.to(".hero-title", { opacity: 1, duration: 2, ease: "power2.out" })
        .to(".hero-subtitle", { opacity: 1, duration: 1.5 }, "-=1")
        .to(".scroll-prompt", { opacity: 1, duration: 1 }, "+=0.5");

    // Counter spin 2026 -> 2070 when scrolling starts
    ScrollTrigger.create({
        trigger: "#sec-hero",
        start: "top top",
        end: "bottom center",
        onEnter: () => {
            let obj = { year: 2026 };
            gsap.to(obj, {
                year: 2070,
                duration: 2.5,
                ease: "power3.inOut",
                onUpdate: function () {
                    document.getElementById("year-display").innerText = Math.round(obj.year);
                }
            });
        },
        once: true
    });

    // 2. Body Color Transition (Dark 2026 -> Light 2070)
    ScrollTrigger.create({
        trigger: "#sec-revelation", // Transition starts revealing the truth
        start: "center center",
        onEnter: () => document.body.classList.add("light-mode"),
        onLeaveBack: () => document.body.classList.remove("light-mode")
    });

    // 3. Reveal Text Elements globally
    const revealTexts = gsap.utils.toArray('.reveal-text');
    revealTexts.forEach(text => {
        gsap.to(text, {
            scrollTrigger: {
                trigger: text,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power2.out"
        });
    });

    // 4. Parallax Backgrounds
    gsap.to("#parallax-city", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: "#sec-glimpse",
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });



    // 6. Number Counters
    const counters = document.querySelectorAll('.stat-number');
    ScrollTrigger.create({
        trigger: "#sec-stats",
        start: "top 75%",
        onEnter: () => {
            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isFloat = !Number.isInteger(target);

                let obj = { val: 0 };
                gsap.to(obj, {
                    val: target,
                    duration: 2.5,
                    ease: "power2.out",
                    onUpdate: function () {
                        counter.innerText = isFloat ? obj.val.toFixed(1) : Math.round(obj.val);
                    }
                });
            });
        },
        once: true
    });

    // 7. Reflection Frame Drawing
    ScrollTrigger.create({
        trigger: "#sec-reflection",
        start: "top 60%",
        onEnter: () => document.querySelector(".border-frame").classList.add("is-visible")
    });

    // 8. Finale Animations
    const tlFinale = gsap.timeline({
        scrollTrigger: {
            trigger: "#sec-finale",
            start: "top 60%"
        }
    });

    tlFinale.from(".finale-title", { y: 30, opacity: 0, duration: 1 })
        .from(".finale-subtitle", { scale: 0.9, opacity: 0, duration: 1.2, ease: "back.out" }, "-=0.5")
        .to(".finale-content", { opacity: 1, y: -20, duration: 1 })
        .to(".restart-btn", { opacity: 1, duration: 1 }, "-=0.5");

    // Restart Button Logic
    document.getElementById("restart-btn").addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
}

/* =========================================
   AUDIO CONTROLLER
========================================= */
function initAudio() {
    const audio = document.getElementById('bg-music');
    const toggle = document.getElementById('audio-toggle');
    const enterBtn = document.getElementById('enter-btn');
    const overlay = document.getElementById('welcome-overlay');

    if (!audio || !toggle) return;

    // Set initial volume (30-40% as requested)
    audio.volume = 0.35;
    audio.muted = false;

    // Handle the Welcome Overlay + Audio start
    if (enterBtn && overlay) {
        enterBtn.addEventListener('click', () => {
            // 1. Start audio
            audio.play().then(() => {
                toggle.classList.remove('muted');
            }).catch(e => console.error("Playback failed:", e));

            // 2. Hide overlay
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';

            // 3. Enable scrolling
            document.body.style.overflow = 'auto';

            // 4. Cleanup DOM after transition
            setTimeout(() => {
                overlay.remove();
            }, 1500);
        });
    }

    // Mute/Unmute toggle
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (audio.muted || audio.paused) {
            audio.muted = false;
            audio.play();
            toggle.classList.remove('muted');
        } else {
            audio.muted = true;
            toggle.classList.add('muted');
        }
    });

    // Sync UI with audio state
    audio.onplay = () => {
        toggle.classList.remove('muted');
    };
}

/* =========================================
   AUTOSCROLL CONTROLLER
========================================= */
function initAutoscroll() {
    const toggle = document.getElementById('scroll-toggle');
    if (!toggle) return;

    let scrolling = false;
    let scrollPos = window.scrollY;
    let speed = 0.66; // Approx 40px per second at 60fps

    function step() {
        if (!scrolling) return;

        scrollPos += speed;
        window.scrollTo(0, scrollPos);

        // Stop if reached the bottom
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 2) {
            stop();
        } else {
            requestAnimationFrame(step);
        }
    }

    function start() {
        scrolling = true;
        scrollPos = window.scrollY; // Sync with current scroll
        toggle.classList.remove('muted');
        requestAnimationFrame(step);
    }

    function stop() {
        scrolling = false;
        toggle.classList.add('muted');
    }

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (scrolling) {
            stop();
        } else {
            start();
        }
    });

    // Handle manual scroll to sync position
    window.addEventListener('scroll', () => {
        if (!scrolling) {
            scrollPos = window.scrollY;
        }
    }, { passive: true });

    // Start in "muted" state (off)
    stop();
}
