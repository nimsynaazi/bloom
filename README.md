# blooom! 🌸 - Mental Wellness Web App

> **"Breathe. Bloom. Be Well."**

**blooom!!** is a mental wellness web app designed to be like a gentle friend for daily life. It serves as a personalized daily companion in your browser, aimed at:
-   People feeling stressed, anxious, or depressed
-   Students during exam time
-   Professionals under work pressure
-   Anyone experiencing overthinking or social anxiety

It aims to provide positive motivation, fun calming activities, daily mood check-ins, and self-confidence boosts to help you feel supported.

## ✨ Features

### 🌸 **Mood-Based Activities (New!)**
-   **Breathing Exercise 🧘**: A calming, guided breathing circle (Inhale... Hold... Exhale) designed to lower anxiety and ground usage. Activates for "Not Great" or "Okay" moods, or via the Meditation card.
-   **Flower Pop Game 🌸**: A relaxing, playful activity where you pop floating flowers to celebrate positive moods ("Good", "Great", "Amazing").

### 📱 **Three Main Screens**

#### 1. **Welcome Screen**
-   App name "blooom!" with animated floating flowers
-   Tagline: "Breathe. Bloom. Be Well."
-   Two action buttons: Sign In & Create Account
-   Calming, inviting entry point

#### 2. **Sign In / Sign Up Page**
-   **Session Persistence**: Stays logged in across refreshes for a seamless experience.
-   **Case-Insensitive Login**: Smarter handling of email addresses.
-   Tabbed interface with clean card layout and backdrop blur.

#### 3. **Personalized Home Page**
-   **Dynamic Greeting**: "Hello, [User's Name]"
-   **Mood Selector**: 5 emoji buttons (😢 to 🤩) with feedback messages
-   **Quick Actions**:
    -   **Meditation**: Instantly launches the Breathing Game.
    -   Journal & Relax cards (placeholders for future features).
-   **Daily Wellness Tips**: Random tip displayed from unique suggestions
-   **Visual Navigation**: Gentle logout and navigation dots

## 🎯 **Key Features**

### Emotional Design
- Floating animations on logo and flowers
- Smooth transitions between screens
- Interactive mood selector with instant feedback
- Hover effects that feel natural and responsive

### Accessibility
- Proper semantic HTML
- Keyboard navigation (Escape to go back)
- Focus states on interactive elements
- Respects `prefers-reduced-motion` for users who prefer less animation
- Dark mode support

### Responsive Design
- Mobile-first approach
- Adapts beautifully to all screen sizes
- Touch-friendly button sizes
- Optimized layout for tablets and desktops

### Data Persistence
- Simple localStorage-based authentication
- User data saved locally (note: this is demo only - use real backend for production)

## 🚀 **How to Use**

### 1. **Open the App**
```bash
# Simply open index.html in your browser
# No build process or dependencies needed!
```

### 2. **Navigation Flow**
- Welcome Screen → Sign Up → Home Page
- Or: Welcome Screen → Sign In (if already registered)
- Logout button returns to Welcome Screen

### 3. **Test Credentials**
```
Demo login (after signing up):
- Create an account with any name and credentials
- Use the same email/password to sign back in
```

### 4. **Interactive Elements**
- Click mood emojis to see personalized feedback
- Hover over cards to see lift animation
- Tab between Sign In/Sign Up tabs
- Use navigation dots (bottom of home page) to explore

## 🎨 **Color Palette**

| Color | Hex | Usage |
|-------|-----|-------|
| Soft Pink | #FFD9D9 | Accent, gradients |
| Soft Purple | #D4A5D9 | Primary gradient, buttons |
| Soft Blue | #A8D5E8 | Secondary gradient |
| Soft Green | #C4E4D4 | Tertiary gradient |
| Cream White | #FFFAF5 | Background |
| Light Lavender | #F5F0FF | Card backgrounds |

## 📁 **File Structure**

```
bloom/
├── index.html      # HTML markup for all 3 screens
├── styles.css      # Complete styling with animations
├── script.js       # JavaScript for interactivity
└── README.md       # This file
```

## ⚙️ **Technical Stack**

- **HTML5**: Semantic markup
- **CSS3**: Gradients, animations, flexbox, grid
- **Vanilla JavaScript**: No frameworks needed
- **LocalStorage**: Simple data persistence

## 🎬 **Animations**

| Animation | Purpose |
|-----------|---------|
| `slideInUp` | Screen transitions |
| `float` | Logo and flower elements |
| `fadeIn` | Form transitions |
| `translateY` | Card hover effects |

## 🔧 **Customization**

### Change Colors
Edit the gradient values in `styles.css`:
```css
background: linear-gradient(135deg, #d4a5d9 0%, #a8d5e8 100%);
```

### Change Wellness Tips
Add/modify tips in `script.js`:
```javascript
const wellnessTips = [
    "Your custom tip here",
    "Another tip",
    // ... more tips
];
```

### Change Mood Responses
Update the `moodResponses` object in `script.js`:
```javascript
"😊": "Your custom response message",
```

## 📱 **Browser Support**

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## ♿ **Accessibility Features**

- WCAG 2.1 Level AA compliant
- Keyboard accessible navigation
- Proper heading hierarchy
- Color contrast meets standards
- Dark mode support
- Respects prefers-reduced-motion

## 🚀 **Future Enhancement Ideas**

- Backend authentication with database
- User profiles and progress tracking
- Meditation timer with audio
- Journaling with entries saved
- Progress analytics and streaks
- Push notifications for daily tips
- Social features (share achievements)
- Personalized recommendations

## 📝 **Notes**

- This is a frontend-only demo
- Authentication uses localStorage (not secure for production)
- For a real app, integrate with a proper backend/database
- Consider adding these libraries for enhancement:
  - React/Vue for component management
  - Express.js for backend
  - MongoDB for database
  - Firebase for quick deployment

## 💝 **Design Philosophy**

This app embraces:
- **Minimalism**: Only what's needed, nothing more
- **Calm**: Soft colors, gentle interactions, breathing room
- **Inclusivity**: Accessible to all users
- **Empathy**: Designed with mental wellness in mind
- **Simplicity**: Easy to navigate, intuitive flow

---

**blooom!** - Where design meets intention. 🌸✨
