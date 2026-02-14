

# bloom! �

## Basic Details
**Team Name:** [Nimsy]

**Team Members:** [nimsy,jamia]

**Hosted Project Link:** https://bloom-tan.vercel.app

**Project Description:** bloom! is a gentle mental wellness web app designed to be a daily companion. It helps users track moods, build healthy habits, and find calm through interactive activities like breathing exercises and journaling, all in a soothing, personalized environment.

**The Problem & Solution:**
*   **The Problem:** In today's fast-paced world, people often struggle with stress, anxiety, and a lack of accessible tools to manage their mental well-being daily. Complex apps with paywalls often add to the stress.
*   **The Solution:** bloom! provides an immediate, browser-based sanctuary. It offers a low-barrier entry to mental wellness through simple mood check-ins, instant calming games, and habit tracking, making self-care accessible and engaging.

## Technical Details
**Technologies Used:**
*   **Frontend:** HTML5, CSS3, Vanilla JavaScript
*   **Storage:** LocalStorage (for data persistence)
*   **Tools:** Cursor (AI-powered coding)

## Features
*   **Mood Check-in & Tracking:** Interactive mood selector with personalized feedback and visual atmosphere changes (e.g., rain for sadness, sun for happiness).
*   **Daily Wellness Tips:** Randomly generated self-care advice to encourage healthy daily practices.
*   **Interactive Mini-Games:** Includes a Breathing Game (4-7-8 rhythm), Worry Game, and Memory Game to help manage emotions.
*   **Habit Tracker:** A simple, visual way to track daily essentials like Hydration, Movement, and Reflection with progress visualization.
*   **Journaling:** A private space to write thoughts with options for bullet points or checklists, saved locally.

## Implementation

### Installation
Since this is a static web project, no complex installation is required.

```bash
# Clone the repository
git clone https://github.com/username/bloom.git

# Navigate to the project directory
cd bloom
```

### Run
```bash
# Simply open the index.html file in your browser
# You can use a live server extension or just double-click the file
start index.html  # On Windows
open index.html   # On Mac
```

## Project Documentation

### Screenshots
| | | |
|:-------------------------:|:-------------------------:|:-------------------------:|
| ![Landing Page](placeholder_landing.png) | ![Mood Check-in](placeholder_mood.png) | ![Dashboard](placeholder_dashboard.png) |
| **Welcome Screen** | **Mood Check-in** | **User Dashboard** |

### Diagrams
**System Architecture:**
(Since this is a frontend-only app, the architecture is linear)
User Browser (HTML/CSS/JS) <--> LocalStorage (Data Persistence)

**Workflow:**
1.  **Welcome:** User arrives → Sign In/Sign Up.
2.  **Auth:** User credentials saved/verified in LocalStorage.
3.  **Check-in:** User selects Mood → App Theme updates.
4.  **Dashboard:** User sees Greeting, Tips, Habits, and Quick Actions.
5.  **Activity:** User selects Tool (Journal/Game) → Completes activity → Returns to Home.

## Project Demo
**Video:** []

## AI Tools Used
**Tool:** Cursor

**Purpose:**
*   **Code Generation:** Assisted in writing the CSS animations for the "breathing" and "floating" effects.
*   **Logic Implementation:** Helped implement the LocalStorage logic for persistent user sessions and habit tracking.
*   **README Generation:** Analyzed the codebase to generate this structured documentation.

**Prompts:**
1.  "Create a soothing color palette and CSS animations for a mental wellness app's welcome screen."
2.  "Write a JavaScript function to handle user authentication using LocalStorage."
3.  "Generate a README.md following the TinkHerHack template based on the current file structure."

## Team Contributions
*   [Member 1]: [Contribution details]
*   [Member 2]: [Contribution details]

## License
This project is licensed under the MIT License.

---
Made with ❤️ at TinkerHub
