// ===== Streak Module =====

const streakCountElement = document.getElementById("streak-count");

// Get today's date in YYYY-MM-DD format
function getTodayDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

// Update streak display
function updateStreakUI(count) {
  streakCountElement.textContent = count;
}

// Initialize streak on page load
function initStreak() {
  const savedCount = storage.getData(storage.STORAGE_KEYS.STREAK_COUNT) || 0;
  updateStreakUI(savedCount);
}

// Handle session completion
function handleStreakOnComplete() {
  const today = getTodayDate();
  const lastDate = storage.getData(storage.STORAGE_KEYS.LAST_COMPLETED_DATE);
  let streakCount = storage.getData(storage.STORAGE_KEYS.STREAK_COUNT) || 0;

  if (!lastDate) {
    // First time ever
    streakCount = 1;
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayFormatted = yesterday.toISOString().split("T")[0];

    if (lastDate === today) {
      // Already counted today
      return;
    } else if (lastDate === yesterdayFormatted) {
      // Continue streak
      streakCount += 1;
    } else {
      // Streak broken
      streakCount = 1;
    }
  }

  storage.saveData(storage.STORAGE_KEYS.STREAK_COUNT, streakCount);
  storage.saveData(storage.STORAGE_KEYS.LAST_COMPLETED_DATE, today);

  updateStreakUI(streakCount);

  // Add highlight animation
  const streakCard = document.querySelector(".streak-card");
  streakCard.classList.add("streak-highlight");
  setTimeout(() => {
    streakCard.classList.remove("streak-highlight");
  }, 600);
}

// Expose globally
window.streak = {
  initStreak,
  handleStreakOnComplete,
};
