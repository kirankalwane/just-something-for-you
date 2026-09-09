// ==========================================================================
// Celestial Starfield & Stardust Canvas Engine
// Features: 4-Point Diamond Sparkles (✦), Floating Golden & Rose Stardust,
// Shooting Stars, Gravitational Attraction, and Burst Particles.
// ==========================================================================

class Starfield {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.stardust = [];
    this.shootingStars = [];
    this.sparkles = [];
    this.mouse = { x: null, y: null, radius: 140 };
    this.opacity = 1.0;
    this.targetOpacity = 1.0;
    this.speedMultiplier = 1.0;
    this.time = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize());

    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    window.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        this.mouse.x = e.touches[0].clientX;
        this.mouse.y = e.touches[0].clientY;
      }
    }, { passive: true });

    window.addEventListener('touchend', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });

    this.createStars();
    this.createStardust();
    this.loop();
  }

  resize() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
    
    if (this.stars.length === 0) {
      this.createStars();
      this.createStardust();
    }
  }

  createStars() {
    this.stars = [];
    const count = Math.floor((this.width * this.height) / 8000) + 60;
    for (let i = 0; i < count; i++) {
      const isCross = Math.random() < 0.28; // ~28% are 4-point cross sparkles
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height * 0.85, // concentrate in upper/mid sky
        size: isCross ? Math.random() * 2.2 + 1.2 : Math.random() * 1.6 + 0.6,
        isCross: isCross,
        rotation: (Math.random() - 0.5) * 0.4,
        rotSpeed: (Math.random() - 0.5) * 0.005,
        baseAlpha: Math.random() * 0.6 + 0.3,
        twinkleSpeed: Math.random() * 0.025 + 0.008,
        twinklePhase: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.08,
        color: this.getRandomStarColor(isCross)
      });
    }
  }

  createStardust() {
    this.stardust = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.stardust.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.6 + 0.6,
        vy: -(Math.random() * 0.35 + 0.12),
        vxBase: (Math.random() - 0.5) * 0.15,
        driftPhase: Math.random() * Math.PI * 2,
        alpha: Math.random() * 0.6 + 0.25,
        color: Math.random() > 0.45 ? 'rgba(254, 240, 138,' : 'rgba(249, 168, 212,'
      });
    }
  }

  getRandomStarColor(isCross = false) {
    if (isCross) {
      const crossColors = [
        'rgba(255, 244, 215,', // Warm champagne gold
        'rgba(255, 255, 255,', // Pure crystal white
        'rgba(254, 240, 138,', // Luminous moonlight gold
        'rgba(244, 182, 216,'  // Soft rose shimmer
      ];
      return crossColors[Math.floor(Math.random() * crossColors.length)];
    }
    const colors = [
      'rgba(255, 255, 255,', // Pure crystal white
      'rgba(244, 230, 255,', // Celestial lavender
      'rgba(254, 240, 138,', // Warm moonlight
      'rgba(255, 210, 230,', // Rose blush
      'rgba(216, 235, 255,'  // Soft diamond blue
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  // Draw 4-point diamond cross star (✦) like in reference images
  drawCrossStar(x, y, size, alpha, color, rotation) {
    this.ctx.save();
    this.ctx.translate(x, y);
    if (rotation) this.ctx.rotate(rotation);

    // Outer soft glow halo
    if (alpha > 0.4) {
      const haloGrad = this.ctx.createRadialGradient(0, 0, 0, 0, 0, size * 3.5);
      haloGrad.addColorStop(0, `${color} ${alpha * 0.4})`);
      haloGrad.addColorStop(0.6, `${color} ${alpha * 0.12})`);
      haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      this.ctx.fillStyle = haloGrad;
      this.ctx.beginPath();
      this.ctx.arc(0, 0, size * 3.5, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Four tapered spikes
    const spikeLen = size * 3.6;
    const spikeWidth = size * 0.7;

    this.ctx.fillStyle = `${color} ${alpha})`;
    this.ctx.beginPath();
    this.ctx.moveTo(0, -spikeLen);
    this.ctx.quadraticCurveTo(0, 0, spikeWidth, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, spikeLen);
    this.ctx.quadraticCurveTo(0, 0, -spikeWidth, 0);
    this.ctx.quadraticCurveTo(0, 0, 0, -spikeLen);
    this.ctx.closePath();
    this.ctx.fill();

    // Minor diagonal subtle spokes
    const diagLen = spikeLen * 0.38;
    this.ctx.rotate(Math.PI / 4);
    this.ctx.beginPath();
    this.ctx.moveTo(0, -diagLen);
    this.ctx.lineTo(0, diagLen);
    this.ctx.moveTo(-diagLen, 0);
    this.ctx.lineTo(diagLen, 0);
    this.ctx.strokeStyle = `${color} ${alpha * 0.5})`;
    this.ctx.lineWidth = 0.8;
    this.ctx.stroke();

    // Central bright core dot
    this.ctx.beginPath();
    this.ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(1, alpha * 1.3)})`;
    this.ctx.fill();

    this.ctx.restore();
  }

  burst(x, y, count = 30) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.8 + 1.2;
      const isGolden = Math.random() > 0.45;
      this.sparkles.push({
        x: x || this.width / 2,
        y: y || this.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 2.4 + 1.0,
        alpha: 1,
        decay: Math.random() * 0.02 + 0.015,
        color: isGolden ? 'rgba(254, 240, 138,' : 'rgba(244, 114, 182,'
      });
    }
  }

  triggerShootingStar() {
    const startX = Math.random() * this.width * 0.85;
    const startY = Math.random() * this.height * 0.35;
    const length = Math.random() * 130 + 90;
    const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3;
    const speed = Math.random() * 7 + 7;

    this.shootingStars.push({
      x: startX,
      y: startY,
      length: length,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      opacity: 1,
      decay: 0.022
    });
  }

  setDimmed(dimmed, speed = 0.03) {
    this.targetOpacity = dimmed ? 0.06 : 1.0;
    this.dimSpeed = speed;
  }

  loop() {
    this.time += 0.02;

    // Smooth opacity transition
    if (Math.abs(this.opacity - this.targetOpacity) > 0.005) {
      this.opacity += (this.targetOpacity - this.opacity) * (this.dimSpeed || 0.04);
    } else {
      this.opacity = this.targetOpacity;
    }

    // Transparent clear so the CSS dreamy sky & clouds show through!
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.opacity > 0.01) {
      // 1. Draw floating stardust motes (gently rising upwards)
      for (let i = 0; i < this.stardust.length; i++) {
        const p = this.stardust[i];
        p.y += p.vy;
        p.x += p.vxBase + Math.sin(this.time + p.driftPhase) * 0.25;

        // Reset if it drifted above screen
        if (p.y < -10) {
          p.y = this.height + 10;
          p.x = Math.random() * this.width;
        }

        const alpha = (p.alpha + Math.sin(this.time * 2 + p.driftPhase) * 0.2) * this.opacity;
        const clampedAlpha = Math.max(0.05, Math.min(0.9, alpha));

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${p.color} ${clampedAlpha})`;
        this.ctx.shadowBlur = 4;
        this.ctx.shadowColor = 'rgba(254, 240, 138, 0.6)';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }

      // 2. Draw Stars & Cross Sparkles
      for (let i = 0; i < this.stars.length; i++) {
        const star = this.stars[i];

        // Subtle movement
        star.x += star.vx * this.speedMultiplier;
        star.y += star.vy * this.speedMultiplier;

        if (star.x < 0) star.x = this.width;
        if (star.x > this.width) star.x = 0;
        if (star.y < 0) star.y = this.height;
        if (star.y > this.height) star.y = 0;

        // Twinkle
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = (star.baseAlpha + Math.sin(star.twinklePhase) * 0.38) * this.opacity;
        const clampedAlpha = Math.max(0.08, Math.min(1, currentAlpha));

        if (star.isCross) {
          star.rotation += star.rotSpeed;
          this.drawCrossStar(star.x, star.y, star.size, clampedAlpha, star.color, star.rotation);
        } else {
          // Standard twinkling star
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `${star.color} ${clampedAlpha})`;
          if (star.size > 1.3) {
            this.ctx.shadowBlur = 6;
            this.ctx.shadowColor = 'rgba(255, 235, 200, 0.7)';
          }
          this.ctx.fill();
          this.ctx.shadowBlur = 0;
        }
      }

      // 3. Occasionally trigger shooting star
      if (Math.random() < 0.005 && this.shootingStars.length < 2) {
        this.triggerShootingStar();
      }

      // 4. Update and draw shooting stars
      for (let i = this.shootingStars.length - 1; i >= 0; i--) {
        const s = this.shootingStars[i];
        s.x += s.vx;
        s.y += s.vy;
        s.opacity -= s.decay;

        if (s.opacity <= 0 || s.x > this.width || s.y > this.height) {
          this.shootingStars.splice(i, 1);
          continue;
        }

        const tailX = s.x - (s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;
        const tailY = s.y - (s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;

        const grad = this.ctx.createLinearGradient(s.x, s.y, tailX, tailY);
        grad.addColorStop(0, `rgba(255, 255, 255, ${s.opacity * this.opacity})`);
        grad.addColorStop(0.3, `rgba(254, 240, 138, ${s.opacity * 0.8 * this.opacity})`);
        grad.addColorStop(0.7, `rgba(244, 114, 182, ${s.opacity * 0.4 * this.opacity})`);
        grad.addColorStop(1, 'rgba(160, 180, 255, 0)');

        this.ctx.beginPath();
        this.ctx.moveTo(s.x, s.y);
        this.ctx.lineTo(tailX, tailY);
        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = 1.6;
        this.ctx.stroke();

        // Little sparkle head on shooting star
        this.ctx.beginPath();
        this.ctx.arc(s.x, s.y, 2.2, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity * this.opacity})`;
        this.ctx.shadowBlur = 8;
        this.ctx.shadowColor = 'rgba(254, 240, 138, 0.9)';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }

      // 5. Update and draw burst sparkles
      for (let i = this.sparkles.length - 1; i >= 0; i--) {
        const sp = this.sparkles[i];
        sp.x += sp.vx;
        sp.y += sp.vy;
        sp.vx *= 0.96;
        sp.vy *= 0.96;
        sp.alpha -= sp.decay;

        if (sp.alpha <= 0) {
          this.sparkles.splice(i, 1);
          continue;
        }

        this.ctx.beginPath();
        this.ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        this.ctx.fillStyle = `${sp.color} ${sp.alpha * this.opacity})`;
        this.ctx.shadowBlur = 6;
        this.ctx.shadowColor = 'rgba(254, 240, 138, 0.8)';
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
      }
    }

    requestAnimationFrame(() => this.loop());
  }
}

window.Starfield = Starfield;
