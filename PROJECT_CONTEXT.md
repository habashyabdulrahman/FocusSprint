# FocusSprint: Project Scale & Architecture

This document serves as the **Project Mind** for developer onboarding and context switching.

## 🎯 Product Vision

**To create the fastest, cleanest, and most effective "launch loop" for users with ADHD.** FocusSprint is not a general-purpose timer; it is a specialized tool to overcome *task initiation paralysis*.

---

## 🏗 Current Architecture

### **Core Stack**

*   **HTML5 Structure**: Semantic `index.html` with designated zones (`.app-shell`) for state transformations.
*   **CSS Architecture**: Modular BEM-lite approach with scoped CSS Variables (`variables.css`).
    *   **App Containers**: `.app` (root wrapper), `.app-shell` (interactive zone).
    *   **Deep Focus**: Uses `.app.deep-focus-mode` class toggle for global UI transformation.
*   **JavaScript Design**: Encapsulated Global Objects (`window.timer`, `window.ui`, `window.storage`) for explicit method exposure.
*   **State Management**:
    *   **Transient**: `appState` (in `ui.js`) handles UI modes (`isDeepFocusActive`).
    *   **Persistent**: localStorage handles long-term data (`completed_sessions`, `focus_unlocked`).

---

## 📦 Module Breakdown

### `app.js` (Entry Point)
*   Coordinates initialization of XP, Streaks, and Event Listeners.
*   Handles initial check for `storage.isFocusUnlocked()`.
*   Acts as the central `DOMContentLoaded` controller.

### `timer.js` (Core Logic)
*   Manages `setInterval` loop (1000ms accuracy).
*   Handles `startTimer()`, `pause()`, `reset()`, and `completeSession()`.
*   Triggers UI updates via `ui.updateTimerUI()`.
*   **Integrity Rule**: Always resets Deep Focus (`ui.deactivateDeepFocus()`) on timer reset to prevent trapped user states.

### `ui.js` (DOM & State)
*   **State Owner**: `appState { isDeepFocusActive: boolean }`.
*   **Interaction**: Handles Button Toggles, Modal visibility, and CSS Class management.
*   **Deep Focus Logic**: Controls the visibility of standard UI elements (`.controls`, `.header`) vs. focus elements (`timer`, `exit-focus-btn`).
*   **Key Binding**: Global `Escape` listener for exiting focus mode.

### `storage.js` (Data Wrapper)
*   Abstracts `localStorage` into clean methods (`addXP`, `getStreak`, `unlockFocusMode`).
*   Ensures type safety (parsing integers/booleans) before returning.

### `streak.js` (Motivation Engine)
*   Checks `last_completed_date`.
*   Resets streak if missed day (24h+ window logic).
*   Increments streak on first session completion of the day.

---

## 🚧 Current Development Phase: MVP Stabilization

We have successfully implemented the persistent Deep Focus architecture. The system is stable but requires polish before scaling.

### **Architectural Rules & Constraints**

1.  **No Global Body Styles**: All major UI transformations must happen on `.app` or specific containers, never on `body` (to allow future embedding/iframe support).
2.  **Explicit State Transitions**: UI state changes (Deep Focus -> Normal) must be explicit in code (`deactivateDeepFocus()`), not implied by CSS alone.
3.  **Modular CSS**: Do not write monolithic CSS files. Keep layout separate from component styles.
4.  **Zero-dependency Logic**: Avoid external libraries for timer or storage unless critical for performance.

---

## ⚠️ Known Technical Risks

1.  **Tab Throttling**: `setInterval` in background tabs may drift.
    *   *Mitigation*: Use `Date.now()` delta calculation on resume or switch to Web Workers in Phase 2.
2.  **LocalStorage Limits**: While unlikely for simple text data, heavy usage eventual migration required for cloud sync.
3.  **Mobile Viewport Height**: Deep Focus full-screen mode needs robust `dvh` (dynamic viewport height) handling for mobile browsers.

---

## ⏭ Immediate Next Steps

1.  **Refine Mobile Experience**: Ensure Deep Focus controls are touch-friendly.
2.  **Sound Implementation**: Add completion sounds and ambient tracks (Phase 2).
3.  **Onboarding**: Add a simple "How to use" tooltip for first-time users.
