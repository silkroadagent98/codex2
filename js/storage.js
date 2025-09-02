// Storage helpers for Top Drives IR – MVP
// Keys used in localStorage
const STORAGE_KEYS = {
  team: "team",
  progress: "progress",
};

// Get team (array of car indexes) from storage; default empty array
function getTeam() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.team);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) return parsed.slice(0, 3);
  } catch (_) {}
  return [];
}

// Set team (array of car indexes), clamped to 3 items
function setTeam(indexes) {
  const team = Array.isArray(indexes) ? indexes.slice(0, 3) : [];
  localStorage.setItem(STORAGE_KEYS.team, JSON.stringify(team));
  return team;
}

// Save generic progress object
function saveProgress(progress) {
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(progress || {}));
}

// Load progress, default {}
function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    return raw ? JSON.parse(raw) : {};
  } catch (_) {
    return {};
  }
}

// Expose globally
window.getTeam = getTeam;
window.setTeam = setTeam;
window.saveProgress = saveProgress;
window.loadProgress = loadProgress;

