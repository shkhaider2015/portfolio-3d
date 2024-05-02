import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// Setup

const progressBar = document.getElementById("progress-bar");
const progressBarContainer = document.getElementsByClassName(
  "progress-bar-container"
);

const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function (url, loaded, total) {
  console.log("Start : ", url, loaded, total);
};
loadingManager.onProgress = function (url, loaded, total) {
  console.log("Progress : ", url, loaded, total);
  progressBar.value = (loaded / total) * 100;
};
loadingManager.onLoad = function () {
  console.log("Loaded : ", progressBarContainer);
  if (progressBarContainer.length > 0) {
    progressBarContainer[0].style.display = "none";
  }
};
loadingManager.onError = function (url) {
  console.log("Error : ", url);
  if (progressBarContainer.length > 0) {
    progressBarContainer[0].style.display = "none";
  }
};
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);
camera.position.setX(-3);

renderer.render(scene, camera);

// Torus

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({ color: 0xff6347 });
const torus = new THREE.Mesh(geometry, material);

scene.add(torus);

// Lights

const pointLight = new THREE.PointLight(0xffffff, 100, 20, 2);
pointLight.position.set(2, 1, 3);

const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(pointLight, ambientLight);

// const mainLight = new THREE.PointLight(0xffffff, 100,10, 2);
// mainLight.position.set(-20, 20, 3);
// scene.add(mainLight)
// Helpers

// const lightHelper = new THREE.PointLightHelper(pointLight)
// const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(lightHelper, gridHelper)

// const controls = new OrbitControls(camera, renderer.domElement);
const normalTexture = new THREE.TextureLoader(loadingManager).load(
  "normal.jpg"
);

function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3)
    .fill()
    .map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// Background

const spaceTexture = new THREE.TextureLoader(loadingManager).load("space.jpg");
scene.background = spaceTexture;

// Avatar

const shakeelHaiderTexture = new THREE.TextureLoader(loadingManager).load(
  "shakeel_haider.jpg"
);

const shakeelHaider = new THREE.Mesh(
  new RoundedBoxGeometry(3, 3, 3),
  new THREE.MeshBasicMaterial({ map: shakeelHaiderTexture })
);

scene.add(shakeelHaider);

// earth
const earthTexture = new THREE.TextureLoader(loadingManager).load(
  "flat_earth03.jpeg"
);

const earthGeo = new THREE.SphereGeometry(2, 40, 40);
const earthMesh = new THREE.MeshStandardMaterial({
  map: earthTexture,
});

const earth = new THREE.Mesh(earthGeo, earthMesh);
scene.add(earth);

// Moon

const moonTexture = new THREE.TextureLoader(loadingManager).load("moon.jpg");

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture,
  })
);

scene.add(moon);

const marsTexture = new THREE.TextureLoader(loadingManager).load(
  "Mars_Map.webp"
);

const mars = new THREE.Mesh(
  new THREE.SphereGeometry(3, 44, 44),
  new THREE.MeshStandardMaterial({
    map: marsTexture,
    normalMap: normalTexture,
  })
);

scene.add(mars);

moon.position.z = 30;
moon.position.setX(-10);

mars.position.z = 50;
mars.position.setX(-20);

shakeelHaider.position.z = 60;
shakeelHaider.position.x = -20;
shakeelHaider.position.setY(-5)
shakeelHaider.rotateY(20)

earth.position.z = -5;
earth.position.x = 2;

// Scroll Animation

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  moon.rotation.x += 0.05;
  moon.rotation.y += 0.075;
  moon.rotation.z += 0.05;

  mars.rotation.x += 0.03;
  mars.rotation.y += 0.055;
  mars.rotation.z += 0.03;

  // shakeelHaider.rotation.y += 0.01;
  // shakeelHaider.rotation.z += 0.01;

  earth.rotation.y += 0.01;
  earth.rotation.z += 0.01;

  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.rotation.y = t * -0.0002;
}

document.body.onscroll = moveCamera;
moveCamera();

// Animation Loop

function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.01;
  torus.rotation.y += 0.005;
  torus.rotation.z += 0.01;

  earth.rotation.x += 0.0005;
  moon.rotation.x += 0.005;
  mars.rotation.x += 0.003;

  // controls.update();

  renderer.render(scene, camera);
}

animate();
