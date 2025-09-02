Top Drives IR – MVP (Phaser 3, Static)

A minimal HTML5 game prototype built with Phaser 3 that runs as pure static files. No build step or server required — just open `index.html`.

Features
- Persian (fa-IR) UI texts
- Simple garage to select up to 3 cars (persisted via localStorage)
- Deterministic race simulation (bars moving; highest stats sum wins)
- Pure static assets (no frameworks, only Phaser CDN)

Structure
index.html
js/
  data.js       # Cars data (8 items)
  storage.js    # localStorage helpers (team, progress)
  main.js       # Phaser config + scenes (MainMenu, Garage, RaceSetup, Race)
assets/
  .gitkeep      # placeholder directory (graphics drawn in code)
README.md

Run Locally
- Option 1: Double-click `index.html` to open in your browser.
- Option 2: Serve statically (recommended to avoid CORS with some browsers):
  - Python: `python3 -m http.server` then open `http://localhost:8000`
  - Node: `npx serve .` then open the printed URL

Deploy
- GitHub Pages:
  - Commit/push this folder to a repo.
  - Enable Pages from the repository settings, source: `main` branch, root.
  - Visit your `<username>.github.io/<repo>` URL.
- Netlify:
  - Drag-and-drop the project root folder into the Netlify dashboard, or link the Git repo.
  - Build command: none; Publish directory: `/` (root).

Notes
- Canvas size is 1280x720.
- All scenes are clean classes; UI overlays are HTML buttons for quick navigation.
- Placeholder visuals are colored rectangles created via Phaser Graphics.
- Local state keys: `team` (array of selected indices), `progress` (e.g., `{ cards: number }`).
# codex2
test
