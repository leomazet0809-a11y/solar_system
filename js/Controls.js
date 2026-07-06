class Controls {
  constructor(camera, canvas) {
    this.camera = camera;
    this.canvas = canvas;

    this.isRotating = false;
    this.rotationSpeed = 0.005;
    this.mouseX = 0;
    this.mouseY = 0;

    const pos = camera.position;
    const distance = pos.length();
    this.targetRotationY = Math.atan2(pos.x, pos.z);
    this.targetRotationX = Math.asin(pos.y / distance);

    this.zoom = 1;
    this.minZoom = 0.1;
    this.maxZoom = 10;
    this.zoomSpeed = 0.1;

    this.touchStartDistance = 0;
    this.touchStartZoom = 1;

    this.setupEventListeners();
  }

  setupEventListeners() {
    this.canvas.addEventListener('wheel', (e) => this.onMouseWheel(e), { passive: false });
    this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('mouseup', () => this.onMouseUp());
    this.canvas.addEventListener('mouseleave', () => this.onMouseUp());

    this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
    this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e), { passive: false });
    this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });

    window.addEventListener('wheel', (e) => {
      if (e.target === this.canvas) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  onMouseWheel(event) {
    event.preventDefault();

    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const direction = {
      x: (x - centerX) / rect.width,
      y: (y - centerY) / rect.height
    };

    const delta = event.deltaY > 0 ? -this.zoomSpeed : this.zoomSpeed;
    this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.zoom * (1 + delta)));

    this.updateCameraZoom(direction);
  }

  onMouseDown(event) {
    this.isRotating = true;
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onMouseMove(event) {
    if (!this.isRotating) return;

    const deltaX = event.clientX - this.mouseX;
    const deltaY = event.clientY - this.mouseY;

    this.targetRotationY += deltaX * this.rotationSpeed;
    this.targetRotationX += deltaY * this.rotationSpeed;

    this.targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotationX));

    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  }

  onMouseUp() {
    this.isRotating = false;
  }

  onTouchStart(event) {
    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      this.touchStartZoom = this.zoom;
    } else if (event.touches.length === 1) {
      this.isRotating = true;
      this.mouseX = event.touches[0].clientX;
      this.mouseY = event.touches[0].clientY;
    }
  }

  onTouchMove(event) {
    event.preventDefault();

    if (event.touches.length === 2) {
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      const scale = distance / this.touchStartDistance;
      this.zoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.touchStartZoom / scale));

      const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
      const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;

      const rect = this.canvas.getBoundingClientRect();
      const direction = {
        x: (centerX - rect.left - rect.width / 2) / rect.width,
        y: (centerY - rect.top - rect.height / 2) / rect.height
      };

      this.updateCameraZoom(direction);
    } else if (event.touches.length === 1 && this.isRotating) {
      const deltaX = event.touches[0].clientX - this.mouseX;
      const deltaY = event.touches[0].clientY - this.mouseY;

      this.targetRotationY += deltaX * this.rotationSpeed;
      this.targetRotationX += deltaY * this.rotationSpeed;

      this.targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.targetRotationX));

      this.mouseX = event.touches[0].clientX;
      this.mouseY = event.touches[0].clientY;
    }
  }

  onTouchEnd(event) {
    if (event.touches.length === 0) {
      this.isRotating = false;
      this.touchStartDistance = 0;
    }
  }

  updateCameraZoom(direction = { x: 0, y: 0 }) {
    const distance = 150 / this.zoom;

    this.camera.position.z = distance * Math.cos(this.targetRotationX) * Math.cos(this.targetRotationY);
    this.camera.position.x = distance * Math.cos(this.targetRotationX) * Math.sin(this.targetRotationY);
    this.camera.position.y = distance * Math.sin(this.targetRotationX);

    this.camera.lookAt(0, 0, 0);
    this.camera.updateProjectionMatrix();
  }

  update() {
    this.updateCameraZoom();
  }

  getZoomPercentage() {
    return Math.round((this.zoom / this.maxZoom) * 100);
  }
}
