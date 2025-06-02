# 🎮 FPS Engine - Static Deployment Files

This folder contains the **production-ready files** for the FPS Engine that can be deployed to any web server.

## 📁 What's Included

```
staticdeployment/
├── index.html              ← Main entry point (users access this)
├── static/
│   ├── css/
│   │   └── main.492891a8.css    ← Compiled CSS
│   └── js/
│       └── main.af4016b8.js     ← Compiled JavaScript (entire FPS engine)
├── asset-manifest.json     ← Asset mapping
└── README.md               ← This file
```

## 🚀 How to Deploy

### Option 1: Web Server Upload
1. Upload ALL files and folders from this directory to your web server
2. Ensure the folder structure is maintained
3. Users access: `https://yourwebsite.com/index.html`

### Option 2: GitHub Pages
1. Push this folder to your GitHub repo
2. Enable GitHub Pages in repository settings
3. Set source to the folder containing these files
4. Access via your GitHub Pages URL

### Option 3: Any Static Hosting (Netlify, Vercel, etc.)
1. Upload this entire folder
2. Set `index.html` as the entry point
3. Deploy!

## 🎯 What Users Get

- **Complete 3D FPS Engine** running in browser
- **WASD/Arrow movement** with mouse look controls
- **Click to shoot** mechanics with raycasting
- **Demo level** with targets to shoot
- **Professional game UI** with health, ammo, score
- **Menu system** with game state management

## ⚡ Features

- ✅ 3D WebGL rendering with Three.js
- ✅ First-person shooter controls
- ✅ Physics and collision detection
- ✅ Target shooting with scoring
- ✅ Retro 1990s FPS aesthetic
- ✅ Fully responsive design
- ✅ No backend required for basic gameplay

## 📝 Notes

- These are **compiled, optimized files** ready for production
- No installation or build process needed on the server
- All game logic is self-contained in the JavaScript bundle
- Works on any modern web browser with WebGL support

## 🎮 Controls

- **WASD / Arrow Keys**: Move
- **Mouse**: Look around
- **Click**: Shoot
- **Space**: Jump
- **ESC**: Return to menu

---

**Built with React + Three.js | Ready for Web Deployment**