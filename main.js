/**
 * DoodleSphere — 3D Animus Void & Historical Codex Social Blogging Platform
 * 
 * Architecture:
 * 1. AnimusSoundFX: Web Audio API sound synthesizer for Animus telemetry & parchment SFX.
 * 2. Post & Comment Service: Memory sequence data store with threaded discussion tree.
 * 3. AuthService: Abstergo Subject session manager with localStorage persistence.
 * 4. ThreeAnimusScene: Pure Three.js 3D engine simulating the Animus loading void,
 *    floating memory fragments, doodle-ink comic textures, and codex transitions.
 * 5. UIController: DOM event coordination, reading overlay, writing modal, and HUD.
 */

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

/* ==========================================================================
   1. ANIMUS & CODEX AUDIO SYNTHESIZER (Web Audio API)
   ========================================================================== */
class AnimusSoundFX {
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

  playSync() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    
    // Animus harmonic synchronization chime
    [440, 659.25, 880, 1318.5].forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.04);
      gain.gain.setValueAtTime(0.08, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.38);
    });
  }

  playParchmentRustle() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    // Filtered noise buffer simulating manuscript paper rustle
    const bufferSize = this.ctx.sampleRate * 0.15;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start(now);
  }

  playGlitch() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.linearRampToValueAtTime(180, now + 0.06);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1200, now);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }
}

const soundFX = new AnimusSoundFX();


/* ==========================================================================
   2. POST & COMMENT SERVICE (Data Store & Threaded Trees)
   ========================================================================== */
const INITIAL_POSTS = [
  {
    id: 'animus-post-1',
    title: 'The Flying Machine & The Venice Canals: Aerodynamic Sketches',
    category: 'CODEX',
    era: 'Renaissance, 1486',
    author: 'Leonardo da Vinci',
    authorBio: 'Master Scribe & Inventor of the Brotherhood',
    readTime: '4 min read',
    date: 'Sequence 04 // Venice',
    stamp: '🦅',
    accentColor: '#00f0ff',
    likes: 128,
    hasLiked: false,
    tags: ['renaissance', 'flight', 'schematics', 'doodles', 'venice'],
    content: `When observation turns to mimicry of the raptor, the human mind reaches beyond terrestrial bounds.

A bird is an instrument working according to mathematical law, which is within the capacity of man to reproduce with all its movements. In this codex folio, notice the ribbed bat-wing struts assembled from cured willow reeds and waxed linen.

By distributing the pilot's weight through the stirrup assembly, the equilibrium shift mimics the eagle's stoop over the Grand Canal. The guards on the Palazzo ducale watched with open mouths as the prototype touched the thermals over Saint Mark's Campanile!

Remember: ink and thought must flow unhindered before wood and metal take flight.`,
    comments: [
      {
        id: 'c-101',
        author: 'Ezio Auditore',
        date: 'Venice Memory Log',
        text: 'The glider performed splendidly over the canal, Leonardo! Though a bit more smoke from the braziers would have helped sustain altitude.',
        upvotes: 42,
        replies: [
          {
            id: 'c-102',
            author: 'Leonardo da Vinci',
            date: 'Workshop Notes',
            text: 'I shall double the wingspan in the next revision, my dear friend. And perhaps reinforce the tail rudder against crossbow bolts!',
            upvotes: 27,
            replies: []
          }
        ]
      },
      {
        id: 'c-103',
        author: 'Shaun Hastings',
        date: 'Modern Animus Annotation',
        text: 'Historians debated for centuries whether this prototype was actually airborne. The genetic memory conclusively proves Ezio took it for a joyride.',
        upvotes: 19,
        replies: []
      }
    ]
  },
  {
    id: 'animus-post-2',
    title: 'Animus Void Architecture: Reconstructing Memory Strands in Three.js',
    category: 'TECH',
    era: 'Modern Era // 2026',
    author: 'Rebecca Crane',
    authorBio: 'Lead Hardware Engineer & Animus Architect',
    readTime: '5 min read',
    date: 'Abstergo Infiltration Log',
    stamp: '⚡',
    accentColor: '#00f0ff',
    likes: 94,
    hasLiked: false,
    tags: ['animus', 'threejs', 'shaders', 'webgl', 'code'],
    content: `Rendering the Animus loading void requires blending stark cybernetic geometry with the organic warmth of human memories.

When Shaun and I upgraded to the Animus 4.38 architecture, we discarded standard linear asset pipelines. Instead, memory fragments exist as floating crystalline polyhedra in an infinite dark obsidian matrix.

Each fragment's surface is procedurally synthesized:
1. An underlying Ben-Day halftone comic dot pattern for tactile printing depth.
2. Hand-inked Renaissance sketches rendered dynamically to 2D HTML5 canvas buffers.
3. Volumetric cyan holographic edge glow that reacts dynamically to raycast hover events.

When a user taps into a memory shard, we don't just switch screens—the 3D camera locks coordinates and unfolds the digital polyhedra into an authentic hand-drawn parchment codex in real-time.`,
    comments: [
      {
        id: 'c-201',
        author: 'Kenji Sato',
        date: '2 hours ago',
        text: 'The procedural canvas-to-texture approach gives such high fidelity without loading megabytes of static texture packs. Brilliant architecture!',
        upvotes: 15,
        replies: []
      }
    ]
  },
  {
    id: 'animus-post-3',
    title: 'The Creed & The Leap of Faith: On Freedom and Moral Dogma',
    category: 'PHILOSOPHY',
    era: 'Masyaf, 1191',
    author: 'Altaïr Ibn-La\'Ahad',
    authorBio: 'Mentor of the Levantine Brotherhood',
    readTime: '6 min read',
    date: 'Masyaf Archives',
    stamp: '🗡️',
    accentColor: '#e5a93b',
    likes: 186,
    hasLiked: false,
    tags: ['philosophy', 'creed', 'masyaf', 'wisdom', 'brotherhood'],
    content: `"Nothing is true, everything is permitted."

To say that nothing is true is to realize that the foundations of society are fragile, and that we must be the shepherds of our own civilization.

To say that everything is permitted is to understand that we are the architects of our actions, and that we must live with their consequences, whether glorious or tragic.

When we leap from the highest minarets into the hay wagons below, it is not merely a display of acrobatics—it is an absolute surrender of fear, trusting our instincts, our brotherhood, and gravity itself.`,
    comments: [
      {
        id: 'c-301',
        author: 'Ezio Auditore',
        date: 'Florence Sequence',
        text: 'Your words echoed in my ears during every trial in Rome and Constantinople, Mentor.',
        upvotes: 38,
        replies: []
      }
    ]
  },
  {
    id: 'animus-post-4',
    title: 'Illuminated Marginalia: The Doodle Art of Historical Manuscripts',
    category: 'CODEX',
    era: 'Bologna, 1502',
    author: 'Niccolò Machiavelli',
    authorBio: 'Diplomat & Philosopher of Florence',
    readTime: '3 min read',
    date: 'Diplomatic Dispatches',
    stamp: '📜',
    accentColor: '#d4af37',
    likes: 72,
    hasLiked: false,
    tags: ['manuscript', 'doodles', 'history', 'art', 'marginalia'],
    content: `Take any sacred treaty or state decree, and look closely at the outer margins. What do you see?

Behind the serious political declarations, scribes scribbled miniature jousting snails, mischievous foxes wearing cardinal robes, and caricatures of neighboring chancellors!

Doodling has always been humanity's subtle rebellion against rigid structure. It represents the unfiltered sparks of creativity that formal text tries so desperately to constrain. Never suppress your margins; that is where genius hides.`,
    comments: []
  },
  {
    id: 'animus-post-5',
    title: 'Piece of Eden #02: Holographic Relic or Ancient Precursor Artifact?',
    category: 'LORE',
    era: 'Precursor Age',
    author: 'Shaun Hastings',
    authorBio: 'Historian, Researcher & Tea Enthusiast',
    readTime: '5 min read',
    date: 'Database Entry 88-B',
    stamp: '🍎',
    accentColor: '#e63946',
    likes: 110,
    hasLiked: false,
    tags: ['eden', 'precursors', 'isu', 'lore', 'mystery'],
    content: `The Apple of Eden isn't magic—it's advanced technology indistinguishable from sorcery to early civilizations.

Constructed from gold-palladium composite alloys with an internal quantum harmonic matrix, the sphere projects optical illusions directly into human neurotransmitter receptors.

In this dossier, I've compiled hand-drawn sketches of its internal glyph rings, deciphered during Desmond's synchronization with Sequence 9. Notice how the fractal concentric circles match Leonardo's Vitruvian proportions!`,
    comments: [
      {
        id: 'c-501',
        author: 'Rebecca Crane',
        date: 'Animus Comm Link',
        text: 'Keep digging through the glyph frequencies, Shaun. There might be an encryption key we can feed directly into the decoding cluster.',
        upvotes: 12,
        replies: []
      }
    ]
  },
  {
    id: 'animus-post-6',
    title: 'Heavy Ink Crosshatching & Halftone Ben-Day Dots in 3D WebGL',
    category: 'TECH',
    era: 'Digital Matrix // 2026',
    author: 'Alex Inkwell',
    authorBio: 'Creative Technologist & Comic Illustrator',
    readTime: '4 min read',
    date: 'Graphic Shaders Lab',
    stamp: '🎨',
    accentColor: '#00f0ff',
    likes: 85,
    hasLiked: false,
    tags: ['shaders', 'webgl', 'illustration', 'comics', 'threejs'],
    content: `How do we marry the hand-drawn grit of comic book ink with the mathematical precision of 3D computer graphics?

In DoodleSphere, we employ an inverted-hull black outline mesh around each memory fragment, paired with procedural Ben-Day dot matrices rendered on the diffuse texture map.

When illuminated by cyan directional keylights, the shadows don't just fade into generic dark gray—they break down into crosshatch lines and ink splatters reminiscent of graphic novels and Renaissance sketches.`,
    comments: []
  }
];

class PostService {
  constructor() {
    const saved = localStorage.getItem('doodlesphere_animus_posts_v2');
    if (saved) {
      try {
        this.posts = JSON.parse(saved);
      } catch (e) {
        this.posts = INITIAL_POSTS;
      }
    } else {
      this.posts = INITIAL_POSTS;
      this.save();
    }
  }

  save() {
    localStorage.setItem('doodlesphere_animus_posts_v2', JSON.stringify(this.posts));
  }

  getAll() {
    return this.posts;
  }

  getById(id) {
    return this.posts.find(p => p.id === id);
  }

  create(postData) {
    const newPost = {
      id: `animus-post-${Date.now()}`,
      title: postData.title,
      category: postData.category || 'CODEX',
      era: postData.era || 'Sequence Memory',
      author: postData.author || 'Brotherhood Initiate',
      authorBio: 'Synchronized Animus User',
      readTime: `${Math.max(2, Math.ceil((postData.content || '').split(' ').length / 100))} min read`,
      date: 'Just Synchronized',
      stamp: postData.stamp || '🦅',
      accentColor: postData.category === 'TECH' ? '#00f0ff' : (postData.category === 'PHILOSOPHY' ? '#e5a93b' : '#d4af37'),
      likes: 1,
      hasLiked: false,
      tags: postData.tags && postData.tags.length > 0 ? postData.tags : ['animus', 'codex', 'doodle'],
      content: postData.content,
      comments: []
    };
    this.posts.unshift(newPost);
    this.save();
    return newPost;
  }

  toggleLike(postId) {
    const post = this.getById(postId);
    if (!post) return null;
    post.hasLiked = !post.hasLiked;
    post.likes += post.hasLiked ? 1 : -1;
    this.save();
    return post;
  }

  addComment(postId, commentText, authorName, parentCommentId = null) {
    const post = this.getById(postId);
    if (!post) return null;

    const newComment = {
      id: `c-${Date.now()}`,
      author: authorName || 'Brotherhood Scout',
      date: 'Moments ago',
      text: commentText,
      upvotes: 0,
      replies: []
    };

    if (!parentCommentId) {
      post.comments.unshift(newComment);
    } else {
      const appendRecursive = (list) => {
        for (const c of list) {
          if (c.id === parentCommentId) {
            c.replies = c.replies || [];
            c.replies.push(newComment);
            return true;
          }
          if (c.replies && appendRecursive(c.replies)) return true;
        }
        return false;
      };
      appendRecursive(post.comments);
    }
    this.save();
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
    this.save();
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
   3. AUTH SERVICE (Abstergo Subject Session)
   ========================================================================== */
class AuthService {
  constructor() {
    this.user = JSON.parse(localStorage.getItem('doodlesphere_animus_user')) || {
      name: 'Ezio Auditore',
      avatar: 'E',
      email: 'ezio@brotherhood.firenze',
      role: 'Master Assassin'
    };
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
      name: username || 'Subject 17',
      avatar: (username || 'S')[0].toUpperCase(),
      email: `${(username || 'subject').toLowerCase().replace(/\s+/g, '')}@abstergo.com`,
      role: 'Synchronized Subject'
    };
    localStorage.setItem('doodlesphere_animus_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  register(username, email) {
    this.user = {
      name: username || 'Recruit Assassin',
      avatar: (username || 'R')[0].toUpperCase(),
      email: email || 'recruit@brotherhood.org',
      role: 'Initiate'
    };
    localStorage.setItem('doodlesphere_animus_user', JSON.stringify(this.user));
    this.notify();
    return this.user;
  }

  logout() {
    this.user = null;
    localStorage.removeItem('doodlesphere_animus_user');
    this.notify();
  }

  isLoggedIn() {
    return !!this.user;
  }

  getUserName() {
    return this.user ? this.user.name : 'Unsynchronized Subject';
  }
}


/* ==========================================================================
   4. THREE.JS 3D SCENE & ANIMUS VOID ENGINE
   ========================================================================== */
class ThreeAnimusScene {
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

    this.postMeshes = []; // { mesh, postData, originalPos, originalRot, codexMaterials, shardMaterials }
    this.hoveredObject = null;
    this.selectedPostMesh = null;
    this.activeFilter = 'ALL';
    this.searchQuery = '';

    // Camera default overview coordinates
    this.defaultCameraPos = new THREE.Vector3(0, 16, 44);
    this.defaultTarget = new THREE.Vector3(0, 0, 0);

    // Camera animation tween state
    this.cameraTween = {
      active: false,
      startTime: 0,
      duration: 1200,
      startPos: new THREE.Vector3(),
      targetPos: new THREE.Vector3(),
      startLookAt: new THREE.Vector3(),
      targetLookAt: new THREE.Vector3(),
      onComplete: null
    };

    this.clock = new THREE.Clock();
    this.init();
  }

  init() {
    // 1. Scene Setup
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06090e); // Deep Obsidian Animus Void
    this.scene.fog = new THREE.FogExp2(0x06090e, 0.012);

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

    // 4. OrbitControls with smooth damping
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxDistance = 85;
    this.controls.minDistance = 6;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.12;
    this.controls.target.copy(this.defaultTarget);

    // 5. Lighting Setup
    this.setupLighting();

    // 6. Animus Void Environment (Infinite Grid, DNA helix, dust particles)
    this.setupAnimusEnvironment();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.renderer.domElement.addEventListener('pointermove', (e) => this.onPointerMove(e));
    this.renderer.domElement.addEventListener('click', (e) => this.onPointerClick(e));

    // 8. Start Render Loop
    this.animate();
  }

  setupLighting() {
    // Ambient cyan luminescence
    const ambientLight = new THREE.AmbientLight(0x0a2238, 1.8);
    this.scene.add(ambientLight);

    // Primary directional Animus spotlight
    const dirLight = new THREE.DirectionalLight(0x00f0ff, 2.2);
    dirLight.position.set(25, 40, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.bias = -0.001;
    this.scene.add(dirLight);

    // Warm golden secondary rim light for historical contrast
    const rimLight = new THREE.DirectionalLight(0xe5a93b, 1.2);
    rimLight.position.set(-30, 20, -25);
    this.scene.add(rimLight);

    // Center holographic point light
    const centerGlow = new THREE.PointLight(0x00f0ff, 2.5, 60);
    centerGlow.position.set(0, 4, 0);
    this.scene.add(centerGlow);
  }

  setupAnimusEnvironment() {
    // 1. Procedural Animus Infinite Memory Grid Floor
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = 1024;
    gridCanvas.height = 1024;
    const gctx = gridCanvas.getContext('2d');

    gctx.fillStyle = '#06090e';
    gctx.fillRect(0, 0, 1024, 1024);

    // High-tech Cyan coordinate grid
    gctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    gctx.lineWidth = 1.5;
    const step = 64;
    for (let x = 0; x <= 1024; x += step) {
      gctx.beginPath();
      gctx.moveTo(x, 0);
      gctx.lineTo(x, 1024);
      gctx.stroke();
    }
    for (let y = 0; y <= 1024; y += step) {
      gctx.beginPath();
      gctx.moveTo(0, y);
      gctx.lineTo(1024, y);
      gctx.stroke();
    }

    // Secondary fine dot grid with Ben-Day comic dots
    gctx.fillStyle = 'rgba(0, 240, 255, 0.4)';
    for (let x = step / 2; x < 1024; x += step) {
      for (let y = step / 2; y < 1024; y += step) {
        gctx.beginPath();
        gctx.arc(x, y, 2.5, 0, Math.PI * 2);
        gctx.fill();
      }
    }

    // Glowing Animus concentric memory rings
    gctx.strokeStyle = 'rgba(0, 240, 255, 0.5)';
    gctx.lineWidth = 2;
    [120, 240, 360, 480].forEach(r => {
      gctx.beginPath();
      gctx.arc(512, 512, r, 0, Math.PI * 2);
      gctx.stroke();
    });

    // Renaissance Assassin compass rose markings in center
    gctx.strokeStyle = 'rgba(229, 169, 59, 0.6)';
    gctx.lineWidth = 3;
    gctx.beginPath();
    gctx.arc(512, 512, 60, 0, Math.PI * 2);
    gctx.stroke();
    gctx.beginPath();
    gctx.moveTo(512, 430); gctx.lineTo(512, 594);
    gctx.moveTo(430, 512); gctx.lineTo(594, 512);
    gctx.stroke();

    const gridTex = new THREE.CanvasTexture(gridCanvas);
    gridTex.wrapS = THREE.RepeatWrapping;
    gridTex.wrapT = THREE.RepeatWrapping;
    gridTex.repeat.set(10, 10);

    const floorGeo = new THREE.PlaneGeometry(180, 180);
    const floorMat = new THREE.MeshStandardMaterial({
      map: gridTex,
      roughness: 0.85,
      metalness: 0.3
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -10;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 2. Animus DNA Data Stream (Double Helix of Floating Light)
    const helixGroup = new THREE.Group();
    const strandCount = 100;
    const helixRadius = 14;
    const helixHeight = 50;

    const dotGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const cyanMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const amberMat = new THREE.MeshBasicMaterial({ color: 0xe5a93b });

    for (let i = 0; i < strandCount; i++) {
      const t = i / strandCount;
      const angle = t * Math.PI * 8;
      const y = t * helixHeight - 10;

      // Strand A
      const dotA = new THREE.Mesh(dotGeo, cyanMat);
      dotA.position.set(Math.cos(angle) * helixRadius, y, Math.sin(angle) * helixRadius);
      helixGroup.add(dotA);

      // Strand B
      const dotB = new THREE.Mesh(dotGeo, amberMat);
      dotB.position.set(Math.cos(angle + Math.PI) * helixRadius, y, Math.sin(angle + Math.PI) * helixRadius);
      helixGroup.add(dotB);
    }
    this.scene.add(helixGroup);
    this.helixGroup = helixGroup;

    // 3. Floating Animus Memory Dust & Doodle Crosshairs
    const particleCount = 140;
    const pGroup = new THREE.Group();
    const pGeos = [
      new THREE.OctahedronGeometry(0.35, 0),
      new THREE.TetrahedronGeometry(0.3, 0),
      new THREE.RingGeometry(0.2, 0.35, 6)
    ];
    const pMats = [
      new THREE.MeshBasicMaterial({ color: 0x00f0ff }),
      new THREE.MeshBasicMaterial({ color: 0xe5a93b }),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    ];

    this.floatingParticles = [];
    for (let i = 0; i < particleCount; i++) {
      const geo = pGeos[Math.floor(Math.random() * pGeos.length)];
      const mat = pMats[Math.floor(Math.random() * pMats.length)];
      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 35 + 5,
        (Math.random() - 0.5) * 80
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      pGroup.add(mesh);
      this.floatingParticles.push({
        mesh,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        floatOffset: Math.random() * Math.PI * 2
      });
    }
    this.scene.add(pGroup);
  }

  /**
   * Generates procedural canvas textures:
   * 1. Animus Cyber-Doodle Shard Texture (Cyan/Ink comic aesthetic)
   * 2. Historical Codex Parchment Texture (Leonardo Da Vinci sketch manuscript)
   */
  generateFragmentTextures(post) {
    // -------------------------------------------------------------
    // A. ANIMUS SHARD TEXTURE (Cyber Void + Comic Doodle Hatching)
    // -------------------------------------------------------------
    const shardCanvas = document.createElement('canvas');
    shardCanvas.width = 512;
    shardCanvas.height = 720;
    const sctx = shardCanvas.getContext('2d');

    // Dark cyber-void background with cyan perimeter
    sctx.fillStyle = '#0a0f18';
    sctx.fillRect(0, 0, 512, 720);

    // Halftone Ben-Day dot pattern
    sctx.fillStyle = 'rgba(0, 240, 255, 0.12)';
    for (let x = 12; x < 512; x += 18) {
      for (let y = 12; y < 720; y += 18) {
        sctx.beginPath();
        sctx.arc(x, y, 2.2, 0, Math.PI * 2);
        sctx.fill();
      }
    }

    // Heavy Ink Border with Tech Brackets
    sctx.strokeStyle = '#00f0ff';
    sctx.lineWidth = 6;
    sctx.strokeRect(16, 16, 480, 688);

    sctx.strokeStyle = '#e5a93b';
    sctx.lineWidth = 3;
    sctx.strokeRect(26, 26, 460, 668);

    // Assassin Brotherhood Crest Doodle Watermark
    sctx.strokeStyle = 'rgba(0, 240, 255, 0.25)';
    sctx.lineWidth = 4;
    sctx.beginPath();
    sctx.moveTo(256, 160);
    sctx.lineTo(170, 360);
    sctx.lineTo(210, 360);
    sctx.lineTo(256, 240);
    sctx.lineTo(302, 360);
    sctx.lineTo(342, 360);
    sctx.closePath();
    sctx.stroke();

    // Category / Memory Sequence Pill
    sctx.fillStyle = '#00f0ff';
    sctx.fillRect(45, 55, 180, 38);
    sctx.fillStyle = '#06090e';
    sctx.font = 'bold 20px "Share Tech Mono", monospace';
    sctx.fillText(`// ${post.category}`, 60, 81);

    // Title (multi-line wrapped)
    sctx.fillStyle = '#ffffff';
    sctx.font = 'bold 36px "Cinzel", serif';
    sctx.textAlign = 'left';

    const words = post.title.split(' ');
    let line = '';
    let curY = 440;
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = sctx.measureText(testLine);
      if (metrics.width > 420 && n > 0) {
        sctx.fillText(line, 48, curY);
        line = words[n] + ' ';
        curY += 46;
      } else {
        line = testLine;
      }
    }
    sctx.fillText(line, 48, curY);

    // Scribe / Author & Stamp
    sctx.fillStyle = '#e5a93b';
    sctx.font = 'bold 22px "Kalam", cursive';
    sctx.fillText(`✍ ${post.author}`, 48, curY + 60);

    sctx.font = '72px serif';
    sctx.textAlign = 'center';
    sctx.fillText(post.stamp || '🦅', 420, 110);

    // -------------------------------------------------------------
    // B. HISTORICAL CODEX PARCHMENT TEXTURE (Leonardo Da Vinci Folio)
    // -------------------------------------------------------------
    const codexCanvas = document.createElement('canvas');
    codexCanvas.width = 512;
    codexCanvas.height = 720;
    const cctx = codexCanvas.getContext('2d');

    // Weathered parchment base
    cctx.fillStyle = '#f7f1df';
    cctx.fillRect(0, 0, 512, 720);

    // Sepia aged paper vignettes
    const radGrad = cctx.createRadialGradient(256, 360, 100, 256, 360, 360);
    radGrad.addColorStop(0, 'rgba(247, 241, 223, 0)');
    radGrad.addColorStop(1, 'rgba(180, 140, 80, 0.45)');
    cctx.fillStyle = radGrad;
    cctx.fillRect(0, 0, 512, 720);

    // Hand-drawn double ink margin lines
    cctx.strokeStyle = '#1c150e';
    cctx.lineWidth = 4;
    cctx.strokeRect(20, 20, 472, 680);
    cctx.lineWidth = 1.5;
    cctx.strokeRect(28, 28, 456, 664);

    // Ruled manuscript sketch lines
    cctx.strokeStyle = 'rgba(75, 56, 39, 0.2)';
    cctx.lineWidth = 1.2;
    for (let y = 140; y < 650; y += 32) {
      cctx.beginPath();
      cctx.moveTo(35, y);
      cctx.lineTo(475, y);
      cctx.stroke();
    }

    // Leonardo's Hand-drawn Flying Machine / Compass doodle sketch in center
    cctx.strokeStyle = '#4b3827';
    cctx.lineWidth = 2;
    cctx.beginPath();
    cctx.arc(256, 260, 70, 0, Math.PI * 2);
    cctx.moveTo(256, 170); cctx.lineTo(256, 350);
    cctx.moveTo(170, 260); cctx.lineTo(342, 260);
    cctx.stroke();

    // Mirror-script Latin / Italian doodle text
    cctx.fillStyle = 'rgba(28, 21, 14, 0.85)';
    cctx.font = 'italic 16px "Kalam", cursive';
    cctx.fillText('~ Cogito ergo virtus in tenebris ~', 130, 380);

    // Red Wax Brotherhood Seal
    cctx.fillStyle = '#9b2226';
    cctx.beginPath();
    cctx.arc(430, 620, 36, 0, Math.PI * 2);
    cctx.fill();
    cctx.strokeStyle = '#1c150e';
    cctx.lineWidth = 3;
    cctx.stroke();
    cctx.fillStyle = '#ffffff';
    cctx.font = 'bold 24px "Cinzel", serif';
    cctx.textAlign = 'center';
    cctx.fillText('⚜', 430, 628);

    // Title on Codex
    cctx.fillStyle = '#1c150e';
    cctx.font = 'bold 30px "Cinzel", serif';
    cctx.textAlign = 'left';
    cctx.fillText(post.title.substring(0, 26) + (post.title.length > 26 ? '...' : ''), 45, 90);

    const shardTex = new THREE.CanvasTexture(shardCanvas);
    const codexTex = new THREE.CanvasTexture(codexCanvas);

    return { shardTex, codexTex };
  }

  /**
   * Creates a 3D Animus Memory Fragment mesh
   */
  createPostMesh(post, position, index) {
    const { shardTex, codexTex } = this.generateFragmentTextures(post);

    // Faceted Memory Fragment Geometry (Box representing codex shard)
    const bookGeo = new THREE.BoxGeometry(4.8, 6.8, 1.0);

    // Shard Materials (Active Animus Cyber style)
    const shardMaterials = [
      new THREE.MeshStandardMaterial({ color: 0x0f1726, roughness: 0.5, metalness: 0.8 }), // Right
      new THREE.MeshStandardMaterial({ color: 0x00f0ff, roughness: 0.3, metalness: 0.9, emissive: 0x00f0ff, emissiveIntensity: 0.2 }), // Spine
      new THREE.MeshStandardMaterial({ color: 0x0f1726, roughness: 0.5 }), // Top
      new THREE.MeshStandardMaterial({ color: 0x0f1726, roughness: 0.5 }), // Bottom
      new THREE.MeshStandardMaterial({ map: shardTex, roughness: 0.4, metalness: 0.2 }), // Front (Shard)
      new THREE.MeshStandardMaterial({ color: 0x070a0f, roughness: 0.8 })  // Back
    ];

    // Codex Materials (Unfolded Historical Manuscript style)
    const codexMaterials = [
      new THREE.MeshStandardMaterial({ color: 0xecdcb9, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0x4b3827, roughness: 0.8 }),
      new THREE.MeshStandardMaterial({ color: 0xecdcb9, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xecdcb9, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ map: codexTex, roughness: 0.9 }),
      new THREE.MeshStandardMaterial({ color: 0xe8dbba, roughness: 0.9 })
    ];

    const bookMesh = new THREE.Mesh(bookGeo, shardMaterials);
    bookMesh.castShadow = true;
    bookMesh.receiveShadow = true;

    // Heavy-ink Cel Outline (Inverted Hull)
    const outlineGeo = new THREE.BoxGeometry(5.08, 7.08, 1.25);
    const outlineMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      side: THREE.BackSide,
      wireframe: false
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
    bookMesh.add(outlineMesh);
    bookMesh.outlineMesh = outlineMesh;

    // Floating Animus Crest / Category Hologram Badge above fragment
    const badgeGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const badgeCanvas = document.createElement('canvas');
    badgeCanvas.width = 128;
    badgeCanvas.height = 128;
    const bctx = badgeCanvas.getContext('2d');
    bctx.fillStyle = 'rgba(10, 15, 24, 0.9)';
    bctx.beginPath();
    bctx.arc(64, 64, 58, 0, Math.PI * 2);
    bctx.fill();
    bctx.strokeStyle = '#00f0ff';
    bctx.lineWidth = 6;
    bctx.stroke();
    bctx.font = '60px serif';
    bctx.textAlign = 'center';
    bctx.fillText(post.stamp || '🦅', 64, 85);

    const badgeTex = new THREE.CanvasTexture(badgeCanvas);
    const badgeMat = new THREE.MeshBasicMaterial({
      map: badgeTex,
      transparent: true,
      side: THREE.DoubleSide
    });
    const badgeMesh = new THREE.Mesh(badgeGeo, badgeMat);
    badgeMesh.position.y = 4.8;
    bookMesh.add(badgeMesh);
    bookMesh.badgeMesh = badgeMesh;

    // Position & Orientation
    bookMesh.position.copy(position);
    const rotY = (index % 2 === 0 ? 0.25 : -0.25) + (Math.random() - 0.5) * 0.15;
    const rotZ = (Math.random() - 0.5) * 0.08;
    bookMesh.rotation.set(0, rotY, rotZ);

    bookMesh.userData = {
      id: post.id,
      postData: post,
      originalPos: position.clone(),
      originalRot: new THREE.Euler(0, rotY, rotZ),
      bobPhase: index * 1.1,
      codexMaterials,
      shardMaterials,
      isCodexMode: false
    };

    this.scene.add(bookMesh);
    return bookMesh;
  }

  /**
   * Populate 3D Scene with initial post fragments arranged in an orbital Animus corridor
   */
  loadPosts(posts) {
    // Clear existing meshes
    this.postMeshes.forEach(item => {
      this.scene.remove(item.mesh);
    });
    this.postMeshes = [];

    const total = posts.length;
    posts.forEach((post, index) => {
      // Cylindrical / orbital corridor formation in the void
      const angle = (index / total) * Math.PI * 2;
      const radius = 18 + (index % 2) * 5;
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const y = (index % 3 - 1) * 4.5 + (Math.random() - 0.5) * 2;

      const pos = new THREE.Vector3(x, y, z);
      const mesh = this.createPostMesh(post, pos, index);

      this.postMeshes.push({
        mesh,
        postData: post,
        originalPos: pos.clone(),
        originalRot: mesh.userData.originalRot.clone()
      });
    });
  }

  /**
   * Dynamically spawns a new post fragment into the Animus Void with particle burst
   */
  addNewPost(post) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 17;
    const x = Math.sin(angle) * radius;
    const z = Math.cos(angle) * radius;
    const y = 0;

    const pos = new THREE.Vector3(x, y, z);
    const mesh = this.createPostMesh(post, pos, this.postMeshes.length);

    this.postMeshes.unshift({
      mesh,
      postData: post,
      originalPos: pos.clone(),
      originalRot: mesh.userData.originalRot.clone()
    });

    // Particle burst at spawn position
    this.createSpawnBurst(pos);

    // Focus camera onto newly synchronized memory
    this.focusPost(mesh);
  }

  createSpawnBurst(position) {
    soundFX.playSync();
    const burstGroup = new THREE.Group();
    const count = 35;
    const geo = new THREE.OctahedronGeometry(0.3, 0);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });

    for (let i = 0; i < count; i++) {
      const p = new THREE.Mesh(geo, mat);
      p.position.copy(position);
      p.userData = {
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        )
      };
      burstGroup.add(p);
    }
    this.scene.add(burstGroup);

    let life = 0;
    const animateBurst = () => {
      life += 0.03;
      burstGroup.children.forEach(p => {
        p.position.addScaledVector(p.userData.vel, 0.03);
        p.scale.multiplyScalar(0.95);
      });
      if (life < 1.0) {
        requestAnimationFrame(animateBurst);
      } else {
        this.scene.remove(burstGroup);
      }
    };
    animateBurst();
  }

  /**
   * Smoothly transitions the 3D fragment between Animus Cyber Shard and Historical Codex
   */
  transitionToCodex(mesh, toCodex = true) {
    if (!mesh || !mesh.userData) return;
    mesh.userData.isCodexMode = toCodex;
    mesh.material = toCodex ? mesh.userData.codexMaterials : mesh.userData.shardMaterials;

    if (mesh.outlineMesh) {
      mesh.outlineMesh.material.color.setHex(toCodex ? 0x1c150e : 0x00f0ff);
    }
    if (toCodex) {
      soundFX.playParchmentRustle();
    }
  }

  /**
   * Raycasting & Pointer Movement
   */
  onPointerMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.checkHover(event.clientX, event.clientY);
  }

  checkHover(clientX, clientY) {
    if (this.cameraTween.active) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactiveMeshes = this.postMeshes
      .filter(item => item.mesh.visible)
      .map(item => item.mesh);

    const intersects = this.raycaster.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      if (this.hoveredObject !== hitMesh) {
        // Reset previous hover
        if (this.hoveredObject && this.hoveredObject !== this.selectedPostMesh) {
          this.setHoverState(this.hoveredObject, false);
        }
        this.hoveredObject = hitMesh;
        this.setHoverState(hitMesh, true);
        soundFX.playGlitch();
      }
      this.onPostHover(hitMesh.userData.postData, clientX, clientY);
      this.renderer.domElement.style.cursor = 'pointer';
    } else {
      if (this.hoveredObject && this.hoveredObject !== this.selectedPostMesh) {
        this.setHoverState(this.hoveredObject, false);
      }
      this.hoveredObject = null;
      this.onPostHover(null, 0, 0);
      this.renderer.domElement.style.cursor = 'grab';
    }
  }

  setHoverState(mesh, isHovered) {
    if (!mesh || !mesh.outlineMesh) return;
    if (isHovered) {
      mesh.outlineMesh.scale.set(1.08, 1.08, 1.15);
      mesh.outlineMesh.material.color.setHex(0xe5a93b); // Glowing Amber on hover
    } else {
      mesh.outlineMesh.scale.set(1.0, 1.0, 1.0);
      mesh.outlineMesh.material.color.setHex(mesh.userData.isCodexMode ? 0x1c150e : 0x00f0ff);
    }
  }

  onPointerClick(event) {
    if (this.cameraTween.active) return;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const interactiveMeshes = this.postMeshes
      .filter(item => item.mesh.visible)
      .map(item => item.mesh);

    const intersects = this.raycaster.intersectObjects(interactiveMeshes, false);

    if (intersects.length > 0) {
      const clickedMesh = intersects[0].object;
      this.focusPost(clickedMesh);
    }
  }

  /**
   * Tight camera focus animation onto fragment & visual transition to historical Codex page
   */
  focusPost(mesh) {
    this.selectedPostMesh = mesh;
    soundFX.playSync();

    // Transition 3D texture to historical parchment Codex
    this.transitionToCodex(mesh, true);

    // Calculate camera target directly in front of the fragment
    const meshPos = mesh.position.clone();
    const forwardVec = new THREE.Vector3(0, 0, 1).applyEuler(mesh.rotation);
    const cameraTargetPos = meshPos.clone().add(forwardVec.clone().multiplyScalar(9.5));
    cameraTargetPos.y += 0.4;

    this.animateCamera(cameraTargetPos, meshPos, 1200, () => {
      // Trigger DOM Reading Overlay
      this.onPostSelected(mesh.userData.postData);
    });
  }

  /**
   * Reset Camera to overview perspective and revert fragment to Animus Shard
   */
  resetView(onComplete = null) {
    if (this.selectedPostMesh) {
      this.transitionToCodex(this.selectedPostMesh, false);
      this.setHoverState(this.selectedPostMesh, false);
      this.selectedPostMesh = null;
    }

    this.animateCamera(this.defaultCameraPos, this.defaultTarget, 1000, onComplete);
  }

  animateCamera(targetPos, targetLookAt, duration = 1100, onComplete = null) {
    this.cameraTween = {
      active: true,
      startTime: performance.now(),
      duration,
      startPos: this.camera.position.clone(),
      targetPos: targetPos.clone(),
      startLookAt: this.controls.target.clone(),
      targetLookAt: targetLookAt.clone(),
      onComplete
    };
    this.controls.enabled = false;
  }

  updateCameraTween(now) {
    if (!this.cameraTween.active) return;

    const elapsed = now - this.cameraTween.startTime;
    const progress = Math.min(elapsed / this.cameraTween.duration, 1.0);
    // Smooth cubic ease out
    const ease = 1 - Math.pow(1 - progress, 3);

    this.camera.position.lerpVectors(this.cameraTween.startPos, this.cameraTween.targetPos, ease);
    this.controls.target.lerpVectors(this.cameraTween.startLookAt, this.cameraTween.targetLookAt, ease);

    if (progress >= 1.0) {
      this.cameraTween.active = false;
      this.controls.enabled = true;
      if (this.cameraTween.onComplete) {
        this.cameraTween.onComplete();
      }
    }
  }

  /**
   * Filter & Search
   */
  applyFilterAndSearch(category, query) {
    this.activeFilter = category;
    this.searchQuery = (query || '').toLowerCase().trim();

    this.postMeshes.forEach(item => {
      const p = item.postData;
      const matchCat = (category === 'ALL' || p.category.toUpperCase() === category.toUpperCase());
      const matchQuery = !this.searchQuery ||
        p.title.toLowerCase().includes(this.searchQuery) ||
        p.content.toLowerCase().includes(this.searchQuery) ||
        p.author.toLowerCase().includes(this.searchQuery) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(this.searchQuery)));

      const isVisible = matchCat && matchQuery;
      item.mesh.visible = isVisible;
    });
  }

  onWindowResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  /**
   * Main Render Loop
   */
  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();
    const now = performance.now();

    // 1. Camera Tweening
    this.updateCameraTween(now);

    // 2. Controls update
    if (this.controls.enabled) {
      this.controls.update();
    }

    // 3. DNA Helix slow rotation
    if (this.helixGroup) {
      this.helixGroup.rotation.y = elapsedTime * 0.15;
    }

    // 4. Floating Dust Particles motion
    if (this.floatingParticles) {
      this.floatingParticles.forEach(p => {
        p.mesh.rotation.x += p.rotSpeed;
        p.mesh.rotation.y += p.rotSpeed;
        p.mesh.position.y += Math.sin(elapsedTime * 1.5 + p.floatOffset) * 0.008;
      });
    }

    // 5. Memory Fragments Floating Bobbing Animation
    this.postMeshes.forEach(item => {
      const mesh = item.mesh;
      if (!mesh.visible) return;

      // Gentle floating bob unless selected in tight focus
      if (mesh !== this.selectedPostMesh) {
        const phase = mesh.userData.bobPhase;
        mesh.position.y = item.originalPos.y + Math.sin(elapsedTime * 1.2 + phase) * 0.35;
        mesh.rotation.y = item.originalRot.y + Math.sin(elapsedTime * 0.8 + phase) * 0.04;
      }

      // Billboard the holographic badge towards camera
      if (mesh.badgeMesh) {
        mesh.badgeMesh.quaternion.copy(this.camera.quaternion);
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}


/* ==========================================================================
   5. UI CONTROLLER (DOM Manipulation & Application Coordination)
   ========================================================================== */
class UIController {
  constructor() {
    this.postService = new PostService();
    this.authService = new AuthService();
    this.scene = null;
    this.currentPost = null;

    this.initScene();
    this.bindEvents();
    this.updateAuthUI();
  }

  initScene() {
    const container = document.getElementById('canvas-container');
    this.scene = new ThreeAnimusScene(
      container,
      (post) => this.openReader(post),
      (post, x, y) => this.updateHoverCard(post, x, y)
    );
    this.scene.loadPosts(this.postService.getAll());
  }

  bindEvents() {
    // 1. Audio Sound Toggle
    const btnSound = document.getElementById('btn-sound-toggle');
    const soundIcon = document.getElementById('sound-icon');
    btnSound.addEventListener('click', () => {
      soundFX.enabled = !soundFX.enabled;
      soundIcon.textContent = soundFX.enabled ? '🔊' : '🔇';
      this.showToast(soundFX.enabled ? 'Animus SFX Activated' : 'Audio Muted');
    });

    // 2. Camera Reset Button
    document.getElementById('btn-reset-view').addEventListener('click', () => {
      soundFX.playClick();
      this.scene.resetView();
      this.closeReader();
    });

    // 3. Category Filter Buttons
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        soundFX.playClick();
        pills.forEach(p => {
          p.classList.remove('bg-animus-cyan', 'text-animus-void', 'font-bold', 'shadow-animus-cyan');
          p.classList.add('text-slate-300');
        });
        pill.classList.add('bg-animus-cyan', 'text-animus-void', 'font-bold', 'shadow-animus-cyan');
        pill.classList.remove('text-slate-300');

        const cat = pill.getAttribute('data-category');
        const query = document.getElementById('search-input').value;
        this.scene.applyFilterAndSearch(cat, query);
      });
    });

    // 4. Search Query Input
    const searchInput = document.getElementById('search-input');
    searchInput.addEventListener('input', (e) => {
      const activePill = document.querySelector('.cat-pill.bg-animus-cyan');
      const cat = activePill ? activePill.getAttribute('data-category') : 'ALL';
      this.scene.applyFilterAndSearch(cat, e.target.value);
    });

    // 5. Reading Overlay Close Button
    document.getElementById('btn-close-reader').addEventListener('click', () => {
      this.closeReader();
    });

    // 6. Like / Wax Seal Reaction Button
    document.getElementById('btn-like-post').addEventListener('click', () => {
      if (!this.currentPost) return;
      soundFX.playClick();
      const updated = this.postService.toggleLike(this.currentPost.id);
      if (updated) {
        document.getElementById('like-count').textContent = updated.likes;
        document.getElementById('like-icon').textContent = updated.hasLiked ? '⚜️' : '🗡️';
        this.showToast(updated.hasLiked ? 'Assassin Wax Seal Affixed!' : 'Seal Removed');
      }
    });

    // 7. Submit Top-Level Comment
    document.getElementById('btn-submit-comment').addEventListener('click', () => {
      this.submitComment();
    });

    // 8. Open & Close Create Post Modal
    document.getElementById('btn-open-create-post').addEventListener('click', () => {
      soundFX.playSync();
      document.getElementById('modal-create-post').classList.remove('hidden');
      document.getElementById('modal-create-post').classList.add('flex');
    });

    const closeCreateModal = () => {
      soundFX.playClick();
      document.getElementById('modal-create-post').classList.add('hidden');
      document.getElementById('modal-create-post').classList.remove('flex');
    };
    document.getElementById('btn-close-create-post').addEventListener('click', closeCreateModal);
    document.getElementById('btn-cancel-create-post').addEventListener('click', closeCreateModal);

    // 9. Handle Create Post Form Submission
    document.getElementById('form-create-post').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createNewPost();
    });

    // 10. Auth Modals (Open/Close, Login, Register, Logout)
    const modalAuth = document.getElementById('modal-auth');
    const openAuth = (tab) => {
      soundFX.playClick();
      modalAuth.classList.remove('hidden');
      modalAuth.classList.add('flex');
      this.switchAuthTab(tab);
    };

    document.getElementById('btn-open-login').addEventListener('click', () => openAuth('login'));
    document.getElementById('btn-open-register').addEventListener('click', () => openAuth('register'));
    document.getElementById('btn-close-auth').addEventListener('click', () => {
      soundFX.playClick();
      modalAuth.classList.add('hidden');
      modalAuth.classList.remove('flex');
    });

    document.getElementById('tab-login').addEventListener('click', () => this.switchAuthTab('login'));
    document.getElementById('tab-register').addEventListener('click', () => this.switchAuthTab('register'));

    document.getElementById('form-login').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      this.authService.login(username);
      modalAuth.classList.add('hidden');
      modalAuth.classList.remove('flex');
      this.showToast(`Subject Authorized: ${this.authService.getUserName()}`);
    });

    document.getElementById('form-register').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      this.authService.register(username, email);
      modalAuth.classList.add('hidden');
      modalAuth.classList.remove('flex');
      this.showToast(`New Assassin Recruited: ${this.authService.getUserName()}`);
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
      soundFX.playClick();
      this.authService.logout();
      this.showToast('Session Desynchronized');
    });

    this.authService.onChange(() => this.updateAuthUI());
  }

  switchAuthTab(tab) {
    soundFX.playClick();
    const tabLogin = document.getElementById('tab-login');
    const tabReg = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formReg = document.getElementById('form-register');

    if (tab === 'login') {
      tabLogin.classList.add('border-animus-cyan', 'text-animus-cyan');
      tabLogin.classList.remove('border-transparent', 'text-slate-400');
      tabReg.classList.remove('border-animus-cyan', 'text-animus-cyan');
      tabReg.classList.add('border-transparent', 'text-slate-400');
      formLogin.classList.remove('hidden');
      formReg.classList.add('hidden');
    } else {
      tabReg.classList.add('border-animus-cyan', 'text-animus-cyan');
      tabReg.classList.remove('border-transparent', 'text-slate-400');
      tabLogin.classList.remove('border-animus-cyan', 'text-animus-cyan');
      tabLogin.classList.add('border-transparent', 'text-slate-400');
      formReg.classList.remove('hidden');
      formLogin.classList.add('hidden');
    }
  }

  updateAuthUI() {
    const loggedIn = this.authService.isLoggedIn();
    const loggedInContainer = document.getElementById('auth-logged-in');
    const loggedOutContainer = document.getElementById('auth-logged-out');
    const commenterPreview = document.getElementById('commenter-name-preview');

    if (loggedIn) {
      loggedInContainer.classList.remove('hidden');
      loggedInContainer.classList.add('flex');
      loggedOutContainer.classList.add('hidden');

      const user = this.authService.user;
      document.getElementById('user-avatar').textContent = user.avatar || 'A';
      document.getElementById('user-display-name').textContent = user.name;
      if (commenterPreview) commenterPreview.textContent = user.name;
    } else {
      loggedInContainer.classList.add('hidden');
      loggedInContainer.classList.remove('flex');
      loggedOutContainer.classList.remove('hidden');
      if (commenterPreview) commenterPreview.textContent = 'Unsynchronized Subject';
    }
  }

  updateHoverCard(post, x, y) {
    const card = document.getElementById('post-hover-card');
    if (!post) {
      card.classList.add('opacity-0');
      card.style.left = '-999px';
      card.style.top = '-999px';
      return;
    }

    document.getElementById('hover-category').textContent = post.category.toUpperCase();
    document.getElementById('hover-title').textContent = post.title;
    document.getElementById('hover-meta').textContent = `By ${post.author} • ${post.readTime}`;

    card.style.left = `${x}px`;
    card.style.top = `${y}px`;
    card.classList.remove('opacity-0');
  }

  /**
   * Generates an authentic Leonardo da Vinci Renaissance Blueprint SVG
   * dynamically tailored to the post's theme and category.
   */
  generateCodexBlueprintSVG(post) {
    const isTech = post.category === 'TECH';
    const isPhilosophy = post.category === 'PHILOSOPHY';
    const isLore = post.category === 'LORE';

    // 1. TECH SCHEMATIC (Leonardo's Optical Refraction, Shaders & Mechanical Gears)
    if (isTech) {
      return `
        <svg viewBox="0 0 600 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="blueprint-dots" width="16" height="16" patternUnits="userSpaceOnUse">
              <circle cx="8" cy="8" r="1.5" fill="#4b3827" fill-opacity="0.25"/>
            </pattern>
          </defs>
          <rect width="600" height="240" fill="url(#blueprint-dots)" />
          
          <!-- Background Assassin Watermark -->
          <path d="M500 40 L450 180 L470 180 L500 110 L530 180 L550 180 Z" fill="#4b3827" fill-opacity="0.08"/>
          
          <!-- Optical Lens & Ray Inversion Scheme -->
          <circle cx="200" cy="120" r="70" fill="none" stroke="#1c150e" stroke-width="2.5" stroke-dasharray="4,2"/>
          <circle cx="200" cy="120" r="55" fill="none" stroke="#4b3827" stroke-width="1.5"/>
          <circle cx="200" cy="120" r="4" fill="#8a181a"/>
          
          <!-- Mechanical Gear Assembly -->
          <g transform="translate(370, 110)">
            <circle cx="0" cy="0" r="45" fill="none" stroke="#1c150e" stroke-width="2.5"/>
            <circle cx="0" cy="0" r="32" fill="none" stroke="#4b3827" stroke-width="1.5"/>
            <circle cx="0" cy="0" r="12" fill="#e5a93b" fill-opacity="0.4" stroke="#1c150e" stroke-width="2"/>
            <!-- Gear Teeth -->
            ${Array.from({ length: 12 }).map((_, i) => {
              const a = (i * 30 * Math.PI) / 180;
              const x1 = Math.cos(a) * 45; const y1 = Math.sin(a) * 45;
              const x2 = Math.cos(a) * 53; const y2 = Math.sin(a) * 53;
              return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#1c150e" stroke-width="3"/>`;
            }).join('')}
          </g>

          <!-- Intersecting Ray Tracing Lines & Angle Arcs -->
          <line x1="40" y1="50" x2="360" y2="190" stroke="#8a181a" stroke-width="1.8" stroke-dasharray="6,3"/>
          <line x1="40" y1="190" x2="360" y2="50" stroke="#8a181a" stroke-width="1.8" stroke-dasharray="6,3"/>
          <line x1="20" y1="120" x2="580" y2="120" stroke="#1c150e" stroke-width="1.2" stroke-opacity="0.5"/>
          
          <!-- Caliper Measurement Marks -->
          <line x1="130" y1="20" x2="270" y2="20" stroke="#1c150e" stroke-width="1.5"/>
          <line x1="130" y1="15" x2="130" y2="25" stroke="#1c150e" stroke-width="1.5"/>
          <line x1="270" y1="15" x2="270" y2="25" stroke="#1c150e" stroke-width="1.5"/>
          <text x="180" y="16" font-family="Share Tech Mono" font-size="10" fill="#1c150e" font-weight="bold">Ø = 14.2 BRACCIA</text>
          
          <!-- Leonardo Italian Mirror Inscription -->
          <text x="40" y="215" font-family="Kalam" font-style="italic" font-size="13" fill="#4b3827">
            "Della prospettiva dei colori et delle linee... l'ombra e la luce in punto"
          </text>
          <text x="440" y="215" font-family="Share Tech Mono" font-size="11" fill="#008080" font-weight="bold">
            [SHADER_MATRIX // OK]
          </text>
        </svg>
      `;
    }

    // 2. CODEX SCHEMATIC (Leonardo's Flying Machine / Ornithopter Wing Breakdown)
    if (!isPhilosophy && !isLore) {
      return `
        <svg viewBox="0 0 600 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <!-- Compass Grid -->
          <circle cx="300" cy="120" r="90" fill="none" stroke="#4b3827" stroke-width="1" stroke-opacity="0.3"/>
          <circle cx="300" cy="120" r="110" fill="none" stroke="#4b3827" stroke-width="1" stroke-dasharray="4,4" stroke-opacity="0.4"/>
          
          <!-- Ornithopter Wing Skeletal Frame -->
          <path d="M 60 180 Q 220 40 420 70 Q 540 90 560 130 Q 420 120 280 160 Z" fill="#ecdcb9" fill-opacity="0.6" stroke="#1c150e" stroke-width="3"/>
          
          <!-- Ribbed Struts & Pulleys -->
          <line x1="160" y1="130" x2="190" y2="60" stroke="#1c150e" stroke-width="2"/>
          <line x1="230" y1="145" x2="270" y2="55" stroke="#1c150e" stroke-width="2"/>
          <line x1="310" y1="140" x2="350" y2="60" stroke="#1c150e" stroke-width="2"/>
          <line x1="390" y1="125" x2="430" y2="72" stroke="#1c150e" stroke-width="2"/>
          <line x1="470" y1="110" x2="500" y2="82" stroke="#1c150e" stroke-width="1.8"/>

          <!-- Tensioner Wires & Pull-cord Ring -->
          <path d="M 60 180 L 300 120 L 560 130" fill="none" stroke="#8a181a" stroke-width="1.8" stroke-dasharray="5,2"/>
          <circle cx="300" cy="120" r="6" fill="#8a181a"/>
          
          <!-- Aerodynamic Vector Arrows -->
          <path d="M 120 50 Q 180 20 240 40" fill="none" stroke="#e5a93b" stroke-width="2" marker-end="url(#arrow)"/>
          <path d="M 280 30 Q 340 10 400 30" fill="none" stroke="#e5a93b" stroke-width="2"/>
          
          <!-- Scribe Notes -->
          <text x="50" y="35" font-family="Cinzel" font-size="12" font-weight="bold" fill="#1c150e">
            FIG. I — ALA DIRETTA CON GIUNTO DI SALICE
          </text>
          <text x="50" y="215" font-family="Kalam" font-style="italic" font-size="13" fill="#4b3827">
            "L'uomo colle sue larghe ale movendo contro l'aria resistera et volera." — Codex fol. 38r
          </text>
        </svg>
      `;
    }

    // 3. PHILOSOPHY SCHEMATIC (The Assassin Hidden Blade & Brotherhood Insignia)
    if (isPhilosophy) {
      return `
        <svg viewBox="0 0 600 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <!-- Background Concentric Circles -->
          <circle cx="300" cy="120" r="85" fill="none" stroke="#4b3827" stroke-width="1.5" stroke-opacity="0.3"/>
          <line x1="100" y1="120" x2="500" y2="120" stroke="#4b3827" stroke-width="1" stroke-opacity="0.3"/>
          <line x1="300" y1="20" x2="300" y2="220" stroke="#4b3827" stroke-width="1" stroke-opacity="0.3"/>

          <!-- Assassin Brotherhood Insignia Crest -->
          <g transform="translate(300, 115) scale(0.95)">
            <path d="M 0 -75 L -55 55 L -30 55 L 0 -5 L 30 55 L 55 55 Z" fill="#8a181a" stroke="#1c150e" stroke-width="2.5"/>
            <path d="M 0 15 L -22 68 L 0 80 L 22 68 Z" fill="#8a181a" stroke="#1c150e" stroke-width="2"/>
          </g>

          <!-- Hidden Blade Mechanism Cross-Section (Forearm Rail & Spring Cam) -->
          <rect x="70" y="105" width="460" height="30" rx="4" fill="#ecdcb9" fill-opacity="0.5" stroke="#1c150e" stroke-width="2.5"/>
          <line x1="120" y1="120" x2="480" y2="120" stroke="#8a181a" stroke-width="3"/>
          
          <!-- Spring Coils -->
          ${Array.from({ length: 14 }).map((_, i) => {
            const x = 140 + i * 18;
            return `<path d="M ${x} 110 Q ${x + 9} 102 ${x + 18} 110 Q ${x + 9} 138 ${x + 18} 130" fill="none" stroke="#1c150e" stroke-width="2"/>`;
          }).join('')}

          <!-- Inscription -->
          <text x="60" y="35" font-family="Cinzel" font-size="13" font-weight="bold" fill="#1c150e">
            PROGETTO LAMA CELATA // MECCANISMO A SCATTO
          </text>
          <text x="60" y="215" font-family="Kalam" font-style="italic" font-size="13" fill="#4b3827">
            "Nulla è reale, ogni cosa è lecita. Agiamo nell'ombra per servire la luce."
          </text>
        </svg>
      `;
    }

    // 4. LORE SCHEMATIC (Piece of Eden Quantum Relic Geometry)
    return `
      <svg viewBox="0 0 600 240" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <!-- Spherical Grid & Orbital Rings -->
        <circle cx="300" cy="120" r="75" fill="#ecdcb9" fill-opacity="0.5" stroke="#1c150e" stroke-width="3"/>
        <ellipse cx="300" cy="120" rx="75" ry="30" fill="none" stroke="#e5a93b" stroke-width="2"/>
        <ellipse cx="300" cy="120" rx="30" ry="75" fill="none" stroke="#e5a93b" stroke-width="2"/>
        <circle cx="300" cy="120" r="45" fill="none" stroke="#8a181a" stroke-width="1.8" stroke-dasharray="4,2"/>
        <circle cx="300" cy="120" r="8" fill="#8a181a"/>

        <!-- Fibonacci Golden Spirals -->
        <path d="M 300 120 Q 340 100 375 120 T 450 170" fill="none" stroke="#1c150e" stroke-width="1.8" stroke-dasharray="3,3"/>
        <path d="M 300 120 Q 260 140 225 120 T 150 70" fill="none" stroke="#1c150e" stroke-width="1.8" stroke-dasharray="3,3"/>

        <!-- Precursor Isu Glyphs -->
        <text x="60" y="35" font-family="Cinzel" font-size="13" font-weight="bold" fill="#1c150e">
          REPERTO ISU #02 // MATRICE QUANTISTICA DEL PRECURSORE
        </text>
        <text x="60" y="215" font-family="Kalam" font-style="italic" font-size="13" fill="#4b3827">
          "Chi possiede la mela, comanda la percezione dell'umanità intera."
        </text>
      </svg>
    `;
  }

  openReader(post) {
    this.currentPost = post;

    // Header & Meta Details
    document.getElementById('reader-category').textContent = `${post.category} // RECONSTRUCTION`;
    document.getElementById('reader-readtime').textContent = post.readTime;
    document.getElementById('reader-title').textContent = post.title;
    document.getElementById('reader-author-name').textContent = post.author;
    document.getElementById('reader-date').textContent = post.date || 'Historical Record';
    document.getElementById('reader-author-avatar').textContent = (post.author || 'A')[0].toUpperCase();

    // Dynamic Sequence and Author Bio
    const seqEl = document.getElementById('reader-sequence');
    if (seqEl) {
      seqEl.textContent = post.era ? `SEQUENCE // ${post.era.toUpperCase()}` : 'HISTORICAL SEQUENCE // RECONSTRUCTED';
    }

    const bioEl = document.getElementById('reader-author-bio');
    if (bioEl) {
      bioEl.textContent = post.authorBio || 'Brotherhood Chronicler';
    }

    const folioEl = document.getElementById('blueprint-folio-title');
    if (folioEl) {
      folioEl.textContent = `FOLIO_${post.category}_${post.id.slice(-4).toUpperCase()} // LEONARDO CODEX`;
    }

    // Populate Dynamic Technical Blueprint Banner SVG
    const blueprintCanvas = document.getElementById('reader-blueprint-canvas');
    if (blueprintCanvas) {
      blueprintCanvas.innerHTML = this.generateCodexBlueprintSVG(post);
    }

    // Like Reaction Wax Seal
    document.getElementById('like-count').textContent = post.likes;

    // Format Editorial Content with Illuminated Renaissance Initial
    const bodyEl = document.getElementById('reader-body');
    bodyEl.innerHTML = '';
    const paragraphs = post.content.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((pText, idx) => {
      const cleanText = pText.trim();
      const p = document.createElement('p');

      if (idx === 0) {
        // Gilded Renaissance Illuminated Drop Cap
        const firstLetter = cleanText.charAt(0);
        const restOfText = cleanText.slice(1);

        p.className = 'leading-relaxed text-codex-ink text-lg sm:text-xl mb-5 font-manuscript';
        p.innerHTML = `
          <span class="inline-block float-left mr-3.5 mb-1 px-3.5 py-1.5 bg-gradient-to-br from-[#8a181a] via-[#6f1315] to-[#45090b] text-[#f7f1df] font-codex font-black text-3xl sm:text-4xl rounded-md border-2 border-[#1c150e] shadow-[3px_3px_0px_#1c150e] leading-none select-none">
            ${firstLetter}
          </span>
          <span>${restOfText}</span>
        `;
      } else if (cleanText.startsWith('"') || cleanText.startsWith('“')) {
        // Illuminated Blockquote Style
        p.className = 'my-6 p-4 rounded-lg bg-amber-50/70 border-l-4 border-[#8a181a] italic font-manuscript text-xl text-amber-950 shadow-sm';
        p.innerHTML = `<em>${cleanText}</em>`;
      } else {
        p.className = 'leading-relaxed text-codex-ink text-lg sm:text-xl mb-4 font-manuscript';
        p.textContent = cleanText;
      }
      bodyEl.appendChild(p);

      // Add a subtle marginalia flourish after paragraph 2
      if (idx === 1 && paragraphs.length > 2) {
        const marginalia = document.createElement('div');
        marginalia.className = 'my-3 py-1.5 px-3 border-y border-dashed border-amber-800/30 flex items-center justify-between text-xs font-doodle text-amber-900/80 bg-amber-100/30 rounded';
        marginalia.innerHTML = `
          <span>✍ Scribe Note: Folio verified against Venice archival rolls</span>
          <span class="font-mono text-[10px] text-amber-950 font-bold">⚜ CODEX ARCHIVE</span>
        `;
        bodyEl.appendChild(marginalia);
      }
    });

    // Render Tags
    const tagsContainer = document.getElementById('reader-tags');
    tagsContainer.innerHTML = '';
    (post.tags || []).forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'px-2.5 py-1 text-xs font-mono font-bold bg-codex-parchmentDark text-codex-ink border border-codex-ink rounded shadow-sm';
      tagSpan.textContent = `#${tag}`;
      tagsContainer.appendChild(tagSpan);
    });

    // Render Comments
    this.renderComments(post.comments || []);

    // Open Drawer Animation
    const overlay = document.getElementById('reader-overlay');
    const panel = document.getElementById('reader-panel');
    overlay.classList.remove('opacity-0', 'pointer-events-none');
    panel.classList.remove('translate-x-full');
  }

  closeReader() {
    const overlay = document.getElementById('reader-overlay');
    const panel = document.getElementById('reader-panel');
    panel.classList.add('translate-x-full');
    overlay.classList.add('opacity-0', 'pointer-events-none');

    // Recenter camera overview in 3D void
    this.scene.resetView();
    this.currentPost = null;
  }

  renderComments(comments) {
    const container = document.getElementById('comments-container');
    container.innerHTML = '';
    const totalCount = this.postService.countTotalComments(comments);
    document.getElementById('comment-total-badge').textContent = totalCount;

    if (!comments || comments.length === 0) {
      container.innerHTML = `
        <div class="text-center py-8 font-doodle text-codex-sepia text-sm">
          No observations recorded yet. Be the first to inscribe your annotations!
        </div>
      `;
      return;
    }

    const renderCommentNode = (c, depth = 0) => {
      const el = document.createElement('div');
      el.className = `p-3 sm:p-4 rounded-lg bg-white/70 border border-codex-sepia/30 shadow-sm ${depth > 0 ? 'ml-4 sm:ml-8 mt-2 border-l-3 border-l-codex-redWax bg-amber-50/50' : 'mb-3'}`;

      el.innerHTML = `
        <div class="flex items-center justify-between mb-1.5">
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-codex-parchmentDark border border-codex-ink flex items-center justify-center font-codex text-xs font-bold text-codex-ink">
              ${(c.author || 'A')[0].toUpperCase()}
            </div>
            <span class="font-codex font-bold text-xs text-codex-ink">${c.author}</span>
            <span class="font-mono text-[10px] text-codex-sepia">• ${c.date}</span>
          </div>
          <button data-comment-id="${c.id}" class="btn-upvote-comment text-xs font-mono text-codex-sepia hover:text-codex-redWax font-bold flex items-center gap-1">
            ▲ <span>${c.upvotes || 0}</span>
          </button>
        </div>
        <p class="text-sm font-sans text-codex-ink pl-8 leading-relaxed">${c.text}</p>
        <div class="flex items-center justify-end mt-2 pt-1 border-t border-codex-sepia/20">
          <button data-parent-id="${c.id}" class="btn-reply-toggle text-[11px] font-animus text-codex-redWax hover:underline font-bold">
            [ ADD RECURSIVE REPLY ]
          </button>
        </div>
        <div id="reply-box-${c.id}" class="hidden mt-2 pt-2">
          <textarea id="reply-input-${c.id}" rows="2" placeholder="Inscribe your reply..."
            class="w-full p-2 border border-codex-ink rounded text-xs font-sans bg-codex-parchment text-codex-ink resize-none"></textarea>
          <div class="flex justify-end gap-2 mt-1">
            <button data-cancel-id="${c.id}" class="btn-cancel-reply text-[10px] font-animus text-codex-sepia px-2 py-1">CANCEL</button>
            <button data-submit-id="${c.id}" class="btn-submit-reply bg-codex-sepia hover:bg-codex-ink text-white text-[10px] font-codex font-bold px-3 py-1 rounded">SEND ✍️</button>
          </div>
        </div>
      `;

      // Upvote action
      el.querySelector('.btn-upvote-comment').addEventListener('click', () => {
        soundFX.playClick();
        this.postService.upvoteComment(this.currentPost.id, c.id);
        this.renderComments(this.currentPost.comments);
      });

      // Reply Toggle
      const replyBox = el.querySelector(`#reply-box-${c.id}`);
      el.querySelector('.btn-reply-toggle').addEventListener('click', () => {
        replyBox.classList.toggle('hidden');
      });
      el.querySelector('.btn-cancel-reply').addEventListener('click', () => {
        replyBox.classList.add('hidden');
      });
      el.querySelector('.btn-submit-reply').addEventListener('click', () => {
        const text = document.getElementById(`reply-input-${c.id}`).value.trim();
        if (!text) return;
        soundFX.playClick();
        const author = this.authService.getUserName();
        this.postService.addComment(this.currentPost.id, text, author, c.id);
        this.renderComments(this.currentPost.comments);
      });

      // Render nested replies recursively
      if (c.replies && c.replies.length > 0) {
        const repliesContainer = document.createElement('div');
        repliesContainer.className = 'space-y-2';
        c.replies.forEach(subComment => {
          repliesContainer.appendChild(renderCommentNode(subComment, depth + 1));
        });
        el.appendChild(repliesContainer);
      }

      return el;
    };

    comments.forEach(c => {
      container.appendChild(renderCommentNode(c, 0));
    });
  }

  submitComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text || !this.currentPost) return;

    soundFX.playClick();
    const author = this.authService.getUserName();
    this.postService.addComment(this.currentPost.id, text, author);
    input.value = '';
    this.renderComments(this.currentPost.comments);
    this.showToast('Codex Annotation Synchronized!');
  }

  createNewPost() {
    const title = document.getElementById('post-input-title').value.trim();
    const category = document.getElementById('post-input-category').value;
    const stamp = document.getElementById('post-input-stamp').value;
    const author = document.getElementById('post-input-author').value.trim() || this.authService.getUserName();
    const tagsInput = document.getElementById('post-input-tags').value.trim();
    const content = document.getElementById('post-input-content').value.trim();

    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    const newPost = this.postService.create({
      title,
      category,
      stamp,
      author,
      tags,
      content
    });

    // Close modal & reset form
    document.getElementById('modal-create-post').classList.add('hidden');
    document.getElementById('modal-create-post').classList.remove('flex');
    document.getElementById('form-create-post').reset();

    // Spawn 3D Fragment in Three.js Animus Void in real time!
    this.scene.addNewPost(newPost);
    this.showToast(`Memory Sequence Injected: "${title.substring(0, 20)}..."`);
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'animus-bracket-box px-4 py-2.5 rounded text-xs font-animus text-animus-cyan border border-animus-cyan shadow-animus-cyan flex items-center gap-2 transform translate-x-full transition-transform duration-300';
    toast.innerHTML = `
      <span class="w-2 h-2 rounded-full bg-animus-cyan animate-ping"></span>
      <span>${message}</span>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.classList.remove('translate-x-full');
    });

    setTimeout(() => {
      toast.classList.add('translate-x-full');
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }
}

// Initialize Application when DOM content is loaded
window.addEventListener('DOMContentLoaded', () => {
  new UIController();
});
