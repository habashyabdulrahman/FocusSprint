// ===== App Entry Point =====

document.addEventListener("DOMContentLoaded", () => {
  const timeButtons = document.querySelectorAll(".time-btn");

  // Initialize time button event listeners
  timeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const minutes = parseFloat(button.dataset.time);

      // Add button animation
      button.classList.add("btn-pop");
      setTimeout(() => {
        button.classList.remove("btn-pop");
      }, 300);

      // Start the timer
      timer.startTimer(minutes);
    });
  });

  // Initialize streak display
  if (window.streak && streak.initStreak) {
    streak.initStreak();
  }

  // Initialize specific features
  if (window.storage && window.ui) {
    // XP
    const currentXP = storage.getXP();
    ui.updateXPDisplay(currentXP);

    // Persistent Focus Mode Toggle
    window.UnlockConfig = {
      deepFocus: 3,
      customDurations: 50
    };

    // Initialize unlock UI (handles visibility, progress, and locked state)
    ui.updateUnlockUI();
  }
});