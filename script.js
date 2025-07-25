import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.154.0/build/three.module.js";

const colors = [0xffffff, 0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xffa500]; // white, red, green, blue, yellow, orange

let cubeSize = 3; // Default
let scene, camera, renderer, cubeGroup;

// Create the cube group
function createCube(size) {
  cubeGroup = new THREE.Group();
  const offset = (size - 1) / 2;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        // Only add "visible" cubies (on the surface, not inside)
        if (
          x === 0 || x === size - 1 ||
          y === 0 || y === size - 1 ||
          z === 0 || z === size - 1
        ) {
          const geometry = new THREE.BoxGeometry(0.92, 0.92, 0.92);
          const materials = [];
          // Assign colors to each face based on position
          for (let i = 0; i < 6; i++) {
            let matColor = 0x222222;
            if (i === 0 && y === size - 1) matColor = colors[0]; // up
            if (i === 1 && y === 0)       matColor = colors[1]; // down
            if (i === 2 && z === size - 1)matColor = colors[2]; // front
            if (i === 3 && z === 0)       matColor = colors[3]; // back
            if (i === 4 && x === 0)       matColor = colors[4]; // left
            if (i === 5 && x === size - 1)matColor = colors[5]; // right
            materials.push(new THREE.MeshBasicMaterial({ color: matColor }));
          }
          const cubie = new THREE.Mesh(geometry, materials);
          cubie.position.set(x - offset, y - offset, z - offset);
          cubeGroup.add(cubie);
        }
      }
    }
  }
  scene.add(cubeGroup);
}

// Scramble function (rotates random groups)
function scrambleCube() {
  // For demo: just rotate the whole cube randomly
  cubeGroup.rotation.x += Math.random() * Math.PI * 2;
  cubeGroup.rotation.y += Math.random() * Math.PI * 2;
}

// Setup Three.js scene
function setup(size) {
  if (renderer) renderer.dispose();
  document.body.querySelectorAll('canvas').forEach(c => c.remove());

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, size * 4);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  createCube(size);

  // Orbit controls (simple mouse drag)
  let isDragging = false, prevX, prevY;
  renderer.domElement.addEventListener('mousedown', e => { isDragging = true; prevX = e.clientX; prevY = e.clientY; });
  window.addEventListener('mouseup', () => { isDragging = false; });
  window.addEventListener('mousemove', e => {
    if (isDragging) {
      cubeGroup.rotation.y += (e.clientX - prevX) * 0.01;
      cubeGroup.rotation.x += (e.clientY - prevY) * 0.01;
      prevX = e.clientX; prevY = e.clientY;
    }
  });

  animate();
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Handle level selection
document.getElementById('levelSelect').addEventListener('change', e => {
  cubeSize = parseInt(e.target.value);
  setup(cubeSize);
});

// Initial load
setup(cubeSize);

window.addEventListener('keydown', (e) => {
  if (e.key === 's') scrambleCube();
});