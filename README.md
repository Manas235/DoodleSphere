# 🎨 DoodleSphere — 3D Comic & Doodle Social Blogging Platform

> An interactive 3D Social Blogging platform pairing a hand-drawn comic book aesthetic with Three.js (via ESM) and 2D Tailwind CSS overlays.

![DoodleSphere Preview](https://img.shields.io/badge/Three.js-WebGL-black?style=for-the-badge&logo=three.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **3D Comic & Doodle Metaverse**:
  - Interactive 3D scene built with Three.js where each blog post is represented as a floating, hand-drawn comic notebook.
  - Procedurally generated canvas textures (halftone Ben-Day dots, ink hatching, lined paper, category badges, and doodle stamps).
  - Inverted-hull cel-shaded black outlines for an authentic comic book silhouette.
  - OrbitControls for smooth panning, rotating, and zooming.
- **Raycasting & Camera Easing**:
  - Raycaster detects hovered 3D posts with comic outline glow and floating speech-bubble tooltips.
  - Clicking any 3D post smoothly animates the camera to frame the notebook.
- **Reading Drawer Overlay**:
  - Slide-in 2D reader panel containing full post text, author info, read-time badge, tags, and like reactions.
- **Threaded Discussions & Comments**:
  - Nested recursive comment tree with real-time top-level comments and threaded replies.
- **Doodle a New Post (FAB)**:
  - Floating action button opens a 2D modal to author new posts.
  - Submitting dynamically instantiates a new 3D notebook in the Three.js scene in real time.
- **Authentication Service**:
  - Login and registration modals with active user session state.
- **Synthesized Comic Sound FX**:
  - Web Audio API synthesizer for retro comic pops, whooshes, and chimes.

---

## 🚀 Quick Start

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Manas235/DoodleSphere.git
   cd DoodleSphere
   ```

2. Start the local server:
   ```bash
   node server.js
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your web browser!

---

## 🛠 Tech Stack

- **3D Engine**: Three.js (ESM from CDN) with OrbitControls
- **2D UI & Styling**: Tailwind CSS, Google Fonts (`Bangers`, `Kalam`, `Outfit`)
- **Logic & Services**: Vanilla JavaScript (ES Modules)
- **Audio**: Web Audio API (real-time synthesized SFX)
