/**
 * Space Voyage - Interactive 3D Canvas Starfield & Hyperspace Warp Engine
 * High-performance 60fps rendering, mouse parallax, shooting stars, and warp streaks.
 */

class StarfieldCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.stars = [];
    this.starCount = 850;
    this.maxDepth = 1500;
    this.baseSpeed = 0.8;
    this.speed = this.baseSpeed;
    this.warpSpeed = 38;
    this.isWarping = false;
    
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    
    // Meteors
    this.meteors = [];
    this.lastMeteorTime = Date.now();
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Mouse move parallax
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - this.canvas.width / 2) * 0.08;
      this.targetMouseY = (e.clientY - this.canvas.height / 2) * 0.08;
    });

    this.createStars();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.cx = this.canvas.width / 2;
    this.cy = this.canvas.height / 2;
  }

  createStars() {
    this.stars = [];
    const colors = ['#ffffff', '#e0f2fe', '#bae6fd', '#38bdf8', '#c084fc', '#fef08a'];
    
    for (let i = 0; i < this.starCount; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * this.canvas.width * 2.5,
        y: (Math.random() - 0.5) * this.canvas.height * 2.5,
        z: Math.random() * this.maxDepth,
        pz: 0,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.random() * 1.5 + 0.5,
        twinkle: Math.random() * Math.PI * 2
      });
    }
  }

  setWarp(active) {
    this.isWarping = active;
  }

  spawnMeteor() {
    const startX = Math.random() * this.canvas.width;
    const startY = Math.random() * (this.canvas.height * 0.4);
    const length = Math.random() * 120 + 80;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = Math.random() * 14 + 10;

    this.meteors.push({
      x: startX,
      y: startY,
      length,
      angle,
      speed,
      opacity: 1
    });
  }

  animate() {
    // Parallax damping
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;

    // Smooth speed interpolation for warp jump
    const targetSpeed = this.isWarping ? this.warpSpeed : this.baseSpeed;
    this.speed += (targetSpeed - this.speed) * 0.08;

    // Trail effect during warp
    if (this.isWarping || this.speed > 3) {
      this.ctx.fillStyle = 'rgba(3, 7, 18, 0.25)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    const cx = this.cx + this.mouseX;
    const cy = this.cy + this.mouseY;

    // Render stars
    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];
      star.pz = star.z;
      star.z -= this.speed;

      if (star.z <= 0) {
        star.z = this.maxDepth;
        star.pz = this.maxDepth;
        star.x = (Math.random() - 0.5) * this.canvas.width * 2.5;
        star.y = (Math.random() - 0.5) * this.canvas.height * 2.5;
      }

      const k = 280 / star.z;
      const px = star.x * k + cx;
      const py = star.y * k + cy;

      if (px < 0 || px >= this.canvas.width || py < 0 || py >= this.canvas.height) {
        continue;
      }

      const pk = 280 / star.pz;
      const prevX = star.x * pk + cx;
      const prevY = star.y * pk + cy;

      star.twinkle += 0.05;
      const twinkleAlpha = 0.6 + Math.sin(star.twinkle) * 0.35;
      const depthAlpha = (1 - star.z / this.maxDepth) * twinkleAlpha;

      if (this.speed > 2.5) {
        // Render streak in warp mode
        this.ctx.beginPath();
        this.ctx.moveTo(prevX, prevY);
        this.ctx.lineTo(px, py);
        this.ctx.strokeStyle = star.color;
        this.ctx.lineWidth = Math.min(3, (1 - star.z / this.maxDepth) * 3);
        this.ctx.globalAlpha = depthAlpha;
        this.ctx.stroke();
      } else {
        // Normal twinkling point
        const size = Math.max(0.6, (1 - star.z / this.maxDepth) * star.radius * 2);
        this.ctx.beginPath();
        this.ctx.arc(px, py, size, 0, Math.PI * 2);
        this.ctx.fillStyle = star.color;
        this.ctx.globalAlpha = depthAlpha;
        this.ctx.fill();
      }
    }
    this.ctx.globalAlpha = 1;

    // Meteors / Shooting stars logic (only during normal cruise)
    if (!this.isWarping && Date.now() - this.lastMeteorTime > 5000 && Math.random() < 0.03) {
      this.spawnMeteor();
      this.lastMeteorTime = Date.now();
    }

    for (let i = this.meteors.length - 1; i >= 0; i--) {
      const m = this.meteors[i];
      const tailX = m.x - Math.cos(m.angle) * m.length;
      const tailY = m.y - Math.sin(m.angle) * m.length;

      const grad = this.ctx.createLinearGradient(tailX, tailY, m.x, m.y);
      grad.addColorStop(0, 'rgba(0, 240, 255, 0)');
      grad.addColorStop(1, `rgba(255, 255, 255, ${m.opacity})`);

      this.ctx.beginPath();
      this.ctx.moveTo(tailX, tailY);
      this.ctx.lineTo(m.x, m.y);
      this.ctx.strokeStyle = grad;
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      m.x += Math.cos(m.angle) * m.speed;
      m.y += Math.sin(m.angle) * m.speed;
      m.opacity -= 0.015;

      if (m.opacity <= 0 || m.x > this.canvas.width || m.y > this.canvas.height) {
        this.meteors.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.animate());
  }
}

window.StarfieldCanvas = StarfieldCanvas;
