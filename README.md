# FocusSprint

**FocusSprint** is a streamlined, vanilla European-style productivity timer designed specifically for neurodivergent users and those seeking high-performance flow states. By stripping away distractions and gamifying the focus process with immediate feedback loops (XP and Streaks), it helps users overcome executive dysfunction and maintain momentum.

> **Vision:** To become the simplest, most effective "flow trigger" for anyone who struggles to start.

---

## 🚀 Core Features

- **Micro-Commitments**: Pre-set timer intervals (5m, 8m, 12m) to lower friction.
- **Gamified Progress**:
  - **XP System**: Earn XP for every minute of focus.
  - **Streak Tracking**: daily streak persistence to build habits.
- **Deep Focus Mode**: A dedicated, distraction-free UI state that unlocks after 3 completed sessions.
  - *Calm gradient immersion*
  - *Vignette focus effect*
  - *Scaled timer for readability*
- **Privacy First**: All data is stored locally in the browser (`localStorage`). No accounts required.

---

## 🛠 Tech Stack

- **Core**: Semantic HTML5
- **Styling**: Vanilla CSS (Modular Architecture)
  - CSS Variables for theming
  - Flexbox/Grid layouts
- **Logic**: Vanilla JavaScript (ES6+)
  - Modular pattern (`app.js`, `timer.js`, `ui.js`, `storage.js`)
- **Persistence**: LocalStorage API

---

## 📂 Project Structure

```bash
FocusSprint/
├── index.html          # Main application entry point
├── css/
│   ├── reset.css       # CSS Reset
│   ├── variables.css   # Design tokens (colors, spacing, fonts)
│   ├── layout.css      # Structural styles & Grid systems
│   ├── components.css  # Buttons, Cards, Modals
│   └── animations.css  # Keyframes and Transitions
├── js/
│   ├── app.js          # App initialization and event coordination
│   ├── timer.js        # Core timer logic and interval management
│   ├── ui.js           # DOM manipulation and State Management
│   ├── storage.js      # LocalStorage wrapper
│   └── streak.js       # Streak calculation logic
└── assets/
    ├── icons/          # App icons
    └── sounds/         # Notification sounds
```

---

## 📦 Installation & Usage

FocusSprint is a static web application. You can run it locally without a build step.

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/focussprint.git
    cd focussprint
    ```

2.  **Run Locally**:
    *   Open `index.html` directly in your browser.
    *   OR serve with a local server (recommended due to ES modules/CORS policies if expanded):
        ```bash
        npx serve .
        ```

3.  **Resetting Data**:
    *   To reset your streak or lock status, open the browser console and run:
        ```javascript
        localStorage.clear();
        location.reload();
        ```

---

## 🔮 Future Roadmap

We are currently in the **Product Hardening** phase.

- **Phase 1 (Current)**: Stabilization of Deep Focus architecture and UI state consistency.
- **Phase 2**: User retention features (basic analytics, onboarding flow).
- **Phase 3**: SaaS transition with Premium features (Ambient sounds, Cloud Sync).

See [ROADMAP.md](./ROADMAP.md) for detailed plans.

---

## 📄 License

MIT License. Free to use and modify.
