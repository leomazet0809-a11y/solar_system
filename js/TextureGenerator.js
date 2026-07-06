function createPlanetTexture(planetData) {
  const size = 2048;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const noise = simplex3DNoise();

  const fBm = (x, y, z, octaves, persistence) => {
    let value = 0, amplitude = 1, frequency = 1;
    for (let i = 0; i < octaves; i++) {
      value += amplitude * noise.noise(x * frequency, y * frequency, z * frequency);
      amplitude *= persistence;
      frequency *= 2;
    }
    return value;
  };

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;

      const theta = u * Math.PI * 2;
      const phi = v * Math.PI;
      const nx = Math.sin(phi) * Math.cos(theta);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(theta);

      let r, g, b, a = 255;

      if (planetData.isSun) {
        const n1 = fBm(nx * 2, ny * 2, nz * 2, 4, 0.6);
        const n2 = noise.noise(nx * 8, ny * 8, nz * 8);
        const intensity = (n1 * 0.6 + n2 * 0.4) * 0.5 + 0.5;
        const bright = Math.pow(intensity, 0.8);
        r = Math.floor(255 * bright);
        g = Math.floor(210 * bright * 0.95);
        b = Math.floor(100 * bright * 0.5);
      } else if (planetData.name === 'Mercure') {
        const n1 = fBm(nx * 6, ny * 6, nz * 6, 5, 0.5);
        const n2 = noise.noise(nx * 12, ny * 12, nz * 12);
        const crater = Math.sin(nx * 20) * Math.sin(ny * 20) * 0.3;
        const detail = n1 * 0.6 + n2 * 0.3 + crater * 0.1;
        const base = 120 + detail * 40;
        r = Math.floor(base + Math.random() * 15);
        g = Math.floor(base + Math.random() * 10);
        b = Math.floor(base - Math.random() * 10);
      } else if (planetData.name === 'Vénus') {
        const n1 = fBm(nx * 7, ny * 7, nz * 7, 6, 0.5);
        const clouds1 = Math.sin(nx * 15 + ny * 10) * 0.5 + 0.5;
        const clouds2 = Math.sin(ny * 20) * 0.5 + 0.5;
        const sulfur = Math.abs(n1) * 0.5 + 0.3;
        r = Math.floor(255 * sulfur);
        g = Math.floor(200 * sulfur * (0.8 + clouds1 * 0.2));
        b = Math.floor(80 * sulfur * (0.7 + clouds2 * 0.2));
      } else if (planetData.name === 'Terre') {
        const landGen = fBm(nx * 4, ny * 4, nz * 4, 5, 0.6);
        const cloudGen1 = fBm(nx * 8, ny * 8, nz * 8, 4, 0.5);
        const cloudGen2 = Math.sin(nx * 30 + ny * 20);
        let baseR, baseG, baseB;

        if (landGen < -0.4) {
          baseR = 10; baseG = 50; baseB = 140;
        } else if (landGen < -0.2) {
          baseR = 30; baseG = 100; baseB = 180;
        } else if (landGen < 0.1) {
          baseR = 180; baseG = 160; baseB = 100;
        } else if (landGen < 0.35) {
          baseR = 50; baseG = 130; baseB = 40;
        } else if (landGen < 0.6) {
          baseR = 80; baseG = 110; baseB = 60;
        } else {
          baseR = 100; baseG = 90; baseB = 100;
        }

        const cloudIntensity = Math.max(0, cloudGen1 * 0.7 + cloudGen2 * 0.3);
        if (cloudIntensity > 0.3) {
          r = Math.min(255, Math.floor(baseR + (cloudIntensity - 0.3) * 180));
          g = Math.min(255, Math.floor(baseG + (cloudIntensity - 0.3) * 180));
          b = Math.min(255, Math.floor(baseB + (cloudIntensity - 0.3) * 160));
        } else {
          r = baseR; g = baseG; b = baseB;
        }
      } else if (planetData.name === 'Mars') {
        const n1 = fBm(nx * 5, ny * 5, nz * 5, 5, 0.5);
        const n2 = noise.noise(nx * 10, ny * 10, nz * 10);
        const dust = Math.sin(nx * 25) * Math.sin(ny * 25) * 0.2;
        const height = n1 * 0.7 + n2 * 0.2 + dust * 0.1;
        const rustLevel = 150 + height * 80;
        r = Math.min(255, Math.floor(rustLevel));
        g = Math.floor(rustLevel * 0.55);
        b = Math.floor(rustLevel * 0.35);
      } else if (planetData.name === 'Jupiter') {
        const bands = Math.sin(ny * Math.PI * 16 + fBm(nx * 3, ny * 3, nz * 3, 3, 0.6) * 4) * 0.5 + 0.5;
        const swirls = fBm(nx * 6, ny * 6, nz * 6, 5, 0.5);
        const turbulence = Math.abs(Math.sin(nx * 40) * Math.cos(nz * 30)) * 0.3;
        const storm = Math.max(0, fBm(nx * 8, ny * 8, nz * 8, 3, 0.5) - 0.2) * 3;

        const bandColor = bands * 0.6 + swirls * 0.3 + turbulence * 0.1;
        r = Math.floor(230 * bandColor + storm * 40);
        g = Math.floor(180 * bandColor + storm * 20);
        b = Math.floor(50 * bandColor + storm * 10);
      } else if (planetData.name === 'Saturne') {
        const bands = Math.sin(ny * Math.PI * 12 + fBm(nx * 3, ny * 3, nz * 3, 3, 0.6) * 3) * 0.5 + 0.5;
        const clouds = fBm(nx * 7, ny * 7, nz * 7, 5, 0.5);
        const detail = noise.noise(nx * 15, ny * 15, nz * 15);
        const haze = Math.sin(ny * 20) * 0.3 + 0.5;

        const baseColor = bands * 0.5 + clouds * 0.3 + detail * 0.2;
        r = Math.floor(250 * baseColor * haze);
        g = Math.floor(220 * baseColor * haze * 0.95);
        b = Math.floor(120 * baseColor * haze * 0.7);
      } else if (planetData.name === 'Uranus') {
        const layers = Math.sin(ny * Math.PI * 8 + fBm(nx * 4, ny * 4, nz * 4, 4, 0.5) * 2) * 0.5 + 0.5;
        const clouds = fBm(nx * 6, ny * 6, nz * 6, 5, 0.5);
        const methane = Math.abs(fBm(nx * 8, ny * 8, nz * 8, 3, 0.6)) * 0.4;
        const tilt = Math.sin(nz * 15) * 0.3 + 0.5;

        r = Math.floor(100 * (layers * 0.6 + clouds * 0.3 + methane * 0.1) + 50);
        g = Math.floor(210 * (layers * 0.5 + clouds * 0.4 + methane * 0.1));
        b = Math.floor(235 * (layers * 0.4 + clouds * 0.5 + methane * 0.1 + tilt * 0.1));
      } else if (planetData.name === 'Neptune') {
        const windBands = Math.sin(ny * Math.PI * 10 + fBm(nx * 3, ny * 3, nz * 3, 4, 0.6) * 5) * 0.5 + 0.5;
        const storms = fBm(nx * 7, ny * 7, nz * 7, 5, 0.5);
        const darkStorm = Math.max(0, fBm(nx * 10, ny * 10, nz * 10, 3, 0.5) - 0.3) * 2;
        const methaneShift = Math.abs(Math.sin(nz * 12)) * 0.4 + 0.6;

        r = Math.floor(60 * windBands * methaneShift + darkStorm * 30);
        g = Math.floor(120 * windBands * methaneShift + darkStorm * 40);
        b = Math.floor(250 * windBands * methaneShift + darkStorm * 20);
      }

      const index = (y * size + x) * 4;
      data[index] = Math.min(255, Math.max(0, r));
      data[index + 1] = Math.min(255, Math.max(0, g));
      data[index + 2] = Math.min(255, Math.max(0, b));
      data[index + 3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

function simplex3DNoise() {
  const permutation = [];
  for (let i = 0; i < 256; i++) {
    permutation[i] = Math.floor(Math.random() * 256);
  }
  const p = [...permutation, ...permutation];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (t, a, b) => a + t * (b - a);
  const grad = (hash, x, y, z) => {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 8 ? y : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  };

  return {
    noise: (x, y, z) => {
      const xi = Math.floor(x) & 255;
      const yi = Math.floor(y) & 255;
      const zi = Math.floor(z) & 255;

      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);
      const zf = z - Math.floor(z);

      const u = fade(xf);
      const v = fade(yf);
      const w = fade(zf);

      const aaa = p[p[p[xi] + yi] + zi];
      const aba = p[p[p[xi] + yi + 1] + zi];
      const aab = p[p[p[xi] + yi] + zi + 1];
      const abb = p[p[p[xi] + yi + 1] + zi + 1];
      const baa = p[p[p[xi + 1] + yi] + zi];
      const bba = p[p[p[xi + 1] + yi + 1] + zi];
      const bab = p[p[p[xi + 1] + yi] + zi + 1];
      const bbb = p[p[p[xi + 1] + yi + 1] + zi + 1];

      const g0 = grad(aaa, xf, yf, zf);
      const g1 = grad(baa, xf - 1, yf, zf);
      const g2 = grad(aba, xf, yf - 1, zf);
      const g3 = grad(bba, xf - 1, yf - 1, zf);
      const g4 = grad(aab, xf, yf, zf - 1);
      const g5 = grad(bab, xf - 1, yf, zf - 1);
      const g6 = grad(abb, xf, yf - 1, zf - 1);
      const g7 = grad(bbb, xf - 1, yf - 1, zf - 1);

      const l0 = lerp(u, g0, g1);
      const l1 = lerp(u, g2, g3);
      const l2 = lerp(u, g4, g5);
      const l3 = lerp(u, g6, g7);
      const l4 = lerp(v, l0, l1);
      const l5 = lerp(v, l2, l3);

      return lerp(w, l4, l5);
    }
  };
}
