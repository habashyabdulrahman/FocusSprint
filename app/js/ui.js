// ===== UI Module =====

// ===== Elements =====
const appContainer = document.querySelector(".app");

const timerElement = document.getElementById("timer");
const encouragementElement = document.getElementById("encouragement");
const timeButtons = document.querySelectorAll(".time-btn");
const xpDisplay = document.getElementById("xp-display");

const modal = document.getElementById("session-modal");
const closeModalBtn = document.getElementById("close-modal");
const successSound = document.getElementById("success-sound");

const sessionControls = document.getElementById("session-controls");
const pauseBtn = document.getElementById("pause-btn");
const resetBtn = document.getElementById("reset-btn");

// Persistent Focus Elements
const focusToggleBtn = document.getElementById("focus-toggle-btn");
const exitFocusBtn = document.getElementById("exit-focus-btn");

// ===== State Management =====
const appState = {
  isDeepFocusActive: false,
};

let inactivityTimeout = null;

// ===== Encouragement messages =====
const encouragementMessages = [
  "You're doing great. Keep going.",
  "Small steps build big results.",
  "Momentum is building.",
  "Stay focused. You got this.",
  "One session at a time.",
];

// ===== Core UI Functions =====

function updateTimerUI(formattedTime) {
  if (!timerElement) return;
  timerElement.textContent = formattedTime;
}

function toggleTimeButtons(disabled) {
  timeButtons.forEach((btn) => {
    btn.disabled = disabled;
    btn.classList.toggle("disabled", disabled);
  });

  // Track duration selection state for Deep Focus
  if (appContainer) {
    appContainer.classList.toggle("duration-selected", disabled);
  }
}

function updateXPDisplay(value) {
  if (!xpDisplay) return;
  xpDisplay.textContent = `XP: ${value}`;
}

function setRunningState(isRunning) {
  if (!timerElement) return;
  timerElement.classList.toggle("timer-running", isRunning);

  // Controls visibility is now handled by mouse movement in Deep Focus
}

function setRandomEncouragement() {
  if (!encouragementElement) return;

  const randomIndex = Math.floor(Math.random() * encouragementMessages.length);
  encouragementElement.textContent = encouragementMessages[randomIndex];
}

function toggleSessionControls(show) {
  if (!sessionControls) return;
  sessionControls.classList.toggle("hidden", !show);
}

function updatePauseButton(isPaused) {
  if (!pauseBtn) return;
  pauseBtn.textContent = isPaused ? "Resume" : "Pause";
}

function showSessionComplete() {
  setRandomEncouragement();

  if (successSound) {
    try {
      successSound.currentTime = 0;
      successSound.play();
    } catch (e) {
      console.warn("Sound blocked:", e);
    }
  }

  if (modal) {
    modal.classList.remove("hidden");
  }

  // Refresh unlock progress
  updateUnlockUI();
}

// ===== Helper Functions =====

function showToast(message) {
  let toast = document.getElementById("toast-message");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast-message";
    toast.className = "toast-message";
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add("visible");

  setTimeout(() => {
    toast.classList.remove("visible");
  }, 3000);
}

function updateUnlockUI() {
  if (!window.storage) return;

  const config = window.UnlockConfig || { deepFocus: 3 };
  const required = config.deepFocus;
  const completed = storage.getCompletedSessions();

  const countEl = document.getElementById("unlock-count");
  const fillEl = document.getElementById("progress-fill");
  const progressContainer = document.getElementById("unlock-progress");

  // Update numbers
  if (countEl) countEl.textContent = `${Math.min(completed, required)} / ${required}`;

  // Update bar
  if (fillEl) {
    const percentage = Math.min((completed / required) * 100, 100);
    fillEl.style.width = `${percentage}%`;
  }

  // Lock/Unlock State
  const isUnlocked = completed >= required;

  if (focusToggleBtn) {
    if (isUnlocked) {
      focusToggleBtn.classList.remove("hidden", "locked");
      if (progressContainer) progressContainer.classList.add("hidden");

      // Persist unlock state
      if (!storage.isFocusUnlocked()) {
        storage.unlockFocusMode();
      }
    } else {
      // Locked state: Visible but dimmed
      focusToggleBtn.classList.remove("hidden");
      focusToggleBtn.classList.add("locked");
      if (progressContainer) progressContainer.classList.remove("hidden");
    }
  }
}

// ===== Persistent Deep Focus Mode =====

function handleMouseMove() {
  if (!appState.isDeepFocusActive) return;

  const controls = document.querySelectorAll(".focus-controls");
  controls.forEach(el => el.classList.add("controls-visible"));

  // Show exit button as well
  if (exitFocusBtn) exitFocusBtn.classList.add("controls-visible");

  if (inactivityTimeout) clearTimeout(inactivityTimeout);

  inactivityTimeout = setTimeout(() => {
    controls.forEach(el => el.classList.remove("controls-visible"));
    if (exitFocusBtn) exitFocusBtn.classList.remove("controls-visible");
  }, 2000);
}

function activateDeepFocus() {
  if (!appContainer) return;

  // Security check: verification against storage
  if (window.storage && !storage.isFocusUnlocked()) {
    const config = window.UnlockConfig || { deepFocus: 3 };
    showToast(`Complete ${config.deepFocus} sessions to unlock Deep Focus.`);
    return;
  }

  // 1. Add transitioning class
  appContainer.classList.add('deep-focus-transitioning');

  // 2. Wait for transition (150ms)
  setTimeout(() => {
    appState.isDeepFocusActive = true;
    appContainer.classList.remove('deep-focus-transitioning');
    appContainer.classList.add("deep-focus-mode");

    // Trigger animation state
    requestAnimationFrame(() => {
      appContainer.classList.add('deep-focus-animate');
    });

    // Enter true browser fullscreen
    if (appContainer.requestFullscreen) {
      appContainer.requestFullscreen().catch(err => {
        console.warn("Fullscreen request failed:", err);
      });
    }

    // Show exit button (initially visible, then fades with inactivity)
    if (exitFocusBtn) {
      exitFocusBtn.classList.remove("hidden");
      exitFocusBtn.classList.add("controls-visible"); // Start visible
    }

    // Hide main toggle if visible
    if (focusToggleBtn) focusToggleBtn.classList.add("hidden");

    // Start interaction listener
    document.addEventListener("mousemove", handleMouseMove);

    // Initialize inactivity timer
    handleMouseMove();
  }, 150);
}

function deactivateDeepFocus() {
  if (!appContainer) return;

  // Prevent multiple calls during exit
  if (appContainer.classList.contains('deep-focus-exiting')) return;

  // 1. Add exiting class first
  appContainer.classList.add('deep-focus-exiting');

  // 2. Wait for animation
  setTimeout(() => {
    // Update state
    appState.isDeepFocusActive = false;

    // Exit fullscreen first
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.warn("Exit fullscreen failed:", err);
      });
    }

    // Remove deep mode classes including exiting
    appContainer.classList.remove(
      "deep-focus-mode",
      "deep-focus-animate",
      "deep-focus-exiting"
    );

    // Hide exit button
    if (exitFocusBtn) {
      exitFocusBtn.classList.add("hidden");
      exitFocusBtn.classList.remove("controls-visible");
    }

    // Show main toggle again
    if (focusToggleBtn) focusToggleBtn.classList.remove("hidden");

    // Cleanup listener
    document.removeEventListener("mousemove", handleMouseMove);
    if (inactivityTimeout) clearTimeout(inactivityTimeout);

    // Reset controls visibility
    const controls = document.querySelectorAll(".focus-controls");
    controls.forEach(el => el.classList.remove("controls-visible"));

    plausible('deep_focus_activated');

  }, 200);
}

function toggleDeepFocus() {
  if (appState.isDeepFocusActive) {
    deactivateDeepFocus();
  } else {
    activateDeepFocus();
  }
}

function showFocusUnlocked() {
  // Legacy support or alias
  if (focusToggleBtn) {
    focusToggleBtn.classList.remove("hidden");
  }
}

// ===== Event Listeners =====

// Handle browser fullscreen exit (ESC key)
document.addEventListener("fullscreenchange", () => {
  if (!document.fullscreenElement && appState.isDeepFocusActive) {
    // User pressed ESC or exited fullscreen externally
    deactivateDeepFocus();
  }
});

// Global ESC support (Fallback if fullscreen API fails or not used)
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && appState.isDeepFocusActive) {
    deactivateDeepFocus();
  }
});

// Focus Toggles
if (focusToggleBtn) {
  focusToggleBtn.addEventListener("click", activateDeepFocus);
}

if (exitFocusBtn) {
  exitFocusBtn.addEventListener("click", deactivateDeepFocus);
}

// Modal & Controls
if (closeModalBtn) {
  closeModalBtn.addEventListener("click", function () {
    modal.classList.add("hidden");
  });
}

if (pauseBtn) {
  pauseBtn.addEventListener("click", function () {
    timer.togglePause();
  });
}

if (resetBtn) {
  resetBtn.addEventListener("click", function () {
    timer.resetTimer();
    // Reset behaves as stop/clear. We stay in Deep Focus if active.
  });
}


// ===== Export to Global =====

window.ui = {
  updateTimerUI,
  setRunningState,
  setRandomEncouragement,
  showSessionComplete,
  toggleSessionControls,
  updatePauseButton,
  toggleTimeButtons,
  updateXPDisplay,
  showFocusUnlocked,
  updateUnlockUI,
  activateDeepFocus,
  deactivateDeepFocus,
  toggleDeepFocus
};
