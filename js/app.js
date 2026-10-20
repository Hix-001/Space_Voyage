/**
 * Space Voyage - Core Application Lifecycle Controller
 * Coordinates audio, 3D starfield, planet renderer, telemetry, booking, and shortcuts.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Interactive Starfield Canvas
  const starfield = new window.StarfieldCanvas('space-starfield-canvas');

  // 2. Initialize 3D Planet Renderer
  const planetRenderer = new window.PlanetRenderer('planet-canvas-3d');

  // 3. Initialize Cockpit Telemetry Engine
  const telemetry = new window.TelemetryEngine();

  // 4. Initialize Booking Reservation Engine
  const booking = new window.BookingEngine();

  // 5. Initialize Astronomical Missions Controller
  const missions = new window.MissionsController();

  // 6. Set initial active planet
  let activeDestination = window.VOYAGE_DESTINATIONS ? window.VOYAGE_DESTINATIONS[0] : null;
  if (activeDestination) {
    updateActivePlanet(activeDestination);
  }

  // 7. Render Quick Destination Cards
  renderDestinationCards();

  // 8. Bind Filter Tabs
  bindCategoryFilters();

  // 9. Navbar Scroll State
  const nav = document.querySelector('.cosmic-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // 10. Audio Ambient Synthesizer Button
  const audioBtn = document.getElementById('nav-audio-toggle');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (window.cosmicAudio) {
        const isPlaying = window.cosmicAudio.toggleMute();
        if (isPlaying) {
          audioBtn.classList.add('playing');
        } else {
          audioBtn.classList.remove('playing');
        }
      }
    });
  }

  // 11. Warp Speed Jump Trigger Buttons
  const warpButtons = document.querySelectorAll('[data-action="warp-jump"]');
  warpButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      telemetry.initiateWarpJump(starfield);
    });
  });

  // 12. Mobile Drawer Navigation
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  const drawerClose = document.getElementById('mobile-drawer-close');
  const drawerBackdrop = document.getElementById('mobile-drawer-backdrop');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  const openDrawer = () => {
    mobileDrawer.classList.add('open');
    drawerBackdrop.classList.add('active');
    if (window.cosmicAudio) window.cosmicAudio.playClick();
  };

  const closeDrawer = () => {
    mobileDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('active');
  };

  if (mobileToggle) mobileToggle.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', closeDrawer);
  mobileLinks.forEach(link => link.addEventListener('click', closeDrawer));

  // 13. Keyboard Shortcuts (W for Warp, M for Mute/Sound, 1-6 for Planets)
  window.addEventListener('keydown', (e) => {
    // Avoid interfering when typing in text inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
      return;
    }

    if (e.key === 'w' || e.key === 'W') {
      telemetry.initiateWarpJump(starfield);
    } else if (e.key === 'm' || e.key === 'M') {
      if (audioBtn) audioBtn.click();
    } else if (e.key >= '1' && e.key <= '6') {
      const idx = parseInt(e.key, 10) - 1;
      if (window.VOYAGE_DESTINATIONS && window.VOYAGE_DESTINATIONS[idx]) {
        updateActivePlanet(window.VOYAGE_DESTINATIONS[idx]);
        if (window.cosmicAudio) window.cosmicAudio.playClick();
      }
    } else if (e.key === 'Escape') {
      closeDrawer();
    }
  });

  // Functions
  function updateActivePlanet(planet) {
    activeDestination = planet;
    planetRenderer.setPlanet(planet);

    // Update Dossier DOM
    const nameEl = document.getElementById('stage-planet-name');
    const typeEl = document.getElementById('stage-planet-type');
    const descEl = document.getElementById('stage-planet-desc');
    const distEl = document.getElementById('stage-planet-distance');
    const gravEl = document.getElementById('stage-planet-gravity');
    const tempEl = document.getElementById('stage-planet-temp');
    const habEl = document.getElementById('stage-planet-hab');

    if (nameEl) nameEl.textContent = planet.name;
    if (typeEl) typeEl.textContent = `${planet.sector} • ${planet.type}`;
    if (descEl) descEl.textContent = planet.description;
    if (distEl) distEl.textContent = planet.distance;
    if (gravEl) gravEl.textContent = planet.gravity;
    if (tempEl) tempEl.textContent = planet.temp;
    if (habEl) habEl.textContent = `${planet.habitability}%`;

    // Sync booking dropdown selection
    const bookingSelect = document.getElementById('booking-destination-select');
    if (bookingSelect && bookingSelect.value !== planet.id) {
      bookingSelect.value = planet.id;
      booking.selectedDestination = planet;
      booking.calculateAndRender();
    }

    // Highlight card
    document.querySelectorAll('.destination-card').forEach(c => {
      c.classList.toggle('active', c.dataset.id === planet.id);
    });
  }

  function renderDestinationCards(category = 'all') {
    const grid = document.getElementById('destinations-cards-grid');
    if (!grid || !window.VOYAGE_DESTINATIONS) return;

    grid.innerHTML = '';
    const filtered = category === 'all' 
      ? window.VOYAGE_DESTINATIONS 
      : window.VOYAGE_DESTINATIONS.filter(d => d.category === category);

    filtered.forEach(dest => {
      const card = document.createElement('div');
      card.className = `destination-card ${activeDestination && activeDestination.id === dest.id ? 'active' : ''}`;
      card.dataset.id = dest.id;

      card.innerHTML = `
        <div class="destination-thumb">
          <img src="${dest.image}" alt="${dest.name}" class="destination-img" loading="lazy">
          <span class="destination-badge">${dest.category.toUpperCase()}</span>
        </div>
        <div class="destination-body">
          <h4 class="destination-title">${dest.name}</h4>
          <span class="destination-sector">${dest.sector}</span>
          <p class="destination-summary">${dest.description}</p>
          <div class="destination-footer">
            <span class="destination-distance">${dest.distance}</span>
            <span class="destination-btn-select">EXPLORE &rarr;</span>
          </div>
        </div>
      `;

      card.addEventListener('click', () => {
        updateActivePlanet(dest);
        if (window.cosmicAudio) window.cosmicAudio.playClick();
        // Scroll smoothly to planet stage if on mobile
        if (window.innerWidth <= 768) {
          document.getElementById('planet-stage-card')?.scrollIntoView({ behavior: 'smooth' });
        }
      });

      card.addEventListener('mouseenter', () => {
        if (window.cosmicAudio) window.cosmicAudio.playHoverBlip();
      });

      grid.appendChild(card);
    });
  }

  function bindCategoryFilters() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const cat = tab.dataset.category || 'all';
        renderDestinationCards(cat);
        if (window.cosmicAudio) window.cosmicAudio.playClick();
      });
    });
  }

  // Smooth scroll for nav anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        if (window.cosmicAudio) window.cosmicAudio.playClick();
      }
    });
  });

  // Booking CTA shortcut
  const stageBookBtn = document.getElementById('stage-book-btn');
  if (stageBookBtn) {
    stageBookBtn.addEventListener('click', () => {
      const bookingSec = document.getElementById('booking');
      if (bookingSec) {
        bookingSec.scrollIntoView({ behavior: 'smooth' });
        if (window.cosmicAudio) window.cosmicAudio.playClick();
      }
    });
  }
});
