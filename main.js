import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
	70, // fov (similar to minecraft's default)
	document.getElementById("canvas").clientWidth / document.getElementById("canvas").clientHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); // alpha (transparency) set to true
// so i can manipulate the background using only css
// canvas: canvas means the canvas element in index.html is used to render everything

renderer.setSize(document.getElementById("canvas").clientWidth, document.getElementById("canvas").clientHeight);

// load all textures from textures.json
const textures = {}; // Store loaded textures

fetch("./data/textures.json")
	.then(response => {
		if (!response.ok) throw new Error("Network response was not ok");
		return response.json();
	})
	.then(data => {
		Object.keys(data).forEach(key => {
			const texture = new THREE.TextureLoader().load(data[key]);
			texture.minFilter = THREE.NearestFilter; // When texture scaled down
			texture.magFilter = THREE.NearestFilter; // When texture scaled up
			texture.colorSpace = THREE.SRGBColorSpace; // so that the textures don't look washed out
			// defaults to no color space for some reason
			textures[key] = texture;
		});
	loadStructure("house.json"); // default structure (gui soonTM)
	})
	.catch(error => console.error("Error loading textures.json:", error));

function loadStructure(structureFile) {
	fetch(`./data/${structureFile}`)
	.then(response => {
		if (!response.ok) throw new Error("Network response was not ok");
		return response.json();
	})
	.then(data => {
		// clear the scene before loading new structure
		// i know i could have used ImageUtils.loadTexture but i discovered this way too late :(
		clearScene();
		data.blocks.base.forEach(block => { 
			createBlock(block[0], block[1], block[2], "cobblestone"); // using arrays to store "coordinates"
		});
		data.blocks.middle.forEach(block => {
			createBlock(block[0], block[1], block[2], "oak_planks");
		});
		data.blocks.top.forEach(block => {
			createBlock(block[0], block[1], block[2], "bricks");
		});
		data.blocks.windows.forEach(block => {
			createBlock(block[0], block[1], block[2], "glass");
		});
	})
	.catch(error => console.error(`Error loading ${structureFile}:\n`, error));
}

function clearScene() {
	scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh || child instanceof THREE.LineSegments));
}

function createBlock(x, y, z, textureName) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);

	const textureMap = textures[textureName];
	const material = new THREE.MeshStandardMaterial({ map: textureMap, transparent: true });
	const cube = new THREE.Mesh(geometry, material);

	// outlines
	const edges = new THREE.EdgesGeometry(geometry);
	const lineMaterial = new THREE.LineBasicMaterial({ color: 0x333333 });
	const line = new THREE.LineSegments(edges, lineMaterial);
	line.position.set(x, y, z);
	scene.add(line);

	cube.position.set(x, y, z);
	scene.add(cube);
}

// lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 20, 10).normalize();
scene.add(directionalLight);

const spotlight = new THREE.SpotLight(0xffffff, 1);
spotlight.position.set(15, 30, 15);
spotlight.castShadow = true;
scene.add(spotlight);


renderer.shadowMap.enabled = true;

camera.position.set(8, 8, 8);
camera.lookAt(0, 0, 0);

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);

animate();