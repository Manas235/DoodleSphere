/**
 * DoodleSphere — 3D Comic & Doodle Social Blogging Platform
 * Architecture: Clean separation of Three.js 3D Scene Engine, Post Data Service,
 * Comment Service, Auth Service, and UI Controller.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================================================
   1. SOUND EFFECTS SYNTHESIZER (Web Audio API)
   ========================================================================== */
class ComicSoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
  }

  playPop() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(800, now + 0.08);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  }

  playWhoosh() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(450, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.2);
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.23);
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    [523.25, 659.25, 783.99].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);
      gain.gain.setValueAtTime(0.12, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.26);
    });
  }
}

const soundFX = new ComicSoundFX();


/* ==========================================================================
   2. POST & COMMENT SERVICE (Data Store & State)
   ========================================================================== */
const INITIAL_POSTS = [
  {
    id: 'post-1',
    title: 'Ink & Silicon: Building Hand-Drawn Metaspaces',
    category: 'TECH',
    author: 'Alex Inkwell',
    authorBio: 'Creative Technologist & Pixel Alchemist',
    readTime: '4 min read',
    date: 'Sep 9, 2026',
    stamp: '🚀',
    accentColor: '#00d2d3',
    likes: 42,
    hasLiked: false,
    tags: ['threejs', 'creative-coding', 'webgl', 'doodle'],
    content: `Why do modern user interfaces feel so sterile and geometric? Rectangles, perfect 1px borders, and flat glass gradients have homogenized our digital universe.

In DoodleSphere, every 3D notebook is rendered directly with real-time procedural canvas textures! We draw jittered ink lines, halftone stippling, and organic sketch borders right onto Three.js meshes.

By pairing modern WebGL raycasting with responsive 2D comic panels, users don't just "scroll" through a feed—they explore an expansive constellation of floating sketchbooks in space.`,
    comments: [
      {
        id: 'c-101',
        author: 'Sarah Scribble',
        date: '10 mins ago',
        text: 'The hand-drawn comic shader feels so tactile! Reminds me of classic indie zines and Calvin & Hobbes.',
        upvotes: 8,
        replies: [
          {
            id: 'c-102',
            author: 'Alex Inkwell',
            date: '5 mins ago',
            text: 'Thank you Sarah! Calvin & Hobbes line weights were definitely a big inspiration for our outline technique.',
            upvotes: 3,
            replies: []
          }
        ]
      },
      {
        id: 'c-103',
        author: 'DevSketcher',
        date: '25 mins ago',
        text: 'How are you handling the smooth camera tweening when clicking a 3D book?',
        upvotes: 5,
        replies: [
          {
            id: 'c-104',
            author: 'Alex Inkwell',
            date: '12 mins ago',
            text: 'We interpolate both camera.position and controls.target using cubic easing curves for that snappy comic punch!',
            upvotes: 4,
            replies: []
          }
        ]
      }
    ]
  },
  {
    id: 'post-2',
    title: 'The Lost Art of Marginalia & Coffee Doodles',
    category: 'ART',
    author: 'Maya Lin',
    authorBio: 'Illustrator & Coffee Brewer',
    readTime: '3 min read',
    date: 'Sep 8, 2026',
    stamp: '☕',
    accentColor: '#ff5c8a',
    likes: 29,
    hasLiked: false,
    tags: ['illustration', 'notebooks', 'coffee', 'sketches'],
    content: `Medieval monks used to draw mythical creatures, snail knights, and silly caricatures in the margins of sacred manuscripts. This practice was called marginalia.

When you doodle while thinking, your brain bypasses rigid linear logic. The coffee ring on your page becomes the halo of a tiny astronaut; a slip of the pen transforms into a cartoon mountain peak.

Don't let your ideas remain pristine in cold digital spreadsheets. Let your thoughts get inked, scratched, and scribbled!`,
    comments: [
      {
        id: 'c-201',
        author: 'PaperKnight',
        date: '1 hour ago',
        text: 'Snail knights fighting rabbits in medieval margins is literally peak illustration history.',
        upvotes: 11,
        replies: []
      }
    ]
  },
  {
    id: 'post-3',
    title: 'Midnight Musings on Autonomous AI Art Studios',
    category: 'IDEAS',
    author: 'Cyborg Quill',
    authorBio: 'Speculative Fiction Writer',
    readTime: '5 min read',
    date: 'Sep 7, 2026',
    stamp: '💡',
    accentColor: '#9b5de5',
    likes: 56,
    hasLiked: false,
    tags: ['philosophy', 'ai', 'creativity', 'future'],
    content: `Will synthetic agents ever experience the physical resistance of graphite on coarse cotton paper?

There is something irreplaceable about human error in illustration: the tremor in a freehand circle, the unexpected ink blot from a fountain pen, the tactile smudge of charcoal on an index finger.

Future AI interfaces shouldn't just strive for clean photorealism. They should embrace imperfections, whimsy, and handwritten charm.`,
    comments: [
      {
        id: 'c-301',
        author: 'VoxelVagabond',
        date: '2 hours ago',
        text: 'Embracing imperfections is exactly why the doodle aesthetic resonates so deeply with folks right now.',
        upvotes: 7,
        replies: []
      }
    ]
  },
  {
    id: 'post-4',
    title: 'The Dragon Who Forgot How to Breathe Fire',
    category: 'STORIES',
    author: 'Barnaby Finch',
    authorBio: 'Folklorist & Story Spinner',
    readTime: '6 min read',
    date: 'Sep 6, 2026',
    stamp: '🌈',
    accentColor: '#ffd13b',
    likes: 64,
    hasLiked: false,
    tags: ['fiction', 'short-story', 'fantasy', 'comics'],
    content: `Ignis woke up one frosty Tuesday morning and tried to ignite his breakfast skillet. Instead of a roaring jet of crimson flame, all that emerged from his snout was a stream of warm rainbow soap bubbles.

The bubbles bobbed softly over the tavern roofs, reflecting the golden sunrise. The village children gasped in delight, dancing through the cobblestone alleys chasing the iridescent spheres.

"Well," Ignis chuckled to himself, folding his leathery green wings, "perhaps entertaining the kingdom pays better than terrifying it anyway."`,
    comments: [
      {
        id: 'c-401',
        author: 'WhimsicalWanderer',
        date: '3 hours ago',
        text: 'This warmed my heart so much! I can totally picture this as a Saturday morning animated strip.',
        upvotes: 9,
        replies: []
      }
    ]
  },
  {
    id: 'post-5',
    title: 'Shaders, Halftones, and Retro Print Dots in 3D',
    category: 'TECH',
    author: 'Kenji Sato',
    authorBio: 'Graphics Programmer',
    readTime: '4 min read',
    date: 'Sep 5, 2026',
    stamp: '⚡',
    accentColor: '#ff9f1c',
    likes: 38,
    hasLiked: false,
    tags: ['shaders', 'halftone', 'threejs', 'retro'],
    content: `The Ben-Day dots technique originated in 1879 for commercial printing presses. By spacing tiny magenta, cyan, and black dots, printers could simulate full tonal gradients with limited ink plates.

Bringing this into Three.js allows us to blend 3D depth with vintage comic book textures. Each 3D post mesh in this platform dynamically calculates dot patterns based on light angles!`,
    comments: []
  },
  {
    id: 'post-6',
    title: 'Retro Arcade Cabinets & The Joy of 8-Bit Pixels',
    category: 'ART',
    author: 'Pixel Pioneer',
    authorBio: 'Chiptune Composer & Retro Arcade Archivist',
    readTime: '3 min read',
    date: 'Sep 4, 2026',
    stamp: '👾',
    accentColor: '#2ec4b6',
    likes: 47,
    hasLiked: false,
    tags: ['pixelart', 'retro', 'gaming', 'nostalgia'],
    content: `Nothing evokes nostalgia quite like the neon glow and wooden side panels of a 1980s arcade cabinet in a dark mall corner.

When pixels were scarce, every single colored square had to tell a story. An 8x8 sprite wasn't just pixels; it was an astronaut, an alien invader, or a magical potion bottle. That constraint is what birthed true visual mastery.`,
    comments: []
  }
];

class PostService {
  constructor() {
    this.posts = [...INITIAL_POSTS];
  }

  getAll() {
    return this.posts;
  }

  getById(id) {
    return this.posts.find(p => p.id === id);
  }

  createPost(newPostData) {
    const newPost = {
      id: `post-${Date.now()}`,
      title: newPostData.title,
      category: newPostData.category || 'TECH',
      author: newPostData.author || 'Anonymous Doodler',
      authorBio: 'Creative Sphere Contributor',
      readTime: `${Math.max(1, Math.round(newPostData.content.split(' ').length / 150))} min read`,
      date: 'Just now',
      stamp: newPostData.stamp || '🚀',
      accentColor: this.getCategoryColor(newPostData.category),
      likes: 1,
      hasLiked: false,
      tags: newPostData.tags || ['creative', 'doodlesphere'],
      content: newPostData.content,
      comments: []
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  getCategoryColor(category) {
    switch (category) {
      case 'ART': return '#ff5c8a';
      case 'TECH': return '#00d2d3';
      case 'STORIES': return '#ffd13b';
      case 'IDEAS': return '#9b5de5';
      default: return '#2ec4b6';
    }
  }

  toggleLike(postId) {
    const post = this.getById(postId);
    if (!post) return null;
    post.hasLiked = !post.hasLiked;
    post.likes += post.hasLiked ? 1 : -1;
    return post;
  }

  addComment(postId, parentCommentId, text, authorName) {
    const post = this.getById(postId);
    if (!post) return null;

    const newComment = {
      id: `c-${Date.now()}-${Math.floor(Math.random()*1000)}`,
      author: authorName || 'Doodle Visitor',
      date: 'Just now',
      text: text.trim(),
      upvotes: 1,
      replies: []
    };

    if (!parentCommentId) {
      post.comments.unshift(newComment);
    } else {
      // Find parent comment recursively
      const appendRecursive = (commentList) => {
        for (const c of commentList) {
          if (c.id === parentCommentId) {
            c.replies.push(newComment);
            return true;
          }
          if (c.replies && c.replies.length > 0) {
            if (appendRecursive(c.replies)) return true;
          }
        }
        return false;
      };
      appendRecursive(post.comments);
    }
    return post;
  }

  upvoteComment(postId, commentId) {
    const post = this.getById(postId);
    if (!post) return;
    const findAndUpvote = (list) => {
      for (const c of list) {
        if (c.id === commentId) {
          c.upvotes++;
          return true;
        }
        if (c.replies && findAndUpvote(c.replies)) return true;
      }
      return false;
    };
    findAndUpvote(post.comments);
  }

  countTotalComments(comments) {
    let count = comments.length;
    for (const c of comments) {
      if (c.replies && c.replies.length > 0) {
        count += this.countTotalComments(c.replies);
      }
    }
    return count;
  }
}


/* ==========================================================================
   3. AUTH SERVICE
   ========================================================================== */
class AuthService {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('doodlesphere_user')) || null;
    this.listeners = [];
  }

  onChange(callback) {
    this.listeners.push(callback);
  }

  notify() {
    this.listeners.forEach(cb => cb(this.user));
  }

  login(username) {
    this.user = {
      name: username || 'DoodleMaster',
      avatar: (username || 'D')[0].toUpperCase(),
      email: `${(username || 'doodler').toLowerCase()}@doodlesphere.art`
    };
    localStorage.setItem('doodlesphere_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  register(username, email) {
    this.user = {
      name: username || 'InkCaptain',
      avatar: (username || 'I')[0].toUpperCase(),
      email: email || 'ink@doodlesphere.art'
    };
    localStorage.setItem('doodlesphere_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('doodlesphere_user');
    this.notify();
  }

  isLoggedIn() {
    return !!this.user;
  }

  getUserName() {
    return this.user ? this.user.name : 'Guest Doodler';
  }
}


/* ==========================================================================
   4. THREE.JS 3D SCENE & DOODLE ENVIRONMENT
   ========================================================================== */
class ThreeDoodleScene {
  constructor(containerElement, onPostSelected, onPostHover) {
    this.container = containerElement;
    this.onPostSelected = onPostSelected;
    this.onPostHover = onPostHover;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);

    this.postMeshes = []; // Array of { mesh, postData, originalPos, originalRot }
    this.hoveredObject = null;
    this.isCameraAnimating = false;
    this.selectedPostMesh = null;

    // Camera default overview position
    this.defaultCameraPos = new THREE.Vector3(0, 18, 48);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);

    // Camera animation tween state
    this.cameraTween = {
      active: false,
      startTime: 0,
      duration: 1100,
      startPos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      startLookAt: new THREE.Vector3(),
      targetLookAt: new THREE.Vector3()
    };

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfaf5e8);
    this.scene.fog = new THREE.FogExp2(0xfaf5e8, 0.012);

    // 2. Camera Setup
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    this.camera.position.copy(this.defaultCameraPos);

    // 3. Renderer Setup
    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    // 4. OrbitControls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 90;
    this.controls.minDistance = 8;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.15; // Don't flip below bottom plane
    this.controls.target.copy(this.defaultTarget);

    // 5. Lighting
    this.setupLighting();

    // 6. Environment Props (Hand-drawn floor grid, comic clouds, doodle particles)
    this.setupEnvironment();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('click', (e) => this.onPointerClick(e));

    // 8. Start Loop
    this.animate();
  }

  setupLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff7e6, 1.2);
    dirLight.position.set(30, 45, 25);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -40;
    dirLight.shadow.camera.right = 40;
    dirLight.shadow.camera.top = 40;
    dirLight.shadow.camera.bottom = -40;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x00d2d3, 0.35);
    fillLight.position.set(-30, -10, -20);
    this.scene.add(fillLight);
  }

  setupEnvironment() {
    // 1. Hand-drawn Comic Ground Grid
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 512;
    gridCanvas.height = 512;
    const gctx = gridCanvas.getContext('2d');
    gctx.fillStyle = '#faf5e8';
    gctx.fillRect(0, 0, 512, 512);

    // Crosshatch ink dots
    gctx.fillStyle = '#d6c9af';
    for (let x = 16; x < 512; x += 32) {
      for (let y = 16; y < 512; y += 32) {
        gctx.beginPath();
        gctx.arc(x, y, 2.5, 0, Math.PI * 2);
        gctx.fill();
      }
    }
    // Sketchy concentric rings
    gctx.strokeStyle = '#e2d5bd';
    gctx.lineWidth = 2;
    gctx.beginPath();
    gctx.arc(256, 256, 120, 0, Math.PI * 2);
    gctx.arc(256, 256, 220, 0, Math.PI * 2);
    gctx.stroke();

    const gridTexture = new THREE.CanvasTexture(gridCanvas);
    gridTexture.wrapS = THREE.RepeatWrapping;
    gridTexture.wrapT = THREE.RepeatWrapping;
    gridTexture.repeat.set(12, 12);

    const groundGeo = new THREE.PlaneGeometry(160, 160);
    const groundMat = new THREE.MeshStandardMaterial({
      map: gridTexture,
      roughness: 0.9,
      metalness: 0.1
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -10;
    ground.receiveShadow = true;
    this.scene.add(ground);

    // 2. Comic Floating Particles (Hand-drawn crosses, rings, doodle stars)
    const particleCount = 120;
    const particleGroup = new THREE.Group();
    const particleGeos = [
      new THREE.RingGeometry(0.3, 0.45, 8),
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.OctahedronGeometry(0.45, 0)
    ];
    const particleMats = [
      new THREE.MeshBasicMaterial({ color: 0x161311 }),
      new THREE.MeshBasicMaterial({ color: 0xff5c8a }),
      new THREE.MeshBasicMaterial({ color: 0xffd13b }),
      new THREE.MeshBasicMaterial({ color: 0x00d2d3 })
    ];

    for (let i = 0; i < particleCount; i++) {
      const geo = particleGeos[i % particleGeos.length];
      const mat = particleMats[i % particleMats.length];
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        Math.random() * 35 - 5,
        (Math.random() - 0.5) * 80
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      mesh.scale.setScalar(0.7 + Math.random() * 0.8);
      mesh.userData = {
        speedY: (Math.random() * 0.015 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        rotSpeed: Math.random() * 0.02 - 0.01
      };
      particleGroup.add(mesh);
    }
    this.particleGroup = particleGroup;
    this.scene.add(particleGroup);

    // 3. Whimsical 3D Comic Clouds hovering around scene
    this.createComicCloud(new THREE.Vector3(-28, 18, -25));
    this.createComicCloud(new THREE.Vector3(26, 22, -20));
    this.createComicCloud(new THREE.Vector3(0, 24, 25));
  }

  createComicCloud(pos) {
    const cloudGroup = new THREE.Group();
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.8,
      metalness: 0.1
    });

    // Cloud puff spheres
    const puffs = [
      { r: 2.2, x: 0, y: 0, z: 0 },
      { r: 1.7, x: -1.8, y: -0.2, z: 0 },
      { r: 1.8, x: 1.8, y: -0.1, z: 0 },
      { r: 1.3, x: -0.7, y: 1.2, z: 0.3 },
      { r: 1.4, x: 0.9, y: 1.1, z: -0.2 }
    ];

    puffs.forEach(p => {
      const sphere = new THREE.Mesh(new THREE.SphereGeometry(p.r, 12, 10), cloudMat);
      sphere.position.set(p.x, p.y, p.z);
      sphere.castShadow = true;

      // Inverted ink outline for comic look
      const outlineGeo = new THREE.SphereGeometry(p.r * 1.06, 10, 8);
      const outlineMat = new THREE.MeshBasicMaterial({ color: 0x161311, side: THREE.BackSide });
      const outline = new THREE.Mesh(outlineGeo, outlineMat);
      sphere.add(outline);

      cloudGroup.add(sphere);
    });

    cloudGroup.position.copy(pos);
    this.scene.add(cloudGroup);
  }

  /**
   * Generates procedural canvas textures for a post notebook:
   * Front cover (title, stamps, halftone dots, doodle badge), spine, and lined pages
   */
  generateNotebookTextures(post) {
    // 1. FRONT COVER CANVAS
    const coverCanvas = document.createElement('canvas');
    coverCanvas.width = 512;
    coverCanvas.height = 720;
    const ctx = coverCanvas.getContext('2d');

    // Background paper color
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 720);

    // Accent header band
    ctx.fillStyle = post.accentColor || '#ffd13b';
    ctx.fillRect(0, 0, 512, 140);

    // Halftone dots in header
    ctx.fillStyle = 'rgba(22, 19, 17, 0.12)';
    for (let x = 12; x < 512; x += 16) {
      for (let y = 12; y < 140; y += 16) {
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Bold ink comic border
    ctx.strokeStyle = '#161311';
    ctx.lineWidth = 14;
    ctx.strokeRect(7, 7, 498, 706);

    // Category banner badge
    ctx.fillStyle = '#161311';
    ctx.fillRect(36, 115, 160, 42);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px Outfit, sans-serif';
    ctx.fillText(post.category.toUpperCase(), 50, 144);

    // Doodle Motif Stamp
    ctx.font = '70px serif';
    ctx.textAlign = 'center';
    ctx.fillText(post.stamp || '🎨', 410, 100);

    // Ruled notebook lines
    ctx.strokeStyle = 'rgba(22, 19, 17, 0.15)';
    ctx.lineWidth = 2;
    for (let y = 200; y < 650; y += 38) {
      ctx.beginPath();
      ctx.moveTo(35, y);
      ctx.lineTo(477, y);
      ctx.stroke();
    }

    // Title (multi-line wrapped)
    ctx.fillStyle = '#161311';
    ctx.font = 'bold 36px Bangers, cursive, sans-serif';
    ctx.textAlign = 'left';

    const words = post.title.split(' ');
    let line = '';
    let curY = 240;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > 420 && n > 0) {
        ctx.fillText(line, 45, curY);
        line = words[n] + ' ';
        curY += 44;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 45, curY);

    // Author & Reading Time footer
    ctx.fillStyle = '#161311';
    ctx.font = 'bold 20px Kalam, cursive, sans-serif';
    ctx.fillText(`✎ ${post.author}`, 45, 620);
    ctx.font = '16px Outfit, sans-serif';
    ctx.fillStyle = '#666666';
    ctx.fillText(`⏱ ${post.readTime} • ${post.likes} Likes`, 45, 650);

    // Cute decorative comic sticker
    ctx.fillStyle = '#ffd13b';
    ctx.strokeStyle = '#161311';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(430, 615, 34, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#161311';
    ctx.font = 'bold 15px Bangers, cursive';
    ctx.textAlign = 'center';
    ctx.fillText('READ ME!', 430, 620);

    // 2. SPINE TEXTURE
    const spineCanvas = document.createElement('canvas');
    spineCanvas.width = 128;
    spineCanvas.height = 720;
    const sctx = spineCanvas.getContext('2d');
    sctx.fillStyle = post.accentColor || '#ffd13b';
    sctx.fillRect(0, 0, 128, 720);
    sctx.strokeStyle = '#161311';
    sctx.lineWidth = 8;
    sctx.strokeRect(4, 4, 120, 712);
    // Stitching / tape lines
    sctx.fillStyle = '#161311';
    for (let y = 30; y < 700; y += 40) {
      sctx.fillRect(52, y, 24, 6);
    }

    // 3. PAGES EDGE TEXTURE
    const pagesCanvas = document.createElement('canvas');
    pagesCanvas.width = 128;
    pagesCanvas.height = 512;
    const pctx = pagesCanvas.getContext('2d');
    pctx.fillStyle = '#faf5e8';
    pctx.fillRect(0, 0, 128, 512);
    pctx.strokeStyle = 'rgba(22, 19, 17, 0.2)';
    pctx.lineWidth = 1;
    for (let y = 0; y < 512; y += 4) {
      pctx.beginPath();
      pctx.moveTo(0, y);
      pctx.lineTo(128, y);
      pctx.stroke();
    }

    const coverTex = new THREE.CanvasTexture(coverCanvas);
    const spineTex = new THREE.CanvasTexture(spineCanvas);
    const pagesTex = new THREE.CanvasTexture(pagesCanvas);

    return { coverTex, spineTex, pagesTex };
  }

  /**
   * Creates a 3D Comic Notebook mesh for a post
   */
  createPostMesh(post, position, index) {
    const { coverTex, spineTex, pagesTex } = this.generateNotebookTextures(post);

    // Box dimensions: Width: 4.8, Height: 6.8, Depth: 1.1
    const bookGeo = new THREE.BoxGeometry(4.8, 6.8, 1.1);

    // Materials for 6 faces: Right(Pages), Left(Spine), Top(Pages), Bottom(Pages), Front(Cover), Back(Plain)
    const materials = [
      new THREE.MeshStandardMaterial({ map: pagesTex, roughness: 0.8 }), // Right
      new THREE.MeshStandardMaterial({ map: spineTex, roughness: 0.6 }), // Left / Spine
      new THREE.MeshStandardMaterial({ map: pagesTex, roughness: 0.8 }), // Top
      new THREE.MeshStandardMaterial({ map: pagesTex, roughness: 0.8 }), // Bottom
      new THREE.MeshStandardMaterial({ map: coverTex, roughness: 0.4 }), // Front cover
      new THREE.MeshStandardMaterial({ color: 0xf4ebd0, roughness: 0.7 }) // Back cover
    ];

    const bookMesh = new THREE.Mesh(bookGeo, materials);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;

    // Hand-drawn Inverted-Hull Comic Outline
    const outlineGeo = new THREE.BoxGeometry(5.08, 7.08, 1.28);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x161311,
      side: THREE.BackSide
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    bookMesh.add(outlineMesh);

    // Floating Speech Bubble / Action Badge above post
    const badgeGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 128;
    badgeCanvas.height = 128;
    const bctx = badgeCanvas.getContext('2d');
    bctx.fillStyle = '#ffd13b';
    bctx.beginPath();
    bctx.arc(64, 64, 58, 0, Math.PI * 2);
    bctx.fill();
    bctx.strokeStyle = '#161311';
    bctx.lineWidth = 8;
    bctx.stroke();
    bctx.font = '60px serif';
    bctx.textAlign = 'center';
    bctx.fillText(post.stamp || '✨', 64, 85);

    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.set(2.0, 3.7, 0.4);
    bookMesh.add(badgeMesh);

    // Set initial organic position and slight tilt
    bookMesh.position.copy(position);
    bookMesh.rotation.y = (Math.random() - 0.5) * 0.4;
    bookMesh.rotation.z = (Math.random() - 0.5) * 0.15;

    // Link post data and animation metadata
    bookMesh.userData = {
      isPost: true,
      postId: post.id,
      postData: post,
      originalPos: bookMesh.position.clone(),
      originalRot: bookMesh.rotation.clone(),
      floatOffset: index * 0.9,
      floatSpeed: 1.2 + Math.random() * 0.5,
      outlineMesh: outlineMesh
    };

    this.scene.add(bookMesh);
    this.postMeshes.push(bookMesh);

    return bookMesh;
  }

  /**
   * Spawns all posts in an organic celestial ring
   */
  populatePosts(posts) {
    // Clear existing
    this.postMeshes.forEach(p => this.scene.remove(p));
    this.postMeshes = [];

    const total = posts.length;
    const radius = 17;

    posts.forEach((post, i) => {
      const angle = (i / total) * Math.PI * 2;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const z = Math.sin(angle) * (radius * 0.9) + (Math.random() - 0.5) * 2;
      const y = Math.sin(i * 1.8) * 3 + 2;

      const pos = new THREE.Vector3(x, y, z);
      const mesh = this.createPostMesh(post, pos, i);

      // Face roughly towards the center with slight tilt
      mesh.lookAt(0, y * 0.5, 0);
      mesh.rotateY(Math.PI); // Orient front cover facing viewer
      mesh.userData.originalRot = mesh.rotation.clone();
    });
  }

  /**
   * Add a single newly published post dynamically into the 3D scene
   */
  addNewPost(post) {
    // Spawn right in front of the camera view
    const angle = Math.random() * Math.PI * 2;
    const radius = 15;
    const pos = new THREE.Vector3(
      Math.cos(angle) * radius,
      3 + Math.random() * 2,
      Math.sin(angle) * radius
    );
    const mesh = this.createPostMesh(post, pos, this.postMeshes.length);
    mesh.lookAt(0, pos.y, 0);
    mesh.rotateY(Math.PI);
    mesh.userData.originalRot = mesh.rotation.clone();

    // Comic entrance scale pop
    mesh.scale.set(0.01, 0.01, 0.01);
    const enterTween = () => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 0.08;
        const s = Math.min(1, Math.sin(progress * Math.PI * 0.5) * 1.15);
        mesh.scale.set(s, s, s);
        if (progress >= 1.2) {
          mesh.scale.set(1, 1, 1);
          clearInterval(interval);
        }
      }, 16);
    };
    enterTween();
    soundFX.playChime();
  }

  /**
   * Filter posts visible in 3D by category
   */
  filterByCategory(category) {
    this.postMeshes.forEach(mesh => {
      const match = category === 'ALL' || mesh.userData.postData.category === category;
      mesh.visible = match;
    });
  }

  /**
   * Raycasting on pointer move for hover interactions
   */
  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.postMeshes, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      if (this.hoveredObject !== hit) {
        // Unhover previous
        if (this.hoveredObject) {
          this.hoveredObject.userData.outlineMesh.material.color.setHex(0x161311);
        }
        this.hoveredObject = hit;
        // Glow comic outline
        this.hoveredObject.userData.outlineMesh.material.color.setHex(0xff5c8a);
        this.container.style.cursor = 'pointer';
        soundFX.playPop();
      }
      if (this.onPostHover) {
        this.onPostHover(hit.userData.postData, event.clientX, event.clientY);
      }
    } else {
      if (this.hoveredObject) {
        this.hoveredObject.userData.outlineMesh.material.color.setHex(0x161311);
        this.hoveredObject = null;
        this.container.style.cursor = 'grab';
        if (this.onPostHover) {
          this.onPostHover(null);
        }
      }
    }
  }

  /**
   * Raycasting on click to select post & trigger smooth camera focus
   */
  onPointerClick(event) {
    if (this.isCameraAnimating) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.postMeshes, false);

    if (intersects.length > 0) {
      const postMesh = intersects[0].object;
      this.selectedPostMesh = postMesh;
      soundFX.playWhoosh();

      // Animate Camera to focus on this post
      this.focusOnPost(postMesh);

      if (this.onPostSelected) {
        this.onPostSelected(postMesh.userData.postData);
      }
    }
  }

  /**
   * Smoothly animates camera to frame the selected 3D post
   */
  focusOnPost(mesh) {
    this.isCameraAnimating = true;
    this.controls.enabled = false;

    // Calculate position in front of the post
    const targetLookAt = mesh.position.clone();
    
    // Normal vector pointing outwards from book front cover
    const offset = new THREE.Vector3(0, 0.5, 9).applyQuaternion(mesh.quaternion);
    const targetCameraPos = mesh.position.clone().add(offset);

    this.cameraTween = {
      active: true,
      startTime: performance.now(),
      duration: 1000,
      startPos: this.camera.position.clone(),
      targetPos: targetCameraPos,
      startLookAt: this.controls.target.clone(),
      targetLookAt: targetLookAt
    };
  }

  /**
   * Smoothly reset camera back to wide overview
   */
  resetCameraOverview() {
    this.isCameraAnimating = true;
    this.controls.enabled = false;
    this.selectedPostMesh = null;
    soundFX.playWhoosh();

    this.cameraTween = {
      active: true,
      startTime: performance.now(),
      duration: 1200,
      startPos: this.camera.position.clone(),
      targetPos: this.defaultCameraPos.clone(),
      startLookAt: this.controls.target.clone(),
      targetLookAt: this.defaultTarget.clone()
    };
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const elapsedTime = this.clock.getElapsedTime();

    // 1. Handle Camera Tween Animation
    if (this.cameraTween.active) {
      const elapsed = performance.now() - this.cameraTween.startTime;
      const progress = Math.min(1, elapsed / this.cameraTween.duration);
      
      // Smooth cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.lerpVectors(this.cameraTween.startPos, this.cameraTween.targetPos, ease);
      this.controls.target.lerpVectors(this.cameraTween.startLookAt, this.cameraTween.targetLookAt, ease);

      if (progress >= 1) {
        this.cameraTween.active = false;
        this.isCameraAnimating = false;
        this.controls.enabled = true;
      }
    } else {
      this.controls.update();
    }

    // 2. Animate Floating 3D Post Meshes (Gentle Organic Bobbing & Sway)
    this.postMeshes.forEach(mesh => {
      if (mesh === this.selectedPostMesh) {
        // Keep selected mesh facing camera steadily
        return;
      }
      const u = mesh.userData;
      const bob = Math.sin(elapsedTime * u.floatSpeed + u.floatOffset) * 0.45;
      mesh.position.y = u.originalPos.y + bob;

      // Slight comic wobble
      mesh.rotation.z = u.originalRot.z + Math.sin(elapsedTime * 0.8 + u.floatOffset) * 0.03;
    });

    // 3. Animate Background Comic Particles
    if (this.particleGroup) {
      this.particleGroup.children.forEach(p => {
        p.position.y += p.userData.speedY;
        p.rotation.x += p.userData.rotSpeed;
        p.rotation.y += p.userData.rotSpeed;
        if (p.position.y > 32) p.position.y = -5;
        if (p.position.y < -5) p.position.y = 32;
      });
    }

    this.renderer.render(this.scene, this.camera);
  }
}


/* ==========================================================================
   5. UI CONTROLLER (DOM Manipulation & Event Binding)
   ========================================================================== */
class UIController {
  constructor(postService, authService, soundFX) {
    this.postService = postService;
    this.authService = authService;
    this.soundFX = soundFX;

    this.scene = null;
    this.currentPost = null;

    // Cache DOM Elements
    this.dom = {
      canvasContainer: document.getElementById('canvas-container'),
      btnResetView: document.getElementById('btn-reset-view'),
      postHoverCard: document.getElementById('post-hover-card'),
      hoverCategory: document.getElementById('hover-category'),
      hoverTitle: document.getElementById('hover-title'),
      hoverMeta: document.getElementById('hover-meta'),
      searchInput: document.getElementById('search-input'),
      categoryPills: document.getElementById('category-pills'),
      btnSoundToggle: document.getElementById('btn-sound-toggle'),
      soundIcon: document.getElementById('sound-icon'),
      authLoggedOut: document.getElementById('auth-logged-out'),
      authLoggedIn: document.getElementById('auth-logged-in'),
      btnOpenLogin: document.getElementById('btn-open-login'),
      btnOpenRegister: document.getElementById('btn-open-register'),
      btnLogout: document.getElementById('btn-logout'),
      userAvatar: document.getElementById('user-avatar'),
      userDisplayName: document.getElementById('user-display-name'),
      btnOpenCreatePost: document.getElementById('btn-open-create-post'),
      readerOverlay: document.getElementById('reader-overlay'),
      readerPanel: document.getElementById('reader-panel'),
      btnCloseReader: document.getElementById('btn-close-reader'),
      readerCategory: document.getElementById('reader-category'),
      readerReadTime: document.getElementById('reader-readtime'),
      readerTitle: document.getElementById('reader-title'),
      readerAuthorName: document.getElementById('reader-author-name'),
      readerAuthorAvatar: document.getElementById('reader-author-avatar'),
      readerDate: document.getElementById('reader-date'),
      readerBannerMotif: document.getElementById('reader-banner-motif'),
      readerBody: document.getElementById('reader-body'),
      readerTags: document.getElementById('reader-tags'),
      btnLikePost: document.getElementById('btn-like-post'),
      likeIcon: document.getElementById('like-icon'),
      likeCount: document.getElementById('like-count'),
      commentsContainer: document.getElementById('comments-container'),
      commentTotalBadge: document.getElementById('comment-total-badge'),
      commenterNamePreview: document.getElementById('commenter-name-preview'),
      commentInput: document.getElementById('comment-input'),
      btnSubmitComment: document.getElementById('btn-submit-comment'),
      modalCreatePost: document.getElementById('modal-create-post'),
      formCreatePost: document.getElementById('form-create-post'),
      btnCloseCreatePost: document.getElementById('btn-close-create-post'),
      btnCancelCreatePost: document.getElementById('btn-cancel-create-post'),
      modalAuth: document.getElementById('modal-auth'),
      tabLogin: document.getElementById('tab-login'),
      tabRegister: document.getElementById('tab-register'),
      formLogin: document.getElementById('form-login'),
      formRegister: document.getElementById('form-register'),
      btnCloseAuth: document.getElementById('btn-close-auth'),
      toastContainer: document.getElementById('toast-container')
    };

    this.init();
  }

  init() {
    // 1. Initialize 3D Scene
    this.scene = new ThreeDoodleScene(
      this.dom.canvasContainer,
      (post) => this.openReader(post),
      (post, x, y) => this.handlePostHover(post, x, y)
    );

    // Populate Initial 3D Posts
    this.scene.populatePosts(this.postService.getAll());

    // 2. Setup Auth State
    this.authService.onChange((user) => this.updateAuthUI(user));
    this.updateAuthUI(this.authService.user);

    // 3. Bind UI Events
    this.bindEvents();
  }

  bindEvents() {
    // Sound Toggle
    this.dom.btnSoundToggle.addEventListener('click', () => {
      this.soundFX.enabled = !this.soundFX.enabled;
      this.dom.soundIcon.textContent = this.soundFX.enabled ? '🔊' : '🔇';
      this.showToast(this.soundFX.enabled ? 'Comic Sound FX: ON' : 'Comic Sound FX: OFF');
    });

    // Reset View Button
    this.dom.btnResetView.addEventListener('click', () => {
      this.closeReader();
      this.scene.resetCameraOverview();
    });

    // Search Input
    this.dom.searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      this.scene.postMeshes.forEach(mesh => {
        const p = mesh.userData.postData;
        const match = !q || p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.content.toLowerCase().includes(q);
        mesh.visible = match;
      });
    });

    // Category Filter Pills
    this.dom.categoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      this.soundFX.playPop();

      // Toggle active style
      this.dom.categoryPills.querySelectorAll('.cat-pill').forEach(btn => {
        btn.classList.remove('bg-ink', 'text-white');
        btn.classList.add('bg-white', 'text-ink');
      });
      pill.classList.remove('bg-white', 'text-ink');
      pill.classList.add('bg-ink', 'text-white');

      const cat = pill.getAttribute('data-category');
      this.scene.filterByCategory(cat);
    });

    // Auth Modals (Login / Register)
    this.dom.btnOpenLogin.addEventListener('click', () => this.openAuthModal('login'));
    this.dom.btnOpenRegister.addEventListener('click', () => this.openAuthModal('register'));
    this.dom.btnCloseAuth.addEventListener('click', () => this.closeAuthModal());
    this.dom.tabLogin.addEventListener('click', () => this.switchAuthTab('login'));
    this.dom.tabRegister.addEventListener('click', () => this.switchAuthTab('register'));

    this.dom.formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value;
      this.authService.login(username);
      this.closeAuthModal();
      this.showToast(`Welcome back, ${username}! 🎨`);
      this.soundFX.playChime();
    });

    this.dom.formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const email = document.getElementById('reg-email').value;
      this.authService.register(username, email);
      this.closeAuthModal();
      this.showToast(`Joined DoodleSphere! Ready to sketch, ${username} ✨`);
      this.soundFX.playChime();
    });

    this.dom.btnLogout.addEventListener('click', () => {
      this.authService.logout();
      this.showToast('Logged out of DoodleSphere.');
    });

    // Reader Close Button
    this.dom.btnCloseReader.addEventListener('click', () => {
      this.closeReader();
      this.scene.resetCameraOverview();
    });

    // Close reader when clicking outside panel
    this.dom.readerOverlay.addEventListener('click', (e) => {
      if (e.target === this.dom.readerOverlay) {
        this.closeReader();
        this.scene.resetCameraOverview();
      }
    });

    // Like Post Button
    this.dom.btnLikePost.addEventListener('click', () => {
      if (!this.currentPost) return;
      const updated = this.postService.toggleLike(this.currentPost.id);
      if (updated) {
        this.dom.likeCount.textContent = updated.likes;
        this.dom.likeIcon.textContent = updated.hasLiked ? '💖' : '❤️';
        this.soundFX.playPop();
      }
    });

    // Top-Level Comment Submission
    this.dom.btnSubmitComment.addEventListener('click', () => {
      const text = this.dom.commentInput.value.trim();
      if (!text) {
        this.showToast('Please type your comic thought first! ✏️');
        return;
      }
      const author = this.authService.getUserName();
      this.postService.addComment(this.currentPost.id, null, text, author);
      this.dom.commentInput.value = '';
      this.soundFX.playChime();
      this.renderComments(this.currentPost);
      this.showToast('Doodle comment published! 💬');
    });

    // Create New Post Modal
    this.dom.btnOpenCreatePost.addEventListener('click', () => {
      this.soundFX.playPop();
      this.dom.modalCreatePost.classList.remove('hidden');
      this.dom.modalCreatePost.classList.add('flex');
    });

    const closeCreate = () => {
      this.dom.modalCreatePost.classList.add('hidden');
      this.dom.modalCreatePost.classList.remove('flex');
    };
    this.dom.btnCloseCreatePost.addEventListener('click', closeCreate);
    this.dom.btnCancelCreatePost.addEventListener('click', closeCreate);

    this.dom.formCreatePost.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('post-input-title').value.trim();
      const category = document.getElementById('post-input-category').value;
      const stamp = document.getElementById('post-input-stamp').value;
      const author = document.getElementById('post-input-author').value.trim() || this.authService.getUserName();
      const rawTags = document.getElementById('post-input-tags').value;
      const tags = rawTags ? rawTags.split(',').map(t => t.trim().toLowerCase()) : ['doodle'];
      const content = document.getElementById('post-input-content').value.trim();

      const newPost = this.postService.createPost({
        title,
        category,
        stamp,
        author,
        tags,
        content
      });

      // Spawn new 3D book mesh into Three.js scene
      this.scene.addNewPost(newPost);

      closeCreate();
      this.dom.formCreatePost.reset();
      this.showToast(`"${title}" is now floating in the 3D Sphere! 🚀`);
    });
  }

  updateAuthUI(user) {
    if (user) {
      this.dom.authLoggedOut.classList.add('hidden');
      this.dom.authLoggedIn.classList.remove('hidden');
      this.dom.authLoggedIn.classList.add('flex');
      this.dom.userAvatar.textContent = user.avatar || user.name[0].toUpperCase();
      this.dom.userDisplayName.textContent = user.name;
      this.dom.commenterNamePreview.textContent = user.name;
    } else {
      this.dom.authLoggedOut.classList.remove('hidden');
      this.dom.authLoggedIn.classList.add('hidden');
      this.dom.authLoggedIn.classList.remove('flex');
      this.dom.commenterNamePreview.textContent = 'Guest Doodler';
    }
  }

  openAuthModal(tab = 'login') {
    this.soundFX.playPop();
    this.dom.modalAuth.classList.remove('hidden');
    this.dom.modalAuth.classList.add('flex');
    this.switchAuthTab(tab);
  }

  closeAuthModal() {
    this.dom.modalAuth.classList.add('hidden');
    this.dom.modalAuth.classList.remove('flex');
  }

  switchAuthTab(tab) {
    if (tab === 'login') {
      this.dom.tabLogin.classList.replace('border-transparent', 'border-doodlePink');
      this.dom.tabLogin.classList.replace('text-gray-400', 'text-ink');
      this.dom.tabRegister.classList.replace('border-doodlePink', 'border-transparent');
      this.dom.tabRegister.classList.replace('text-ink', 'text-gray-400');
      this.dom.formLogin.classList.remove('hidden');
      this.dom.formRegister.classList.add('hidden');
    } else {
      this.dom.tabRegister.classList.replace('border-transparent', 'border-doodlePink');
      this.dom.tabRegister.classList.replace('text-gray-400', 'text-ink');
      this.dom.tabLogin.classList.replace('border-doodlePink', 'border-transparent');
      this.dom.tabLogin.classList.replace('text-ink', 'text-gray-400');
      this.dom.formRegister.classList.remove('hidden');
      this.dom.formLogin.classList.add('hidden');
    }
  }

  handlePostHover(post, clientX, clientY) {
    if (!post) {
      this.dom.postHoverCard.style.opacity = '0';
      return;
    }
    this.dom.hoverCategory.textContent = post.category;
    this.dom.hoverCategory.style.backgroundColor = post.accentColor || '#ffd13b';
    this.dom.hoverTitle.textContent = post.title;
    this.dom.hoverMeta.textContent = `By ${post.author} • ${post.readTime}`;

    this.dom.postHoverCard.style.left = `${clientX}px`;
    this.dom.postHoverCard.style.top = `${clientY - 20}px`;
    this.dom.postHoverCard.style.opacity = '1';
  }

  openReader(post) {
    this.currentPost = post;

    // Populate Reader Data
    this.dom.readerCategory.textContent = post.category;
    this.dom.readerCategory.style.backgroundColor = post.accentColor || '#ffd13b';
    this.dom.readerReadTime.textContent = post.readTime;
    this.dom.readerTitle.textContent = post.title;
    this.dom.readerAuthorName.textContent = post.author;
    this.dom.readerAuthorAvatar.textContent = (post.author || 'A')[0].toUpperCase();
    this.dom.readerDate.textContent = `Published on ${post.date} • ${post.authorBio || 'Author'}`;
    this.dom.readerBannerMotif.textContent = post.stamp || '🎨';
    this.dom.likeCount.textContent = post.likes;
    this.dom.likeIcon.textContent = post.hasLiked ? '💖' : '❤️';

    // Body content formatting
    this.dom.readerBody.innerHTML = post.content
      .split('\n\n')
      .map(para => `<p class="leading-relaxed font-sans text-gray-800">${para}</p>`)
      .join('');

    // Tags
    this.dom.readerTags.innerHTML = post.tags
      .map(tag => `<span class="px-2.5 py-1 text-xs font-bold rounded-full bg-white border-2 border-ink shadow-comic-sm text-ink font-doodle">#${tag}</span>`)
      .join('');

    // Render Threaded Comments
    this.renderComments(post);

    // Slide in drawer
    this.dom.readerOverlay.classList.remove('opacity-0', 'pointer-events-none');
    this.dom.readerOverlay.classList.add('opacity-100', 'pointer-events-auto');
    this.dom.readerPanel.classList.remove('translate-x-full');
  }

  closeReader() {
    this.dom.readerPanel.classList.add('translate-x-full');
    this.dom.readerOverlay.classList.remove('opacity-100', 'pointer-events-auto');
    this.dom.readerOverlay.classList.add('opacity-0', 'pointer-events-none');
    this.currentPost = null;
  }

  /**
   * Recursively renders threaded comments
   */
  renderComments(post) {
    const totalCount = this.postService.countTotalComments(post.comments);
    this.dom.commentTotalBadge.textContent = totalCount;

    if (!post.comments || post.comments.length === 0) {
      this.dom.commentsContainer.innerHTML = `
        <div class="text-center py-6 border-2 border-dashed border-gray-300 rounded-xl bg-white/60">
          <span class="text-3xl">📝</span>
          <p class="font-doodle text-sm font-bold text-gray-600 mt-2">No comments yet!</p>
          <p class="text-xs text-gray-400">Be the first to leave a doodle thought above.</p>
        </div>
      `;
      return;
    }

    const renderCommentNode = (comment, depth = 0) => {
      const isNested = depth > 0;
      const indentClass = isNested ? 'ml-6 sm:ml-10 border-l-4 border-doodleYellow pl-3 mt-3' : 'bg-white comic-border shadow-comic-sm p-4';
      
      const repliesHTML = (comment.replies && comment.replies.length > 0)
        ? comment.replies.map(rep => renderCommentNode(rep, depth + 1)).join('')
        : '';

      return `
        <div class="${indentClass} transition-all" data-comment-id="${comment.id}">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-7 h-7 rounded-full bg-doodleYellow border border-ink flex items-center justify-center font-comic text-xs">
                ${comment.author[0].toUpperCase()}
              </div>
              <span class="font-doodle font-bold text-sm text-ink">${comment.author}</span>
              <span class="text-[10px] text-gray-400 font-sans">${comment.date}</span>
            </div>
            <button class="btn-upvote-comment text-xs font-bold text-gray-500 hover:text-doodlePink flex items-center gap-1" data-id="${comment.id}">
              <span>▲</span> <span>${comment.upvotes}</span>
            </button>
          </div>
          <p class="font-sans text-sm text-gray-800 mt-2 leading-relaxed">${comment.text}</p>
          
          <div class="mt-2.5 flex items-center gap-3">
            <button class="btn-reply-toggle text-xs font-comic font-bold text-doodleCyan hover:text-cyan-700 uppercase tracking-wider" data-id="${comment.id}">
              💬 Reply
            </button>
          </div>

          <!-- Hidden Nested Reply Input Box -->
          <div class="reply-input-box hidden mt-3 bg-parchment p-3 border-2 border-ink rounded-lg" id="reply-box-${comment.id}">
            <textarea rows="2" placeholder="Replying to ${comment.author}..." 
              class="w-full p-2 border border-ink rounded font-sans text-xs bg-white focus:outline-none focus:ring-2 focus:ring-doodleYellow resize-none reply-textarea"></textarea>
            <div class="flex items-center justify-end gap-2 mt-2">
              <button class="btn-cancel-reply text-xs font-bold text-gray-500 hover:text-ink px-2 py-1">Cancel</button>
              <button class="btn-submit-nested-reply comic-btn bg-doodleYellow hover:bg-amber-400 text-ink px-3 py-1 text-xs font-bold font-comic" data-id="${comment.id}">
                REPLY
              </button>
            </div>
          </div>

          ${repliesHTML}
        </div>
      `;
    };

    this.dom.commentsContainer.innerHTML = post.comments
      .map(c => renderCommentNode(c, 0))
      .join('');

    // Attach listeners for Upvotes & Replies
    this.dom.commentsContainer.querySelectorAll('.btn-upvote-comment').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        this.postService.upvoteComment(this.currentPost.id, id);
        this.soundFX.playPop();
        this.renderComments(this.currentPost);
      });
    });

    this.dom.commentsContainer.querySelectorAll('.btn-reply-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-id');
        const box = document.getElementById(`reply-box-${id}`);
        if (box) box.classList.toggle('hidden');
      });
    });

    this.dom.commentsContainer.querySelectorAll('.btn-cancel-reply').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const box = e.target.closest('.reply-input-box');
        if (box) box.classList.add('hidden');
      });
    });

    this.dom.commentsContainer.querySelectorAll('.btn-submit-nested-reply').forEach(btn => {
      btn.addEventListener('click', () => {
        const parentId = btn.getAttribute('data-id');
        const box = document.getElementById(`reply-box-${parentId}`);
        const textarea = box.querySelector('.reply-textarea');
        const text = textarea.value.trim();
        if (!text) return;

        const author = this.authService.getUserName();
        this.postService.addComment(this.currentPost.id, parentId, text, author);
        this.soundFX.playChime();
        this.renderComments(this.currentPost);
        this.showToast('Nested reply posted! 💬');
      });
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'bg-white px-4 py-2.5 comic-border shadow-comic flex items-center gap-2 text-xs font-bold font-comic tracking-wide pointer-events-auto transform translate-y-2 opacity-0 transition-all duration-200';
    toast.innerHTML = `<span>✨</span><span>${message}</span>`;
    this.dom.toastContainer.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-2', 'opacity-0');
      toast.classList.add('translate-y-0', 'opacity-100');
    });

    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

// Bootstrap Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const postService = new PostService();
  const authService = new AuthService();
  window.doodleSphere = new UIController(postService, authService, soundFX);
});
