Top Drives IR – MVP (Phaser 3, static)

Overview
This is a minimal Phaser 3 web app prototype for “Top Drives IR – MVP”. It runs entirely from static files: open index.html and play. Data is stored locally in your browser via localStorage.

File tree
.
├─ index.html
├─ js/
│  ├─ data.js
│  ├─ storage.js
│  └─ main.js
└─ assets/           (placeholder images; not required)

Run locally
- Option 1: Double-click index.html to open in your browser. If your browser blocks localStorage or module access from file://, use a tiny static server.
- Option 2: Serve via a simple static server:
  - Python 3: python3 -m http.server 8080
  - Node: npx http-server -p 8080
  Then open http://localhost:8080

Deploy
- GitHub Pages:
  1) Commit and push this folder to a repository.
  2) In repo Settings → Pages → Source: Deploy from branch, select main branch, root (/), save. Wait a minute; your site will be live.
- Netlify:
  1) Drag-and-drop the project folder on app.netlify.com → Sites.
  2) Or connect your repo and set the publish directory to the repo root.

Gameplay
- Main Menu: Start → Race Setup; Garage → pick up to 3 cars.
- Garage: Select/deselect cars (max 3). “ذخیره و بازگشت” saves the team to localStorage.
- Race Setup: Shows your 3 cars on an asphalt track. “شروع مسابقه” starts the race.
- Race: Cars move as colored bars. Winner is deterministic based on stats. After finish, click “بازگشت به منو”.

Tech notes
- Phaser 3 loaded from CDN. No build tools or frameworks.
- Screen size: WIDTH=1280, HEIGHT=720.
- All text in Persian (fa-IR), right-to-left friendly.
- Data persistence uses localStorage keys: "team", "progress".

