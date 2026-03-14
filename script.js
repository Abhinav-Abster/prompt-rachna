// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initAnimations();
    initAudio();
    initAutoscroll();
    initCustomCursor();
    initTextDecipher(); // Prepare deciphering early
    initMangaAnimations(); // Then start manga animations
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
        r: 125,  // Light Blue (#7dd3fc)
        g: 211,
        b: 252,
        activeR: 30, // Navy Blue highlight
        activeG: 58,
        activeB: 138
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
        trigger: "#panel-ch4", // Transition starts revealing the truth
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

    // 4. Cinematic Panel Panning (Restored for high impact)
    gsap.utils.toArray('.manga-panel').forEach(panel => {
        gsap.to(panel, {
            backgroundPosition: "50% 100%", // Stronger vertical pan
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });
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

    // 8. Finale Animations
    const tlFinale = gsap.timeline({
        scrollTrigger: {
            trigger: "#panel-ch7",
            start: "top 60%"
        }
    });

    tlFinale.from(".large-text", { y: 30, opacity: 0, duration: 1 })
        .to(".restart-btn", { opacity: 1, duration: 1 }, "-=0.5");

    // Restart Button Logic
    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

/* =========================================
   MANGA MODE ANIMATIONS (Anime.js + GSAP)
========================================= */
/* =========================================
   MANGA MODE ANIMATIONS (Sequential ScrollTrigger)
========================================= */
function initMangaAnimations() {
    gsap.utils.toArray('.manga-panel').forEach(panel => {
        // 1. Panel Panning Effect (GSAP)
        gsap.to(panel, {
            backgroundPosition: "50% 100%",
            ease: "none",
            scrollTrigger: {
                trigger: panel,
                start: "top bottom",
                end: "bottom top",
                scrub: true
            }
        });

        // 2. Sequential Bubble pop-in
        const bubbles = gsap.utils.toArray('.anime-bubble', panel);

        ScrollTrigger.create({
            trigger: panel,
            start: "top 95%", // Trigger early: fires as soon as the panel edges into view
            onEnter: () => {
                bubbles.forEach(el => {
                    if (!el.classList.contains('animated')) {
                        el.classList.add('animated');

                        // Anime.js elastic pop
                        anime({
                            targets: el,
                            opacity: [0, 1],
                            scale: [0.4, 1],
                            translateY: [40, 0],
                            duration: 1200,
                            delay: parseInt(el.dataset.delay) || 0,
                            easing: 'easeOutElastic(1, .6)',
                            begin: () => {
                                // Audio trigger exactly when bubble starts its entry
                                if (el.dataset.audio) {
                                    addToDialogueQueue(el.dataset.audio);
                                }

                                // Consolidate deciphering: trigger if target is inside
                                const decipherTarget = el.querySelector('.decipher-text') || (el.classList.contains('decipher-text') ? el : null);
                                if (decipherTarget && typeof scramble === 'function') {
                                    scramble(decipherTarget);
                                }
                            }
                        });
                    }
                });
            }
        });
    });

    ScrollTrigger.refresh();
}

/* =========================================
   AUDIO CONTROLLER
========================================= */
let dialogueQueue = [];
let isDialoguePlaying = false;
let dialogueAudio = new Audio();
let lastScrollY = window.scrollY;
let voiceMuted = false;

function initAudio() {
    const audio = document.getElementById('bg-music');
    const toggle = document.getElementById('audio-toggle');
    const voiceToggle = document.getElementById('voice-toggle');
    const enterBtn = document.getElementById('enter-btn');
    const overlay = document.getElementById('welcome-overlay');

    if (!audio || !toggle) return;

    // Set initial volume (30-40% as requested)
    audio.volume = 0.35;
    audio.muted = false;

    // Dialogue audio setup
    dialogueAudio.volume = 0.7; // Sage's voice slightly louder than background
    dialogueAudio.muted = false;

    dialogueAudio.onended = () => {
        isDialoguePlaying = false;
        playNextDialogue();
    };

    // Handle the Welcome Overlay + Audio start
    if (enterBtn && overlay) {
        enterBtn.addEventListener('click', () => {
            // 1. Start audio
            audio.play().then(() => {
                toggle.classList.remove('muted');
            }).catch(e => console.error("Background music failed:", e));

            // Sync dialogue audio state
            dialogueAudio.muted = false;
            if (voiceToggle) voiceToggle.classList.remove('muted');

            // 2. Hide overlay
            overlay.style.opacity = '0';
            overlay.style.pointerEvents = 'none';

            // 3. Enable scrolling and reset position
            document.body.style.overflow = 'auto';
            window.scrollTo(0, 0);

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

    // Voice control toggle
    if (voiceToggle) {
        voiceToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            voiceMuted = !voiceMuted;
            dialogueAudio.muted = voiceMuted;

            if (voiceMuted) {
                voiceToggle.classList.add('muted');
                dialogueAudio.pause();
                isDialoguePlaying = false;
            } else {
                voiceToggle.classList.remove('muted');
                if (!isDialoguePlaying) playNextDialogue();
            }
        });
    }

    // Sync UI with audio state
    audio.onplay = () => {
        toggle.classList.remove('muted');
    };
}

/* --- Dialogue Queue Logic --- */
function addToDialogueQueue(src) {
    if (!dialogueQueue.includes(src)) {
        dialogueQueue.push(src);
        if (!isDialoguePlaying) {
            playNextDialogue();
        }
    }
}

function playNextDialogue() {
    if (dialogueQueue.length > 0 && !isDialoguePlaying) {
        if (voiceMuted) return; // Independent voice control check

        isDialoguePlaying = true;
        const nextSrc = dialogueQueue.shift();
        dialogueAudio.src = nextSrc;

        // Volume boost for dialogue 2
        if (nextSrc.includes('dialouge2.ogg')) {
            dialogueAudio.volume = 1.0; // Fixed invalid value 1.95 to max 1.0
        } else {
            dialogueAudio.volume = 0.7; // Standard
        }

        dialogueAudio.play().catch(e => {
            console.error("Dialogue playback failed:", e);
            isDialoguePlaying = false;
            playNextDialogue();
        });
    }
}

/* =========================================
   AUTOSCROLL CONTROLLER
========================================= */
function initAutoscroll() {
    const toggle = document.getElementById('scroll-toggle');
    if (!toggle) return;

    let scrolling = false;
    let scrollPos = window.scrollY;
    let speed = 1.25; // INCREASED SPEED

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

/* =========================================
   CUSTOM SCANNER CURSOR
========================================= */
function initCustomCursor() {
    const cursor = document.getElementById('scanner-cursor');
    if (!cursor) return;

    const xDisplay = document.getElementById('cursor-x');
    const yDisplay = document.getElementById('cursor-y');

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let isMoving = false;
    let movingTimeout;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        cursor.classList.add('visible');
        cursor.classList.add('moving');

        clearTimeout(movingTimeout);
        movingTimeout = setTimeout(() => {
            cursor.classList.remove('moving');
        }, 1000);
    });

    function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    function render() {
        cursorX = lerp(cursorX, mouseX, 0.15);
        cursorY = lerp(cursorY, mouseY, 0.15);

        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;

        if (xDisplay && yDisplay) {
            xDisplay.textContent = Math.round(cursorX).toString().padStart(3, '0');
            yDisplay.textContent = Math.round(cursorY).toString().padStart(3, '0');
        }

        requestAnimationFrame(render);
    }

    render();

    // Hover states
    const interactiveElements = document.querySelectorAll('a, button, .audio-control, .futuristic-btn, .highlight-text');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
    });

    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));
}

/* =========================================
   TEXT DECIPHER EFFECT
========================================= */
window.scramble = null; // Expose globally for synchronization

function initTextDecipher() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@&%*';

    // Define the scramble function globally
    window.scramble = function (el) {
        if (el.classList.contains('scrambling')) return; // Avoid overlapping runs

        const originalText = el.innerText;
        let iteration = 0;
        el.classList.add('deciphered');
        el.classList.add('scrambling');

        // Note: Audio trigger removed here; handled by Manga bubble system for better sync.

        const interval = setInterval(() => {
            el.innerText = originalText.split('')
                .map((char, index) => {
                    if (index < iteration) {
                        return originalText[index];
                    }
                    return chars[Math.floor(Math.random() * chars.length)];
                })
                .join('');

            if (iteration >= originalText.length) {
                clearInterval(interval);
                el.classList.remove('scrambling');
            }

            iteration += 1;
        }, 12); // Slightly slower for better readability
    };

    // Redundant IntersectionObserver removed to prevent glitches with the Manga bubble system
}
