/**
 * DoodleSphere — Colorful & Playful Creative Blogging Platform
 *
 * Architecture:
 * 1. AnimusSoundFX: Web Audio API sound synthesizer.
 * 2. PostService: Data store with threaded comment trees.
 * 3. AuthService: Session manager with localStorage persistence.
 * 4. CardScene: 2D animated card grid replacing the old Three.js 3D engine.
 * 5. UIController: DOM event coordination, reader overlay, modals, HUD.
 */

/* ==========================================================================
   1. SOUND FX (Web Audio API)
   ========================================================================== */
class AnimusSoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  _initCtx() {
    if (!this.ctx && typeof AudioContext !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch(e) {}
  }

  playHover() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.025, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.03);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.03);
    } catch(e) {}
  }

  playSync() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.05);
        osc.stop(this.ctx.currentTime + idx * 0.05 + 0.2);
      });
    } catch(e) {}
  }

  playParchmentRustle() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.18);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(900, this.ctx.currentTime);
      filter.Q.setValueAtTime(2.5, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch(e) {}
  }

  playLike() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const notes = [659.25, 987.77];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.12, this.ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime + idx * 0.08);
        osc.stop(this.ctx.currentTime + idx * 0.08 + 0.3);
      });
    } catch(e) {}
  }

  playUpvote() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch(e) {}
  }

  playGlitch() {
    if (!this.enabled) return;
    this._initCtx();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.setValueAtTime(440, this.ctx.currentTime + 0.03);
      osc.frequency.setValueAtTime(220, this.ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch(e) {}
  }
}

const soundFX = new AnimusSoundFX();


/* ==========================================================================
   2. POST & COMMENT SERVICE
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
    accentColor: '#a855f7',
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
    accentColor: '#2dd4bf',
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
    author: "Altaïr Ibn-La'Ahad",
    authorBio: 'Mentor of the Levantine Brotherhood',
    readTime: '6 min read',
    date: 'Masyaf Archives',
    stamp: '🗡️',
    accentColor: '#fb923c',
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
    accentColor: '#ec4899',
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
    accentColor: '#f43f5e',
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
    accentColor: '#4ade80',
    likes: 85,
    hasLiked: false,
    tags: ['shaders', 'webgl', 'illustration', 'comics', 'threejs'],
    content: `How do we marry the hand-drawn grit of comic book ink with the mathematical precision of 3D computer graphics?

In AnimusCodex, we employ an inverted-hull black outline mesh around each memory fragment, paired with procedural Ben-Day dot matrices rendered on the diffuse texture map.

When illuminated by cyan directional keylights, the shadows don't just fade into generic dark gray—they break down into crosshatch lines and ink splatters reminiscent of graphic novels and Renaissance sketches.`,
    comments: []
  }
];

class PostService {
  constructor() {
    const SCHEMA_VER = 'ds_schema_v3';
    if (localStorage.getItem('doodlesphere_schema') !== SCHEMA_VER) {
      localStorage.removeItem('animuscodex_posts_v2');
      localStorage.removeItem('doodlesphere_animus_posts_v2');
      localStorage.setItem('doodlesphere_schema', SCHEMA_VER);
    }

    const saved = localStorage.getItem('animuscodex_posts_v3') || localStorage.getItem('animuscodex_posts_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(p => p && typeof p === 'object' && p.title && (p.content || p.body))) {
          this.posts = parsed;
        } else {
          console.warn('[PostService] Storage posts invalid or corrupted, resetting to initial defaults.');
          this.posts = INITIAL_POSTS;
          this.save();
        }
      } catch (e) {
        console.warn('[PostService] Error parsing storage posts, resetting to initial defaults:', e);
        this.posts = INITIAL_POSTS;
        this.save();
      }
    } else {
      this.posts = INITIAL_POSTS;
      this.save();
    }
  }

  save() {
    try {
      localStorage.setItem('animuscodex_posts_v3', JSON.stringify(this.posts));
    } catch(e) {}
  }

  getAll() { return this.posts || INITIAL_POSTS; }

  getById(id) { return (this.posts || INITIAL_POSTS).find(p => p.id === id); }

  create(postData) {
    const newPost = {
      id: `animus-post-${Date.now()}`,
      title: postData.title || 'Untitled Post',
      category: postData.category || 'CODEX',
      era: postData.era || 'Sequence Memory',
      author: postData.author || 'DoodleSphere Creator',
      authorBio: 'DoodleSphere Community Member',
      readTime: `${Math.max(2, Math.ceil((postData.content || '').split(' ').length / 100))} min read`,
      date: 'Just Posted',
      stamp: postData.stamp || '🎨',
      accentColor: '#a855f7',
      likes: 1,
      hasLiked: false,
      tags: postData.tags && postData.tags.length > 0 ? postData.tags : ['doodle', 'creative'],
      content: postData.content || '',
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
      author: authorName || 'Anonymous Doodler',
      date: 'Just now',
      text: commentText,
      upvotes: 0,
      replies: []
    };
    if (!parentCommentId) {
      post.comments = post.comments || [];
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
      appendRecursive(post.comments || []);
    }
    this.save();
    return post;
  }

  upvoteComment(postId, commentId) {
    const post = this.getById(postId);
    if (!post || !post.comments) return;
    const findAndUpvote = (list) => {
      for (const c of list) {
        if (c.id === commentId) { c.upvotes = (c.upvotes || 0) + 1; return true; }
        if (c.replies && findAndUpvote(c.replies)) return true;
      }
      return false;
    };
    findAndUpvote(post.comments);
    this.save();
  }

  countTotalComments(comments) {
    if (!Array.isArray(comments)) return 0;
    let count = comments.length;
    for (const c of comments) {
      if (c.replies && c.replies.length > 0) count += this.countTotalComments(c.replies);
    }
    return count;
  }
}


/* ==========================================================================
   3. AUTH SERVICE
   ========================================================================== */
class AuthService {
  constructor() {
    let savedUser = null;
    try {
      savedUser = JSON.parse(
        localStorage.getItem('animuscodex_user') ||
        localStorage.getItem('doodlesphere_animus_user') ||
        'null'
      );
    } catch(e) {}

    this.user = savedUser || {
      name: 'Ezio Auditore',
      avatar: 'E',
      email: 'ezio@doodlesphere.art',
      role: 'Master Doodler'
    };
    this.listeners = [];
  }

  onChange(callback) { this.listeners.push(callback); }
  notify() { this.listeners.forEach(cb => cb(this.user)); }

  login(username) {
    this.user = {
      name: username || 'Doodler',
      avatar: (username || 'D')[0].toUpperCase(),
      email: `${(username || 'doodler').toLowerCase().replace(/\s+/g, '')}@doodlesphere.art`,
      role: 'Doodle Creator'
    };
    try {
      localStorage.setItem('animuscodex_user', JSON.stringify(this.user));
    } catch(e) {}
    this.notify();
    return this.user;
  }

  register(username, email) {
    this.user = {
      name: username || 'New Doodler',
      avatar: (username || 'N')[0].toUpperCase(),
      email: email || 'new@doodlesphere.art',
      role: 'Initiate'
    };
    try {
      localStorage.setItem('animuscodex_user', JSON.stringify(this.user));
    } catch(e) {}
    this.notify();
    return this.user;
  }

  logout() {
    this.user = null;
    try {
      localStorage.removeItem('animuscodex_user');
      localStorage.removeItem('doodlesphere_animus_user');
    } catch(e) {}
    this.notify();
  }

  isLoggedIn() { return !!this.user; }
  getUserName() { return this.user ? this.user.name : 'Anonymous Doodler'; }
}


/* ==========================================================================
   3.5 INTERACTIVE CANVAS BACKGROUND (Particle Cosmos Engine)
   ========================================================================== */
class InteractiveCanvasBackground {
  constructor(container) {
    this.container = container;
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'interactive-bg-canvas';
    this.canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    document.body.prepend(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.particles = [];
    this.shockwaves = [];
    this.mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };

    this.colors = ['#00f0ff', '#ff007f', '#a855f7', '#39ff14', '#ffee00'];

    this._resize();
    this._initParticles();
    this._bindEvents();
    this._animate();
  }

  _resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  _initParticles() {
    const count = Math.floor((this.width * this.height) / 20000);
    this.particles = [];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2.5 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.35 + 0.15,
        pulseSpeed: Math.random() * 0.02 + 0.005,
        shape: Math.random() > 0.75 ? (Math.random() > 0.5 ? 'diamond' : 'ring') : 'circle'
      });
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => this._resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.targetX = e.clientX;
      this.mouse.targetY = e.clientY;
    });
    window.addEventListener('click', (e) => {
      this.addShockwave(e.clientX, e.clientY);
    });
  }

  addShockwave(x, y) {
    this.shockwaves.push({
      x, y, radius: 4, maxRadius: 180, alpha: 0.8,
      color: this.colors[Math.floor(Math.random() * this.colors.length)]
    });
  }

  _animate() {
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.1;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.1;

    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += 5.5;
      sw.alpha *= 0.94;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      this.ctx.strokeStyle = sw.color;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.lineWidth = 2.5;
      this.ctx.shadowBlur = 12;
      this.ctx.shadowColor = sw.color;
      this.ctx.stroke();
      this.ctx.restore();

      if (sw.alpha < 0.02) this.shockwaves.splice(i, 1);
    }

    const len = this.particles.length;
    for (let i = 0; i < len; i++) {
      const p1 = this.particles[i];
      for (let j = i + 1; j < len; j++) {
        const p2 = this.particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 105) {
          const lineAlpha = (1 - dist / 105) * 0.16;
          this.ctx.beginPath();
          this.ctx.moveTo(p1.x, p1.y);
          this.ctx.lineTo(p2.x, p2.y);
          this.ctx.strokeStyle = p1.color;
          this.ctx.globalAlpha = lineAlpha;
          this.ctx.lineWidth = 0.8;
          this.ctx.stroke();
        }
      }
    }

    for (let i = 0; i < len; i++) {
      const p = this.particles[i];

      const mdx = p.x - this.mouse.x;
      const mdy = p.y - this.mouse.y;
      const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 120) {
        const force = (120 - mdist) / 120;
        p.x += (mdx / mdist) * force * 2.5;
        p.y += (mdy / mdist) * force * 2.5;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
      const currentAlpha = Math.max(0.08, Math.min(0.65, p.alpha));

      this.ctx.save();
      this.ctx.globalAlpha = currentAlpha;
      this.ctx.fillStyle = p.color;
      this.ctx.shadowBlur = 10;
      this.ctx.shadowColor = p.color;

      if (p.shape === 'diamond') {
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y - p.size * 1.5);
        this.ctx.lineTo(p.x + p.size * 1.5, p.y);
        this.ctx.lineTo(p.x, p.y + p.size * 1.5);
        this.ctx.lineTo(p.x - p.size * 1.5, p.y);
        this.ctx.closePath();
        this.ctx.fill();
      } else if (p.shape === 'ring') {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size * 1.4, 0, Math.PI * 2);
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1;
        this.ctx.stroke();
      } else {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.ctx.restore();
    }

    requestAnimationFrame(() => this._animate());
  }
}


/* ==========================================================================
   4. CARD SCENE — 2D Animated Card Grid (replaces Three.js 3D scene)
   ========================================================================== */

// Category color palette — Cyberpunk Synthwave Hues
const CAT_COLORS = {
  CODEX:      { bg: 'rgba(0,240,255,0.12)', border: '#00f0ff', badge: 'linear-gradient(135deg,#00f0ff,#0077ff)', text: '#00f0ff', glow: 'rgba(0,240,255,0.4)', tag: '[CODEX_CORE]' },
  TECH:       { bg: 'rgba(255,0,127,0.12)', border: '#ff007f', badge: 'linear-gradient(135deg,#ff007f,#9d4edd)', text: '#ff007f', glow: 'rgba(255,0,127,0.4)', tag: '[NEON_GRID]' },
  LORE:       { bg: 'rgba(168,85,247,0.12)', border: '#a855f7', badge: 'linear-gradient(135deg,#a855f7,#ff007f)', text: '#a855f7', glow: 'rgba(168,85,247,0.4)', tag: '[ARCHIVE_DATA]' },
  PHILOSOPHY: { bg: 'rgba(57,255,20,0.12)',  border: '#39ff14', badge: 'linear-gradient(135deg,#39ff14,#00f0ff)', text: '#39ff14', glow: 'rgba(57,255,20,0.4)', tag: '[QUANTUM_LOGIC]' },
};

function getCatStyle(cat) {
  const key = (cat || 'CODEX').toString().toUpperCase();
  return CAT_COLORS[key] || CAT_COLORS.CODEX;
}

class CardScene {
  constructor(containerElement, onPostSelected, onPostHover) {
    this.container = containerElement;
    this.onPostSelected = onPostSelected;
    this.onPostHover = onPostHover;

    this.posts = [];
    this.activeFilter = 'ALL';
    this.searchQuery = '';

    this.bgCanvas = new InteractiveCanvasBackground(this.container);
    this._buildGrid();
  }

  _buildGrid() {
    this.container.style.cssText = `
      position: absolute; inset: 0;
      overflow-y: auto; overflow-x: hidden;
      padding: 90px 24px 100px;
      display: flex; flex-direction: column; align-items: center;
      z-index: 1; perspective: 1200px;
    `;

    this.grid = document.createElement('div');
    this.grid.id = 'ds-card-grid';
    this.grid.style.cssText = `
      width: 100%; max-width: 1200px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 22px;
    `;
    this.container.appendChild(this.grid);

    this.emptyState = document.createElement('div');
    this.emptyState.style.cssText = `
      display: none; flex-direction: column; align-items: center; justify-content: center;
      gap: 12px; padding: 60px 20px; color: #8b9bb4;
      font-family: 'Rajdhani', sans-serif; font-size: 22px; text-align: center;
    `;
    this.emptyState.innerHTML = `<div style="font-size:48px;">📡</div><div>NO QUANTUM NODES FOUND…<br><span style="font-size:15px;opacity:0.6;font-family:'Fira Code',monospace;">[ERR 404: ARCHIVE_NOT_FOUND]</span></div>`;
    this.container.appendChild(this.emptyState);
  }

  _makeCard(post) {
    if (!post) post = {};
    const cs = getCatStyle(post.category);
    const card = document.createElement('article');
    card.className = 'ds-post-card';
    card.dataset.postId = post.id || `post-${Math.random()}`;

    card.style.cssText = `
      background: rgba(18, 16, 36, 0.82);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid ${cs.border}55;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08);
      padding: 24px;
      cursor: pointer;
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.3s;
      position: relative;
      overflow: hidden;
      transform-style: preserve-3d;
      animation: card-in 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
    `;

    // Top neon accent light line
    const accent = document.createElement('div');
    accent.style.cssText = `
      position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: ${cs.badge}; box-shadow: 0 0 12px ${cs.glow};
    `;
    card.appendChild(accent);

    // Specular shine glare element
    const shine = document.createElement('div');
    shine.style.cssText = `
      position: absolute; inset: 0; pointer-events: none; border-radius: 16px;
      background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.18) 0%, transparent 60%);
      opacity: 0; transition: opacity 0.3s ease; z-index: 2;
    `;
    card.appendChild(shine);

    // Category badge + stamp
    const topRow = document.createElement('div');
    topRow.style.cssText = 'display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;margin-top:4px;';
    topRow.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;">
        <span style="
          display:inline-flex;align-items:center;
          font-family:'Fira Code',monospace;font-size:11px;font-weight:600;
          padding:4px 10px;border-radius:6px;
          background:${cs.bg};color:${cs.text};
          border:1px solid ${cs.border}88;
          box-shadow:0 0 10px ${cs.glow};
          letter-spacing:0.04em;
        ">${cs.tag}</span>
      </div>
      <span style="font-size:22px;line-height:1;filter:drop-shadow(0 0 8px ${cs.glow});transition:transform 0.3s ease;" class="card-stamp">${post.stamp || '⚡'}</span>
    `;
    card.appendChild(topRow);

    // Title in Orbitron font
    const title = document.createElement('h3');
    title.style.cssText = `
      font-family:'Orbitron',sans-serif;font-size:17px;font-weight:700;
      letter-spacing:0.03em;color:#f1f5f9;line-height:1.35;margin-bottom:12px;
      display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;
    `;
    title.textContent = post.title || 'Untitled Story';
    card.appendChild(title);

    // Content preview in Syne font
    const preview = document.createElement('p');
    preview.style.cssText = `
      font-family:'Syne',sans-serif;font-size:13.5px;color:#8b9bb4;
      line-height:1.6;margin-bottom:16px;
      display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;
    `;
    const contentText = (post.content || post.body || '').toString();
    const firstPara = contentText.split('\n\n')[0] || contentText;
    preview.textContent = (firstPara.substring(0, 140) || 'Click to decrypt and read full story…') + (firstPara.length > 140 ? '…' : '');
    card.appendChild(preview);

    // Tags
    const tags = Array.isArray(post.tags) ? post.tags : [];
    if (tags.length > 0) {
      const tagRow = document.createElement('div');
      tagRow.style.cssText = 'display:flex;flex-wrap:wrap;gap:6px;margin-bottom:16px;';
      tags.slice(0, 3).forEach(tag => {
        const t = document.createElement('span');
        t.style.cssText = `
          font-family:'Fira Code',monospace;font-size:11px;
          padding:3px 8px;border-radius:4px;
          background:rgba(255,255,255,0.04);color:#a0aec0;
          border:1px solid rgba(255,255,255,0.08);
          transition:all 0.2s;
        `;
        t.textContent = `#${tag}`;
        tagRow.appendChild(t);
      });
      card.appendChild(tagRow);
    }

    // Footer row: author, read time, likes
    const footer = document.createElement('div');
    footer.style.cssText = `
      display:flex;align-items:center;justify-content:space-between;
      padding-top:14px;border-top:1px solid rgba(255,255,255,0.06);
    `;

    const authorName = post.author || 'Anonymous';
    const avatarLetter = authorName[0].toUpperCase();
    const authorSide = document.createElement('div');
    authorSide.style.cssText = 'display:flex;align-items:center;gap:10px;';
    authorSide.innerHTML = `
      <div style="
        width:30px;height:30px;border-radius:8px;
        background:${cs.badge};box-shadow:0 0 10px ${cs.glow};
        display:flex;align-items:center;justify-content:center;
        font-family:'Orbitron',sans-serif;font-size:12px;font-weight:700;color:#fff;
        flex-shrink:0;
      ">${avatarLetter}</div>
      <div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:15px;font-weight:700;color:#f1f5f9;line-height:1;">${authorName}</div>
        <div style="font-family:'Fira Code',monospace;font-size:10px;color:#8b9bb4;">${post.readTime || '3 min read'}</div>
      </div>
    `;
    footer.appendChild(authorSide);

    const metaSide = document.createElement('div');
    metaSide.style.cssText = 'display:flex;align-items:center;gap:12px;';
    metaSide.innerHTML = `
      <span style="font-family:'Fira Code',monospace;font-size:12px;color:#8b9bb4;display:flex;align-items:center;gap:4px;">
        ⚡ <span class="card-like-count-${post.id}" style="font-weight:600;color:#f1f5f9;">${post.likes || 0}</span>
      </span>
      <span style="font-family:'Fira Code',monospace;font-size:12px;color:#8b9bb4;display:flex;align-items:center;gap:4px;">
        💬 ${(post.comments || []).length}
      </span>
    `;
    footer.appendChild(metaSide);
    card.appendChild(footer);

    // Read post CTA overlay on hover
    const cta = document.createElement('div');
    cta.className = 'card-cta';
    cta.style.cssText = `
      position:absolute;inset:0;border-radius:16px;
      background:rgba(6,6,14,0.75);backdrop-filter:blur(6px);
      display:flex;align-items:center;justify-content:center;
      opacity:0;transition:opacity 0.25s;pointer-events:none;z-index:3;
    `;
    cta.innerHTML = `<span style="
      font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;
      background:${cs.badge};color:#fff;padding:9px 22px;border-radius:30px;
      box-shadow:0 0 20px ${cs.glow};border:1px solid ${cs.border};
      text-transform:uppercase;
    ">DECRYPT ARCHIVE ⚡</span>`;
    card.appendChild(cta);

    // 3D Tilt & Specular Reflection event listeners
    card.addEventListener('mousemove', (e) => {
      soundFX.playHover();
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -12;
      const rotY = ((x - centerX) / centerX) * 12;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(12px) scale(1.025)`;
      card.style.boxShadow = `0 20px 50px rgba(0,0,0,0.7), 0 0 35px ${cs.glow}`;
      card.style.borderColor = cs.border;

      shine.style.opacity = '1';
      shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.22) 0%, transparent 65%)`;
      cta.style.opacity = '1';

      const stampEl = card.querySelector('.card-stamp');
      if (stampEl) stampEl.style.transform = 'scale(1.25) rotate(10deg)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
      card.style.boxShadow = '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)';
      card.style.borderColor = cs.border + '55';
      shine.style.opacity = '0';
      cta.style.opacity = '0';

      const stampEl = card.querySelector('.card-stamp');
      if (stampEl) stampEl.style.transform = 'none';
    });

    card.addEventListener('click', () => {
      soundFX.playClick();
      this.onPostSelected(post);
    });

    return card;
  }

  loadPosts(posts) {
    this.posts = Array.isArray(posts) && posts.length > 0 ? posts : INITIAL_POSTS;
    this._render();
  }

  addNewPost(post) {
    this.posts.unshift(post);
    this._render();
    this.container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  applyFilterAndSearch(category, query) {
    this.activeFilter = category || 'ALL';
    this.searchQuery = (query || '').toLowerCase().trim();
    this._render();
  }

  resetView() {
    this.container.scrollTo({ top: 0, behavior: 'smooth' });
  }

  _render() {
    if (!document.getElementById('ds-card-anim')) {
      const style = document.createElement('style');
      style.id = 'ds-card-anim';
      style.textContent = `
        @keyframes card-in {
          from { opacity: 0; transform: translateY(36px) scale(0.92); filter: blur(6px); }
          to   { opacity: 1; transform: translateY(0) scale(1); filter: blur(0px); }
        }
      `;
      document.head.appendChild(style);
    }

    if (!this.grid) return;
    this.grid.innerHTML = '';

    const postsToRender = Array.isArray(this.posts) && this.posts.length > 0 ? this.posts : INITIAL_POSTS;

    const filtered = postsToRender.filter(p => {
      if (!p) return false;
      const category = (p.category || 'CODEX').toString().toUpperCase();
      const matchCat = this.activeFilter === 'ALL' || category === this.activeFilter.toUpperCase();
      const q = this.searchQuery;
      const titleStr = (p.title || '').toLowerCase();
      const contentStr = (p.content || p.body || '').toLowerCase();
      const authorStr = (p.author || '').toLowerCase();
      const tagsArr = Array.isArray(p.tags) ? p.tags : [];
      const matchQ = !q ||
        titleStr.includes(q) ||
        contentStr.includes(q) ||
        authorStr.includes(q) ||
        tagsArr.some(t => (t || '').toLowerCase().includes(q));
      return matchCat && matchQ;
    });

    if (filtered.length === 0) {
      if (this.emptyState) this.emptyState.style.display = 'flex';
    } else {
      if (this.emptyState) this.emptyState.style.display = 'none';
      filtered.forEach((post, i) => {
        try {
          const card = this._makeCard(post);
          card.style.animationDelay = `${i * 50}ms`;
          this.grid.appendChild(card);
        } catch(err) {
          console.error('[DoodleSphere] Error rendering card:', err);
        }
      });
    }
  }
}


/* ==========================================================================
   5. UI CONTROLLER
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
    this.scene = new CardScene(
      container,
      (post) => this.openReader(post),
      (post, x, y) => this.updateHoverCard(post, x, y)
    );
    this.scene.loadPosts(this.postService.getAll());
  }

  bindEvents() {
    // Document-wide click ripples and spark particle burst
    document.addEventListener('click', (e) => {
      // Don't spawn ripples on form inputs to keep focus crisp
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      const ripple = document.createElement('div');
      ripple.className = 'click-ripple';
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      for (let i = 0; i < 5; i++) {
        const spark = document.createElement('div');
        spark.className = 'spark-particle';
        spark.style.left = `${e.clientX}px`;
        spark.style.top = `${e.clientY}px`;
        const angle = (i * 72 * Math.PI) / 180 + Math.random() * 0.2;
        const dist = Math.random() * 35 + 20;
        spark.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
        spark.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);
        document.body.appendChild(spark);
        setTimeout(() => spark.remove(), 500);
      }
    });

    // 1. Sound Toggle with wave bars state
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        soundFX.enabled = !soundFX.enabled;
        if (soundFX.enabled) {
          soundBtn.classList.remove('muted');
          soundFX.playSync();
          this.showToast('Audio Synth Active 🔊');
        } else {
          soundBtn.classList.add('muted');
          this.showToast('Audio Synth Muted 🔇');
        }
      });
    }

    // 2. Reset View (scroll to top)
    document.getElementById('btn-reset-view').addEventListener('click', () => {
      soundFX.playClick();
      this.scene.resetView();
    });

    // 3. Category Filter Pills
    const pills = document.querySelectorAll('.cat-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        soundFX.playClick();
        pills.forEach(p => p.classList.remove('active-pill'));
        pill.classList.add('active-pill');
        const cat = pill.getAttribute('data-category');
        const query = document.getElementById('search-input').value;
        this.scene.applyFilterAndSearch(cat, query);
      });
    });

    // 4. Search Input
    document.getElementById('search-input').addEventListener('input', (e) => {
      const activePill = document.querySelector('.cat-pill.active-pill');
      const cat = activePill ? activePill.getAttribute('data-category') : 'ALL';
      this.scene.applyFilterAndSearch(cat, e.target.value);
    });

    // 5. Close Reader
    document.getElementById('btn-close-reader').addEventListener('click', () => {
      this.closeReader();
    });

    // 6. Like Button with Heart Pop micro-interaction
    const likeBtn = document.getElementById('btn-like-post');
    if (likeBtn) {
      likeBtn.addEventListener('click', (e) => {
        if (!this.currentPost) return;
        soundFX.playLike();
        const btn = e.currentTarget;
        btn.classList.add('heart-popping');
        setTimeout(() => btn.classList.remove('heart-popping'), 500);

        const updated = this.postService.toggleLike(this.currentPost.id);
        if (updated) {
          document.getElementById('like-count').textContent = updated.likes;

          if (updated.hasLiked) {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '💖 +1';
            const rect = btn.getBoundingClientRect();
            heart.style.left = `${rect.left + 10}px`;
            heart.style.top = `${rect.top - 10}px`;
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 900);
          }

          this.showToast(updated.hasLiked ? '💖 Liked!' : 'Like removed');
          const el = document.querySelector(`.card-like-count-${updated.id}`);
          if (el) el.textContent = updated.likes;
        }
      });
    }

    // 7. Submit Comment
    document.getElementById('btn-submit-comment').addEventListener('click', () => {
      this.submitComment();
    });

    // 8. Open/Close Create Post Modal
    document.getElementById('btn-open-create-post').addEventListener('click', () => {
      soundFX.playSync();
      const m = document.getElementById('modal-create-post');
      m.style.display = 'flex';
    });

    const closeCreateModal = () => {
      soundFX.playClick();
      document.getElementById('modal-create-post').style.display = 'none';
    };
    document.getElementById('btn-close-create-post').addEventListener('click', closeCreateModal);
    document.getElementById('btn-cancel-create-post').addEventListener('click', closeCreateModal);

    // 9. Create Post Form Submit
    document.getElementById('form-create-post').addEventListener('submit', (e) => {
      e.preventDefault();
      this.createNewPost();
    });

    // 10. Auth Modals
    const modalAuth = document.getElementById('modal-auth');
    const openAuth = (tab) => {
      soundFX.playClick();
      modalAuth.style.display = 'flex';
      this.switchAuthTab(tab);
    };

    document.getElementById('btn-open-login').addEventListener('click', () => openAuth('login'));
    document.getElementById('btn-open-register').addEventListener('click', () => openAuth('register'));
    document.getElementById('btn-close-auth').addEventListener('click', () => {
      soundFX.playClick();
      modalAuth.style.display = 'none';
    });

    document.getElementById('tab-login').addEventListener('click', () => this.switchAuthTab('login'));
    document.getElementById('tab-register').addEventListener('click', () => this.switchAuthTab('register'));

    document.getElementById('form-login').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      this.authService.login(username);
      modalAuth.style.display = 'none';
      this.showToast(`Welcome back, ${this.authService.getUserName()} 🎨`);
    });

    document.getElementById('form-register').addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value.trim();
      const email = document.getElementById('reg-email').value.trim();
      this.authService.register(username, email);
      modalAuth.style.display = 'none';
      this.showToast(`Welcome to DoodleSphere, ${this.authService.getUserName()} ✨`);
    });

    document.getElementById('btn-logout').addEventListener('click', () => {
      soundFX.playClick();
      this.authService.logout();
      this.showToast('Signed out. See you soon! 👋');
    });

    this.authService.onChange(() => this.updateAuthUI());

    // Close modals on backdrop click
    document.getElementById('modal-create-post').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
    });
    document.getElementById('modal-auth').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) e.currentTarget.style.display = 'none';
    });
    document.getElementById('reader-overlay').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) this.closeReader();
    });
  }

  switchAuthTab(tab) {
    soundFX.playClick();
    const tabLogin = document.getElementById('tab-login');
    const tabReg   = document.getElementById('tab-register');
    const formLogin = document.getElementById('form-login');
    const formReg   = document.getElementById('form-register');

    if (tab === 'login') {
      tabLogin.classList.add('active-tab');
      tabReg.classList.remove('active-tab');
      formLogin.style.display = 'flex';
      formReg.style.display = 'none';
    } else {
      tabReg.classList.add('active-tab');
      tabLogin.classList.remove('active-tab');
      formReg.style.display = 'flex';
      formLogin.style.display = 'none';
    }
  }

  updateAuthUI() {
    const loggedIn = this.authService.isLoggedIn();
    const loggedInContainer  = document.getElementById('auth-logged-in');
    const loggedOutContainer = document.getElementById('auth-logged-out');
    const commenterPreview   = document.getElementById('commenter-name-preview');

    if (loggedIn) {
      loggedInContainer.style.display = 'flex';
      loggedOutContainer.style.display = 'none';
      const user = this.authService.user;
      document.getElementById('user-avatar').textContent = user.avatar || 'A';
      document.getElementById('user-display-name').textContent = user.name;
      if (commenterPreview) commenterPreview.textContent = user.name;
    } else {
      loggedInContainer.style.display = 'none';
      loggedOutContainer.style.display = 'flex';
      if (commenterPreview) commenterPreview.textContent = 'Anonymous Doodler';
    }
  }

  updateHoverCard(post, x, y) {}

  openReader(post) {
    this.currentPost = post;
    soundFX.playParchmentRustle();

    document.getElementById('reader-category').textContent = post.category;
    document.getElementById('reader-readtime').textContent = post.readTime;
    document.getElementById('reader-title').textContent = post.title;
    document.getElementById('reader-author-name').textContent = post.author;
    document.getElementById('reader-date').textContent = post.date || 'Posted recently';
    document.getElementById('reader-author-avatar').textContent = (post.author || 'A')[0].toUpperCase();
    document.getElementById('like-count').textContent = post.likes;

    const seqEl = document.getElementById('reader-sequence');
    if (seqEl) seqEl.textContent = post.era ? `✨ ${post.era}` : '✨ Creative Sequence';

    const bioEl = document.getElementById('reader-author-bio');
    if (bioEl) bioEl.textContent = post.authorBio || 'DoodleSphere Creator';

    const folioEl = document.getElementById('blueprint-folio-title');
    if (folioEl) folioEl.textContent = `${post.category} • ${post.id.slice(-6).toUpperCase()}`;

    // Blueprint banner with SVG animations
    const blueprintCanvas = document.getElementById('reader-blueprint-canvas');
    if (blueprintCanvas) {
      blueprintCanvas.innerHTML = this.generateBlueprintSVG(post);
    }

    // Article body
    const bodyEl = document.getElementById('reader-body');
    bodyEl.innerHTML = '';
    const cs = getCatStyle(post.category);
    const paragraphs = post.content.split('\n\n').filter(p => p.trim());

    paragraphs.forEach((pText, idx) => {
      const cleanText = pText.trim();
      const p = document.createElement('p');

      if (idx === 0) {
        const firstLetter = cleanText.charAt(0);
        const rest = cleanText.slice(1);
        p.style.cssText = 'margin-bottom:18px;';
        p.innerHTML = `
          <span style="
            display:inline-block;float:left;
            margin:0 12px 4px 0;
            width:52px;height:52px;border-radius:12px;
            background:${cs.badge};
            display:flex;align-items:center;justify-content:center;
            font-family:'Orbitron',sans-serif;font-size:28px;font-weight:900;
            color:#fff;flex-shrink:0;
            box-shadow:0 4px 14px rgba(168,85,247,0.3);
            float:left;
          ">${firstLetter}</span>${rest}`;
      } else if (cleanText.startsWith('"') || cleanText.startsWith('\u201c')) {
        p.style.cssText = `
          margin:18px 0;padding:16px 20px;border-radius:12px;
          background:rgba(168,85,247,0.06);
          border-left:4px solid ${cs.border};
          font-style:italic;color:#5b21b6;font-size:17px;
        `;
        p.textContent = cleanText;
      } else {
        p.style.cssText = 'margin-bottom:16px;';
        p.textContent = cleanText;
      }
      bodyEl.appendChild(p);
    });

    // Tags
    const tagsContainer = document.getElementById('reader-tags');
    tagsContainer.innerHTML = '';
    (post.tags || []).forEach(tag => {
      const tagSpan = document.createElement('span');
      tagSpan.className = 'reader-tag';
      tagSpan.textContent = `#${tag}`;
      tagsContainer.appendChild(tagSpan);
    });

    // Comments
    this.renderComments(post.comments || []);

    // Open panel with spring entrance
    const overlay = document.getElementById('reader-overlay');
    const panel   = document.getElementById('reader-panel');
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = 'auto';
    panel.style.transform = 'translateX(0)';

    // Trigger staggered element animation
    const readerBody = document.querySelector('.reader-body');
    if (readerBody) {
      readerBody.classList.remove('reader-body-animate');
      void readerBody.offsetWidth; // trigger reflow
      readerBody.classList.add('reader-body-animate');
    }
  }

  closeReader() {
    soundFX.playClick();
    const overlay = document.getElementById('reader-overlay');
    const panel   = document.getElementById('reader-panel');
    panel.style.transform = 'translateX(100%)';
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
    this.currentPost = null;
  }

  generateBlueprintSVG(post) {
    const cs = getCatStyle(post.category);
    const isTech = post.category === 'TECH';
    const isPhilo = post.category === 'PHILOSOPHY';
    const isLore  = post.category === 'LORE';

    if (isTech) {
      return `
        <svg viewBox="0 0 600 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="200" fill="#f3eeff"/>
          <g class="bp-spin-cw">
            <circle cx="180" cy="100" r="65" fill="none" stroke="#a855f7" stroke-width="2" stroke-dasharray="8,4" class="bp-dash-animated" opacity="0.6"/>
            <circle cx="180" cy="100" r="42" fill="none" stroke="#ec4899" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.5"/>
          </g>
          <circle cx="180" cy="100" r="8" fill="#a855f7" class="bp-pulse-dot"/>
          <g class="bp-spin-ccw">
            <circle cx="420" cy="100" r="50" fill="none" stroke="#2dd4bf" stroke-width="2" stroke-dasharray="6,3" class="bp-dash-animated" opacity="0.6"/>
            ${Array.from({length:8}).map((_,i)=>{
              const a = i*45*Math.PI/180;
              return `<line x1="${420+Math.cos(a)*42}" y1="${100+Math.sin(a)*42}" x2="${420+Math.cos(a)*54}" y2="${100+Math.sin(a)*54}" stroke="#2dd4bf" stroke-width="3" opacity="0.7"/>`;
            }).join('')}
          </g>
          <line x1="50" y1="100" x2="550" y2="100" stroke="#c4b5fd" stroke-width="1" stroke-dasharray="5,5"/>
          <rect x="0" y="0" width="600" height="4" fill="url(#laser-grad)" class="bp-scan-line"/>
          <defs>
            <linearGradient id="laser-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stop-color="transparent"/>
              <stop offset="50%" stop-color="#00f0ff"/>
              <stop offset="100%" stop-color="transparent"/>
            </linearGradient>
          </defs>
          <text x="40" y="30" font-family="Space Grotesk" font-size="12" font-weight="700" fill="#7c5fad">⚡ TECH SCHEMATIC // ${post.category}</text>
          <text x="40" y="185" font-family="Caveat" font-style="italic" font-size="13" fill="#a78bfa">"${post.title.substring(0,50)}..."</text>
        </svg>
      `;
    }

    if (isPhilo) {
      return `
        <svg viewBox="0 0 600 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="200" fill="#fff9f0"/>
          <g class="bp-spin-cw">
            <circle cx="300" cy="100" r="80" fill="none" stroke="#fb923c" stroke-width="2" stroke-dasharray="6,4" opacity="0.5"/>
            <circle cx="300" cy="100" r="60" fill="none" stroke="#facc15" stroke-width="1" opacity="0.4"/>
          </g>
          <path d="M300 20 L245 150 L265 150 L300 80 L335 150 L355 150 Z" fill="#fb923c" fill-opacity="0.15" stroke="#fb923c" stroke-width="2"/>
          <circle cx="300" cy="100" r="6" fill="#fb923c" class="bp-pulse-dot"/>
          <line x1="100" y1="100" x2="500" y2="100" stroke="#fbbf24" stroke-width="1" stroke-dasharray="5,3" opacity="0.6"/>
          <line x1="300" y1="10" x2="300" y2="190" stroke="#fbbf24" stroke-width="1" stroke-dasharray="5,3" opacity="0.6"/>
          <text x="40" y="30" font-family="Space Grotesk" font-size="12" font-weight="700" fill="#b45309">🏛 PHILOSOPHY // CREED DIAGRAM</text>
          <text x="40" y="185" font-family="Caveat" font-style="italic" font-size="13" fill="#d97706">"Nothing is true, everything is permitted."</text>
        </svg>
      `;
    }

    if (isLore) {
      return `
        <svg viewBox="0 0 600 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <rect width="600" height="200" fill="#fff5f5"/>
          <circle cx="300" cy="100" r="70" fill="none" stroke="#f43f5e" stroke-width="2.5" opacity="0.5"/>
          <g class="bp-spin-cw">
            <ellipse cx="300" cy="100" rx="70" ry="28" fill="none" stroke="#fb923c" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.6"/>
          </g>
          <g class="bp-spin-ccw">
            <ellipse cx="300" cy="100" rx="28" ry="70" fill="none" stroke="#f43f5e" stroke-width="1.5" stroke-dasharray="4,2" opacity="0.6"/>
          </g>
          <circle cx="300" cy="100" r="8" fill="#f43f5e" class="bp-pulse-dot"/>
          <text x="40" y="30" font-family="Space Grotesk" font-size="12" font-weight="700" fill="#9f1239">🍎 LORE // PRECURSOR ARTIFACT SCAN</text>
          <text x="40" y="185" font-family="Caveat" font-style="italic" font-size="13" fill="#e11d48">"Ancient technology beyond human understanding..."</text>
        </svg>
      `;
    }

    // Default (CODEX)
    return `
      <svg viewBox="0 0 600 200" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="200" fill="#f9f5ff"/>
        <g class="bp-spin-cw">
          <circle cx="300" cy="100" r="70" fill="none" stroke="#a855f7" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.5"/>
        </g>
        <line x1="220" y1="20" x2="300" y2="180" stroke="#a855f7" stroke-width="1.5" opacity="0.4"/>
        <line x1="380" y1="20" x2="300" y2="180" stroke="#ec4899" stroke-width="1.5" opacity="0.4"/>
        <line x1="170" y1="100" x2="430" y2="100" stroke="#c4b5fd" stroke-width="1" stroke-dasharray="4,3"/>
        <circle cx="300" cy="100" r="6" fill="#a855f7" class="bp-pulse-dot"/>
        <text x="40" y="30" font-family="Space Grotesk" font-size="12" font-weight="700" fill="#7c5fad">📜 CODEX // HISTORICAL SCHEMATIC</text>
        <text x="40" y="185" font-family="Caveat" font-style="italic" font-size="13" fill="#a78bfa">"${post.title.substring(0,55)}..."</text>
      </svg>
    `;
  }

  renderComments(comments) {
    const container = document.getElementById('comments-container');
    container.innerHTML = '';
    const totalCount = this.postService.countTotalComments(comments);
    document.getElementById('comment-total-badge').textContent = totalCount;

    if (!comments || comments.length === 0) {
      container.innerHTML = `
        <div style="text-align:center;padding:32px 20px;font-family:'Caveat',cursive;color:#a78bfa;font-size:18px;">
          No annotations yet. Be the first to comment! ✍️
        </div>
      `;
      return;
    }

    const renderCommentNode = (c, depth = 0) => {
      const el = document.createElement('div');
      el.style.cssText = `
        padding:14px 16px;border-radius:12px;
        background:${depth > 0 ? 'rgba(168,85,247,0.05)' : '#fff'};
        border:1.5px solid ${depth > 0 ? 'rgba(168,85,247,0.2)' : '#ede8ff'};
        ${depth > 0 ? 'margin-left:20px;margin-top:8px;' : 'margin-bottom:10px;'}
        animation: slide-up-fade 0.35s ease-out both;
      `;

      el.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:8px;">
            <div style="
              width:26px;height:26px;border-radius:8px;
              background:linear-gradient(135deg,#a855f7,#ec4899);
              display:flex;align-items:center;justify-content:center;
              font-family:'Orbitron',sans-serif;font-size:12px;font-weight:800;color:#fff;
            ">${(c.author || 'A')[0].toUpperCase()}</div>
            <span style="font-family:'Orbitron',sans-serif;font-size:13px;font-weight:700;color:#1a1030;">${c.author}</span>
            <span style="font-family:'Fira Code',monospace;font-size:11px;color:#a78bfa;">· ${c.date}</span>
          </div>
          <button data-comment-id="${c.id}" class="btn-upvote-comment" style="
            background:none;border:1.5px solid #ede8ff;border-radius:20px;
            padding:3px 10px;font-family:'Fira Code',monospace;font-size:12px;font-weight:700;
            color:#a78bfa;cursor:pointer;display:flex;align-items:center;gap:4px;transition:all 0.2s;
          ">▲ ${c.upvotes || 0}</button>
        </div>
        <p style="font-family:'Syne',sans-serif;font-size:14px;color:#2e1a5b;line-height:1.6;margin-bottom:8px;padding-left:34px;">${c.text}</p>
        <div style="display:flex;justify-content:flex-end;padding-left:34px;">
          <button data-parent-id="${c.id}" class="btn-reply-toggle" style="
            background:none;border:none;font-family:'Rajdhani',sans-serif;font-size:14px;
            color:#a855f7;cursor:pointer;font-weight:700;
          ">↩ Reply</button>
        </div>
        <div id="reply-box-${c.id}" style="display:none;margin-top:10px;padding-left:34px;">
          <textarea id="reply-input-${c.id}" rows="2" placeholder="Write your reply…" style="
            width:100%;padding:8px 12px;border:2px solid #ede8ff;border-radius:10px;
            background:#faf8ff;font-family:'Syne',sans-serif;font-size:13px;
            color:#1a1030;resize:none;outline:none;
          "></textarea>
          <div style="display:flex;justify-content:flex-end;gap:8px;margin-top:6px;">
            <button data-cancel-id="${c.id}" class="btn-cancel-reply" style="
              background:none;border:1.5px solid #ede8ff;border-radius:20px;
              padding:5px 14px;font-family:'Syne',sans-serif;font-size:12px;color:#a78bfa;cursor:pointer;
            ">Cancel</button>
            <button data-submit-id="${c.id}" class="btn-submit-reply" style="
              background:linear-gradient(135deg,#a855f7,#ec4899);border:none;border-radius:20px;
              padding:5px 16px;font-family:'Orbitron',sans-serif;font-size:12px;font-weight:700;
              color:#fff;cursor:pointer;
            ">Send ✨</button>
          </div>
        </div>
      `;

      // Upvote spring animation
      el.querySelector('.btn-upvote-comment').addEventListener('click', (ev) => {
        soundFX.playUpvote();
        const btn = ev.currentTarget;
        btn.classList.add('upvote-active');
        setTimeout(() => btn.classList.remove('upvote-active'), 450);
        this.postService.upvoteComment(this.currentPost.id, c.id);
        this.renderComments(this.currentPost.comments);
      });

      // Reply toggle
      const replyBox = el.querySelector(`#reply-box-${c.id}`);
      el.querySelector('.btn-reply-toggle').addEventListener('click', () => {
        soundFX.playClick();
        replyBox.style.display = replyBox.style.display === 'none' ? 'block' : 'none';
      });
      el.querySelector('.btn-cancel-reply').addEventListener('click', () => {
        soundFX.playClick();
        replyBox.style.display = 'none';
      });
      el.querySelector('.btn-submit-reply').addEventListener('click', () => {
        const text = document.getElementById(`reply-input-${c.id}`).value.trim();
        if (!text) return;
        soundFX.playClick();
        this.postService.addComment(this.currentPost.id, text, this.authService.getUserName(), c.id);
        this.renderComments(this.currentPost.comments);
      });

      // Nested replies
      if (c.replies && c.replies.length > 0) {
        const repliesWrap = document.createElement('div');
        c.replies.forEach(sub => repliesWrap.appendChild(renderCommentNode(sub, depth + 1)));
        el.appendChild(repliesWrap);
      }

      return el;
    };

    comments.forEach(c => container.appendChild(renderCommentNode(c, 0)));
  }

  submitComment() {
    const input = document.getElementById('comment-input');
    const text = input.value.trim();
    if (!text || !this.currentPost) return;

    soundFX.playClick();
    this.postService.addComment(this.currentPost.id, text, this.authService.getUserName());
    input.value = '';
    this.renderComments(this.currentPost.comments);
    this.showToast('Comment posted ✨');
  }

  createNewPost() {
    const title    = document.getElementById('post-input-title').value.trim();
    const category = document.getElementById('post-input-category').value;
    const stamp    = document.getElementById('post-input-stamp').value;
    const author   = document.getElementById('post-input-author').value.trim() || this.authService.getUserName();
    const tagsInput = document.getElementById('post-input-tags').value.trim();
    const content  = document.getElementById('post-input-content').value.trim();
    const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [];

    const newPost = this.postService.create({ title, category, stamp, author, tags, content });

    document.getElementById('modal-create-post').style.display = 'none';
    document.getElementById('form-create-post').reset();

    this.scene.addNewPost(newPost);
    soundFX.playGlitch();
    this.showToast(`"${title.substring(0, 24)}…" posted! 🚀`);
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.style.cssText = `
      background:rgba(22,22,40,0.95);
      backdrop-filter:blur(16px);
      border:1.5px solid rgba(168,85,247,0.4);
      border-radius:12px;
      padding:12px 20px 14px;
      font-family:'Orbitron',sans-serif;
      font-size:13px;font-weight:700;
      color:#f0effe;
      display:flex;align-items:center;gap:10px;
      box-shadow:0 12px 36px rgba(0,0,0,0.4), 0 0 20px rgba(168,85,247,0.2);
      pointer-events:auto;
      position:relative;
      overflow:hidden;
      transform:translateX(120%);
      transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
    `;
    toast.innerHTML = `
      <span style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#a855f7,#ec4899);flex-shrink:0;"></span>
      <span>${message}</span>
      <div class="toast-progress-bar"></div>
    `;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(0)';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(120%)';
      setTimeout(() => toast.remove(), 350);
    }, 3200);
  }
}

// Boot
function initApp() {
  console.log('[DoodleSphere] Animated startup 🎨⚡');
  new UIController();

  // Custom glowing cursor (desktop only)
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -200, mouseY = -200;
    let ringX  = -200, ringY  = -200;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    let isClicking = false;
    document.addEventListener('mousedown', () => {
      isClicking = true;
      dot.style.width  = '18px';
      dot.style.height = '18px';
      dot.style.background = 'var(--ds-pink)';
      dot.style.boxShadow  = '0 0 28px var(--ds-pink), 0 0 8px #fff';
    });
    document.addEventListener('mouseup', () => {
      isClicking = false;
      dot.style.width  = '12px';
      dot.style.height = '12px';
      dot.style.background = 'var(--ds-teal)';
      dot.style.boxShadow  = '0 0 18px var(--ds-teal), 0 0 6px #fff';
    });

    // Expand ring on interactive elements
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('button, a, [role="button"], .cat-pill, .ds-post-card')) {
        ring.style.width   = '52px';
        ring.style.height  = '52px';
        ring.style.opacity = '0.5';
        ring.style.borderColor = 'rgba(0,240,255,0.7)';
      }
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('button, a, [role="button"], .cat-pill, .ds-post-card')) {
        ring.style.width   = '34px';
        ring.style.height  = '34px';
        ring.style.opacity = '1';
        ring.style.borderColor = 'rgba(168, 85, 247, 0.6)';
      }
    });

    (function animateCursor() {
      // Dot snaps immediately
      dot.style.left = `${mouseX}px`;
      dot.style.top  = `${mouseY}px`;

      // Ring lags behind with lerp
      ringX += (mouseX - ringX) * 0.12;
      ringY += (mouseY - ringY) * 0.12;
      ring.style.left = `${ringX}px`;
      ring.style.top  = `${ringY}px`;

      requestAnimationFrame(animateCursor);
    })();
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
