function createPlanetTexture(planetData) {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  const imageData = ctx.createImageData(size, size);
  const data = imageData.data;

  const noise = simplex3DNoise();

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
        const intensity = noise.noise(nx * 3, ny * 3, nz * 3) * 0.5 + 0.5;
        r = Math.floor(255 * intensity);
        g = Math.floor(200 * intensity * 0.9);
        b = Math.floor(100 * intensity * 0.4);
      } else if (planetData.name === 'Mercure') {
        const n = noise.noise(nx * 4, ny * 4, nz * 4);
        const base = 139 + n * 30;
        r = base;
        g = base;
        b = base;
      } else if (planetData.name === 'Vénus') {
        const n = noise.noise(nx * 5, ny * 5, nz * 5);
        r = 255;
        g = 198 + n * 30;
        b = 73 + n * 20;
      } else if (planetData.name === 'Terre') {
        const landNoise = noise.noise(nx * 3, ny * 3, nz * 3);
        if (landNoise < -0.3) {
          r = 25; g = 85; b = 150;
        } else if (landNoise < 0) {
          r = 50; g = 120; b = 180;
        } else if (landNoise < 0.2) {
          r = 194; g = 178; b = 128;
        } else if (landNoise < 0.5) {
          r = 34; g = 139; b = 34;
        } else {
          r = 128; g = 128; b = 128;
        }
        const cloudNoise = noise.noise(nx * 6, ny * 6, nz * 6);
        if (cloudNoise > 0.4) {
          r = Math.min(255, r + (cloudNoise - 0.4) * 200);
          g = Math.min(255, g + (cloudNoise - 0.4) * 200);
          b = Math.min(255, b + (cloudNoise - 0.4) * 200);
        }
      } else if (planetData.name === 'Mars') {
        const n = noise.noise(nx * 4, ny * 4, nz * 4);
        const rust = 139 + n * 50;
        r = Math.min(255, rust);
        g = Math.floor(rust * 0.6);
        b = Math.floor(rust * 0.4);
      } else if (planetData.name === 'Jupiter') {
        const bandNoise = Math.sin(ny * Math.PI * 10 + noise.noise(nx * 2, ny * 2, nz * 2) * 3) * 0.5 + 0.5;
        const detailNoise = noise.noise(nx * 8, ny * 8, nz * 8);
        r = Math.floor(218 * bandNoise + 30 * detailNoise);
        g = Math.floor(165 * bandNoise + 20 * detailNoise);
        b = Math.floor(32 * bandNoise + 10 * detailNoise);
      } else if (planetData.name === 'Saturne') {
        const bandNoise = Math.sin(ny * Math.PI * 8 + noise.noise(nx * 2, ny * 2, nz * 2) * 3) * 0.5 + 0.5;
        const detailNoise = noise.noise(nx * 6, ny * 6, nz * 6);
        r = Math.floor(244 * bandNoise + 40 * detailNoise);
        g = Math.floor(214 * bandNoise + 30 * detailNoise);
        b = Math.floor(96 * bandNoise + 20 * detailNoise);
      } else if (planetData.name === 'Uranus') {
        const n = noise.noise(nx * 4, ny * 4, nz * 4);
        const cloudNoise = Math.sin(ny * Math.PI * 6) * 0.5 + 0.5;
        r = Math.floor((79 + n * 30) * cloudNoise);
        g = Math.floor((208 + n * 20) * cloudNoise);
        b = Math.floor((231 + n * 20) * cloudNoise);
      } else if (planetData.name === 'Neptune') {
        const n = noise.noise(nx * 4, ny * 4, nz * 4);
        const stormNoise = Math.sin(nz * Math.PI * 8) * 0.5 + 0.5;
        r = Math.floor((65 + n * 20) * stormNoise);
        g = Math.floor((102 + n * 30) * stormNoise);
        b = Math.floor((245 + n * 10) * stormNoise);
      }

      const index = (y * size + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = a;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.anisotropy = 16;
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
