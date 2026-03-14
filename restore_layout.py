import re

# 1. GENERATE INDEX.HTML
html_content = """<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Quiet Revolution - A Hopeful Future</title>
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@300;400;600;700&family=Orbitron:wght@400;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <!-- Welcome Overlay -->
    <div id="welcome-overlay">
        <div class="welcome-content">
            <h1 class="welcome-tagline">The Future is a Quiet Revolution.</h1>
            <p class="welcome-subtext">Are you ready to awaken?</p>
            <button id="enter-btn" class="futuristic-btn">ENTER EXPERIENCE</button>
        </div>
    </div>

    <!-- Particle Background -->
    <canvas id="particle-canvas"></canvas>

    <!-- Custom Scanner Cursor -->
    <div id="scanner-cursor">
        <div class="cursor-dot"></div>
        <div class="cursor-ring ring-1"></div>
        <div class="cursor-ring ring-2"></div>
        <div class="cursor-coords">
            <span id="cursor-x">000</span>
            <span id="cursor-y">000</span>
        </div>
    </div>

    <!-- Scroll Progress Indicator -->
    <div class="progress-bar" id="progress-bar"></div>

    <!-- Audio Control Group -->
    <div class="controls-container">
        <div class="audio-control" id="scroll-toggle" title="Toggle Autoscroll">
            <div class="scroll-icon">
                <div class="dot"></div><div class="dot"></div><div class="dot"></div>
            </div>
            <span class="audio-label">AUTO</span>
        </div>
        <div class="audio-control" id="audio-toggle" title="Toggle Music">
            <div class="visualizer">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
            <span class="audio-label">FREQ</span>
        </div>
        <div class="audio-control" id="voice-toggle" title="Toggle Voice">
            <div class="visualizer" id="voice-visualizer">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
            <span class="audio-label">VOICE</span>
        </div>
    </div>

    <audio id="bg-music" loop>
        <source src="audio.mp3" type="audio/mpeg">
    </audio>

    <main>
        <!-- Horizontal Scroll Container -->
        <div id="comic-wrapper">
            <div id="comic-container">
                
                <!-- Panel 1 -->
                <section class="comic-panel" id="panel-1" style="background-image: url('chapter 1.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="comic-caption reveal-text">
                            <span class="caption-title">March 14, 2026. 11:47 PM.</span>
                            <p>Arjun knew his ceiling. Seven years of staring at it... faint water stains, the Italy crack.</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>He waited for the familiar thrum of the 7:15 local. The city's morning roar. It never came.</p>
                        </div>
                        <div class="dialogue-bubble tail-bottom reveal-text">
                            <p class="highlight-text">This ceiling was breathing.</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>Panels of soft material expanded and contracted... the light just existed.</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 2 -->
                <section class="comic-panel light-mode" id="panel-2" style="background-image: url('chapter 2.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="dialogue-bubble tail-left character-sage decipher-text reveal-text" data-audio="dialouge1.ogg">
                            <p>"Good morning. Your vitals are stable. The year is 2070, Arjun. You've been asleep for a long time."</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>Mumbai 2070. The city was vertical. Buildings rose in organic curves, draped in living green.</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 3 -->
                <section class="comic-panel light-mode" id="panel-3" style="background-image: url('chapter 3.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="dialogue-bubble tail-left character-sage decipher-text reveal-text" data-audio="dialouge3.ogg">
                            <p>"I'm SAGE. The previous resident called me that. I manage the building's ecosystem."</p>
                        </div>
                        <div class="dialogue-bubble tail-left character-sage decipher-text reveal-text" data-audio="dialouge4.ogg">
                            <p>"Air quality index: 8. It's been under 15 for six years. We stopped waiting for a miracle."</p>
                        </div>
                        <div class="dialogue-bubble tail-left character-sage decipher-text reveal-text" data-audio="dialouge5.ogg">
                            <p>"It took a long time. Millions of people who simply refused to stop trying."</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 4 -->
                <section class="comic-panel light-mode" id="panel-4" style="background-image: url('chapter 4.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="comic-caption reveal-text">
                            <p>The air didn't smell like diesel and desperation. It smelled like rain on wet stone.</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>No cars. Only cyclists and silent pods moving like schools of fish through glass veins.</p>
                        </div>
                        <div class="dialogue-bubble tail-right character-boy reveal-text">
                            <p>"My dadi says people used to sit in metal boxes and breathe anger for two hours."</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>Arjun wandered for hours, finding a city that finally felt like a home for humans.</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 5 -->
                <section class="comic-panel light-mode" id="panel-5" style="background-image: url('chapter 5.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="dialogue-bubble tail-left character-aria reveal-text">
                            <p>"ARIA can do a basic scan... Most things we catch early now. Preventative care is a right."</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>He thought about his uncle in 2024. The fear of a hospital bill was as deadly as the disease.</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>The world was so different then. We were so afraid of tomorrow.</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 6 -->
                <section class="comic-panel light-mode" id="panel-6" style="background-image: url('chapter 6.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content">
                        <div class="dialogue-bubble tail-left character-teacher reveal-text">
                            <p>"That group is working on a local watershed restoration project. Lessons from the past."</p>
                        </div>
                        <div class="dialogue-bubble tail-right character-oldman reveal-text">
                            <p>"Millions of small, stubborn acts of refusing to give up. That's how we got here."</p>
                        </div>
                        <div class="dialogue-bubble tail-right character-oldman reveal-text">
                            <p>"It wasn't one miracle, Arjun. It was every one of us, every single day."</p>
                        </div>
                    </div>
                </section>

                <!-- Panel 7 -->
                <section class="comic-panel light-mode" id="panel-7" style="background-image: url('chapter 7.jpeg');">
                    <div class="panel-overlay"></div>
                    <div class="comic-content finale-center">
                        <div class="comic-caption reveal-text">
                            <p>Arjun finally understood. The nightmare of his past was the seed that grew into this dream.</p>
                        </div>
                        <div class="dialogue-bubble reveal-text box-glow" style="max-width: 600px; text-align: center;">
                            <span class="caption-title" style="margin-bottom:1rem;">Epilogue — The Message</span>
                            <p class="emphasis highlight-text">I have seen your future. It happened because of you. The version of you that kept going anyway.</p>
                        </div>
                        <div class="comic-caption reveal-text">
                            <p>Mumbai breathed under a sky of stars. The future belongs to those who build it together.</p>
                        </div>
                        <button class="restart-btn futuristic-btn" id="restart-btn" style="margin-top:2rem;">Wake Up Again</button>
                    </div>
                </section>

            </div>
        </div>
    </main>

    <!-- Scripts -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js"></script>
    <script src="gsap.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
    <script src="script.js"></script>
</body>
</html>
"""

with open("index.html", "w") as f:
    f.write(html_content)

# 2. FIX CSS - Remove .manga-panel, restore .comic-panel flexbox
with open("style.css", "r") as f:
    css = f.read()

# Instead of regex, let's just replace the whole MANGA MODE LAYOUT section
# that contains the bad stuff, up to RESPONSIVE ADJUSTMENTS.
start_idx = css.find("/* =========================================\n   MANGA MODE LAYOUT")
end_idx = css.find("/* =========================================\n   CINEMATIC ENHANCEMENTS: SCANNER CURSOR")

if start_idx != -1 and end_idx != -1:
    comic_css = """/* =========================================
   COMIC HORIZONTAL LAYOUT (RESTORED)
========================================= */
/* Comic Layout Base */
#comic-wrapper {
    overflow: hidden; /* Hide horizontal scrollbar */
    height: 100vh; 
    width: 100vw;
}
#comic-container {
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    width: max-content; /* expands to fit panels */
}

/* Individual Panel */
.comic-panel {
    flex-shrink: 0;
    width: 100vw;
    height: 100vh;
    position: relative;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Subtle dark overlay so text pops */
.panel-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 30%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.8) 100%);
    pointer-events: none;
    z-index: 1;
}

.comic-content {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    padding: 10vh 5vw 12vh 5vw; /* Extra bottom padding for controls */
}

/* Comic Caption Box (Narration) */
.comic-caption {
    background: rgba(15, 23, 42, 0.85); /* Dark slate */
    border: 2px solid var(--color-accent-cold);
    box-shadow: 4px 4px 0px rgba(59, 130, 246, 0.5); /* Hard comic shadow */
    padding: 1rem 1.5rem;
    max-width: 450px;
    border-radius: 4px; /* Sharp edges for comic feel */
    font-family: var(--font-body);
    font-size: 1rem;
    line-height: 1.4;
    color: #e2e8f0;
    align-self: flex-start; /* Default */
    position: relative;
    z-index: 10;
}
.comic-caption p { margin-bottom: 0.8rem; }
.comic-caption p:last-child { margin-bottom: 0; }
.caption-title { font-family: var(--font-futuristic); font-size: 0.85rem; color: var(--color-accent-cold); display: block; margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 2px; }

/* Dialogue Bubbles */
.dialogue-bubble {
    background: rgba(255, 255, 255, 0.95);
    color: #0f172a;
    border: 2px solid #1e293b;
    padding: 1rem 1.2rem;
    max-width: 350px;
    border-radius: 20px;
    font-family: var(--font-heading);
    font-size: 1.1rem;
    font-weight: 600;
    box-shadow: 2px 4px 15px rgba(0,0,0,0.3);
    position: relative;
    align-self: flex-start; /* Default */
    z-index: 10;
}
.dialogue-bubble p { margin: 0; }

/* Tails for bubbles utilizing pseudo-elements */
.dialogue-bubble::after {
    content: '';
    position: absolute;
    width: 0; height: 0;
    border-style: solid;
}
.tail-left::after {
    border-width: 10px 15px 10px 0;
    border-color: transparent rgba(255,255,255,0.95) transparent transparent;
    left: -15px; top: 50%; transform: translateY(-50%);
}
.tail-right::after {
    border-width: 10px 0 10px 15px;
    border-color: transparent transparent transparent rgba(255,255,255,0.95);
    right: -15px; top: 50%; transform: translateY(-50%);
}
.tail-bottom::after {
    border-width: 15px 10px 0 10px;
    border-color: rgba(255,255,255,0.95) transparent transparent transparent;
    bottom: -15px; left: 50%; transform: translateX(-50%);
}

.box-glow { box-shadow: 0 0 40px rgba(59, 130, 246, 0.4), inset 0 0 20px rgba(59, 130, 246, 0.2); border-color: rgba(59, 130, 246, 0.8); }

/* Character Specific Bubble tweaks */
.character-sage { background: rgba(15, 23, 42, 0.95); color: #7dd3fc; border-color: #3b82f6; box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
.character-sage.tail-left::after { border-color: transparent rgba(15, 23, 42, 0.95) transparent transparent; }
.character-boy { color: #86efac; }
.character-aria { color: #fcd34d; }
.character-teacher { color: #2dd4bf; }
.character-oldman { color: #fb923c; }

/* Specific overrides for layout tuning - Flexbox Sequential Flow */
#panel-1 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 5%; }
#panel-1 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 8%; }
#panel-1 > .comic-content > :nth-child(3) { align-self: center; margin-right: 15%; }
#panel-1 > .comic-content > :nth-child(4) { align-self: flex-start; margin-left: 10%; }

#panel-2 > .comic-content > :nth-child(1) { align-self: center; margin-left: 10%; margin-top: 10%; }
#panel-2 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 15%; margin-bottom: 10%; }

#panel-3 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 10%; }
#panel-3 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 10%; }
#panel-3 > .comic-content > :nth-child(3) { align-self: center; margin-left: 15%; }

#panel-4 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 8%; }
#panel-4 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 15%; }
#panel-4 > .comic-content > :nth-child(3) { align-self: center; margin-left: 5%; }
#panel-4 > .comic-content > :nth-child(4) { align-self: flex-end; margin-right: 8%; max-width: 450px; }

#panel-5 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 15%; margin-top: 5%; }
#panel-5 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 10%; }
#panel-5 > .comic-content > :nth-child(3) { align-self: center; margin-left: 5%; }

#panel-6 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 8%; }
#panel-6 > .comic-content > :nth-child(2) { align-self: flex-end; margin-right: 10%; }
#panel-6 > .comic-content > :nth-child(3) { align-self: center; margin-left: 15%; }

#panel-7 > .comic-content > :nth-child(1) { align-self: flex-start; margin-left: 8%; }
#panel-7 > .comic-content > :nth-child(2) { align-self: center; }
#panel-7 > .comic-content > :nth-child(3) { align-self: flex-end; margin-right: 8%; }
#panel-7 > .comic-content > :nth-child(4) { align-self: center; }

.finale-center { display: flex; align-items: center; justify-content: center; flex-direction: column; }
.reveal-text { opacity: 0; }

.restart-btn {
    background: transparent;
    color: #fff;
    border: 1px solid rgba(168, 85, 247, 0.5);
    padding: 1rem 2rem;
    font-family: var(--font-futuristic);
    cursor: pointer;
    transition: 0.3s;
    font-size: 15px;
}
.restart-btn:hover {
    background: rgba(168, 85, 247, 0.2);
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
}

"""
    new_css = css[:start_idx] + comic_css + css[end_idx:]
    
    # Also remove chapter-text and section-title if they exist
    new_css = re.sub(r'/\* =========================================\n   2\. CHAPTER TEXT STYLES[\s\S]*?/\* =========================================\n   CINEMATIC', '/* =========================================\n   CINEMATIC', new_css)
    
    with open('style.css', 'w') as f:
        f.write(new_css)

# 3. FIX JS - Restore scrolltrigger horizontal panning
with open('script.js', 'r') as f:
    js = f.read()

# Replace the GSAP STORY ANIMATIONS and MANGA MODE ANIMATIONS with the correct horizontal scroll
start_idx_js = js.find("/* =========================================\n   GSAP STORY ANIMATIONS")
end_idx_js = js.find("/* =========================================\n   AUDIO CONTROLLER")

if start_idx_js != -1 and end_idx_js != -1:
    comic_js = """/* =========================================
   GSAP HORIZONTAL MANGA ANIMATIONS
========================================= */
function initAnimations() {
    let comicWrapper = document.getElementById("comic-wrapper");
    let comicContainer = document.getElementById("comic-container");

    if (!comicWrapper || !comicContainer) return;

    let panels = gsap.utils.toArray(".comic-panel");

    // Horizontal Scroll Trigger
    let scrollTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: "none",
        scrollTrigger: {
            trigger: comicWrapper,
            pin: true,
            scrub: 1,
            end: () => "+=" + comicContainer.offsetWidth 
        }
    });

    // Reveal Text in Panels with unique anime.js animations
    panels.forEach((panel, i) => {
        let texts = panel.querySelectorAll('.reveal-text');
        if(texts.length) {
            anime.set(texts, { opacity: 0 });

            ScrollTrigger.create({
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left center",
                onEnter: () => playPanelAnimation(i, texts),
                onLeaveBack: () => resetPanelAnimation(texts)
            });
        }
    });

    function playPanelAnimation(index, elements) {
        switch(index) {
            case 0:
                anime({ targets: elements, translateY: [40, 0], opacity: [0, 1], easing: 'easeOutElastic(1, .8)', duration: 1200, delay: anime.stagger(400) });
                break;
            case 1:
                anime({ targets: elements, translateX: [-50, 0], opacity: [0, 1], easing: 'easeOutExpo', duration: 1000, delay: anime.stagger(400) });
                break;
            case 2:
                anime({ targets: elements, scale: [0.8, 1], opacity: [0, 1], easing: 'easeOutBack', duration: 1000, delay: anime.stagger(350) });
                break;
            case 3:
                anime({ targets: elements, translateY: [-50, 0], opacity: [0, 1], easing: 'easeOutBounce', duration: 1200, delay: anime.stagger(400) });
                break;
            case 4:
                anime({ targets: elements, translateX: [50, 0], opacity: [0, 1], easing: 'easeOutQuad', duration: 1000, delay: anime.stagger(400) });
                break;
            case 5:
                anime({ targets: elements, rotateX: [90, 0], opacity: [0, 1], easing: 'easeOutSine', duration: 800, delay: anime.stagger(400) });
                break;
            case 6: // Panel 7
                anime({ targets: elements, translateY: [20, 0], opacity: [0, 1], easing: 'easeInOutQuad', duration: 1500, delay: anime.stagger(600) });
                
                // Trigger audio if present
                elements.forEach(el => {
                    if (el.dataset.audio) {
                        setTimeout(() => addToDialogueQueue(el.dataset.audio), 500);
                    }
                });
                break;
            default:
                anime({ targets: elements, opacity: [0, 1], translateY: [20,0], duration: 800, delay: anime.stagger(200) });
        }
        
        // Ensure audio plays for earlier elements too
        if (index !== 6) {
           elements.forEach(el => {
                if (el.dataset.audio) {
                    setTimeout(() => addToDialogueQueue(el.dataset.audio), 500);
                }
            });
        }
    }

    function resetPanelAnimation(elements) {
        anime.set(elements, { opacity: 0, translateY: 0, translateX: 0, scale: 1, rotateX: 0 });
    }

    const restartBtn = document.getElementById("restart-btn");
    if (restartBtn) {
        restartBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    gsap.to("#progress-bar", {
        width: "100%",
        ease: "none",
        scrollTrigger: {
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.3
        }
    });
}
"""
    new_js = js[:start_idx_js] + comic_js + js[end_idx_js:]
    with open('script.js', 'w') as f:
        f.write(new_js)

