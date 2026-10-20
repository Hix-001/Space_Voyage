/**
 * Space Voyage - Spacecraft Cockpit Telemetry & Hyperdrive Sequencer
 * Simulates real-time reactor metrics, relativistic velocity, and hyperspace jump effects.
 */

class TelemetryEngine {
  constructor() {
    this.reactorOutput = 4.82; // Gigawatts
    this.velocity = 0.924; // % speed of light
    this.shieldIntegrity = 96; // %
    this.lifeSupportO2 = 99.4; // %
    this.gravitationalG = 1.02; // Gs
    
    this.isWarpActive = false;
    this.intervalId = null;
    
    this.init();
  }

  init() {
    this.bindDomElements();
    this.startTelemetryLoop();
  }

  bindDomElements() {
    this.elReactorVal = document.getElementById('hud-reactor-val');
    this.elShieldGauge = document.getElementById('hud-shield-gauge');
    this.elShieldText = document.getElementById('hud-shield-text');
    this.elVelocityVal = document.getElementById('hud-velocity-val');
    this.elO2Val = document.getElementById('hud-o2-val');
    this.elO2Bar = document.getElementById('hud-o2-bar');
    this.elGVal = document.getElementById('hud-g-val');
    this.elWarpOverlay = document.getElementById('warp-jump-overlay');
    this.elWarpCounter = document.getElementById('warp-velocity-counter');
  }

  startTelemetryLoop() {
    this.intervalId = setInterval(() => {
      if (!this.isWarpActive) {
        // Natural jitter around nominal cruising metrics
        this.reactorOutput = +(4.82 + (Math.random() - 0.5) * 0.12).toFixed(2);
        this.velocity = +(0.924 + (Math.random() - 0.5) * 0.004).toFixed(3);
        this.shieldIntegrity = Math.round(96 + (Math.random() - 0.5) * 2);
        this.lifeSupportO2 = +(99.4 + (Math.random() - 0.5) * 0.2).toFixed(1);
        this.gravitationalG = +(1.00 + (Math.random() - 0.5) * 0.04).toFixed(2);
        
        this.updateHUDDisplay();
      }
    }, 1200);
  }

  updateHUDDisplay() {
    if (this.elReactorVal) this.elReactorVal.textContent = `${this.reactorOutput} GW`;
    if (this.elVelocityVal) this.elVelocityVal.textContent = `${this.velocity} c`;
    
    if (this.elShieldText) this.elShieldText.textContent = `${this.shieldIntegrity}%`;
    if (this.elShieldGauge) {
      // 283 is total circumference
      const offset = 283 - (283 * (this.shieldIntegrity / 100));
      this.elShieldGauge.style.strokeDashoffset = offset;
    }

    if (this.elO2Val) this.elO2Val.textContent = `${this.lifeSupportO2}%`;
    if (this.elO2Bar) this.elO2Bar.style.width = `${this.lifeSupportO2}%`;

    if (this.elGVal) this.elGVal.textContent = `${this.gravitationalG} G`;
  }

  // Trigger Cinematic Warp Speed Hyperspace Jump
  initiateWarpJump(starfieldInstance) {
    if (this.isWarpActive) return;
    this.isWarpActive = true;

    // Trigger audio warp ramp
    if (window.cosmicAudio) {
      window.cosmicAudio.playWarpSound();
    }

    // Set starfield to warp mode
    if (starfieldInstance) {
      starfieldInstance.setWarp(true);
    }

    // Show overlay
    if (this.elWarpOverlay) {
      this.elWarpOverlay.classList.add('active');
    }

    // Rapid velocity acceleration readout
    let currentC = 0.92;
    const accelInterval = setInterval(() => {
      currentC = +(currentC + 0.95).toFixed(1);
      if (this.elWarpCounter) {
        this.elWarpCounter.textContent = `WARP ${currentC}c`;
      }
    }, 100);

    // After 2.8 seconds, drop out of warp smoothly
    setTimeout(() => {
      clearInterval(accelInterval);
      if (this.elWarpOverlay) {
        this.elWarpOverlay.classList.remove('active');
      }
      if (starfieldInstance) {
        starfieldInstance.setWarp(false);
      }
      this.isWarpActive = false;

      if (window.cosmicAudio) {
        window.cosmicAudio.playBeep(980, 'sine', 0.25, 0.1);
      }
    }, 3000);
  }
}

window.TelemetryEngine = TelemetryEngine;
