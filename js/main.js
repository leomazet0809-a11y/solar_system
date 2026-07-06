const WINDOW_WIDTH = window.innerWidth;
const WINDOW_HEIGHT = window.innerHeight;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(45, WINDOW_WIDTH / WINDOW_HEIGHT, 0.1, 100000);
camera.position.set(0, 50, 150);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector('canvas') || createCanvas();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, precision: 'highp' });
renderer.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowShadowMap;

if (!document.querySelector('canvas')) {
  document.body.insertBefore(canvas, document.body.firstChild);
}

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 1.5);
sunLight.position.set(0, 0, 0);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
scene.add(sunLight);

let solarSystem;
let controls;
let selectedPlanet = null;

async function initialize() {
  try {
    solarSystem = new SolarSystem(scene);
    await solarSystem.initialize();

    controls = new Controls(camera, canvas);
    setupClickListener();

    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    animate();
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error);
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.textContent = 'Erreur lors du chargement. Veuillez rafraîchir.';
    }
  }
}

let lastTime = Date.now();
let clickListener = null;

function setupClickListener() {
  if (clickListener) {
    canvas.removeEventListener('click', clickListener);
  }

  clickListener = (event) => {
    const rect = canvas.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -((event.clientY - rect.top) / rect.height) * 2 + 1
    );

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const closestKey = solarSystem.getClosestPlanet(raycaster, camera);

    if (closestKey) {
      selectedPlanet = closestKey;
      solarSystem.highlightPlanet(closestKey);
    }
  };

  canvas.addEventListener('click', clickListener);
}

function animate() {
  requestAnimationFrame(animate);

  const now = Date.now();
  const deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  if (solarSystem) {
    solarSystem.update(deltaTime);
  }

  if (controls) {
    controls.update();
  }

  updateUI();
  renderer.render(scene, camera);
}

function updateUI() {
  if (selectedPlanet && solarSystem) {
    const planetInfo = solarSystem.getPlanetInfo(selectedPlanet);

    if (planetInfo) {
      const nameElement = document.getElementById('planet-name');
      const infoElement = document.getElementById('planet-info');

      if (nameElement) {
        nameElement.textContent = planetInfo.name;
      }

      if (infoElement) {
        let infoHTML = `<div><strong>${planetInfo.type}</strong></div>`;
        Object.entries(planetInfo.info).forEach(([key, value]) => {
          if (key !== 'type') {
            const label = key
              .replace(/([A-Z])/g, ' $1')
              .replace(/^./, (str) => str.toUpperCase());
            infoHTML += `<div>${label}: ${value}</div>`;
          }
        });
        infoElement.innerHTML = infoHTML;
      }
    }
  }

  if (controls) {
    const zoomIndicator = document.getElementById('zoom-indicator');
    if (zoomIndicator) {
      zoomIndicator.textContent = `Zoom: ${controls.getZoomPercentage()}%`;
    }
  }
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  document.body.insertBefore(canvas, document.body.firstChild);
  return canvas;
}

window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

initialize();
