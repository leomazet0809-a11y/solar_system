class SolarSystem {
  constructor(scene) {
    this.scene = scene;
    this.planets = {};
    this.orbits = [];
    this.time = 0;
    this.scaledData = getScaledPlanetData();
  }

  async initialize() {
    const sunData = this.scaledData.sun;
    const sunGeometry = new THREE.IcosahedronGeometry(sunData.scaledRadius, 64);
    const sunTexture = createPlanetTexture(sunData);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
      color: sunData.color,
      emissive: sunData.emissive,
      emissiveIntensity: 1
    });

    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.userData = { ...sunData, key: 'sun' };

    const glowGeometry = new THREE.IcosahedronGeometry(sunData.scaledRadius * 1.2, 64);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: sunData.color,
      transparent: true,
      opacity: 0.2
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    sun.add(glow);

    this.scene.add(sun);
    this.planets.sun = sun;

    const planetKeys = ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune'];

    for (const key of planetKeys) {
      const planetData = this.scaledData[key];
      const planet = this.createPlanet(planetData, key);
      this.planets[key] = planet;
      this.createOrbit(planetData.scaledDistance);
    }
  }

  createPlanet(planetData, key) {
    const segments = 128;
    const geometry = new THREE.IcosahedronGeometry(planetData.scaledRadius, segments);

    const texture = createPlanetTexture(planetData);
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      color: planetData.color,
      emissive: 0x000000,
      emissiveIntensity: 0,
      shininess: 5
    });

    const planet = new THREE.Mesh(geometry, material);
    planet.userData = { ...planetData, key, angle: Math.random() * Math.PI * 2 };

    if (planetData.hasRings) {
      this.addSaturnRings(planet, planetData);
    }

    this.scene.add(planet);
    return planet;
  }

  addSaturnRings(planet, planetData) {
    const innerRadius = planetData.scaledRadius * 1.5;
    const outerRadius = planetData.scaledRadius * 2.5;
    const geometry = new THREE.BufferGeometry();

    const vertices = [];
    const indices = [];

    for (let i = 0; i < 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);

      vertices.push(cos * innerRadius, 0, sin * innerRadius);
      vertices.push(cos * outerRadius, 0, sin * outerRadius);

      if (i < 63) {
        const a = i * 2;
        const b = a + 1;
        const c = (i + 1) * 2;
        const d = c + 1;

        indices.push(a, b, c);
        indices.push(b, d, c);
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));
    geometry.setIndex(new THREE.BufferAttribute(new Uint32Array(indices), 1));

    const material = new THREE.MeshPhongMaterial({
      color: 0xd4a574,
      emissive: 0x000000,
      emissiveIntensity: 0,
      shininess: 30,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });

    const rings = new THREE.Mesh(geometry, material);
    rings.rotation.x = (planetData.tilt || 0) * Math.PI / 180;
    planet.add(rings);
  }

  createOrbit(distance) {
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i <= 256; i++) {
      const angle = (i / 256) * Math.PI * 2;
      vertices.push(
        Math.cos(angle) * distance,
        0,
        Math.sin(angle) * distance
      );
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3));

    const material = new THREE.LineBasicMaterial({
      color: 0x444444,
      transparent: true,
      opacity: 0.3,
      linewidth: 1
    });

    const orbit = new THREE.Line(geometry, material);
    this.scene.add(orbit);
    this.orbits.push(orbit);
  }

  update(deltaTime) {
    this.time += deltaTime * SCALE_FACTORS.time;

    const planetKeys = Object.keys(this.planets);

    planetKeys.forEach(key => {
      const planet = this.planets[key];
      const data = planet.userData;

      if (key !== 'sun') {
        const angle = this.time * data.speed + data.angle;
        planet.position.x = Math.cos(angle) * data.scaledDistance;
        planet.position.z = Math.sin(angle) * data.scaledDistance;

        planet.rotation.y += data.rotationSpeed * deltaTime;

        if (data.tilt) {
          planet.rotation.z = (data.tilt * Math.PI / 180);
        }
      } else {
        planet.rotation.y += data.rotationSpeed * deltaTime;
      }
    });
  }

  getPlanetInfo(key) {
    const planet = this.planets[key];
    if (!planet) return null;

    const data = planet.userData;
    return {
      name: data.name,
      type: data.info.type,
      info: data.info
    };
  }

  highlightPlanet(key) {
    Object.values(this.planets).forEach(planet => {
      if (planet.material.emissiveIntensity !== undefined) {
        planet.material.emissiveIntensity = 0;
      }
    });

    if (key && this.planets[key]) {
      const planet = this.planets[key];
      if (planet.material.emissiveIntensity !== undefined) {
        planet.material.emissiveIntensity = 0.3;
        planet.material.needsUpdate = true;
      }
    }
  }

  getClosestPlanet(raycaster, camera) {
    const intersects = raycaster.intersectObjects(Object.values(this.planets));

    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const object = intersects[i].object;
        if (object.userData && object.userData.key) {
          return object.userData.key;
        }
      }
    }

    return null;
  }
}
