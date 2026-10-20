/**
 * Space Voyage - Celestial Destinations & Starship Fleet Data
 */

const VOYAGE_DESTINATIONS = [
  {
    id: "mars-colony",
    name: "Mars Olympus Outpost",
    sector: "Sector 04 • Sol System",
    category: "sol",
    type: "Terraformed Planetary Colony",
    distance: "225M km (1.52 AU)",
    transitTime: "14 Days Sub-light / 48 hrs Warp",
    gravity: "0.38 g",
    temp: "-63°C to +20°C (Domes)",
    atmosphere: "Terraformed Nitrogen-O2 mix",
    habitability: 78,
    baseFare: 1450,
    image: "assets/images/mars_colony.jpg",
    description: "Nestled beneath the majestic caldera of Olympus Mons, Mars Outpost One is humanity's thriving jewel. Features climate-controlled biodomes, geothermal hot spring resorts, and vast terraforming agricultural complexes.",
    planetColors: {
      primary: '#c2410c',
      secondary: '#9a3412',
      accent: '#fb923c',
      atmosphere: 'rgba(251, 146, 60, 0.45)',
      clouds: 'rgba(255, 237, 213, 0.2)'
    }
  },
  {
    id: "europa-ocean",
    name: "Europa Deep-Ice Biosphere",
    sector: "Sector 05 • Jovian System",
    category: "jovian",
    type: "Sub-crustal Ocean Station",
    distance: "628M km (4.2 AU)",
    transitTime: "28 Days Sub-light / 4 Days Warp",
    gravity: "0.134 g",
    temp: "-160°C Surface / +4°C Ocean",
    atmosphere: "Molecular Oxygen (Trace)",
    habitability: 68,
    baseFare: 3200,
    image: "assets/images/europa_base.jpg",
    description: "Drill 15 kilometers through crystalline ice into a vast, luminous ocean warmed by hydrothermal vents. Home to exotic bioluminescent marine research centers with panoramic observation under Jupiter's giant disk.",
    planetColors: {
      primary: '#0284c7',
      secondary: '#0369a1',
      accent: '#38bdf8',
      atmosphere: 'rgba(56, 189, 248, 0.5)',
      clouds: 'rgba(255, 255, 255, 0.4)'
    }
  },
  {
    id: "earth-orbital",
    name: "Earth Orbital Ring & Lunar Port",
    sector: "Sector 01 • Sol Gateway",
    category: "sol",
    type: "Megastructure Orbital Station",
    distance: "384,400 km (Earth Orbit)",
    transitTime: "6 Hours Sub-orbital Shuttle",
    gravity: "1.00 g (Centrifugal Spin)",
    temp: "+21°C Constant",
    atmosphere: "Earth Standard 1.0 ATM",
    habitability: 99,
    baseFare: 680,
    image: "assets/images/hero_cruiser.jpg",
    description: "The crown jewel of human engineering: a planetary-spanning tethered ring offering zero-gravity sports, world-class orbital observatory suites, and panoramic views of glowing planetary auroras.",
    planetColors: {
      primary: '#1e40af',
      secondary: '#047857',
      accent: '#38bdf8',
      atmosphere: 'rgba(0, 240, 255, 0.55)',
      clouds: 'rgba(255, 255, 255, 0.55)'
    }
  },
  {
    id: "titan-methane",
    name: "Titan Skylight Haven",
    sector: "Sector 06 • Saturnian System",
    category: "outer",
    type: "Low-Gravity Cryo-Haven",
    distance: "1.4 Billion km (9.5 AU)",
    transitTime: "45 Days Sub-light / 6 Days Warp",
    gravity: "0.14 g",
    temp: "-179°C",
    atmosphere: "Dense Nitrogen & Methane",
    habitability: 62,
    baseFare: 5600,
    image: "assets/images/europa_base.jpg",
    description: "Fly with strap-on personal wings through Titan's dense golden atmosphere and skim liquid methane lakes beneath Saturn's glowing rings. A breathtaking playground for zero-g explorers.",
    planetColors: {
      primary: '#d97706',
      secondary: '#b45309',
      accent: '#fef3c7',
      atmosphere: 'rgba(245, 158, 11, 0.45)',
      clouds: 'rgba(254, 243, 199, 0.3)'
    }
  },
  {
    id: "kepler-452b",
    name: "Kepler-452b Genesis",
    sector: "Sector 72 • Cygnus Expanse",
    category: "exo",
    type: "Super-Earth Exoplanet",
    distance: "1,402 Light Years",
    transitTime: "4.8 Months (Warp Factor 9.6)",
    gravity: "1.90 g",
    temp: "+22°C Temperate Average",
    atmosphere: "Nitrogen, Oxygen, Water Vapor",
    habitability: 94,
    baseFare: 48000,
    image: "assets/images/hero_cruiser.jpg",
    description: "Humanity's true second home: an ancient Super-Earth with massive sapphire oceans, towering hyper-forests, and an optimal G2-type star providing perpetual golden sunlight.",
    planetColors: {
      primary: '#0f766e',
      secondary: '#065f46',
      accent: '#a855f7',
      atmosphere: 'rgba(168, 85, 247, 0.4)',
      clouds: 'rgba(255, 255, 255, 0.45)'
    }
  },
  {
    id: "proxima-b",
    name: "Proxima Centauri b Outpost",
    sector: "Sector 02 • Alpha Centauri Triple",
    category: "exo",
    type: "Tidally Locked Exoworld",
    distance: "4.24 Light Years",
    transitTime: "18 Days (Warp Factor 9.0)",
    gravity: "1.17 g",
    temp: "-39°C to +30°C (Twilight Belt)",
    atmosphere: "Sub-dense Nitrogen with Ozone",
    habitability: 84,
    baseFare: 18500,
    image: "assets/images/mars_colony.jpg",
    description: "Explore the perpetual sunset in the twilight terminator zone between scorching day and frozen night. The closest extrasolar colony, featuring subterranean geothermal cities.",
    planetColors: {
      primary: '#991b1b',
      secondary: '#7f1d1d',
      accent: '#fb7185',
      atmosphere: 'rgba(251, 113, 133, 0.5)',
      clouds: 'rgba(254, 205, 211, 0.3)'
    }
  }
];

const STARSHIP_FLEET = [
  {
    name: "Aethon Interstellar Cruiser",
    class: "Luxury Flagship",
    cruisingSpeed: "0.92 c",
    warpCapability: "Warp 9.8",
    capacity: "450 Passengers",
    shieldRating: "Class-A Kinetic & Graviton"
  },
  {
    name: "Chronos Warp Clipper",
    class: "Express Scout",
    cruisingSpeed: "0.98 c",
    warpCapability: "Warp 9.95",
    capacity: "80 Passengers",
    shieldRating: "Hyper-Deflector Matrix"
  },
  {
    name: "Valkyrie Heavy Transporter",
    class: "Colonial Carrier",
    cruisingSpeed: "0.75 c",
    warpCapability: "Warp 8.5",
    capacity: "1,200 Passengers",
    shieldRating: "Reinforced Titanium-Plasma Armor"
  }
];

window.VOYAGE_DESTINATIONS = VOYAGE_DESTINATIONS;
window.STARSHIP_FLEET = STARSHIP_FLEET;
