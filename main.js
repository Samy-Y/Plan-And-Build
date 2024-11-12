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
	})
	.catch(error => console.error("Error loading textures.json:", error));

const selectedBlocks = { // default values
	base: "cobblestone",   
	middle: "oak_planks",
	top: "bricks"     
};

function updateSelectedBlocks() {
	selectedBlocks.base = document.getElementById("blocks-base").value;
	selectedBlocks.middle = document.getElementById("blocks-middle").value;
	selectedBlocks.top = document.getElementById("blocks-top").value;
}

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
		data.components.base.blocks.forEach(block => { 
			createBlock(block[0], block[1], block[2], selectedBlocks.base); // using arrays to store "coordinates"
		});
		data.components.base.stairs.forEach(stair => { 
			createStairs(stair[0], stair[1], stair[2], selectedBlocks.base, stair[3]);
		});

		data.components.middle.blocks.forEach(block => {
			createBlock(block[0], block[1], block[2], selectedBlocks.middle);
		});
		data.components.middle.stairs.forEach(stair => { 
			createStairs(stair[0], stair[1], stair[2], selectedBlocks.middle, stair[3]);
		});

		data.components.top.blocks.forEach(block => {
			createBlock(block[0], block[1], block[2], selectedBlocks.top);
		});
		data.components.top.stairs.forEach(stair => { 
			createStairs(stair[0], stair[1], stair[2], selectedBlocks.top, stair[3]);
		});

		data.components.windows.blocks.forEach(block => {
			createBlock(block[0], block[1], block[2], "glass");
		}); // no stairs

		data.components.doors.blocks.forEach(door => {
			createDoor(door[0],door[1],door[2],"oak_door", door[3]);
		})
	})
	.catch(error => console.error(`Error loading ${structureFile}:\n`, error));
}

function clearScene() {
	scene.children = scene.children.filter(child => !(child instanceof THREE.Mesh || child instanceof THREE.LineSegments || child instanceof THREE.Group));
}

function createBlock(x, y, z, textureName) {
	const geometry = new THREE.BoxGeometry(1, 1, 1);

	const textureMap = textures[textureName].clone(); // security measure or else they'll share the same instance in mem, and that's bad
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

function createStairs(x, y, z, textureName, orientation) {
    const group = new THREE.Group();

    const textureMap1 = textures[textureName].clone();
    textureMap1.wrapS = THREE.RepeatWrapping;
    textureMap1.wrapT = THREE.RepeatWrapping;
    textureMap1.repeat.set(1, 0.5); 

    const material1 = new THREE.MeshStandardMaterial({ map: textureMap1, transparent: true });

    const geometry1 = new THREE.BoxGeometry(1, 0.5, 1);
    const step1 = new THREE.Mesh(geometry1, material1);
    step1.position.set(0, 0.25, 0); 

    const textureMap2 = textures[textureName].clone();
    textureMap2.wrapS = THREE.RepeatWrapping;
    textureMap2.wrapT = THREE.RepeatWrapping;
    textureMap2.repeat.set(1, 0.5);

    const material2 = new THREE.MeshStandardMaterial({ map: textureMap2, transparent: true });

    const geometry2 = new THREE.BoxGeometry(0.5, 0.5, 1);
    const step2 = new THREE.Mesh(geometry2, material2);
    step2.position.set(0.25, 0.5 +0.25, 0);

    group.add(step1);
    group.add(step2);

    group.position.set(x, y - 0.5, z);

	group.rotateY(orientation*Math.PI/2);

    scene.add(group);
}

function createDoor(x,y,z,textureName,orientation){

	const geometry = new THREE.BoxGeometry(1, 2, 0.25);

	const textureMap = textures[textureName].clone();
	textureMap.wrapS = THREE.RepeatWrapping;
	textureMap.wrapT = THREE.RepeatWrapping;
	textureMap.repeat.set(1, 1);
	const material = new THREE.MeshStandardMaterial({ map: textureMap, transparent: true });
	const door = new THREE.Mesh(geometry, material);

	door.position.set(x, y+0.5, z);
	door.rotateY(orientation * Math.PI/2); // i hate this

	scene.add(door);
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

// render

renderer.shadowMap.enabled = true;

camera.position.set(-10, 8, 10);
camera.lookAt(new THREE.Vector3(0, 8, 0));

function loadSelectedStructure() {
    const structureSelector = document.getElementById("structure-selector");
    const selectedStructure = structureSelector.value;

    clearScene();
    loadStructure(selectedStructure);
}

function onWindowResize() {

	const width = window.innerWidth;
	const height = window.innerHeight;

	camera.aspect = width / height;
	camera.updateProjectionMatrix();

	renderer.setSize( width, height );
}

window.addEventListener( 'resize', onWindowResize ); // doesn't work for some reason

document.getElementById("render-button").addEventListener("click", loadSelectedStructure);
document.getElementById("render-button").addEventListener("click", updateSelectedBlocks);

loadSelectedStructure();

function animate() {
	requestAnimationFrame(animate);
	controls.update();
	renderer.render(scene, camera);
}

const controls = new OrbitControls(camera, renderer.domElement);

animate();