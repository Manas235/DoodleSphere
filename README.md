# 🦅 DoodleSphere — 3D Animus Void & Historical Codex Blogverse

> An interactive 3D Social Blogging platform fusing an **Assassin's Creed "Animus" loading void** with heavy-inked comic doodle art and Renaissance historical codex journals. Built with Vanilla Three.js (ESM), Tailwind CSS, and Vanilla JavaScript.

![Three.js](https://img.shields.io/badge/Three.js-WebGL-00f0ff?style=for-the-badge&logo=three.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/Vanilla_JS-ESM-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

---

## ✨ Features

- **3D Animus Loading Void & Memory Shards**:
  - Atmospheric Three.js scene featuring an infinite glowing Animus coordinate grid floor, DNA double-helix data stream, and floating particle dust.
  - Floating 3D memory fragments representing individual blog posts, textured with heavy-ink comic doodle art, Ben-Day halftone patterns, and Assassin Brotherhood insignia.
  - **Dynamic Texture Transition**: Focusing a memory fragment visually transitions it from a digital cyber shard into an unfolded historical Leonardo da Vinci codex manuscript!
  - OrbitControls with smooth damping for intuitive panning, rotating, and zooming.
- **Raycasting & Camera Focusing**:
  - Raycaster detects hovered 3D fragments with an amber holographic outline glow, glitch sound effects, and floating telemetry HUD tooltips.
  - Smooth cubic-eased camera animation to focus tightly on any clicked fragment.
- **Historical Codex Reading Interface**:
  - Slide-in 2D reader panel styled like a Renaissance parchment manuscript with deckled edges, Leonardo-style marginalia sketches, illuminated drop caps, and Assassin wax seal reactions.
- **Threaded Discussions & Codex Annotations**:
  - Nested recursive comment tree supporting top-level annotations, threaded replies, and upvoting.
- **Synchronize New Memory (FAB)**:
  - Animus-themed Floating Action Button opening a 2D modal to encode new memory posts.
  - Submitting dynamically instantiates a new 3D memory fragment in the Three.js void with a particle burst effect in real time.
- **Abstergo / Brotherhood Authentication Service**:
  - Futuristic minimalist HUD with active session state, telemetry indicators, and biometric login/registration modals.
- **Synthesized Animus & Parchment Audio**:
  - Web Audio API real-time synthesizer providing Animus synchronization chimes, glitch telemetry, and manuscript parchment paper rustles.

---

## 🚀 Quick Start

1. Clone or download the repository:
   ```bash
   git clone https://github.com/Manas235/DoodleSphere.git
   cd DoodleSphere
   ```

2. Install dependencies (optional, project uses zero external npm dependencies):
   ```bash
   npm install
   ```

3. Start the local server:
   ```bash
   npm start
   # or
   node server.js
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser!

---

## 🛠 Tech Stack

- **3D Engine**: Three.js (ESM from CDN) with OrbitControls
- **2D UI & Styling**: Tailwind CSS, Google Fonts (`Cinzel`, `Share Tech Mono`, `Kalam`, `Bangers`, `Outfit`)
- **Architecture**: Modular Services (`ThreeAnimusScene`, `PostService`, `AuthService`, `AnimusSoundFX`, `UIController`)
- **Audio**: Web Audio API (real-time synthesized SFX)
