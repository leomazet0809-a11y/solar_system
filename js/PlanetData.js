const PLANETS_DATA = {
  sun: {
    name: 'Soleil',
    radius: 300000,
    distance: 0,
    speed: 0,
    rotationSpeed: 0.004,
    color: 0xfdb813,
    emissive: 0xfdb813,
    isSun: true,
    info: {
      type: 'Étoile',
      mass: '1.989 × 10³⁰ kg',
      temperature: '5 778 K',
      age: '4.6 milliards d\'années',
      composition: 'Hydrogène (73%), Hélium (25%)'
    }
  },
  mercury: {
    name: 'Mercure',
    radius: 3825,
    distance: 57.9e6,
    speed: 0.04,
    rotationSpeed: 0.004,
    tilt: 0.04,
    color: 0x8c7853,
    info: {
      type: 'Planète tellurique',
      mass: '3.285 × 10²³ kg',
      temperature: 'De -173°C à 427°C',
      distanceFromSun: '57.9 millions km',
      yearDuration: '88 jours terrestres'
    }
  },
  venus: {
    name: 'Vénus',
    radius: 6052,
    distance: 108.2e6,
    speed: 0.015,
    rotationSpeed: -0.002,
    tilt: 177.4,
    color: 0xffc649,
    info: {
      type: 'Planète tellurique',
      mass: '4.867 × 10²⁴ kg',
      temperature: '464°C',
      distanceFromSun: '108.2 millions km',
      yearDuration: '225 jours terrestres'
    }
  },
  earth: {
    name: 'Terre',
    radius: 6371,
    distance: 149.6e6,
    speed: 0.01,
    rotationSpeed: 0.01,
    tilt: 23.44,
    color: 0x4da6ff,
    info: {
      type: 'Planète tellurique',
      mass: '5.972 × 10²⁴ kg',
      temperature: '15°C (moyenne)',
      distanceFromSun: '149.6 millions km',
      yearDuration: '365.25 jours'
    }
  },
  mars: {
    name: 'Mars',
    radius: 3390,
    distance: 227.9e6,
    speed: 0.008,
    rotationSpeed: 0.009,
    tilt: 25.19,
    color: 0xdc6d4a,
    info: {
      type: 'Planète tellurique',
      mass: '6.417 × 10²³ kg',
      temperature: '-65°C (moyenne)',
      distanceFromSun: '227.9 millions km',
      yearDuration: '687 jours terrestres'
    }
  },
  jupiter: {
    name: 'Jupiter',
    radius: 69911,
    distance: 778.5e6,
    speed: 0.002,
    rotationSpeed: 0.02,
    tilt: 3.13,
    color: 0xdaa520,
    info: {
      type: 'Géante gazeuse',
      mass: '1.898 × 10²⁷ kg',
      temperature: '-110°C (nuages)',
      distanceFromSun: '778.5 millions km',
      yearDuration: '12 années terrestres'
    }
  },
  saturn: {
    name: 'Saturne',
    radius: 58232,
    distance: 1434.0e6,
    speed: 0.0009,
    rotationSpeed: 0.018,
    tilt: 26.73,
    color: 0xf4a460,
    hasRings: true,
    info: {
      type: 'Géante gazeuse',
      mass: '5.683 × 10²⁶ kg',
      temperature: '-140°C (nuages)',
      distanceFromSun: '1.434 milliards km',
      yearDuration: '29.5 années terrestres'
    }
  },
  uranus: {
    name: 'Uranus',
    radius: 25559,
    distance: 2873.0e6,
    speed: 0.0004,
    rotationSpeed: 0.015,
    tilt: 97.77,
    color: 0x4fd0e7,
    info: {
      type: 'Géante glacée',
      mass: '8.681 × 10²⁵ kg',
      temperature: '-195°C (nuages)',
      distanceFromSun: '2.873 milliards km',
      yearDuration: '84 années terrestres'
    }
  },
  neptune: {
    name: 'Neptune',
    radius: 24764,
    distance: 4495.0e6,
    speed: 0.0001,
    rotationSpeed: 0.016,
    tilt: 28.32,
    color: 0x4166f5,
    info: {
      type: 'Géante glacée',
      mass: '1.024 × 10²⁶ kg',
      temperature: '-200°C (nuages)',
      distanceFromSun: '4.495 milliards km',
      yearDuration: '165 années terrestres'
    }
  }
};

const SCALE_FACTORS = {
  distance: 1 / 1e7,
  radius: 1 / 5000,
  time: 0.0001
};

function getScaledPlanetData() {
  const scaled = {};
  Object.entries(PLANETS_DATA).forEach(([key, planet]) => {
    scaled[key] = {
      ...planet,
      scaledRadius: planet.radius * SCALE_FACTORS.radius,
      scaledDistance: planet.distance * SCALE_FACTORS.distance
    };
  });
  return scaled;
}
