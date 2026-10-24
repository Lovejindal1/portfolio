/**
 * LOVE KUMAR — INTERACTIVE PORTFOLIO ENGINE
 * Includes: Canvas Constellation, Web Audio FX, Interactive Terminal,
 * System Architecture Simulator, Skill Filters, Theme Switcher & Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  initScrollProgress();
  initCustomCursor();
  initParticleCanvas();
  initTypewriter();
  initThemeSwitcher();
  initSoundEngine();
  initTerminal();
  initArchSimulator();
  initSkillFilters();
  initContactActions();
  initModals();
  initKeyboardShortcuts();
});

/* ==========================================================================
   1. SCROLL PROGRESS BAR
   ========================================================================== */
function initScrollProgress() {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    progressBar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ==========================================================================
   2. CUSTOM CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.custom-cursor-dot');
  const ring = document.querySelector('.custom-cursor-ring');
  if (!dot || !ring) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Add hover effect on interactives
  const interactives = document.querySelectorAll('a, button, input, textarea, .quick-chip, .node-group, .filter-btn');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================================
   3. INTERACTIVE PARTICLE CANVAS CONSTELLATION
   ========================================================================== */
function initParticleCanvas() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particleCount = Math.min(Math.floor(window.innerWidth / 18), 70);
  const particles = [];
  const mouse = { x: null, y: null, maxDist: 130 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.8
    });
  }

  function getThemeColor() {
    const theme = document.body.getAttribute('data-theme') || 'cyan';
    if (theme === 'purple') return '183, 110, 255';
    if (theme === 'emerald') return '16, 185, 129';
    if (theme === 'amber') return '245, 158, 11';
    return '0, 242, 254';
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const colorStr = getThemeColor();

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Mouse attraction / bounce
      if (mouse.x !== null) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.maxDist) {
          const force = (mouse.maxDist - dist) / mouse.maxDist;
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${colorStr}, 0.5)`;
      ctx.fill();

      // Connect particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${colorStr}, ${0.2 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(render);
  }
  render();
}

/* ==========================================================================
   4. DYNAMIC TYPEWRITER
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const roles = [
    "Backend & Microservices Architect",
    "Real-Time Systems & WebSocket Specialist",
    "Distributed Systems Engineer (RabbitMQ & BullMQ)",
    "Competitive Programmer (450+ LeetCode)",
    "Docker Sandboxing & Cloud Builder"
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2200; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      typingSpeed = 400; // Pause before typing new text
    }

    setTimeout(type, typingSpeed);
  }
  type();
}

/* ==========================================================================
   5. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  const themeMenu = document.getElementById('theme-menu');
  const themeOptions = document.querySelectorAll('.theme-option');

  const savedTheme = localStorage.getItem('love_portfolio_theme') || 'cyan';
  setTheme(savedTheme);

  if (themeBtn && themeMenu) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      themeMenu.classList.toggle('show');
    });

    document.addEventListener('click', () => {
      themeMenu.classList.remove('show');
    });
  }

  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const theme = opt.getAttribute('data-theme-name');
      setTheme(theme);
      playSound('chime');
      showToast(`Switched theme to ${theme.toUpperCase()}`);
      if (themeMenu) themeMenu.classList.remove('show');
    });
  });

  function setTheme(name) {
    document.body.setAttribute('data-theme', name);
    localStorage.setItem('love_portfolio_theme', name);
  }
}

/* ==========================================================================
   6. WEB AUDIO FX SYNTHESIZER
   ========================================================================== */
let audioCtx = null;
let soundEnabled = true;

function initSoundEngine() {
  const soundBtn = document.getElementById('sound-toggle-btn');
  const savedState = localStorage.getItem('love_portfolio_sound');
  if (savedState !== null) {
    soundEnabled = savedState === 'true';
  }

  updateSoundBtnUI();

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      localStorage.setItem('love_portfolio_sound', soundEnabled);
      updateSoundBtnUI();
      if (soundEnabled) {
        playSound('chime');
        showToast('Sound effects enabled 🔊');
      } else {
        showToast('Sound effects muted 🔇');
      }
    });
  }

  function updateSoundBtnUI() {
    if (!soundBtn) return;
    if (soundEnabled) {
      soundBtn.innerHTML = '🔊';
      soundBtn.title = 'Mute sound effects';
      soundBtn.classList.add('active');
    } else {
      soundBtn.innerHTML = '🔇';
      soundBtn.title = 'Enable sound effects';
      soundBtn.classList.remove('active');
    }
  }
}

function playSound(type = 'click') {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'chime') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(1040, now + 0.12);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    } else if (type === 'packet') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    }
  } catch (err) {
    // Audio context may require user gesture on some browsers
  }
}

/* ==========================================================================
   7. INTERACTIVE CLI TERMINAL
   ========================================================================== */
function initTerminal() {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const quickChips = document.querySelectorAll('.quick-chip');
  if (!terminalBody || !terminalInput) return;

  const commandHistory = [];
  let historyIdx = -1;

  const commands = {
    help: () => `Available commands:
  <span style="color:var(--accent-primary)">about</span>       - Brief overview & bio
  <span style="color:var(--accent-primary)">skills</span>      - Technical stack breakdown
  <span style="color:var(--accent-primary)">projects</span>    - Featured high-impact projects
  <span style="color:var(--accent-primary)">stats</span>       - DSA, LeetCode & academics stats
  <span style="color:var(--accent-primary)">arch</span>        - Microservices architecture details
  <span style="color:var(--accent-primary)">contact</span>     - Email, phone, socials & resume
  <span style="color:var(--accent-primary)">sudo hire</span>   - Fast-track recruiter action!
  <span style="color:var(--accent-primary)">clear</span>       - Clear terminal window`,

    about: () => `Love Kumar (Love Jindal)
CS Undergrad @ IIIT Una (2024 - 2028) | CGPA: 8.32
Specializing in Backend Engineering, Real-Time Distributed Systems,
Microservices Architecture, Docker Containerization & Event-Driven pipelines.`,

    skills: () => `⚡ Languages: C++, JavaScript (ES6+), Python, SQL
⚡ Backend: Node.js, Express.js, Socket.io, WebSockets, REST APIs, JWT
⚡ Distributed: RabbitMQ, BullMQ, Redis, Microservices, API Gateway
⚡ DevOps & Cloud: Docker, AWS (EC2, RDS), Git, Linux, Vercel
⚡ Core CS: DSA (450+ LeetCode), OS, DBMS, Computer Networks, AI`,

    projects: () => `1. <b>CodeForge</b>: Real-Time CP Platform (BullMQ + Redis + Docker sandboxing + Socket.io)
2. <b>Airline Booking Microservices</b>: 4 decoupled services + RabbitMQ + API Gateway + AWS EC2
3. <b>RoamHaven</b>: Full-Stack Vacation Rental & Geo-Discovery (Mapbox + Cloudinary + RBAC)
Type <span style="color:var(--accent-primary)">'arch'</span> or scroll down to interact with live architecture!`,

    stats: () => `🏆 450+ DSA Problems Solved on LeetCode (300+ Medium)
🏆 Top 2% in JEE Mains 2024 (1.4M+ Aspirants)
🏆 1st Place - PixelForge UI/UX Competition (IIIT Una)
🏆 Technical & Research Head @ Force Coding Club (IIIT Una)`,

    arch: () => `Architecture modes available:
1. CodeForge Sandbox: Asynchronous BullMQ execution in isolated Docker containers with memory/CPU limits.
2. Airline Microservices: RabbitMQ event broker coordinating Auth, Flights, Bookings & Nodemailer cron.`,

    contact: () => `📧 Email: <a href="mailto:lkjindal123@gmail.com" style="color:var(--accent-primary)">lkjindal123@gmail.com</a>
📱 Phone: +91-7082406330
🔗 LinkedIn: linkedin.com/in/love-kumar-jindal
💻 GitHub: github.com/Lovejindal1
⚡ LeetCode: leetcode.com/u/JINDALSAHAAB`,

    'sudo hire': () => `<span style="color:#10b981; font-weight:bold;">ACCESS GRANTED:</span> Love Kumar is ready to deliver top-tier backend & distributed system solutions!
Direct calendar invite sent to recruiter pipeline. Mail: <a href="mailto:lkjindal123@gmail.com?subject=Opportunity%20Discussion" style="color:var(--accent-primary)">lkjindal123@gmail.com</a>`,

    hire: () => `Use command <span style="color:var(--accent-primary)">'sudo hire'</span> for privileged recruiter access!`,

    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const input = terminalInput.value.trim();
      if (!input) return;

      commandHistory.push(input);
      historyIdx = commandHistory.length;
      executeCommand(input);
      terminalInput.value = '';
    } else if (e.key === 'ArrowUp') {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx];
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  quickChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      executeCommand(cmd);
      playSound('click');
    });
  });

  function executeCommand(rawCmd) {
    playSound('click');
    const cmd = rawCmd.toLowerCase();

    // Create command echo
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-output';
    cmdLine.innerHTML = `
      <div class="terminal-command-line">
        <span class="terminal-prompt-symbol">guest@love-portfolio:~$</span> ${escapeHTML(rawCmd)}
      </div>
    `;

    terminalBody.appendChild(cmdLine);

    if (cmd === 'clear') {
      commands.clear();
      return;
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = 'terminal-result';

    if (commands[cmd]) {
      resultDiv.innerHTML = commands[cmd]();
    } else {
      resultDiv.innerHTML = `command not found: "${escapeHTML(rawCmd)}". Type <span style="color:var(--accent-primary)">'help'</span> for list of commands.`;
    }

    terminalBody.appendChild(resultDiv);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
}

/* ==========================================================================
   8. INTERACTIVE SYSTEM ARCHITECTURE SIMULATOR
   ========================================================================== */
const ARCH_DATA = {
  codeforge: {
    title: "CodeForge — Sandboxed Real-Time Execution Engine",
    desc: "Docker container sandboxing with BullMQ job queues, Redis penalty leaderboards & live WebSocket telemetry.",
    nodes: [
      { id: "client", name: "Client Browser", sub: "React + Socket.io", icon: "💻", badge: "Live Duel" },
      { id: "gateway", name: "Express Gateway", sub: "28+ REST / 7 WS", icon: "🌐", badge: "Auth & Rate Limit" },
      { id: "queue", name: "BullMQ & Redis", sub: "Job Orchestrator", icon: "⚡", badge: "Prioritized" },
      { id: "sandbox", name: "Docker Sandbox", sub: "C++ Runner Isolation", icon: "🐳", badge: "cgroup capped" },
      { id: "telemetry", name: "Socket Telemetry", sub: "Redis Leaderboard", icon: "🏆", badge: "±200 ELO Match" }
    ],
    logs: [
      "[INFO] Socket.io matched user Alex_K (2150 ELO) vs Ivan_P (2120 ELO)",
      "[QUEUE] BullMQ assigned code submission to worker queue #3",
      "[DOCKER] Spawning isolated sandbox container (mem_limit: 256MB, cpu_quota: 0.5)",
      "[RUNNER] Test cases 4/4 PASSED in 42ms with memory usage 14.2MB",
      "[CACHE] Redis updated ICPC penalty leaderboard & broadcasted state"
    ]
  },
  airline: {
    title: "Airline Booking System — Decoupled Microservices",
    desc: "Independent microservices connected via RabbitMQ message broker with centralized API Gateway on AWS EC2.",
    nodes: [
      { id: "client", name: "Client Request", sub: "Mobile / Web Client", icon: "📱", badge: "HTTPS / TLS" },
      { id: "gateway", name: "API Gateway", sub: "Routing & JWT Guard", icon: "🛡️", badge: "Service Discovery" },
      { id: "services", name: "Core Services", sub: "Auth / Flights / Booking", icon: "⚙️", badge: "MySQL & Sequelize" },
      { id: "broker", name: "RabbitMQ Broker", sub: "Exchange & Queue Bus", icon: "🐇", badge: "Event-Driven" },
      { id: "worker", name: "Notification Worker", sub: "Cron & Nodemailer", icon: "✉️", badge: "AWS EC2" }
    ],
    logs: [
      "[GATEWAY] Routing POST /api/v1/bookings with JWT authentication token",
      "[BOOKING] Reserving Seat 14A on Flight AI-204 (status: PENDING)",
      "[RABBITMQ] Published 'booking.created' event to exchange 'booking_events'",
      "[CONSUMER] Notification service consumed event & triggered Nodemailer template",
      "[CRON] Automated 24h pre-flight check-in reminder scheduled successfully"
    ]
  }
};

let currentArchMode = 'codeforge';

function initArchSimulator() {
  const container = document.getElementById('flow-diagram-wrapper');
  const logContainer = document.getElementById('arch-log-text');
  const triggerBtn = document.getElementById('trigger-packet-btn');
  const tabBtns = document.querySelectorAll('.arch-tab-btn');
  if (!container || !triggerBtn) return;

  function renderArchitecture(mode) {
    currentArchMode = mode;
    const data = ARCH_DATA[mode];
    container.innerHTML = '';

    data.nodes.forEach((node, idx) => {
      const nodeGroup = document.createElement('div');
      nodeGroup.className = 'node-group';
      nodeGroup.setAttribute('data-node-id', node.id);

      nodeGroup.innerHTML = `
        <div class="arch-node">
          <span class="node-badge">${node.badge}</span>
          <div class="node-icon">${node.icon}</div>
          <div class="node-name">${node.name}</div>
          <div class="node-sub">${node.sub}</div>
        </div>
      `;

      nodeGroup.addEventListener('click', () => {
        playSound('click');
        highlightNode(nodeGroup, node);
      });

      container.appendChild(nodeGroup);

      if (idx < data.nodes.length - 1) {
        const wire = document.createElement('div');
        wire.className = 'wire-connector';
        wire.innerHTML = `<div class="wire-packet" id="packet-${idx}"></div>`;
        container.appendChild(wire);
      }
    });

    logContainer.textContent = data.logs[0];
  }

  function highlightNode(nodeGroup, node) {
    document.querySelectorAll('.node-group').forEach(ng => ng.classList.remove('active'));
    nodeGroup.classList.add('active');
    showToast(`Inspecting: ${node.name} (${node.sub})`);
  }

  triggerBtn.addEventListener('click', () => {
    playSound('packet');
    triggerPacketFlow();
  });

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.getAttribute('data-arch-mode');
      playSound('chime');
      renderArchitecture(mode);
    });
  });

  function triggerPacketFlow() {
    const packets = container.querySelectorAll('.wire-packet');
    const logs = ARCH_DATA[currentArchMode].logs;

    packets.forEach((pkt, i) => {
      pkt.classList.remove('animating');
      setTimeout(() => {
        pkt.classList.add('animating');
        playSound('packet');
        if (logs[i + 1]) {
          logContainer.textContent = logs[i + 1];
        }
      }, i * 350);
    });

    setTimeout(() => {
      showToast('Distributed transaction simulation completed successfully (200 OK)');
    }, packets.length * 350 + 200);
  }

  renderArchitecture('codeforge');
}

/* ==========================================================================
   9. SKILL CATEGORY FILTERS
   ========================================================================== */
function initSkillFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   10. CONTACT ACTIONS & TOASTS
   ========================================================================== */
function initContactActions() {
  const copyEmailBtns = document.querySelectorAll('.copy-email-btn');
  const copyPhoneBtns = document.querySelectorAll('.copy-phone-btn');
  const contactForm = document.getElementById('portfolio-contact-form');

  copyEmailBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('lkjindal123@gmail.com').then(() => {
        playSound('chime');
        showToast('Email copied to clipboard: lkjindal123@gmail.com 📋');
      });
    });
  });

  copyPhoneBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText('+917082406330').then(() => {
        playSound('chime');
        showToast('Phone number copied: +91-7082406330 📱');
      });
    });
  });

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('form-name')?.value || 'Guest';
      const email = document.getElementById('form-email')?.value || '';
      const message = document.getElementById('form-message')?.value || '';

      playSound('chime');
      showToast(`Thanks ${name}! Launching your email client...`);

      const mailtoLink = `mailto:lkjindal123@gmail.com?subject=Portfolio%20Inquiry%20from%20${encodeURIComponent(name)}&body=${encodeURIComponent(message + '\n\nSender Email: ' + email)}`;
      setTimeout(() => {
        window.location.href = mailtoLink;
      }, 600);
      contactForm.reset();
    });
  }
}

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>⚡</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

/* ==========================================================================
   11. MODALS & RESUME PREVIEW
   ========================================================================== */
function initModals() {
  const resumeModal = document.getElementById('resume-modal');
  const openResumeBtns = document.querySelectorAll('.open-resume-btn');
  const closeBtns = document.querySelectorAll('.modal-close-btn');
  const mobileToggle = document.getElementById('mobile-menu-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const mobileClose = document.getElementById('mobile-drawer-close');

  openResumeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      playSound('chime');
      if (resumeModal) resumeModal.classList.add('active');
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      playSound('click');
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Mobile drawer
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      playSound('click');
      mobileDrawer.classList.add('open');
    });
  }
  if (mobileClose && mobileDrawer) {
    mobileClose.addEventListener('click', () => {
      playSound('click');
      mobileDrawer.classList.remove('open');
    });
  }
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    });
  });
}

/* ==========================================================================
   12. KEYBOARD SHORTCUTS
   ========================================================================== */
function initKeyboardShortcuts() {
  window.addEventListener('keydown', (e) => {
    // Avoid triggering when user is typing in form or terminal
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      if (e.key === 'Escape') {
        document.activeElement.blur();
      }
      return;
    }

    if (e.key === 't' || e.key === 'T') {
      const termInput = document.getElementById('terminal-input');
      if (termInput) {
        termInput.focus();
        showToast('Focused interactive terminal ⌨️');
      }
    } else if (e.key === 'p' || e.key === 'P') {
      const projectsSec = document.getElementById('projects');
      if (projectsSec) projectsSec.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'a' || e.key === 'A') {
      const archSec = document.getElementById('architecture');
      if (archSec) archSec.scrollIntoView({ behavior: 'smooth' });
    } else if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
      const mobileDrawer = document.getElementById('mobile-drawer');
      if (mobileDrawer) mobileDrawer.classList.remove('open');
    }
  });
}


// Resume Modal Tab Handler
(function setupResumeTabs() {
  const tabPdf = document.getElementById('tab-pdf-view');
  const tabTex = document.getElementById('tab-latex-view');
  const pdfWrapper = document.getElementById('pdf-view-wrapper');
  const texWrapper = document.getElementById('latex-view-wrapper');
  const copyTexBtn = document.getElementById('btn-copy-latex');
  const dlPdfBtn = document.getElementById('modal-dl-pdf');

  if (tabPdf && tabTex) {
    tabPdf.addEventListener('click', () => {
      tabPdf.classList.add('active');
      tabTex.classList.remove('active');
      if (pdfWrapper) pdfWrapper.style.display = 'block';
      if (texWrapper) texWrapper.style.display = 'none';
      if (copyTexBtn) copyTexBtn.style.display = 'none';
      if (dlPdfBtn) dlPdfBtn.style.display = 'inline-flex';
      playSound('click');
    });

    tabTex.addEventListener('click', () => {
      tabTex.classList.add('active');
      tabPdf.classList.remove('active');
      if (pdfWrapper) pdfWrapper.style.display = 'none';
      if (texWrapper) texWrapper.style.display = 'block';
      if (copyTexBtn) copyTexBtn.style.display = 'inline-flex';
      if (dlPdfBtn) dlPdfBtn.style.display = 'none';
      playSound('click');
    });
  }

  if (copyTexBtn) {
    copyTexBtn.addEventListener('click', () => {
      const code = document.getElementById('latex-raw-code')?.textContent || '';
      navigator.clipboard.writeText(code).then(() => {
        playSound('chime');
        showToast('Overleaf LaTeX source code copied to clipboard! 📋');
      });
    });
  }
})();
