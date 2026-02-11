// ===== Timer Module =====

let countdownInterval = null;
let remainingTime = 0;
let isRunning = false;
let isPaused = false;
let sessionMinutes = 0;

// ===== Helper Functions =====

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function updateDisplay() {
  ui.updateTimerUI(formatTime(remainingTime));
}

function clearTimerInterval() {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
}

// ===== Core Timer Functions =====

function startTimer(minutes) {
  // Prevent starting a new timer if one is already running
  if (isRunning) return;

  // Initialize timer state
  remainingTime = Math.round(minutes * 60);
  isRunning = true;
  isPaused = false;
  sessionMinutes = minutes;

  // Update UI to running state
  ui.setRunningState(true);
  ui.toggleTimeButtons(true); // Disable time selection buttons
  ui.toggleSessionControls(true); // Show Pause/Reset buttons

  updateDisplay();

  // Start countdown
  countdownInterval = setInterval(runTimer, 1000);
}

function runTimer() {
  // Skip if paused
  if (isPaused) return;

  remainingTime--;
  updateDisplay();

  // Check if timer completed
  if (remainingTime <= 0) {
    completeSession();
  }
}

function togglePause() {
  // Only allow pausing if timer is running
  if (!isRunning) return;

  isPaused = !isPaused;
  ui.updatePauseButton(isPaused);
}

function resetTimer() {
  // Clear the interval
  clearTimerInterval();

  // Reset all state variables
  isRunning = false;
  isPaused = false;
  remainingTime = 0;

  // Reset UI to initial state
  ui.setRunningState(false);
  ui.toggleTimeButtons(false); // Re-enable time selection buttons
  ui.toggleSessionControls(false); // Hide Pause/Reset buttons
  ui.updatePauseButton(false); // Reset button text to "Pause"
  ui.updateTimerUI("00:00");
}

function completeSession() {
  // Clear the interval and ensure it's fully stopped
  clearTimerInterval();

  // Reset state variables
  isRunning = false;
  isPaused = false;
  remainingTime = 0;

  // Reset UI to initial state
  ui.setRunningState(false);
  ui.toggleSessionControls(false); // Hide Pause/Reset buttons
  ui.updatePauseButton(false); // Reset button text to "Pause"
  ui.toggleTimeButtons(false); // Re-enable time selection buttons
  ui.updateTimerUI("00:00");

  // Award XP for completed session
  const xpEarned = Math.max(1, Math.round(sessionMinutes));
  const newXP = storage.addXP(xpEarned);
  ui.updateXPDisplay(newXP);

  // Track completed sessions
  const sessions = storage.incrementCompletedSessions();

  if (sessions >= 3 && !storage.isFocusUnlocked()) {
    storage.unlockFocusMode();
    ui.showFocusUnlocked();
  }

  // Update streak
  if (window.streak && streak.handleStreakOnComplete) {
    streak.handleStreakOnComplete();
  }

  // Show completion modal
  ui.showSessionComplete();
}

// ===== Expose Public API =====

window.timer = {
  startTimer,
  togglePause,
  resetTimer,
};