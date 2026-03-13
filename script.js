// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAnimations();
    initAudio();
    initAutoscroll();
});

/* =========================================
   INTERACTIVE DOT GRID BACKGROUND
========================================= */
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];

    // Config
    const dotSize = 2; // Sleek small dots
    const gap = 30;    // Spacious minimalist feel
    const proximity = 120;
    const shockRadius = 250;
    const shockStrength = 15;
    const returnDuration = 1.2;
    const speedTrigger = 100;

    const pointer = {
        x: -999, y: -999,
        vx: 0, vy: 0,
        speed: 0,
        lastX: 0, lastY: 0,
        lastTime: 0
    };

    const state = {
        r: 59,  // start blue
        g: 130,
        b: 246,
        activeR: 168, // active purple
        activeG: 85,
        activeB: 247
    };

    function hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : { r: 0, g: 0, b: 0 };
    }

    function buildGrid() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;

        const cols = Math.floor(width / gap);
        const rows = Math.floor(height / gap);

        const startX = (width - (cols * gap)) / 2 + gap / 2;
        const startY = (height - (rows * gap)) / 2 + gap / 2;

        dots = [];
        for (let y = 0; y < rows + 1; y++) {
            for (let x = 0; x < cols + 1; x++) {
                dots.push({
                    cx: startX + x * gap,
                    cy: startY + y * gap,
                    xOffset: 0,
                    yOffset: 0,
                    _active: false
                });
            }
        }
    }

    window.addEventListener('resize', buildGrid);
    buildGrid();

    function draw() {
        ctx.clearRect(0, 0, width, height);

        const proxSq = proximity * proximity;

        dots.forEach(dot => {
            const dx = dot.cx - pointer.x;
            const dy = dot.cy - pointer.y;
            const dsq = dx * dx + dy * dy;

            let fillStyle = `rgba(${state.r}, ${state.g}, ${state.b}, 0.15)`;

            if (dsq < proxSq) {
                const dist = Math.sqrt(dsq);
                const t = 1 - dist / proximity;
                const r = Math.round(state.r + (state.activeR - state.r) * t);
                const g = Math.round(state.g + (state.activeG - state.g) * t);
                const b = Math.round(state.b + (state.activeB - state.b) * t);
                fillStyle = `rgba(${r}, ${g}, ${b}, ${0.15 + t * 0.85})`;
            }

            ctx.fillStyle = fillStyle;
            ctx.beginPath();
            ctx.arc(dot.cx + dot.xOffset, dot.cy + dot.yOffset, dotSize, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    // Interaction Listeners
    window.addEventListener('mousemove', (e) => {
        const now = performance.now();
        const dt = pointer.lastTime ? now - pointer.lastTime : 16;

        const dx = e.clientX - pointer.lastX;
        const dy = e.clientY - pointer.lastY;

        pointer.vx = (dx / dt) * 1000;
        pointer.vy = (dy / dt) * 1000;
        pointer.speed = Math.hypot(pointer.vx, pointer.vy);

        pointer.lastX = e.clientX;
        pointer.lastY = e.clientY;
        pointer.lastTime = now;
        pointer.x = e.clientX;
        pointer.y = e.clientY;

        // "Push" effect for nearby dots when moving fast
        if (pointer.speed > speedTrigger) {
            dots.forEach(dot => {
                const dist = Math.hypot(dot.cx - pointer.x, dot.cy - pointer.y);
                if (dist < proximity && !dot._active) {
                    dot._active = true;
                    // Nudge calculation
                    const pushX = (dot.cx - pointer.x) * 0.2 + pointer.vx * 0.01;
                    const pushY = (dot.cy - pointer.y) * 0.2 + pointer.vy * 0.01;

                    gsap.to(dot, {
                        xOffset: pushX,
                        yOffset: pushY,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            gsap.to(dot, {
                                xOffset: 0,
                                yOffset: 0,
                                duration: returnDuration,
                                ease: "elastic.out(1, 0.5)",
                                onComplete: () => { dot._active = false; }
                            });
                        }
                    });
                }
            });
        }
    }, { passive: true });

    window.addEventListener('click', (e) => {
        const cx = e.clientX;
        const cy = e.clientY;

        dots.forEach(dot => {
            const dist = Math.hypot(dot.cx - cx, dot.cy - cy);
            if (dist < shockRadius) {
                dot._active = true;
                const falloff = 1 - dist / shockRadius;
                const pushX = (dot.cx - cx) * shockStrength * falloff;
                const pushY = (dot.cy - cy) * shockStrength * falloff;

                gsap.killTweensOf(dot);
                gsap.to(dot, {
                    xOffset: pushX,
                    yOffset: pushY,
                    duration: 0.4,
                    ease: "power3.out",
                    onComplete: () => {
                        gsap.to(dot, {
                            xOffset: 0,
                            yOffset: 0,
                            duration: returnDuration + 0.5,
                            ease: "elastic.out(1, 0.3)",
                            onComplete: () => { dot._active = false; }
                        });
                    }
                });
            }
        });
    });

    draw();

    // Theming transition tied to scroll
    ScrollTrigger.create({
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 2,
        onUpdate: (self) => {
            // Background color state transition for the dots
            // From Blue (59, 130, 246) to Purple (168, 85, 247)
            state.r = Math.floor(59 + (168 - 59) * self.progress);
            state.g = Math.floor(130 + (85 - 130) * self.progress);
            state.b = Math.floor(246 + (247 - 246) * self.progress);

            // Adjust active color too to keep contrast
            // From Purple to a lighter Teal or similar if desired, 
            // but keeping it simple for now: active is always slightly brighter or just shifted.
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
    let speed = 0.867; // SPEED

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
