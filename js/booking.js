/**
 * Space Voyage - Voyage Reservation Engine & Relativistic Time Dilation Calculator
 * Computes Lorentz factor, ship time vs Earth time, and updates the holographic boarding pass.
 */

class BookingEngine {
  constructor() {
    this.selectedDestination = null;
    this.selectedCabinClass = 'cryo';
    this.passengerCount = 1;
    this.passengerName = 'Commander Shepard';
    
    this.cabinMultipliers = {
      cryo: 1.0,
      suite: 1.85,
      vip: 3.2
    };

    this.init();
  }

  init() {
    this.bindElements();
    this.populateDestinationsDropdown();
    this.bindEvents();
    this.calculateAndRender();
  }

  bindElements() {
    this.selectDest = document.getElementById('booking-destination-select');
    this.inputName = document.getElementById('booking-passenger-name');
    this.inputDate = document.getElementById('booking-stardate-input');
    this.selectShip = document.getElementById('booking-starship-select');
    this.cabinButtons = document.querySelectorAll('.cabin-btn');
    this.btnConfirm = document.getElementById('booking-confirm-btn');

    // Boarding Pass Elements
    this.passFlightCode = document.getElementById('pass-flight-code');
    this.passOriginCode = document.getElementById('pass-origin-code');
    this.passDestCode = document.getElementById('pass-dest-code');
    this.passPassengerName = document.getElementById('pass-passenger-name');
    this.passStardate = document.getElementById('pass-stardate');
    this.passCabinClass = document.getElementById('pass-cabin-class');
    this.passTotalFare = document.getElementById('pass-total-fare');
    
    // Relativistic Readouts
    this.metricShipTime = document.getElementById('metric-ship-time');
    this.metricEarthTime = document.getElementById('metric-earth-time');
    this.metricGamma = document.getElementById('metric-gamma-factor');
  }

  populateDestinationsDropdown() {
    if (!this.selectDest || !window.VOYAGE_DESTINATIONS) return;
    this.selectDest.innerHTML = '';

    window.VOYAGE_DESTINATIONS.forEach((d, idx) => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.textContent = `${d.name} (${d.distance})`;
      if (idx === 0) opt.selected = true;
      this.selectDest.appendChild(opt);
    });

    this.selectedDestination = window.VOYAGE_DESTINATIONS[0];
  }

  bindEvents() {
    if (this.selectDest) {
      this.selectDest.addEventListener('change', (e) => {
        const found = window.VOYAGE_DESTINATIONS.find(d => d.id === e.target.value);
        if (found) {
          this.selectedDestination = found;
          this.calculateAndRender();
          if (window.cosmicAudio) window.cosmicAudio.playClick();
        }
      });
    }

    if (this.inputName) {
      this.inputName.addEventListener('input', (e) => {
        this.passengerName = e.target.value.trim() || 'Cadet Voyager';
        if (this.passPassengerName) this.passPassengerName.textContent = this.passengerName;
      });
    }

    if (this.cabinButtons) {
      this.cabinButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.cabinButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.selectedCabinClass = btn.dataset.cabin || 'cryo';
          this.calculateAndRender();
          if (window.cosmicAudio) window.cosmicAudio.playClick();
        });
      });
    }

    if (this.btnConfirm) {
      this.btnConfirm.addEventListener('click', () => {
        this.confirmReservation();
      });
    }
  }

  calculateAndRender() {
    if (!this.selectedDestination) return;

    // Relativistic calculations assuming cruising velocity v = 0.92c
    const beta = 0.92;
    const gamma = 1 / Math.sqrt(1 - beta * beta); // ~2.55

    // Total Fare calculation
    const mult = this.cabinMultipliers[this.selectedCabinClass] || 1.0;
    const totalFare = Math.round(this.selectedDestination.baseFare * mult);

    // Update boarding pass fields
    if (this.passOriginCode) this.passOriginCode.textContent = "TERRA";
    if (this.passDestCode) {
      const code = this.selectedDestination.name.split(' ')[0].substring(0, 4).toUpperCase();
      this.passDestCode.textContent = code;
    }
    if (this.passPassengerName) this.passPassengerName.textContent = this.passengerName;
    if (this.passCabinClass) {
      const classLabels = { cryo: 'Cryo-Sleep Pod', suite: 'Orbital Suite', vip: 'Zero-G Penthouse' };
      this.passCabinClass.textContent = classLabels[this.selectedCabinClass] || 'Standard';
    }
    if (this.passTotalFare) {
      this.passTotalFare.textContent = `${totalFare.toLocaleString()} ₢`;
    }

    // Update Relativistic Physics Readout
    if (this.metricGamma) this.metricGamma.textContent = `γ = ${gamma.toFixed(2)}`;
    if (this.metricShipTime) this.metricShipTime.textContent = this.selectedDestination.transitTime.split('/')[0] || '14 Days';
    if (this.metricEarthTime) this.metricEarthTime.textContent = `+${(gamma * 1.8).toFixed(1)}x Earth Offset`;
  }

  confirmReservation() {
    if (window.cosmicAudio) window.cosmicAudio.playBeep(1100, 'sine', 0.3, 0.15);
    
    const banner = document.createElement('div');
    banner.style.position = 'fixed';
    banner.style.bottom = '2rem';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.background = 'rgba(16, 185, 129, 0.9)';
    banner.style.color = '#ffffff';
    banner.style.padding = '1rem 2rem';
    banner.style.borderRadius = '9999px';
    banner.style.fontFamily = 'var(--font-display)';
    banner.style.fontSize = '0.9rem';
    banner.style.letterSpacing = '0.08em';
    banner.style.boxShadow = '0 0 25px rgba(16, 185, 129, 0.6)';
    banner.style.zIndex = '9999';
    banner.textContent = `VOYAGE CONFIRMED: ${this.selectedDestination.name.toUpperCase()} RESERVED!`;

    document.body.appendChild(banner);
    setTimeout(() => banner.remove(), 4000);
  }
}

window.BookingEngine = BookingEngine;
