/**
 * Space Voyage - Interactive Procedural 3D Planet Canvas Renderer
 * Renders rotating spherical celestial bodies, atmospheric glow, lighting, and drag rotation.
 */

class PlanetRenderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.rotationY = 0;
    this.rotationX = 0.2;
    this.autoSpinSpeed = 0.006;
    
    // Drag state
    this.isDragging = false;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    
    // Planet appearance
    this.currentPlanet = null;
    this.radius = 140;
    
    this.init();
  }

  init() {
    this.setupResolution();
    this.bindEvents();
    this.animate();
  }

  setupResolution() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width || 400;
    this.height = rect.height || 400;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
    this.radius = Math.min(this.width, this.height) * 0.36;
  }

  bindEvents() {
    window.addEventListener('resize', () => this.setupResolution());

    const startDrag = (x, y) => {
      this.isDragging = true;
      this.lastMouseX = x;
      this.lastMouseY = y;
    };

    const doDrag = (x, y) => {
      if (!this.isDragging) return;
      const dx = x - this.lastMouseX;
      const dy = y - this.lastMouseY;
      this.rotationY += dx * 0.008;
      this.rotationX += dy * 0.008;
      this.rotationX = Math.max(-0.6, Math.min(0.6, this.rotationX));
      this.lastMouseX = x;
      this.lastMouseY = y;
    };

    const stopDrag = () => {
      this.isDragging = false;
    };

    this.canvas.addEventListener('mousedown', (e) => startDrag(e.clientX, e.clientY));
    window.addEventListener('mousemove', (e) => doDrag(e.clientX, e.clientY));
    window.addEventListener('mouseup', stopDrag);

    // Touch support
    this.canvas.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        doDrag(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    window.addEventListener('touchend', stopDrag);
  }

  setPlanet(planetData) {
    this.currentPlanet = planetData;
  }

  animate() {
    if (!this.isDragging) {
      this.rotationY += this.autoSpinSpeed;
    }

    this.render();
    requestAnimationFrame(() => this.animate());
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    if (!this.currentPlanet) return;

    const cx = this.width / 2;
    const cy = this.height / 2;
    const r = this.radius;
    const colors = this.currentPlanet.planetColors || {
      primary: '#0284c7',
      secondary: '#075985',
      accent: '#38bdf8',
      atmosphere: 'rgba(56, 189, 248, 0.4)',
      clouds: 'rgba(255, 255, 255, 0.3)'
    };

    // 1. Atmospheric Outer Halo Glow
    const halo = this.ctx.createRadialGradient(cx, cy, r * 0.95, cx, cy, r * 1.35);
    halo.addColorStop(0, colors.atmosphere);
    halo.addColorStop(0.5, colors.atmosphere.replace(')', ', 0.2)').replace('rgb', 'rgba'));
    halo.addColorStop(1, 'rgba(0,0,0,0)');
    
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
    this.ctx.fillStyle = halo;
    this.ctx.fill();

    // Save context for planet sphere clip
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.clip();

    // 2. Base Sphere Color
    this.ctx.fillStyle = colors.secondary;
    this.ctx.fill();

    // 3. Rotating Surface Bands & Continents Simulation
    const bandCount = 14;
    for (let i = -bandCount; i <= bandCount; i++) {
      const yNorm = i / bandCount;
      const yPos = cy + yNorm * r;
      const xSpan = Math.sqrt(Math.max(0, r * r - (yNorm * r) * (yNorm * r)));

      const offset = (this.rotationY * 50 + i * 25) % (xSpan * 2);
      
      this.ctx.beginPath();
      this.ctx.strokeStyle = (i % 2 === 0) ? colors.primary : colors.accent;
      this.ctx.lineWidth = r / bandCount;
      this.ctx.globalAlpha = 0.45 + Math.sin(i * 1.2) * 0.2;
      this.ctx.moveTo(cx - xSpan, yPos);
      this.ctx.lineTo(cx + xSpan, yPos);
      this.ctx.stroke();

      // Organic procedural cloud/continent swirls
      const swirlX = cx - xSpan + ((offset + xSpan * 2) % (xSpan * 2));
      this.ctx.beginPath();
      this.ctx.arc(swirlX, yPos, (r / bandCount) * 1.5, 0, Math.PI * 2);
      this.ctx.fillStyle = colors.clouds;
      this.ctx.globalAlpha = 0.3;
      this.ctx.fill();
    }

    // 4. Photorealistic Spherical Shadow & Illumination (Sun at upper-left)
    const lightX = cx - r * 0.45;
    const lightY = cy - r * 0.45;
    const sphereShading = this.ctx.createRadialGradient(lightX, lightY, r * 0.1, cx, cy, r * 1.05);
    sphereShading.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    sphereShading.addColorStop(0.35, 'rgba(255, 255, 255, 0.05)');
    sphereShading.addColorStop(0.7, 'rgba(3, 7, 18, 0.7)');
    sphereShading.addColorStop(1, 'rgba(3, 7, 18, 0.98)');

    this.ctx.globalAlpha = 1;
    this.ctx.fillStyle = sphereShading;
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, r, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();

    // 5. Planetary Rings (If applicable, e.g. Titan/Saturn)
    if (this.currentPlanet.category === 'outer') {
      this.ctx.save();
      this.ctx.translate(cx, cy);
      this.ctx.rotate(-0.35 + this.rotationX * 0.5);

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, r * 1.85, r * 0.45, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
      this.ctx.lineWidth = 14;
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.ellipse(0, 0, r * 1.6, r * 0.38, 0, 0, Math.PI * 2);
      this.ctx.strokeStyle = 'rgba(254, 243, 199, 0.25)';
      this.ctx.lineWidth = 6;
      this.ctx.stroke();

      this.ctx.restore();
    }
  }
}

window.PlanetRenderer = PlanetRenderer;
