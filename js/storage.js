// ===== Storage Module =====

const STORAGE_KEYS = {
  XP: "focus_xp",
  STREAK_COUNT: "focus_streak_count",
  LAST_COMPLETED_DATE: "focus_last_completed_date",
  COMPLETED_SESSIONS: "completed_sessions",
  FOCUS_UNLOCKED: "focus_unlocked"
};

/* ===== Generic Storage ===== */

function getData(key) {
  return localStorage.getItem(key);
}

function setData(key, value) {
  localStorage.setItem(key, value);
}

// Backward compatibility
const saveData = setData;

/* ===== XP ===== */

function getXP() {
  const xp = getData(STORAGE_KEYS.XP);
  return xp ? parseInt(xp, 10) : 0;
}

function saveXP(value) {
  setData(STORAGE_KEYS.XP, value);
}

function addXP(amount) {
  const currentXP = getXP();
  const newXP = currentXP + amount;
  saveXP(newXP);
  return newXP;
}

/* ===== Hidden Unlock ===== */

function getCompletedSessions() {
  return parseInt(localStorage.getItem(STORAGE_KEYS.COMPLETED_SESSIONS)) || 0;
}

function incrementCompletedSessions() {
  const current = getCompletedSessions() + 1;
  localStorage.setItem(STORAGE_KEYS.COMPLETED_SESSIONS, current);
  return current;
}

function isFocusUnlocked() {
  return localStorage.getItem(STORAGE_KEYS.FOCUS_UNLOCKED) === "true";
}

function unlockFocusMode() {
  localStorage.setItem(STORAGE_KEYS.FOCUS_UNLOCKED, "true");
}


/* ===== Streak ===== */

function getStreak() {
  const streak = getData(STORAGE_KEYS.STREAK_COUNT);
  return streak ? parseInt(streak, 10) : 0;
}

function saveStreak(value) {
  setData(STORAGE_KEYS.STREAK_COUNT, value);
}

function getLastCompletedDate() {
  return getData(STORAGE_KEYS.LAST_COMPLETED_DATE);
}

function saveLastCompletedDate(date) {
  setData(STORAGE_KEYS.LAST_COMPLETED_DATE, date);
}

window.storage = {
  STORAGE_KEYS,
  getData,
  setData,
  saveData, // 👈 مهم
  getXP,
  saveXP,
  addXP,
  getStreak,
  saveStreak,
  getLastCompletedDate,
  saveLastCompletedDate,
  getCompletedSessions,
  incrementCompletedSessions,
  isFocusUnlocked,
  unlockFocusMode
};

