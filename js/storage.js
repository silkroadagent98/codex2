// Simple localStorage-backed helpers for team and progress
// Keys: "team" (array of selected car indices), "progress" (object)
(function () {
  const TEAM_KEY = 'team';
  const PROGRESS_KEY = 'progress';

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      // ignore quota errors in MVP
    }
  }

  function getTeam() {
    const team = readJSON(TEAM_KEY, []);
    if (Array.isArray(team)) return team.slice(0, 3);
    return [];
  }

  function setTeam(teamIndices) {
    const limited = Array.isArray(teamIndices) ? teamIndices.slice(0, 3) : [];
    writeJSON(TEAM_KEY, limited);
  }

  function loadProgress() {
    const progress = readJSON(PROGRESS_KEY, { cards: 0 });
    if (typeof progress.cards !== 'number') progress.cards = 0;
    return progress;
  }

  function saveProgress(progress) {
    const sanitized = progress && typeof progress === 'object' ? progress : { cards: 0 };
    if (typeof sanitized.cards !== 'number') sanitized.cards = 0;
    writeJSON(PROGRESS_KEY, sanitized);
  }

  window.StorageHelpers = { getTeam, setTeam, loadProgress, saveProgress };
})();

