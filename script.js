// ===============================
// STATE MANAGEMENT
// ===============================

let currentUser = null;
let currentMood = "😊"; // Default
let targetAuthType = null; // 'signin' or 'signup'

const wellnessTips = [
    "Take 3 deep breaths right now. In through your nose, out through your mouth.",
    "Drink a glass of water. Hydration is essential for mental clarity.",
    "Step outside for 5 minutes. Fresh air and sunlight boost mood instantly.",
    "Stretch gently for 2 minutes. Movement helps release tension.",
    "Practice gratitude. Name 3 things you're grateful for today.",
    "Limit notifications. Digital detox is self-care.",
    "Eat something nourishing. Your body fuels your mind.",
    "Listen to your favorite song. Music is medicine for the soul.",
    "Write down one positive thing that happened today.",
    "Send a kind message to someone you care about.",
    "Practice a 2-minute body scan meditation.",
    "Go for a walk without your phone. Be present.",
];

const moodResponses = {
    "😢": "It's okay to feel down. Consider reaching out to someone. You're not alone.",
    "😕": "That's alright. Small moments of joy can help. Try one of our activities.",
    "😊": "That's wonderful! Hold onto this feeling and nurture it.",
    "😄": "Amazing! You're radiating positivity. Keep shining!",
    "🤩": "Absolutely incredible! You're thriving. Share your energy!",
};

// ===============================
// JOURNAL & ENDING PROMPTS
// ===============================
const JOURNAL_PLACEHOLDER = [
    "Take a slow breath.",
    "Write what’s taking up space in your mind right now.",
    "Then list up to 3 things that truly need your attention today.",
    "Everything else can wait."
].join("\n");
const ENDING_PROMPT = [
    "You’ve done enough for now.",
    "Whatever you placed here doesn’t need to follow you.",
    "Close this space gently and return when you’re ready."
].join("\n");
const SHORT_JOURNAL = "Write freely. Keep only what matters today.";
const SHORT_ENDING = "Rest now. bloom will be here.";

// ===============================
// SCREEN NAVIGATION
// ===============================

function navigateTo(screenName, authType = null) {
    // Hide all screens
    document.querySelectorAll(".screen").forEach(screen => {
        screen.classList.remove("active");
    });

    // Show target screen
    switch (screenName) {
        case "welcome":
            document.getElementById("welcome-screen").classList.add("active");
            break;
        case "mood-checkin":
            targetAuthType = authType;
            document.getElementById("mood-checkin-screen").classList.add("active");
            initializeMoodCheckin();
            break;
        case "signin":
        case "signup":
            document.getElementById("auth-screen").classList.add("active");
            if (screenName === "signin") {
                switchAuthTab("signin");
            } else {
                switchAuthTab("signup");
            }
            break;
        case "home":
            if (!currentUser) {
                navigateTo("welcome");
                return;
            }
            document.getElementById("home-screen").classList.add("active");
            initializeHome();
            break;
        case "journal":
            if (!currentUser) {
                navigateTo("welcome");
                return;
            }
            document.getElementById("journal-screen").classList.add("active");
            initializeJournalSimple();
            break;
        case "game":
            document.getElementById("game-screen").classList.add("active");
            break;
    }

    // Scroll to top
    window.scrollTo(0, 0);
}

// ===============================
// AUTHENTICATION
// ===============================

function switchAuthTab(tabName) {
    // Update forms
    document.querySelectorAll(".auth-form").forEach(form => {
        form.classList.remove("active");
    });

    // Update tab buttons
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(btn => btn.classList.remove("active"));

    if (tabName === "signin") {
        document.getElementById("signin-form").classList.add("active");
        // Assuming first tab is Sign In
        if (tabs[0]) tabs[0].classList.add("active");
    } else {
        document.getElementById("signup-form").classList.add("active");
        // Assuming second tab is Sign Up
        if (tabs[1]) tabs[1].classList.add("active");
    }
}

function handleSignIn(event) {
    event.preventDefault();

    const email = document.getElementById("signin-email").value.trim().toLowerCase();
    const password = document.getElementById("signin-password").value;

    // Simulate authentication
    const userData = JSON.parse(localStorage.getItem(email));

    if (userData && userData.password === password) {
        currentUser = {
            name: userData.name,
            email: email
        };
        localStorage.setItem('bloom_session_user', JSON.stringify(currentUser));
        navigateTo("home");
    } else {
        alert("Invalid credentials. Try signing up first!");
    }
}

function handleSignUp(event) {
    event.preventDefault();

    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value.trim().toLowerCase();
    const password = document.getElementById("signup-password").value;
    const confirm = document.getElementById("signup-confirm").value;

    if (password !== confirm) {
        alert("Passwords don't match!");
        return;
    }

    if (localStorage.getItem(email)) {
        alert("Account already exists. Please sign in.");
        return;
    }

    // Save user data (in real app, this would be on a server)
    const userData = { name, email, password };
    localStorage.setItem(email, JSON.stringify(userData));

    currentUser = {
        name: name,
        email: email
    };
    localStorage.setItem('bloom_session_user', JSON.stringify(currentUser));

    // Show welcome message
    setTimeout(() => {
        navigateTo("home");
    }, 500);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('bloom_session_user');
    document.getElementById("signin-email").value = "";
    document.getElementById("signin-password").value = "";
    navigateTo("welcome");
}

// ===============================
// HOME PAGE INITIALIZATION
// ===============================

function initializeHome() {
    const greetingEl = document.getElementById("greeting");

    // Time of day Greeting
    const hour = new Date().getHours();
    let timeGreeting = "Hello";
    if (hour < 12) timeGreeting = "Good Morning";
    else if (hour < 18) timeGreeting = "Good Afternoon";
    else timeGreeting = "Good Evening";

    greetingEl.innerHTML = `${timeGreeting}, ${currentUser.name.split(" ")[0]} <span class="greeting-flower">🌸</span>`;

    // Set current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById("current-date").textContent = today.toLocaleDateString('en-US', options);

    // Display random wellness tip
    refreshWellnessTip();

    // Restore mood state if same day
    const savedDate = localStorage.getItem("last_mood_date");
    if (savedDate === new Date().toDateString()) {
        const savedMood = localStorage.getItem('bloom_user_mood');
        if (savedMood) {
            // Restore UI state
            updateAtmosphere(savedMood);
            const feedbackEl = document.getElementById("mood-feedback");
            if (feedbackEl) feedbackEl.textContent = "Welcome back!";
            const activityContainer = document.getElementById("mood-activity-container");
            if (activityContainer) activityContainer.style.display = "block";
            document.querySelectorAll(".mood-leaf").forEach(btn => {
                if (btn.getAttribute("data-mood") === savedMood) btn.classList.add("active");
            });
            currentMood = savedMood;
        }
    }

    // Initialize Habits
    loadDailyHabits();
}

function refreshWellnessTip() {
    const randomTip = wellnessTips[Math.floor(Math.random() * wellnessTips.length)];
    const tipEl = document.getElementById("wellness-tip");
    if (tipEl) {
        tipEl.style.opacity = 0;
        setTimeout(() => {
            tipEl.textContent = randomTip;
            tipEl.style.opacity = 1;
        }, 300);
    }
}

// ===============================
// MOOD CHECK-IN SCREEN
// ===============================

const checkinMoodResponses = {
    "😢": {
        message: "It's okay to feel down. Let's take this journey together. We're here to support you.",
        time: 1500
    },
    "😕": {
        message: "Life has ups and downs. The important thing is you're here, taking care of yourself.",
        time: 1500
    },
    "😊": {
        message: "Wonderful! Let's nurture this positive energy and keep building on it.",
        time: 1500
    },
    "😄": {
        message: "Fantastic! You're doing great. Let's channel this joy into growth.",
        time: 1500
    },
    "🤩": {
        message: "Absolutely amazing! You're shining! Let's celebrate and build on this momentum.",
        time: 1500
    }
};

function initializeMoodCheckin() {
    const moodBtns = document.querySelectorAll(".mood-checkin-btn");
    const messageEl = document.getElementById("checkin-message");

    moodBtns.forEach(btn => {
        btn.classList.remove("selected");
    });
    messageEl.textContent = "";
}

function handleMoodCheckin(mood, feedbackKey) {
    // If not logged in (initial screen), just save and go to auth
    if (!currentUser) {
        currentMood = mood;
        const messageEl = document.getElementById("checkin-message");
        if (messageEl) {
            const response = checkinMoodResponses[mood] || { message: "Welcome!" };
            messageEl.textContent = response.message;
            messageEl.style.color = "#e8a0f0";
        }
        setTimeout(() => {
            if (typeof targetAuthType !== 'undefined' && targetAuthType) navigateTo(targetAuthType);
            else navigateTo('signin'); // Default fallback
        }, 1000);
        return;
    }

    // Home Screen Logic
    currentMood = mood;
    localStorage.setItem('bloom_user_mood', mood); // Standardized key
    localStorage.setItem("last_mood_date", new Date().toDateString());

    // Update Streak
    updateHabitStreak();

    // UI Feedback
    const messages = {
        'not well': "It's okay not to be okay. Let's find some calm.",
        'okay': "Taking it one step at a time is perfect.",
        'good': "Glad to hear that! Keep shining.",
        'great': "That's wonderful! Channel that energy.",
        'amazing': "Fantastic! You're glowing today!"
    };

    const feedbackEl = document.getElementById("mood-feedback");
    if (feedbackEl) {
        feedbackEl.textContent = messages[feedbackKey] || "Thanks for checking in!";
        feedbackEl.style.opacity = 1;
    }

    const activityContainer = document.getElementById("mood-activity-container");
    if (activityContainer) activityContainer.style.display = "block";

    // Active State for Leaves
    document.querySelectorAll(".mood-leaf").forEach(btn => {
        btn.classList.remove("active");
        if (btn.getAttribute("data-mood") === mood) btn.classList.add("active");
    });

    // --- Dynamic Atmosphere ---
    updateAtmosphere(mood);
}

function updateAtmosphere(mood) {
    document.body.className = ""; // Reset
    const removeEffects = () => document.querySelectorAll(".rain-drop, .sun-ray").forEach(e => e.remove());
    removeEffects();

    switch (mood) {
        case "😢":
            document.body.classList.add("mood-rain");
            createRain();
            break;
        case "😕":
            document.body.classList.add("mood-cloudy");
            break;
        case "😊":
            document.body.classList.add("mood-sunny");
            createSun();
            break;
        case "😄":
            document.body.classList.add("mood-nature");
            break;
        case "🤩":
            document.body.classList.add("mood-party");
            break;
        default:
            document.body.classList.add("mood-sunny");
    }
}

function createRain() {
    for (let i = 0; i < 20; i++) {
        const drop = document.createElement("div");
        drop.className = "rain-drop";
        drop.style.left = Math.random() * 100 + "vw";
        drop.style.animationDuration = (Math.random() * 0.5 + 0.5) + "s";
        drop.style.animationDelay = Math.random() + "s";
        document.body.appendChild(drop);
    }
}

function createSun() {
    const sun = document.createElement("div");
    sun.className = "sun-ray";
    document.body.appendChild(sun);
}

// --- Habit Tracker Logic ---

function loadDailyHabits() {
    const today = new Date().toDateString();
    const savedDate = localStorage.getItem("bloom_habit_date");
    let habits = { hydrate: false, move: false, reflect: false };

    if (savedDate === today) {
        habits = JSON.parse(localStorage.getItem("bloom_daily_habits") || JSON.stringify(habits));
    } else {
        // Reset for new day
        localStorage.setItem("bloom_habit_date", today);
        localStorage.setItem("bloom_daily_habits", JSON.stringify(habits));
    }

    // Update UI
    document.getElementById("habit-hydrate").checked = habits.hydrate;
    document.getElementById("habit-move").checked = habits.move;
    document.getElementById("habit-reflect").checked = habits.reflect;

    updateHabitProgress();
}

window.toggleHabit = (checkbox, type) => {
    const today = new Date().toDateString();
    const habits = JSON.parse(localStorage.getItem("bloom_daily_habits") || "{}");

    habits[type] = checkbox.checked;

    localStorage.setItem("bloom_daily_habits", JSON.stringify(habits));
    localStorage.setItem("bloom_habit_date", today);

    updateHabitProgress();

    // Celebration if all complete
    if (Object.values(habits).every(v => v === true)) {
        if (typeof confetti === "function") {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        }
    }
};

function updateHabitProgress() {
    const habits = JSON.parse(localStorage.getItem("bloom_daily_habits") || "{}");
    const total = 3;
    const completed = Object.values(habits).filter(v => v).length;
    const pct = (completed / total) * 100;

    const bar = document.getElementById("habit-progress-bar");
    if (bar) bar.style.width = pct + "%";
}

// Deprecated old streak function, keeping for data safety but logic replaced
function updateHabitStreak() {
    // Legacy support if needed, otherwise safe to ignore
}

function renderHabitGarden(streak) {
    const garden = document.getElementById("streak-garden");
    if (!garden) return;
    garden.innerHTML = "";

    // Limit display to last 7 for space
    const displayCount = Math.min(streak, 7);
    for (let i = 0; i < displayCount; i++) {
        const petal = document.createElement("span");
        petal.className = "streak-petal";
        petal.textContent = "🌸";
        petal.style.animationDelay = (i * 0.1) + "s";
        garden.appendChild(petal);
    }
    if (streak > 7) {
        const count = document.createElement("span");
        count.textContent = `+${streak - 7}`;
        count.style.alignSelf = "center";
        garden.appendChild(count);
    }
}

// ===============================
// INITIALIZATION
// ===============================

document.addEventListener("DOMContentLoaded", function () {
    // Check for saved session
    const savedSession = localStorage.getItem('bloom_session_user');
    if (savedSession) {
        currentUser = JSON.parse(savedSession);
        navigateTo("home");
    } else {
        // Start at welcome screen
        navigateTo("welcome");
    }

    // Initialize components once
    // setupMoodSelector(); // Deprecated: Mood leaves use inline onclick

    // Add keyboard navigation
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (document.getElementById("auth-screen").classList.contains("active")) {
                navigateTo("welcome");
            } else if (document.getElementById("mood-checkin-screen").classList.contains("active")) {
                navigateTo("welcome");
            }
        }
    });
    if ("Notification" in window && Notification.permission === "default") {
        setTimeout(() => Notification.requestPermission().catch(() => {}), 500);
    }
    try { scheduleAllReminders(); } catch (e) {}
});

// ===============================
// MINI GAMES
// ===============================

let gameInterval = null;
let gameScore = 0;
let gameTimeouts = [];

// Start Activity with Transition
function startMoodActivity(forcedMood = null) {
    const moodToUse = forcedMood || currentMood;
    const overlay = document.getElementById("transition-overlay");
    const message = document.getElementById("transition-message");

    // Show Overlay
    overlay.classList.add("active");
    message.textContent = "Let’s play a game to lift your mood... 🌟";

    setTimeout(() => {
        overlay.classList.remove("active");
        navigateTo("game");
        const gameContainer = document.getElementById("game-content");
        gameContainer.innerHTML = "";

        // Route to specific game
        switch (moodToUse) {
            case "relaxed": startBreathingGame(gameContainer); break;
            case "😢": startWorryGame(gameContainer); break; // Updated
            case "😕": startMemoryGame(gameContainer); break;
            case "😊": startBubbleGame(gameContainer); break;
            case "😄": startGardenGame(gameContainer); break;
            case "🤩": startConfettiGame(gameContainer); break;
            default: startBubbleGame(gameContainer); // Fallback
        }
    }, 2000);
}

// Stop Game & Cleanup
function stopGame() {
    if (gameInterval) clearInterval(gameInterval);
    gameTimeouts.forEach(t => clearTimeout(t));
    gameTimeouts = [];

    // Hide Game Screen
    document.getElementById("game-screen").classList.remove("active");

    // Show gentle closing prompt then return Home
    const overlay = document.getElementById("transition-overlay");
    const message = document.getElementById("transition-message");
    if (overlay && message) {
        message.textContent = ENDING_PROMPT;
        overlay.classList.add("active");
        setTimeout(() => {
            overlay.classList.remove("active");
            navigateTo("home");
        }, 1800);
    } else {
        navigateTo("home");
    }
}

// 0. 🧘 Breathing Game (Advanced 4-4-6)
function startBreathingGame(container) {
    let duration = 60; // Default 1 min
    let isRunning = false;
    let breathInterval;

    // Initial Setup UI
    container.innerHTML = `
        <div class="breathing-setup" id="breath-setup">
            <h3>Custom Breathing Session</h3>
            <p>Relax with a 4-7-8 rhythm.</p>
            <div class="duration-selector">
                <label>Duration:</label>
                <select id="breath-duration">
                    <option value="60" selected>1 Minute</option>
                    <option value="120">2 Minutes</option>
                    <option value="180">3 Minutes</option>
                    <option value="300">5 Minutes</option>
                </select>
            </div>
            <button class="btn btn-primary" onclick="startBreathingSession()">Start Session 🌿</button>
        </div>

        <div class="breathing-container" id="breath-active" style="display: none; position: relative;">
            <div class="breathing-circle-outer"></div>
            <div class="breathing-circle" id="breath-circle">
                <span id="breath-timer" style="font-size: 2rem; color: white; font-weight: bold;">Ready</span>
            </div>
            <p class="game-instruction" id="breath-text" style="font-size: 1.5rem; margin-top: 20px;">Get ready...</p>
            <button class="btn btn-secondary" style="margin-top: 20px;" onclick="stopGame()">End Session</button>
        </div>
    `;

    window.startBreathingSession = () => {
        const select = document.getElementById("breath-duration");
        duration = parseInt(select.value);

        document.getElementById("breath-setup").style.display = "none";
        document.getElementById("breath-active").style.display = "flex";

        isRunning = true;
        runBreathingCycle();
    };

    const circle = document.getElementById("breath-circle");
    const text = document.getElementById("breath-text");
    const timerDisplay = document.getElementById("breath-timer");

    // Helper for inner countdown
    const runPhaseTimer = (seconds) => {
        let left = seconds;
        timerDisplay.textContent = left;
        const phaseInterval = setInterval(() => {
            if (!isRunning) { clearInterval(phaseInterval); return; }
            left--;
            if (left > 0) timerDisplay.textContent = left;
            else clearInterval(phaseInterval);
        }, 1000);
        gameTimeouts.push(setTimeout(() => clearInterval(phaseInterval), (seconds + 1) * 1000));
    };

    const runBreathingCycle = () => {
        if (!isRunning || duration <= 0) {
            endBreathingSession();
            return;
        }

        // Cycle Total: 14s (4 + 4 + 6)

        // 1. Inhale (4s)
        text.textContent = "Breathe In 🌸";
        circle.style.transition = "transform 4s ease-in-out";
        circle.style.transform = "scale(1.6)";
        circle.classList.add("inhaling");
        runPhaseTimer(4);

        gameTimeouts.push(setTimeout(() => {
            if (!isRunning) return;

            // 2. Hold (4s)
            text.textContent = "Hold 🌿";
            runPhaseTimer(4);

            gameTimeouts.push(setTimeout(() => {
                if (!isRunning) return;

                // 3. Exhale (6s)
                text.textContent = "Breathe Out 🌬️";
                circle.style.transition = "transform 6s ease-in-out";
                circle.style.transform = "scale(1)";
                circle.classList.remove("inhaling");
                runPhaseTimer(6);

                // Next Cycle
                duration -= 14;
                gameTimeouts.push(setTimeout(runBreathingCycle, 6000));
            }, 4000));
        }, 4000));
    };

    const endBreathingSession = () => {
        isRunning = false;
        container.innerHTML = `
            <div class="completion-screen">
                <h2>Session Complete! 🌸</h2>
                <div class="confetti-rain"></div>
                <p>You've taken a moment for yourself.</p>
                <pre style="white-space:pre-wrap;color:#7a6a95;margin-top:8px;">${ENDING_PROMPT}</pre>
                <button class="btn btn-primary" onclick="stopGame()">Return Home</button>
            </div>
        `;
        // Mark "Reflect" or "Breathe" habit if exists
        const habits = JSON.parse(localStorage.getItem("bloom_daily_habits") || "{}");
        if (habits.reflect === false) {
            habits.reflect = true;
            localStorage.setItem("bloom_daily_habits", JSON.stringify(habits));
        }

        if (typeof confetti === "function") {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
        }
    };
}

// 1. 😢 Worry Balloons (Let It Go)
function startWorryGame(container) {
    container.innerHTML = `
        <div class="worry-input-area">
            <input type="text" id="worry-input" placeholder="Type a worry here..." autocomplete="off">
            <button class="btn-small" onclick="createWorryBalloon()">Release</button>
        </div>
        <div id="worry-sky"></div>
        <p class="game-instruction">Type what's troubling you, then pop it to let go.</p>
    `;

    window.createWorryBalloon = () => {
        const input = document.getElementById("worry-input");
        const text = input.value.trim();
        if (!text) return;

        input.value = "";
        const sky = document.getElementById("worry-sky");

        const balloon = document.createElement("div");
        balloon.className = "worry-balloon";
        balloon.textContent = text;
        balloon.style.left = Math.random() * 80 + 10 + "%";
        balloon.style.bottom = "-100px";

        // Pop on click
        balloon.onclick = () => {
            balloon.style.transform = "scale(1.5) opacity(0)";
            balloon.textContent = "💨";
            setTimeout(() => balloon.remove(), 300);
        };

        sky.appendChild(balloon);

        // Float up animation
        setTimeout(() => {
            balloon.style.bottom = "120%";
            balloon.style.transition = "bottom 10s linear";
        }, 100);

        // Auto remove
        setTimeout(() => {
            if (balloon.parentNode) balloon.remove();
        }, 10000);
    };
}

// 4. 😄 Garden Builder (Improved Drag & Drop)
function startGardenGame(container) {
    container.innerHTML = `
             <div class="garden-toolbar">
                <div class="garden-item" draggable="true" data-type="🌻">🌻</div>
                <div class="garden-item" draggable="true" data-type="🌷">🌷</div>
                <div class="garden-item" draggable="true" data-type="🌲">🌲</div>
                <div class="garden-item" draggable="true" data-type="🪨">🪨</div>
                <div class="garden-item" draggable="true" data-type="🍄">🍄</div>
            </div>
            <div class="garden-canvas" id="garden-canvas"></div>
            <p class="game-instruction">Drag items to the garden!</p>
        `;

    const canvas = document.getElementById("garden-canvas");
    let draggedItem = null;

    // Drag Events for Source Items
    container.querySelectorAll(".garden-item").forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item.getAttribute("data-type");
            e.dataTransfer.setData('text/plain', draggedItem);
            item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            draggedItem = null;
        });
    });

    // Drop Events for Canvas
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');

        // Calculate Position
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const plant = document.createElement("div");
        plant.className = "planted-item";
        plant.textContent = type;
        plant.style.left = (x - 20) + "px";
        plant.style.top = (y - 20) + "px";
        plant.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

        // Click to remove
        plant.onclick = (ev) => {
            ev.stopPropagation();
            plant.remove();
        };

        canvas.appendChild(plant);
    });
}

function openJournal() {
    const todayStr = new Date().toLocaleDateString();
    const journalHTML = `
        <div class="journal-wrapper">
            <div class="journal-header">
                <h2>Daily Reflection / Productivity Journal</h2>
                <div class="journal-streak">
                    <span id="journal-streak-count">0</span> day streak
                    <div class="journal-garden" id="journal-garden"></div>
                </div>
            </div>
            <div class="journal-prompts" id="journal-prompts"></div>
            <div class="journal-controls">
                <label class="toggle"><input type="checkbox" id="toggle-bullets"> Bullet mode</label>
                <label class="toggle"><input type="checkbox" id="toggle-checklist"> Checklist mode</label>
                <input type="text" id="journal-tags" placeholder="Tags: work, stress, ideas">
                <input type="text" id="journal-search" placeholder="Search past entries">
            </div>
            <div class="journal-paper">
                <div class="journal-date">${todayStr}</div>
                <textarea id="journal-text" class="auto-resize" placeholder="${JOURNAL_PLACEHOLDER}"></textarea>
            </div>
            <div class="journal-actions">
                <button class="btn btn-primary" id="journal-save">Save</button>
                <button class="btn btn-secondary" id="journal-clear">Clear</button>
                <button class="btn btn-secondary" id="journal-delete">Delete</button>
                <button class="btn" id="journal-export-text">Export .txt</button>
                <button class="btn" id="journal-export-pdf">Export PDF</button>
            </div>
            <div class="reminder-controls">
                <div class="preset-row">
                    <button class="chip preset-chip" data-mins="5">5m</button>
                    <button class="chip preset-chip" data-mins="15">15m</button>
                    <button class="chip preset-chip" data-mins="60">1h</button>
                    <button class="chip preset-chip" data-mins="180">3h</button>
                </div>
                <div class="time-row">
                    <input type="time" id="journal-reminder-time">
                    <label class="toggle"><input type="checkbox" id="journal-reminder-repeat"> Repeat daily</label>
                    <input type="text" id="journal-reminder-label" placeholder="Label (optional)">
                    <button class="btn" id="journal-reminder-add">Add</button>
                </div>
                <div class="reminder-list" id="journal-reminder-list"></div>
            </div>
            <div class="weekly-summary" id="weekly-summary"></div>
            <div class="journal-history" id="journal-history">
                <div id="entries-list"></div>
            </div>
            <div style="margin-top:12px">
                <button class="btn btn-secondary" onclick="stopGame()">Close</button>
            </div>
        </div>
    `;
    navigateTo("game");
    const container = document.getElementById("game-content");
    container.innerHTML = journalHTML;
    initJournalUI();
}

function journalKey() {
    if (currentUser && currentUser.email) return `bloom_journal_entries_${currentUser.email}`;
    return 'bloom_journal_entries';
}
function journalStreakKey() {
    if (currentUser && currentUser.email) return `bloom_journal_streak_${currentUser.email}`;
    return 'bloom_journal_streak';
}
function initJournalUI() {
    const prompts = [
        "List 3 things that are stressing you right now and one action you can take to reduce each 🌱",
        "Write down your top 3 priorities for today ✨",
        "Jot down any intrusive thoughts and let them go 🌸",
        "Write one thing you accomplished today, no matter how small ✅",
        "Reflect on one thing that made you feel calm or relaxed today 🕊️"
    ];
    const promptsEl = document.getElementById("journal-prompts");
    promptsEl.innerHTML = prompts.map(t => `<button class="prompt-chip">${t}</button>`).join("");
    promptsEl.querySelectorAll(".prompt-chip").forEach(btn => {
        btn.onclick = () => {
            const ta = document.getElementById("journal-text");
            if (!ta.value) ta.value = btn.textContent + "\n\n";
            else ta.value += "\n\n" + btn.textContent + "\n\n";
            autoResize(ta);
        };
    });
    const ta = document.getElementById("journal-text");
    ta.addEventListener("input", () => autoResize(ta));
    ta.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            const bullets = document.getElementById("toggle-bullets").checked;
            const checklist = document.getElementById("toggle-checklist").checked;
            setTimeout(() => {
                const lines = ta.value.split("\n");
                const i = getCaretLineIndex(ta);
                if (i >= 0 && i < lines.length) {
                    if (checklist) lines[i] = lines[i].replace(/^\s*$/, "- [ ] ");
                    else if (bullets) lines[i] = lines[i].replace(/^\s*$/, "- ");
                    ta.value = lines.join("\n");
                    autoResize(ta);
                }
            }, 0);
        }
    });
    document.getElementById("journal-save").onclick = saveJournalEntry;
    document.getElementById("journal-clear").onclick = clearJournalEntry;
    document.getElementById("journal-delete").onclick = deleteJournalEntry;
    document.getElementById("journal-export-text").onclick = exportJournalText;
    document.getElementById("journal-export-pdf").onclick = exportJournalPDF;
    document.querySelectorAll(".preset-chip").forEach(chip => {
        chip.onclick = () => quickAddReminder(parseInt(chip.getAttribute("data-mins"), 10));
    });
    document.getElementById("journal-reminder-add").onclick = addReminderFromUI;
    document.getElementById("journal-search").addEventListener("input", () => renderJournalHistory());
    loadTodayEntry();
    renderJournalStreak();
    renderWeeklySummary();
    renderJournalHistory();
    renderReminderList();
}
function autoResize(ta) {
    ta.style.height = "auto";
    ta.style.height = Math.min(600, ta.scrollHeight) + "px";
}
function getCaretLineIndex(ta) {
    const pos = ta.selectionStart;
    const text = ta.value.substring(0, pos);
    return text.split("\n").length - 1;
}
function parseTags(input) {
    return input.split(",").map(t => t.trim()).filter(t => t);
}
function saveJournalEntry() {
    const text = document.getElementById("journal-text").value;
    const tags = parseTags(document.getElementById("journal-tags").value);
    if (!text.trim()) {
        alert("Write something first 🌸");
        return;
    }
    const entry = {
        id: Date.now(),
        date: new Date().toDateString(),
        text,
        tags,
        mood: currentMood,
        tasks: extractTasks(text),
        completedTasks: extractCompletedTasks(text)
    };
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const existingIdx = entries.findIndex(e => new Date(e.date).toDateString() === new Date().toDateString());
    if (existingIdx >= 0) entries.splice(existingIdx, 1);
    entries.unshift(entry);
    localStorage.setItem(key, JSON.stringify(entries));
    updateJournalStreak();
    document.getElementById("journal-text").value = "";
    document.getElementById("journal-tags").value = "";
    renderJournalStreak();
    renderWeeklySummary();
    renderJournalHistory();
    alert("Saved ✅");
}
function clearJournalEntry() {
    document.getElementById("journal-text").value = "";
    autoResize(document.getElementById("journal-text"));
}
function deleteJournalEntry() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const today = new Date().toDateString();
    const idx = entries.findIndex(e => new Date(e.date).toDateString() === today);
    if (idx >= 0) {
        entries.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(entries));
        renderJournalHistory();
        renderWeeklySummary();
        alert("Deleted");
    }
}
function loadTodayEntry() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const today = new Date().toDateString();
    const entry = entries.find(e => new Date(e.date).toDateString() === today);
    if (entry) {
        document.getElementById("journal-text").value = entry.text || "";
        document.getElementById("journal-tags").value = (entry.tags || []).join(", ");
        autoResize(document.getElementById("journal-text"));
    }
}
function extractTasks(text) {
    return text.split("\n").filter(l => /^\s*-\s(\[ \]|\[x\])?/i.test(l)).length;
}
function extractCompletedTasks(text) {
    return text.split("\n").filter(l => /^\s*-\s\[x\]/i.test(l)).length;
}
function renderJournalHistory() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const q = (document.getElementById("journal-search")?.value || "").toLowerCase();
    const list = document.getElementById("entries-list");
    const html = entries
        .filter(e => !q || e.text.toLowerCase().includes(q) || (e.tags || []).join(",").toLowerCase().includes(q))
        .map(e => {
            const tagPills = (e.tags || []).map(t => `<span class="tag-pill">${t}</span>`).join("");
            const preview = escapeHtml(e.text).slice(0, 220);
            const highlighted = q ? highlight(preview, q) : preview;
            return `
                <div class="journal-entry-card fade-in">
                    <div class="entry-meta">
                        <strong>${new Date(e.date).toLocaleDateString()} ${e.mood || ""}</strong>
                        <div class="entry-tags">${tagPills}</div>
                    </div>
                    <p class="entry-text">${highlighted}</p>
                    <div class="entry-stats">
                        <span>Tasks: ${e.tasks || 0}</span>
                        <span>Done: ${e.completedTasks || 0}</span>
                    </div>
                </div>
            `;
        }).join("");
    list.innerHTML = html || `<div class="empty-state">No entries yet</div>`;
}
function highlight(t, q) {
    const re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    return t.replace(re, m => `<mark>${m}</mark>`);
}
function escapeHtml(t) {
    return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function renderJournalStreak() {
    const state = JSON.parse(localStorage.getItem(journalStreakKey()) || "{}");
    const count = state.count || 0;
    const elMain = document.getElementById("journal-streak-count");
    const elSimple = document.getElementById("simple-streak-count");
    if (elMain) elMain.textContent = count;
    if (elSimple) elSimple.textContent = count;
    const gardenMain = document.getElementById("journal-garden");
    const gardenSimple = document.getElementById("simple-garden");
    [gardenMain, gardenSimple].forEach(garden => {
        if (!garden) return;
        garden.innerHTML = "";
        const n = Math.min(count, 12);
        for (let i = 0; i < n; i++) {
            const s = document.createElement("span");
            s.className = "garden-sprout";
            s.textContent = ["🌸", "🌼", "🌷", "⭐"][i % 4];
            s.style.animationDelay = (i * 0.08) + "s";
            garden.appendChild(s);
        }
    });
}
function updateJournalStreak() {
    const key = journalStreakKey();
    const state = JSON.parse(localStorage.getItem(key) || "{}");
    const today = new Date().toDateString();
    if (state.lastDate === today) {
        localStorage.setItem(key, JSON.stringify(state));
        return;
    }
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    const next = {
        lastDate: today,
        count: state.lastDate === yesterday ? (state.count || 0) + 1 : 1
    };
    localStorage.setItem(key, JSON.stringify(next));
}
function renderWeeklySummary() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const now = Date.now();
    const seven = 7 * 86400000;
    const recent = entries.filter(e => now - new Date(e.date).getTime() < seven);
    const total = recent.length;
    const tasks = recent.reduce((a, e) => a + (e.tasks || 0), 0);
    const done = recent.reduce((a, e) => a + (e.completedTasks || 0), 0);
    const el = document.getElementById("weekly-summary");
    if (el) el.innerHTML = `<div class="summary-card"><span>Last 7 days:</span><span>${total} entries</span><span>${tasks} tasks</span><span>${done} completed</span></div>`;
}
function exportJournalText() {
    const text = document.getElementById("journal-text").value;
    const tags = document.getElementById("journal-tags").value;
    const blob = new Blob([`Date: ${new Date().toLocaleString()}\nTags: ${tags}\n\n${text}`], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bloom-journal-${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
}
function exportJournalPDF() {
    const w = window.open("", "_blank");
    const text = escapeHtml(document.getElementById("journal-text").value).replace(/\n/g, "<br>");
    const tags = escapeHtml(document.getElementById("journal-tags").value);
    w.document.write(`
        <html><head><title>Journal Export</title>
        <style>
            body{font-family:Arial, sans-serif; padding:24px}
            h1{font-size:20px}
            .meta{color:#666;margin-bottom:12px}
        </style></head>
        <body>
            <h1>Daily Reflection / Productivity Journal</h1>
            <div class="meta">${new Date().toLocaleString()} | Tags: ${tags}</div>
            <div>${text}</div>
        </body></html>
    `);
    w.document.close();
    w.focus();
    w.print();
}
function scheduleJournalReminder() {
    quickAddReminder(5);
}

let reminderTimers = {};
function reminderStorageKey() {
    if (currentUser && currentUser.email) return `bloom_journal_reminders_${currentUser.email}`;
    return 'bloom_journal_reminders';
}
function loadReminders() {
    return JSON.parse(localStorage.getItem(reminderStorageKey()) || "[]");
}
function saveReminders(list) {
    localStorage.setItem(reminderStorageKey(), JSON.stringify(list));
}
function quickAddReminder(mins) {
    const ts = Date.now() + mins * 60000;
    const r = { id: Date.now() + Math.random(), ts, repeatDaily: false, label: "Journal time" };
    const list = loadReminders();
    list.push(r);
    saveReminders(list);
    scheduleReminder(r);
    renderReminderList();
    toast("Reminder set for " + new Date(ts).toLocaleTimeString());
}
function addReminderFromUI() {
    const timeStr = document.getElementById("journal-reminder-time").value;
    const repeat = document.getElementById("journal-reminder-repeat").checked;
    const label = document.getElementById("journal-reminder-label").value || "Journal time";
    if (!timeStr) {
        toast("Select a time", true);
        return;
    }
    const [hh, mm] = timeStr.split(":").map(n => parseInt(n, 10));
    const now = new Date();
    let target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm, 0, 0).getTime();
    if (target <= Date.now()) target += 86400000;
    const r = { id: Date.now() + Math.random(), ts: target, repeatDaily: repeat, label };
    const list = loadReminders();
    list.push(r);
    saveReminders(list);
    scheduleReminder(r);
    renderReminderList();
    toast("Reminder added");
}
function scheduleAllReminders() {
    Object.values(reminderTimers).forEach(id => clearTimeout(id));
    reminderTimers = {};
    const list = loadReminders();
    list.forEach(r => scheduleReminder(r));
}
function scheduleReminder(r) {
    if (r.repeatDaily && r.ts <= Date.now()) {
        while (r.ts <= Date.now()) r.ts += 86400000;
        const list = loadReminders().map(x => x.id === r.id ? r : x);
        saveReminders(list);
    }
    const delay = r.ts - Date.now();
    if (reminderTimers[r.id]) clearTimeout(reminderTimers[r.id]);
    reminderTimers[r.id] = setTimeout(() => onReminderFire(r), Math.max(0, delay));
}
function onReminderFire(r) {
    const today = new Date().toDateString();
    if (r.lastFiredDate === today) {
        if (r.repeatDaily) {
            r.ts += 86400000;
            const list = loadReminders().map(x => x.id === r.id ? r : x);
            saveReminders(list);
            scheduleReminder(r);
            renderReminderList();
        }
        return;
    }
    chime();
    const body = r.label || "Time to journal";
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Take 5 minutes to jot down your thoughts 🌸", { body });
    } else {
        toast("Take 5 minutes to jot down your thoughts 🌸");
    }
    if (navigator.vibrate) navigator.vibrate(200);
    if (r.repeatDaily) {
        r.lastFiredDate = today;
        r.ts += 86400000;
        const list = loadReminders().map(x => x.id === r.id ? r : x);
        saveReminders(list);
        scheduleReminder(r);
        renderReminderList();
    } else {
        cancelReminder(r.id, false);
        renderReminderList();
    }
}
function renderReminderList() {
    const container = document.getElementById("journal-reminder-list");
    if (!container) return;
    const list = loadReminders().sort((a, b) => a.ts - b.ts);
    container.innerHTML = list.map(r => `
        <div class="reminder-item" data-id="${r.id}">
            <div class="reminder-time">${new Date(r.ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            <div class="reminder-label">${r.label || ""}</div>
            <div class="reminder-flags">${r.repeatDaily ? "⟲" : ""}</div>
            <div class="reminder-actions">
                <button class="btn-small snooze5">Snooze 5m</button>
                <button class="btn-small cancel">Cancel</button>
            </div>
        </div>
    `).join("") || `<div class="empty-state">No reminders</div>`;
    container.querySelectorAll(".reminder-item").forEach(item => {
        const id = parseFloat(item.getAttribute("data-id"));
        item.querySelector(".snooze5").onclick = () => snoozeReminder(id, 5);
        item.querySelector(".cancel").onclick = () => cancelReminder(id, true);
    });
}
function snoozeReminder(id, mins) {
    const list = loadReminders();
    const idx = list.findIndex(r => r.id === id);
    if (idx < 0) return;
    list[idx].ts = Date.now() + mins * 60000;
    saveReminders(list);
    scheduleReminder(list[idx]);
    renderReminderList();
    toast("Snoozed " + mins + "m");
}
function cancelReminder(id, showToastMsg) {
    const list = loadReminders().filter(r => r.id !== id);
    saveReminders(list);
    if (reminderTimers[id]) {
        clearTimeout(reminderTimers[id]);
        delete reminderTimers[id];
    }
    if (showToastMsg) toast("Reminder canceled");
}
function toast(msg, warn) {
    let t = document.getElementById("bloom-toast");
    if (!t) {
        t = document.createElement("div");
        t.id = "bloom-toast";
        t.className = "toast";
        document.body.appendChild(t);
    }
    t.textContent = msg;
    t.classList.remove("warn");
    if (warn) t.classList.add("warn");
    t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 2500);
}
function chime() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(880, ctx.currentTime);
        g.gain.setValueAtTime(0.001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 1.2);
        o.connect(g); g.connect(ctx.destination);
        o.start(); o.stop(ctx.currentTime + 1.2);
    } catch (e) {}
}

// ===============================
// JOURNAL SIMPLE SCREEN
// ===============================
function initializeJournalSimple() {
    const todayStr = new Date().toLocaleDateString();
    const dateEl = document.getElementById("journal-date-today");
    if (dateEl) dateEl.textContent = todayStr;
    const prompts = [
        "List 3 things that are stressing you right now and one action you can take to reduce each 🌱",
        "Write down your top 3 priorities for today ✨",
        "Jot down any intrusive thoughts and let them go 🌸",
        "Write one thing you accomplished today, no matter how small ✅",
        "Reflect on one thing that made you feel calm or relaxed today 🕊️"
    ];
    const chips = prompts.map(t => `<button class="prompt-chip">${t}</button>`).join("");
    const container = document.getElementById("journal-prompts-simple");
    if (container) {
        container.innerHTML = chips;
        container.querySelectorAll(".prompt-chip").forEach(btn => {
            btn.onclick = () => {
                const ta = document.getElementById("journal-entry");
                if (!ta.value) ta.value = btn.textContent + "\n\n";
                else ta.value += "\n\n" + btn.textContent + "\n\n";
            };
        });
    }
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const today = new Date().toDateString();
    const todayEntry = entries.find(e => new Date(e.date).toDateString() === today);
    const ta = document.getElementById("journal-entry");
    ta.value = todayEntry ? (todayEntry.text || "") : "";
    if (typeof autoResize === "function") {
        ta.addEventListener("input", () => autoResize(ta));
        autoResize(ta);
    }
    const counter = document.getElementById("char-counter");
    const updateCounter = () => { if (counter) counter.textContent = ta.value.length; };
    ta.addEventListener("input", updateCounter);
    updateCounter();
    const btnBullets = document.getElementById("tb-bullets");
    const btnCheck = document.getElementById("tb-checklist");
    if (btnBullets) btnBullets.onclick = () => {
        btnBullets.classList.toggle("active");
        if (btnBullets.classList.contains("active")) btnCheck.classList.remove("active");
    };
    if (btnCheck) btnCheck.onclick = () => {
        btnCheck.classList.toggle("active");
        if (btnCheck.classList.contains("active")) btnBullets.classList.remove("active");
    };
    ta.addEventListener("keydown", e => {
        if (e.key === "Enter") {
            setTimeout(() => {
                const lines = ta.value.split("\n");
                const i = getCaretLineIndex(ta);
                if (i >= 0 && i < lines.length) {
                    if (btnCheck && btnCheck.classList.contains("active")) lines[i] = lines[i].replace(/^\s*$/, "- [ ] ");
                    else if (btnBullets && btnBullets.classList.contains("active")) lines[i] = lines[i].replace(/^\s*$/, "- ");
                    ta.value = lines.join("\n");
                    if (typeof autoResize === "function") autoResize(ta);
                    updateCounter();
                }
            }, 0);
        }
    });
    renderJournalStreak();
    renderJournalListSimple();
}
function saveEntry() {
    const text = document.getElementById("journal-entry").value;
    if (!text.trim()) { alert("Write something first 🌸"); return; }
    const entry = { id: Date.now(), date: new Date().toDateString(), text, mood: currentMood };
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const idx = entries.findIndex(e => new Date(e.date).toDateString() === new Date().toDateString());
    if (idx >= 0) entries.splice(idx, 1);
    entries.unshift(entry);
    localStorage.setItem(key, JSON.stringify(entries));
    alert("Saved ✅");
    renderJournalListSimple();
}
function clearEntry() {
    document.getElementById("journal-entry").value = "";
}
function deleteEntry() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const today = new Date().toDateString();
    const idx = entries.findIndex(e => new Date(e.date).toDateString() === today);
    if (idx >= 0) {
        entries.splice(idx, 1);
        localStorage.setItem(key, JSON.stringify(entries));
        document.getElementById("journal-entry").value = "";
        alert("Deleted");
        renderJournalListSimple();
    }
}
function renderJournalListSimple() {
    const key = journalKey();
    const entries = JSON.parse(localStorage.getItem(key) || "[]");
    const list = document.getElementById("journal-list");
    if (!list) return;
    list.innerHTML = entries.slice(0, 10).map(e => `
        <div class="journal-entry-card">
            <div class="entry-meta"><strong>${new Date(e.date).toLocaleDateString()} ${e.mood || ""}</strong></div>
            <p class="entry-text">${escapeHtml(e.text).slice(0, 240)}</p>
        </div>
    `).join("") || `<div class="empty-state">No entries yet</div>`;
}

// 2. 😕 Memory Game (Focus)
function startMemoryGame(container) {
    container.innerHTML = `
        <div class="score-board">Pairs: <span id="mem-score">0</span>/4</div>
        <div class="memory-grid" id="memory-grid"></div>
        <p class="game-instruction">Match the symbols.</p>
    `;

    const icons = ["🍃", "🌊", "☁️", "🌙"];
    const deck = [...icons, ...icons].sort(() => 0.5 - Math.random());
    const grid = document.getElementById("memory-grid");
    let flipped = [];
    let matched = 0;

    deck.forEach((icon, i) => {
        const card = document.createElement("div");
        card.className = "memory-card";
        card.style.setProperty('--i', i); // Stagger animation
        card.innerHTML = `<span>${icon}</span>`;

        card.onclick = () => {
            if (flipped.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
                card.classList.add("flipped");
                flipped.push(card);

                if (flipped.length === 2) {
                    const [c1, c2] = flipped;
                    if (c1.innerHTML === c2.innerHTML) {
                        c1.classList.add("matched");
                        c2.classList.add("matched");
                        matched++;
                        document.getElementById("mem-score").textContent = matched;
                        flipped = [];
                        if (matched === 4) setTimeout(() => alert("Deserve a pat on the back! 🌿"), 500);
                    } else {
                        setTimeout(() => {
                            c1.classList.remove("flipped");
                            c2.classList.remove("flipped");
                            flipped = [];
                        }, 1000);
                    }
                }
            }
        };
        grid.appendChild(card);
    });
}

// 3. 😊 Bubble Smash (Fun)
function startBubbleGame(container) {
    container.innerHTML = `
        <div class="score-board">Smashed: <span id="game-score">0</span></div>
        <div class="flower-game-area" id="flower-area"></div>
        <p class="game-instruction">Smash the bugs!</p>
    `;

    gameScore = 0;
    // Objects to smash inside bubbles
    const smashTargets = ["🐛", "🪰", "🕷️", "🦠", "🐌", "🦟"];
    const smashSounds = ["Smash!", "Bam!", "Pow!", "Splat!", "Whack!"];

    gameInterval = setInterval(() => {
        const area = document.getElementById("flower-area");
        if (!area) return clearInterval(gameInterval);

        const bubble = document.createElement("div");
        bubble.innerHTML = `<span style="font-size: 1.5rem;">${smashTargets[Math.floor(Math.random() * smashTargets.length)]}</span>`;
        bubble.className = "game-flower funny-bubble";
        bubble.style.left = Math.random() * 90 + "%";
        bubble.style.animationDuration = (Math.random() * 2 + 3) + "s"; // Faster for smashing!

        bubble.onclick = function () {
            // Show smash text
            const popText = document.createElement("div");
            popText.className = "pop-text smash-text";
            popText.textContent = smashSounds[Math.floor(Math.random() * smashSounds.length)];
            popText.style.left = this.style.left;
            popText.style.top = this.style.top;
            popText.style.left = this.style.left;
            popText.style.bottom = this.getBoundingClientRect().bottom + "px";

            area.appendChild(popText);

            // Smash effect
            this.innerHTML = "💥";
            this.style.transform = "scale(0.1) rotate(180deg)"; // Crush it!
            this.style.opacity = "0.7";
            this.style.transition = "all 0.2s ease-in";

            gameScore++;
            document.getElementById("game-score").textContent = gameScore;

            setTimeout(() => this.remove(), 200);
            setTimeout(() => popText.remove(), 800);
        };

        area.appendChild(bubble);

        // Cleanup old bubbles
        setTimeout(() => {
            if (bubble && bubble.parentNode) bubble.remove();
        }, 4000);

    }, 600);
}

// 4. 😄 Garden Builder (Creativity)
function startGardenGame(container) {
    container.innerHTML = `
         <div class="garden-toolbar">
            <div class="garden-item" draggable="true" data-type="🌻">🌻</div>
            <div class="garden-item" draggable="true" data-type="🌷">🌷</div>
            <div class="garden-item" draggable="true" data-type="🌲">🌲</div>
            <div class="garden-item" draggable="true" data-type="🪨">🪨</div>
            <div class="garden-item" draggable="true" data-type="🍄">🍄</div>
        </div>
        <div class="garden-canvas" id="garden-canvas"></div>
        <p class="game-instruction">Click items then click canvas to plant!</p>
    `;

    const canvas = document.getElementById("garden-canvas");
    let draggedItem = null;

    // Drag Events for Source Items
    container.querySelectorAll(".garden-item").forEach(item => {
        item.addEventListener('dragstart', (e) => {
            draggedItem = item.getAttribute("data-type");
            e.dataTransfer.setData('text/plain', draggedItem);
            item.style.opacity = '0.5';
        });

        item.addEventListener('dragend', () => {
            item.style.opacity = '1';
            draggedItem = null;
        });
    });

    // Drop Events for Canvas
    canvas.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
    });

    canvas.addEventListener('drop', (e) => {
        e.preventDefault();
        const type = e.dataTransfer.getData('text/plain');

        // Calculate Position
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const plant = document.createElement("div");
        plant.className = "planted-item";
        plant.textContent = type;
        plant.style.left = (x - 20) + "px";
        plant.style.top = (y - 20) + "px";
        plant.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;

        // Click to remove
        plant.onclick = (ev) => {
            ev.stopPropagation();
            plant.remove();
        };

        canvas.appendChild(plant);
    });
}

// 5. 🎨 Random Drawing (Creativity)
function startDrawingGame(container) {
    if (!container) {
        navigateTo("game");
        container = document.getElementById("game-content");
    }

    // Prompts
    const prompts = [
        "Draw your dream house 🏠",
        "Draw a happy cloud ☁️",
        "Draw your favorite food 🍕",
        "Draw a secret garden 🌸",
        "Draw a funny monster 👾",
        "Draw the ocean 🌊",
        "Draw something yellow ☀️",
        "Draw a flying car 🚗",
        "Draw a magical tree 🌳"
    ];

    container.innerHTML = `
        <div class="drawing-game-container">
            <div class="game-header">
                <span class="prompt-text" id="draw-prompt">Prompt: ${prompts[0]}</span>
                <button class="btn-small" onclick="document.getElementById('draw-prompt').textContent = 'Prompt: ' + '${prompts.join("','").split("','")[Math.floor(Math.random() * prompts.length)]}'">🎲 New Prompt</button>
            </div>
            
            <canvas id="free-draw-canvas" width="350" height="400"></canvas>
            
            <div class="drawing-tools">
                <div class="color-picker-row">
                    <div class="color-dot active" style="background:#000" onclick="setPenColor(this, '#000')"></div>
                    <div class="color-dot" style="background:#ff60d8" onclick="setPenColor(this, '#ff60d8')"></div>
                    <div class="color-dot" style="background:#00d4ff" onclick="setPenColor(this, '#00d4ff')"></div>
                    <div class="color-dot" style="background:#00ff88" onclick="setPenColor(this, '#00ff88')"></div>
                    <div class="color-dot" style="background:#ffcc00" onclick="setPenColor(this, '#ffcc00')"></div>
                </div>
                <div class="tool-row">
                    <button class="btn-tool" onclick="clearCanvas()">🗑️ Clear</button>
                    <button class="btn-tool" onclick="stopGame()">❌ Close</button>
                </div>
            </div>
        </div>
    `;

    // Canvas Logic
    const canvas = document.getElementById("free-draw-canvas");
    const ctx = canvas.getContext("2d");

    // Responsive sizing
    const rect = container.getBoundingClientRect();
    canvas.width = Math.min(rect.width - 40, 400);

    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#000";

    let painting = false;

    function startPosition(e) {
        painting = true;
        draw(e);
    }

    function finishedPosition() {
        painting = false;
        ctx.beginPath();
    }

    function draw(e) {
        if (!painting) return;
        e.preventDefault();

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    // Event Listeners
    canvas.addEventListener("mousedown", startPosition);
    canvas.addEventListener("mouseup", finishedPosition);
    canvas.addEventListener("mousemove", draw);

    // Touch support
    canvas.addEventListener("touchstart", startPosition);
    canvas.addEventListener("touchend", finishedPosition);
    canvas.addEventListener("touchmove", draw);

    // Helpers exposed globally for buttons
    window.setPenColor = (el, color) => {
        ctx.strokeStyle = color;
        document.querySelectorAll(".color-dot").forEach(d => d.classList.remove("active"));
        el.classList.add("active");
    };

    window.clearCanvas = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // Wire up the random prompt button correctly in JS scope if needed, 
    // but the inline onclick above handles it via string injection for simplicity.
    // Better make it robust:
    const promptBtn = container.querySelector(".btn-small");
    promptBtn.onclick = () => {
        const p = prompts[Math.floor(Math.random() * prompts.length)];
        document.getElementById("draw-prompt").textContent = "Prompt: " + p;
    };
}

// 5. 🤩 Confetti Pop (Reward)
function startConfettiGame(container) {
    container.innerHTML = `
        <div class="score-board" style="color:#ff60d8"> Score: <span id="c-score">0</span></div>
        <div id="confetti-area" style="width:100%;height:300px;position:relative;overflow:hidden"></div>
        <p class="game-instruction">Pop the balloons!</p>
    `;

    let score = 0;
    const area = document.getElementById("confetti-area");
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff"];

    gameInterval = setInterval(() => {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.textContent = "🎈";
        balloon.style.left = Math.random() * 90 + "%";
        balloon.style.bottom = "-50px";
        balloon.style.transition = `bottom ${Math.random() * 2 + 3}s linear`;

        balloon.onclick = function () {
            // Pop!
            this.style.transform = "scale(1.5)";
            this.textContent = "💥";
            score += 10;
            document.getElementById("c-score").textContent = score;

            // Confetti burst
            for (let i = 0; i < 10; i++) {
                const conf = document.createElement("div");
                conf.className = "confetti-particle";
                conf.style.background = colors[Math.floor(Math.random() * colors.length)];
                conf.style.left = this.style.left;
                conf.style.top = this.getBoundingClientRect().top - area.getBoundingClientRect().top + "px";

                // Random explosion velocity
                const vx = (Math.random() - 0.5) * 100;
                const vy = (Math.random() - 1) * 100;

                conf.animate([
                    { transform: `translate(0, 0)`, opacity: 1 },
                    { transform: `translate(${vx}px, ${vy}px)`, opacity: 0 }
                ], {
                    duration: 1000,
                    easing: 'ease-out'
                });

                area.appendChild(conf);
                setTimeout(() => conf.remove(), 1000);
            }

            setTimeout(() => this.remove(), 100);
        };

        area.appendChild(balloon);

        // Float up
        requestAnimationFrame(() => {
            balloon.style.bottom = "120%";
        });

        // Clean
        setTimeout(() => { if (balloon.parentNode) balloon.remove(); }, 5000);

    }, 800);
}

// ===============================
// UTILS
// ===============================

// Smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
