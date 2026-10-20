/**
 * Space Voyage - Celestial Astronomical Events & Mission Logs Controller
 * Live countdown clocks, radiation alerts, and space exploration timeline.
 */

class MissionsController {
  constructor() {
    this.events = [
      {
        id: 'perseid-swarm',
        title: 'Perseid Hyper-Meteor Swarm',
        type: 'Meteor Alert',
        countdownHours: 14,
        countdownMinutes: 28,
        countdownSeconds: 45,
        desc: 'Orbital Ring Alpha crossing high-density debris field. Shield arrays aligned to deflection angle 42°.'
      },
      {
        id: 'sol-flare',
        title: 'Class-X Solar Radiation Flare',
        type: 'Radiation Warning',
        countdownHours: 36,
        countdownMinutes: 12,
        countdownSeconds: 10,
        desc: 'Intense coronal mass ejection detected from Sol Active Region 3844. Magnetic field shielding recommended.'
      },
      {
        id: 'europa-transit',
        title: 'Jupiter-Europa Eclipse Alignment',
        type: 'Orbital Event',
        countdownHours: 72,
        countdownMinutes: 44,
        countdownSeconds: 0,
        desc: 'Total eclipse of Jupiter from Europa station. Prime spectroscopic imaging opportunity.'
      }
    ];

    this.init();
  }

  init() {
    this.renderEvents();
    this.startCountdownLoop();
  }

  renderEvents() {
    const container = document.getElementById('celestial-events-list');
    if (!container) return;

    container.innerHTML = '';
    this.events.forEach((ev, idx) => {
      const card = document.createElement('div');
      card.className = 'celestial-card';
      card.innerHTML = `
        <div class="celestial-card-top">
          <span class="celestial-type">${ev.type}</span>
          <span class="celestial-countdown" id="event-timer-${idx}">
            ${this.formatTime(ev.countdownHours, ev.countdownMinutes, ev.countdownSeconds)}
          </span>
        </div>
        <h4 class="celestial-name">${ev.title}</h4>
        <p class="celestial-desc">${ev.desc}</p>
        <div class="celestial-impact-meter">
          <span>SHIELD IMPACT: <strong class="impact-status">ABSORBED</strong></span>
          <span>SECTOR 0${idx + 1}</span>
        </div>
      `;

      card.addEventListener('mouseenter', () => {
        if (window.cosmicAudio) window.cosmicAudio.playHoverBlip();
      });

      container.appendChild(card);
    });
  }

  startCountdownLoop() {
    setInterval(() => {
      this.events.forEach((ev, idx) => {
        if (ev.countdownSeconds > 0) {
          ev.countdownSeconds--;
        } else {
          ev.countdownSeconds = 59;
          if (ev.countdownMinutes > 0) {
            ev.countdownMinutes--;
          } else {
            ev.countdownMinutes = 59;
            if (ev.countdownHours > 0) ev.countdownHours--;
          }
        }

        const timerEl = document.getElementById(`event-timer-${idx}`);
        if (timerEl) {
          timerEl.textContent = this.formatTime(ev.countdownHours, ev.countdownMinutes, ev.countdownSeconds);
        }
      });
    }, 1000);
  }

  formatTime(h, m, s) {
    const pad = (n) => String(n).padStart(2, '0');
    return `T - ${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }
}

window.MissionsController = MissionsController;
