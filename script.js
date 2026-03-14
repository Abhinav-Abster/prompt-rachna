// Game State
let currentSceneIndex = 0;
let isTyping = false;
let typeInterval;
let choiceTimerInterval;
let bgMusic;
let isAudioMuted = true;
let isChoiceActive = false;

// Story Data
const story = [
    {
        id: 'start',
        bg: 'chapter 1.jpeg',
        anim: 'anim-fade-in',
        year: '2026',
        speaker: '',
        text: "Arjun knew his ceiling. Seven years of staring at it... faint water stains, the Italy crack.",
        choices: [
            { text: "Trace the crack", nextScene: 'trace_crack' },
            { text: "Just wait...", nextScene: 'wait_room' }
        ],
        timer: 5000,
        defaultChoice: 1
    },
    {
        id: 'trace_crack',
        bg: 'chapter 1.jpeg',
        year: '2026',
        speaker: '',
        text: "He traced the jagged line with his eyes. In his dry-docked life, it was the only map he had.",
        next: 'wait_room'
    },
    {
        id: 'wait_room',
        bg: 'chapter 1.jpeg',
        year: '2026',
        speaker: '',
        text: "He waited for the familiar thrum of the 7:15 local. The city's morning roar. It never came."
    },
    {
        bg: 'chapter 1.jpeg',
        year: '2026',
        speaker: '',
        text: "This ceiling was breathing."
    },
    {
        bg: 'chapter 1.jpeg',
        year: '2026',
        speaker: '',
        text: "Panels of soft material expanded and contracted... the light just existed."
    },
    {
        bg: 'chapter 2.jpeg',
        anim: 'anim-flash-white',
        year: '2070',
        speaker: 'SAGE',
        text: "Good morning."
    },
    {
        bg: 'chapter 2.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "Your vitals are stable. The year is 2070, Arjun. You've been asleep for a long time.",
        choices: [
            { text: "What happened to Mumbai?", nextScene: 'city_intro' },
            { text: "Who are you?", nextScene: 'sage_intro' },
            { text: "I need to get up.", nextScene: 'get_up' }
        ],
        timer: 10000,
        defaultChoice: 0
    },
    {
        id: 'city_intro',
        bg: 'chapter 2.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "Mumbai 2070. The city is vertical now. Buildings rise in organic curves, draped in living green.",
        next: 'sage_intro'
    },
    {
        id: 'get_up',
        bg: 'chapter 2.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "Please take it slowly. Your muscle atrophy has been repaired, but disorientation is expected.",
        next: 'sage_intro'
    },
    {
        id: 'sage_intro',
        bg: 'chapter 3.jpeg',
        anim: 'anim-fade-black',
        year: '2070',
        speaker: 'SAGE',
        text: "I'm SAGE. The previous resident called me that. I manage the building's ecosystem.",
        choices: [
            { text: "How did you do it?", nextScene: 'sage_how' },
            { text: "What about skeptics?", nextScene: 'sage_skeptics' }
        ],
        timer: 8000,
        defaultChoice: 0
    },
    {
        id: 'sage_how',
        bg: 'chapter 3.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "It wasn't a single invention. We synthesized carbon capture with organic architecture. Nature and code finally aligned.",
        next: 'join_air_quality'
    },
    {
        id: 'sage_skeptics',
        bg: 'chapter 3.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "The skeptics were simply invited to breathe. Once the air cleared, the arguments for the old ways withered like smog.",
        next: 'join_air_quality'
    },
    {
        id: 'join_air_quality',
        bg: 'chapter 3.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "Air quality index: 8. It's been under 15 for six years. We stopped waiting for a miracle."
    },
    {
        bg: 'chapter 3.jpeg',
        year: '2070',
        speaker: 'SAGE',
        text: "It took a long time. Millions of people who simply refused to stop trying."
    },
    {
        bg: 'chapter 4.jpeg',
        anim: 'anim-slide-wipe',
        year: '2070',
        speaker: '',
        text: "The air didn't smell like diesel and desperation. It smelled like rain on wet stone."
    },
    {
        bg: 'chapter 4.jpeg',
        year: '2070',
        speaker: '',
        text: "No cars. Only cyclists and silent pods moving like schools of fish through glass veins.",
        choices: [
            { text: "Listen to the streets", nextScene: 'listen_streets' },
            { text: "Keep walking quickly", nextScene: 'keep_walking' }
        ],
        timer: 7000,
        defaultChoice: 1
    },
    {
        id: 'listen_streets',
        bg: 'chapter 4.jpeg',
        year: '2070',
        speaker: '',
        text: "Instead of horns and screeching tires, you hear the distant hum of wind turbines and people laughing.",
        next: 'boy_talk'
    },
    {
        id: 'keep_walking',
        bg: 'chapter 4.jpeg',
        year: '2070',
        speaker: '',
        text: "You step carefully along the glowing pathways, marveling at the sheer scale of the green infrastructure.",
        next: 'boy_talk'
    },
    {
        id: 'boy_talk',
        bg: 'chapter 4.jpeg',
        year: '2070',
        speaker: 'BOY',
        text: "My dadi says people used to sit in metal boxes and breathe anger for two hours."
    },
    {
        bg: 'chapter 4.jpeg',
        year: '2070',
        speaker: '',
        text: "Arjun wandered for hours, finding a city that finally felt like a home for humans."
    },
    {
        bg: 'chapter 5.jpeg',
        anim: 'anim-zoom-fade',
        year: '2070',
        speaker: 'ARIA',
        text: "ARIA can do a basic scan... Most things we catch early now. Preventative care is a right.",
        choices: [
            { text: "Show me my stats", nextScene: 'aria_stats' },
            { text: "Who created you?", nextScene: 'aria_origins' }
        ],
        timer: 7000,
        defaultChoice: 0
    },
    {
        id: 'aria_stats',
        bg: 'chapter 5.jpeg',
        year: '2070',
        speaker: 'ARIA',
        text: "VITALITY: 94% | STRESS: 12% | HOPE: MAXIMIZED. You are physically younger than you should be.",
        next: 'aria_uncle_thought'
    },
    {
        id: 'aria_origins',
        bg: 'chapter 5.jpeg',
        year: '2070',
        speaker: 'ARIA',
        text: "I am a consensus protocol. Millions of doctors donated their life's work to create a health net for all.",
        next: 'aria_uncle_thought'
    },
    {
        id: 'aria_uncle_thought',
        bg: 'chapter 5.jpeg',
        year: '2070',
        speaker: '',
        text: "He thought about his uncle in 2024. The fear of a hospital bill was as deadly as the disease."
    },
    {
        bg: 'chapter 5.jpeg',
        year: '2070',
        speaker: '',
        text: "The world was so different then. We were so afraid of tomorrow."
    },
    {
        bg: 'chapter 6.jpeg',
        anim: 'anim-slide-up',
        year: '2070',
        speaker: 'TEACHER',
        text: "That group is working on a local watershed restoration project. Lessons from the past.",
        choices: [
            { text: "Can I help?", nextScene: 'oldman_help' },
            { text: "Is it peaceful?", nextScene: 'oldman_peace' }
        ],
        timer: 8000,
        defaultChoice: 1
    },
    {
        id: 'oldman_help',
        bg: 'chapter 6.jpeg',
        year: '2070',
        speaker: 'OLD MAN',
        text: "Always. Every pair of hands is a testament to the future. Pick up a spade, son.",
        next: 'oldman_legacy'
    },
    {
        id: 'oldman_peace',
        bg: 'chapter 6.jpeg',
        year: '2070',
        speaker: 'OLD MAN',
        text: "Peace isn't the absence of conflict, it's the presence of a shared purpose. We found it.",
        next: 'oldman_legacy'
    },
    {
        id: 'oldman_legacy',
        bg: 'chapter 6.jpeg',
        year: '2070',
        speaker: 'OLD MAN',
        text: "Millions of small, stubborn acts of refusing to give up. That's how we got here."
    },
    {
        bg: 'chapter 6.jpeg',
        year: '2070',
        speaker: 'OLD MAN',
        text: "It wasn't one miracle, Arjun. It was every one of us, every single day."
    },
    {
        bg: 'chapter 7.jpeg',
        anim: 'anim-blur-fade',
        year: '2070',
        speaker: '',
        text: "Arjun finally understood. The nightmare of his past was the seed that grew into this dream."
    },
    {
        bg: 'chapter 7.jpeg',
        year: '2070',
        speaker: '???',
        text: "I have seen your future. It happened because of you. The version of you that kept going anyway."
    },
    {
        bg: 'chapter 7.jpeg',
        year: '2070',
        speaker: '',
        text: "Mumbai breathed under a sky of stars. The future belongs to those who build it together.",
        choices: [
            { text: "Wake Up", nextScene: 'wake_up' },
            { text: "Stay Asleep", nextScene: 'stay_asleep' },
            { text: "Save Memory", nextScene: 'save_memory' }
        ],
        timer: 6000, 
        defaultChoice: 0
    },
    {
        id: 'wake_up',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SYSTEM',
        text: "You chose to wake up. Your eyes flutter open in 2026. The water stain is still there.",
        next: 'final_waking'
    },
    {
        id: 'final_waking',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SYSTEM',
        text: "But now, you know what you are building towards. End of Experience.",
        restart: true
    },
    {
        id: 'stay_asleep',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SYSTEM',
        text: "You chose to stay asleep. The breathing ceiling lulls you deeper into 2070.",
        next: 'final_sleeping'
    },
    {
        id: 'final_sleeping',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SYSTEM',
        text: "The perfect dream continues forever... End of Experience.",
        restart: true
    },
    {
        id: 'save_memory',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SAGE',
        text: "Memory archived. The blueprint of hope is secured in your neural lattice.",
        next: 'final_memory'
    },
    {
        id: 'final_memory',
        bg: 'chapter 7.jpeg',
        year: '',
        speaker: 'SYSTEM',
        text: "You are ready for either world. End of Experience.",
        restart: true
    }
];

// DOM Elements
const gameContainer = document.getElementById('game-container');
const welcomeScreen = document.getElementById('welcome-screen');
const dialogueScreen = document.getElementById('dialogue-screen');
const bgLayer = document.getElementById('bg-layer');
const transitionOverlay = document.getElementById('transition-overlay');
const yearDisplay = document.getElementById('year-display');
const characterNameBox = document.getElementById('character-name-box');
const characterName = document.getElementById('character-name');
const dialogueText = document.getElementById('dialogue-text');
const nextIndicator = document.getElementById('next-indicator');
const choicesContainer = document.getElementById('choices-container');
const choicesList = document.getElementById('choices-list');
const timerBar = document.getElementById('timer-bar');
const audioToggle = document.getElementById('audio-toggle');
const audioLabel = document.querySelector('.audio-label');

document.addEventListener('DOMContentLoaded', () => {
    bgMusic = document.getElementById('bg-music');
    if (bgMusic) {
        bgMusic.volume = 0.35;
    }
    
    // Start game on click
    gameContainer.addEventListener('click', handleGameClick);
    
    // Start game on Spacebar press
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.key === ' ') {
            e.preventDefault(); // Prevent page scrolling if any
            handleGameClick();
        }
    });
    
    // Audio toggle
    audioToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // prevent advancing dialogue
        toggleAudio();
    });
});

function toggleAudio() {
    if (!bgMusic) return;
    
    if (bgMusic.paused) {
        bgMusic.play().then(() => {
            isAudioMuted = false;
            audioToggle.classList.remove('muted');
            audioLabel.textContent = 'BGM ON';
        }).catch(e => console.error("Audio playback failed", e));
    } else {
        bgMusic.pause();
        isAudioMuted = true;
        audioToggle.classList.add('muted');
        audioLabel.textContent = 'BGM OFF';
    }
}

function handleGameClick() {
    // Block clicks entirely if user must make a choice
    if (isChoiceActive) {
        return;
    }

    // If we're on the welcome screen
    if (welcomeScreen.classList.contains('active')) {
        startGame();
        return;
    }
    
    // If typing is in progress, finish it immediately
    if (isTyping) {
        completeTyping();
        return;
    }
    
    // Otherwise, go to next scene
    nextScene();
}

function startGame() {
    welcomeScreen.classList.remove('active');
    dialogueScreen.classList.add('active');
    
    // Try to play audio if not explicitly disabled
    if (isAudioMuted && bgMusic) {
        toggleAudio();
    }
    
    currentSceneIndex = 0;
    renderScene();
}

function renderScene() {
    const scene = story[currentSceneIndex];
    
    // Update Background and Animations
    if (scene.bg) {
        const prevBg = bgLayer.style.backgroundImage;
        const newBg = `url("${scene.bg}")`;
        
        if (prevBg !== newBg) {
            bgLayer.style.backgroundImage = newBg;
            
            // Trigger Animation if requested
            if (scene.anim) {
                // Determine whether to apply animation to BG or Overlay
                const useOverlay = ['anim-flash-white', 'anim-fade-black', 'anim-slide-wipe', 'anim-slide-up'].includes(scene.anim);
                const animElement = useOverlay ? transitionOverlay : bgLayer;
                
                // Remove animation classes to force reflow and restart animation
                transitionOverlay.className = '';
                bgLayer.className = '';
                void animElement.offsetWidth; // Trigger reflow
                animElement.classList.add(scene.anim);
            }
        }
    }
    
    // Update Year
    if (scene.year) {
        document.getElementById('scene-info').style.display = 'block';
        yearDisplay.textContent = scene.year;
    } else {
        document.getElementById('scene-info').style.display = 'none';
    }
    
    // Update Character Name
    if (scene.speaker) {
        characterNameBox.classList.remove('hidden');
        characterName.textContent = scene.speaker;
    } else {
        characterNameBox.classList.add('hidden');
    }
    
    // Reset and start typing text
    dialogueText.textContent = '';
    nextIndicator.classList.add('hidden');
    choicesContainer.classList.add('hidden');
    isChoiceActive = false;
    clearInterval(choiceTimerInterval);
    
    startTyping(scene.text);
}

function startTyping(text) {
    isTyping = true;
    let charIndex = 0;
    
    // Text speed (lower is faster)
    const typingSpeed = 30; // ms per char
    
    clearInterval(typeInterval);
    typeInterval = setInterval(() => {
        dialogueText.textContent += text.charAt(charIndex);
        charIndex++;
        
        if (charIndex >= text.length) {
            completeTyping();
        }
    }, typingSpeed);
}

function completeTyping() {
    clearInterval(typeInterval);
    const scene = story[currentSceneIndex];
    dialogueText.textContent = scene.text;
    isTyping = false;
    
    // Check if the current scene has choices
    if (scene.choices && scene.choices.length > 0) {
        showChoices(scene.choices, scene.timer, scene.defaultChoice);
    } else {
        nextIndicator.classList.remove('hidden');
    }
}

function showChoices(choices, timerDuration, defaultChoiceIndex) {
    isChoiceActive = true;
    choicesContainer.classList.remove('hidden');
    choicesList.innerHTML = '';
    
    // Render Choice Buttons
    choices.forEach((choice, index) => {
        const btn = document.createElement('button');
        btn.className = 'choice-btn';
        btn.textContent = choice.text;
        
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent game click
            makeChoice(choice.nextScene);
        });
        
        choicesList.appendChild(btn);
    });
    
    // Start countdown timer if specified
    if (timerDuration > 0) {
        let timeLeft = timerDuration;
        const updateRate = 50; // ms
        
        timerBar.style.transform = `scaleX(1)`;
        
        choiceTimerInterval = setInterval(() => {
            timeLeft -= updateRate;
            const percentage = Math.max(0, timeLeft / timerDuration);
            timerBar.style.transform = `scaleX(${percentage})`;
            
            if (timeLeft <= 0) {
                // Timeout reached
                const defaultChoice = choices[defaultChoiceIndex || 0];
                makeChoice(defaultChoice.nextScene);
            }
        }, updateRate);
    } else {
        // No timer bar shown if infinite time
        timerBar.style.transform = `scaleX(1)`;
    }
}

function makeChoice(nextSceneRef) {
    clearInterval(choiceTimerInterval);
    isChoiceActive = false;
    choicesContainer.classList.add('hidden');
    
    // Jump to the chosen scene
    if (typeof nextSceneRef === 'string') {
        currentSceneIndex = story.findIndex(s => s.id === nextSceneRef);
    } else {
        currentSceneIndex = nextSceneRef;
    }
    
    // Determine end of game or render next
    if (currentSceneIndex >= story.length || currentSceneIndex < 0) {
        resetGame();
    } else {
        renderScene();
    }
}

function nextScene() {
    // If we're at a choice screen, spacebar/click usually shouldn't advance blindly
    if (isChoiceActive) return;

    const currentScene = story[currentSceneIndex];
    
    // If scene specifically marks the end of a branch
    if (currentScene.restart) {
        resetGame();
        return;
    }
    
    // Branching jumps
    if (currentScene.next !== undefined) {
        if (typeof currentScene.next === 'string') {
            currentSceneIndex = story.findIndex(s => s.id === currentScene.next);
        } else {
            currentSceneIndex = currentScene.next;
        }
    } else {
        currentSceneIndex++;
    }
    
    // Bounds check
    if (currentSceneIndex >= story.length || currentSceneIndex < 0) { 
        resetGame();
    } else {
        renderScene();
    }
}

function resetGame() {
    currentSceneIndex = 0;
    welcomeScreen.classList.add('active');
    dialogueScreen.classList.remove('active');
    bgLayer.style.backgroundImage = 'none';
    transitionOverlay.className = ''; // Reset overlay effects
}
