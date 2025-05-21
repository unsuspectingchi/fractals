import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';

console.log('main.js starting execution...');

// Safety check for THREE
if (typeof THREE === 'undefined') {
    console.error('THREE is not defined in main.js!');
    throw new Error('THREE is not defined');
}

console.log('THREE is defined in main.js, proceeding with initialization...');

// Create scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// Create camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer
const renderer = new THREE.WebGLRenderer({ 
    antialias: false,
    powerPreference: "high-performance",
    precision: 'mediump'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false;
document.body.appendChild(renderer.domElement);

// Add loading manager
const loadingManager = new THREE.LoadingManager();
loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100;
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    progressBar.style.width = progress + '%';
    loadingText.textContent = Math.round(progress) + '%';
};

loadingManager.onLoad = () => {
    // Hide loading bar when everything is loaded
    const loadingContainer = document.getElementById('loading-container');
    loadingContainer.style.display = 'none';
};

loadingManager.onError = (url) => {
    console.error(`Error loading: ${url}`);
    const loadingText = document.getElementById('loading-text');
    loadingText.textContent = 'Error loading model!';
    loadingText.style.color = '#ff4444';
};

// Create loader
const loader = new GLTFLoader(loadingManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
loader.setDRACOLoader(dracoLoader);

// Create a group to hold all models
const modelGroup = new THREE.Group();
scene.add(modelGroup);

// Store the base model for cloning
let baseModel = null;
let baseModelSize = 0;
let currentFractal = 'menger';

// Create lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);
scene.add(ambientLight);

// Create specific lights for Menger
const mengerCenterLight = new THREE.PointLight(0x4169E1, 4.0, 8);
mengerCenterLight.position.set(0, 0, 0);
scene.add(mengerCenterLight);

const mengerKeyLight = new THREE.DirectionalLight(0xffffff, 3.0);
mengerKeyLight.position.set(3, 3, 3);
scene.add(mengerKeyLight);

const mengerFillLight = new THREE.DirectionalLight(0x4169E1, 2.5);
mengerFillLight.position.set(-3, -2, 2);
scene.add(mengerFillLight);

const mengerBackLight = new THREE.DirectionalLight(0xffffff, 2.0);
mengerBackLight.position.set(0, 0, -3);
scene.add(mengerBackLight);

// Create specific lights for Sierpinski
const sierpinskiCenterLight = new THREE.PointLight(0xffffff, 5.0, 10);
sierpinskiCenterLight.position.set(0, 0, 0);
scene.add(sierpinskiCenterLight);
sierpinskiCenterLight.visible = false; // Initially hidden

const sierpinskiFillLight = new THREE.DirectionalLight(0x4169E1, 2.0);
sierpinskiFillLight.position.set(0, 5, 0);
scene.add(sierpinskiFillLight);
sierpinskiFillLight.visible = false; // Initially hidden

// Function to create a Menger Sponge using the loaded model as the base cube
function createMengerSponge(level, size) {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
        color: 0x4169E1,
        metalness: 0.7,
        roughness: 0.2,
        transparent: true,
        opacity: 1.0,
        flatShading: true
    });
    
    function subdivide(x, y, z, size, currentLevel) {
        if (currentLevel === 0) {
            const modelInstance = baseModel.clone();
            modelInstance.scale.setScalar(size / baseModelSize);
            modelInstance.position.set(x, y, z);
            modelInstance.traverse((child) => {
                if (child.isMesh) {
                    child.material = material;
                }
            });
            group.add(modelInstance);
            return;
        }

        const newSize = size / 3;
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                for (let k = -1; k <= 1; k++) {
                    // Skip center pieces on each face
                    if (Math.abs(i) + Math.abs(j) + Math.abs(k) <= 1) continue;
                    
                    const newX = x + i * newSize;
                    const newY = y + j * newSize;
                    const newZ = z + k * newSize;
                    
                    subdivide(newX, newY, newZ, newSize, currentLevel - 1);
                }
            }
        }
    }

    // Start subdivision
    subdivide(0, 0, 0, size, level);
    return group;
}

// Function to create a 3D Sierpinski Tetrahedron
function createSierpinskiTetrahedron(level, size) {
    const group = new THREE.Group();
    
    function subdivide(x, y, z, size, currentLevel) {
        if (currentLevel === 0) {
            // Clone the base model for this position
            const modelInstance = baseModel.clone();
            modelInstance.scale.setScalar(size / baseModelSize);
            modelInstance.position.set(x, y, z);
            group.add(modelInstance);
            return;
        }

        const newSize = size / 2;
        const height = size * Math.sqrt(2/3); // Height of regular tetrahedron
        
        // Calculate positions for the four sub-tetrahedra
        // These positions form a regular tetrahedron
        const positions = [
            { x: x - newSize/2, y: y - height/4, z: z - newSize/2 },  // Bottom left
            { x: x + newSize/2, y: y - height/4, z: z - newSize/2 },  // Bottom right
            { x: x, y: y - height/4, z: z + newSize/2 },              // Bottom back
            { x: x, y: y + height/2, z: z }                           // Top
        ];

        // Create sub-tetrahedra
        positions.forEach(pos => {
            subdivide(pos.x, pos.y, pos.z, newSize, currentLevel - 1);
        });
    }

    // Start subdivision
    subdivide(0, 0, 0, size, level);
    return group;
}

// Function to create a simple Sierpinski pyramid with 5 models
function createSimpleSierpinskiPyramid(size) {
    const group = new THREE.Group();
    
    // Define the 5 positions for the models
    // 4 models in a tight square formation + 1 centered above
    const squareSize = size * 0.83;
    const yOffset = -squareSize * 0.2;
    const positions = [
        { x: -squareSize/2, y: yOffset, z: -squareSize/2 },    // Bottom left
        { x: squareSize/2, y: yOffset, z: -squareSize/2 },     // Bottom right
        { x: squareSize/2, y: yOffset, z: squareSize/2 },      // Top right
        { x: -squareSize/2, y: yOffset, z: squareSize/2 },     // Top left
        { x: 0, y: squareSize + yOffset, z: 0 }                // Center top
    ];

    // Create models at each position
    positions.forEach(pos => {
        const modelInstance = baseModel.clone();
        modelInstance.position.set(pos.x, pos.y, pos.z);
        // Add a small point light to each model for Sierpinski
        if (currentFractal === 'sierpinski') {
            const modelLight = new THREE.PointLight(0xffffff, 2.0, 3);
            modelLight.position.set(0, 0, 0);
            modelInstance.add(modelLight);
        }
        group.add(modelInstance);
    });

    return group;
}

// Function to clear the current model
function clearCurrentModel() {
    while(modelGroup.children.length > 0) {
        const child = modelGroup.children[0];
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
            if (Array.isArray(child.material)) {
                child.material.forEach(material => material.dispose());
            } else {
                child.material.dispose();
            }
        }
        modelGroup.remove(child);
    }
}

// Add OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.1;
controls.rotateSpeed = 0.7;
controls.zoomSpeed = 0.7;
controls.enablePan = false;

// Function to update controls based on fractal type
function updateControls(type) {
    if (type === 'sierpinski') {
        // Sierpinski controls - prevent zooming too close
        const sierpinskiSize = 4 * 0.83; // Using the same size as the pyramid
        controls.minDistance = sierpinskiSize * 1.5; // Minimum zoom distance
        controls.maxDistance = 15; // Maximum zoom distance
    } else {
        // Menger controls - original settings
        const modelSize = 2;
        controls.minDistance = (modelSize * Math.sqrt(3) / 2) + 0.1;
        controls.maxDistance = 10;
    }
    controls.target.set(0, 0, 0);
    controls.update();
}

// Function to load a specific fractal model
function loadFractalModel(type) {
    // Clear any existing model first
    clearCurrentModel();
    currentFractal = type;
    
    // Update controls and lighting
    updateControls(type);
    updateLighting(type);
    
    // Reset loading progress
    const progressBar = document.getElementById('loading-progress');
    const loadingText = document.getElementById('loading-text');
    const loadingContainer = document.getElementById('loading-container');
    
    progressBar.style.width = '0%';
    loadingText.textContent = '0%';
    loadingText.style.color = '#ffffff'; // Reset text color
    loadingContainer.style.display = 'block';

    // Load the appropriate model based on type
    // const modelPath = type === 'sierpinski' ? '/fractals/models/sierpinski.glb' : `/fractals/models/${type}_sponge.glb`;
    const modelPath = type === 'sierpinski' 
    ? '/fractals/models/sierpinski-compressed.glb' 
    : '/fractals/models/menger_sponge-compressed.glb';

    
    console.log(`Attempting to load model from: ${modelPath}`);
    
    // Reset the loading manager
    loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
        console.log(`Started loading: ${url}`);
    };
    
    loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
        const progress = (itemsLoaded / itemsTotal) * 100;
        console.log(`Loading progress: ${progress.toFixed(2)}%`);
        progressBar.style.width = progress + '%';
        loadingText.textContent = Math.round(progress) + '%';
    };
    
    loadingManager.onLoad = () => {
        console.log('Loading complete!');
        loadingContainer.style.display = 'none';
    };
    
    loadingManager.onError = (url) => {
        console.error(`Error loading: ${url}`);
        loadingText.textContent = 'Error loading model!';
        loadingText.style.color = '#ff4444';
    };

    // Load the model
    loader.load(
        modelPath,
        (gltf) => {
            console.log(`Model loaded successfully: ${modelPath}`);
            const model = gltf.scene;
            
            // Store the base model and its size
            baseModel = model;
            const box = new THREE.Box3().setFromObject(model);
            baseModelSize = Math.max(
                box.max.x - box.min.x,
                box.max.y - box.min.y,
                box.max.z - box.min.z
            );
            
            // Create and add the fractal
            let fractal;
            if (type === 'sierpinski') {
                fractal = createSimpleSierpinskiPyramid(4);
                camera.position.set(8, 8, 8);
            } else {
                fractal = createMengerSponge(1, 2);
                camera.position.set(0, 0, 5);
            }
            
            modelGroup.add(fractal);
            controls.target.set(0, 0, 0);
            controls.update();
            
            // Hide loading container
            loadingContainer.style.display = 'none';
        },
        (xhr) => {
            if (xhr.lengthComputable) {
                const progress = (xhr.loaded / xhr.total * 100);
                console.log(`Download progress: ${progress.toFixed(2)}%`);
                progressBar.style.width = progress + '%';
                loadingText.textContent = Math.round(progress) + '%';
            }
        },
        (error) => {
            console.error('An error happened:', error);
            loadingText.textContent = 'Error loading model!';
            loadingText.style.color = '#ff4444';
        }
    );
}

// Helper function to update lighting based on fractal type
function updateLighting(type) {
    if (type === 'sierpinski') {
        // Enable Sierpinski-specific lights
        sierpinskiCenterLight.visible = true;
        sierpinskiFillLight.visible = true;
        // Disable Menger lights
        mengerCenterLight.visible = false;
        mengerKeyLight.visible = false;
        mengerFillLight.visible = false;
        mengerBackLight.visible = false;
        // Adjust ambient light
        ambientLight.intensity = 1.0;
    } else {
        // Enable Menger-specific lights
        mengerCenterLight.visible = true;
        mengerKeyLight.visible = true;
        mengerFillLight.visible = true;
        mengerBackLight.visible = true;
        // Disable Sierpinski lights
        sierpinskiCenterLight.visible = false;
        sierpinskiFillLight.visible = false;
        // Adjust ambient light
        ambientLight.intensity = 1.5;
    }
}

// Listen for fractal change events
window.addEventListener('fractalChange', (event) => {
    loadFractalModel(event.detail.type);
});

// Initial setup
updateControls('menger'); // Set initial controls for Menger

// Optimized animation loop
let lastTime = 0;
const rotationSpeed = 0.001; // Reduced rotation speed

function animate(currentTime) {
    requestAnimationFrame(animate);
    
    // Calculate delta time for smooth animation
    const delta = currentTime - lastTime;
    lastTime = currentTime;
    
    // Only update rotation if enough time has passed and not in Sierpinski mode
    if (delta > 16 && currentFractal !== 'sierpinski') { // Cap at ~60fps
        modelGroup.rotation.x += rotationSpeed;
        modelGroup.rotation.y += rotationSpeed;
    }
    
    // Only update controls if they've changed
    if (controls.enabled) {
        controls.update();
    }
    
    renderer.render(scene, camera);
}

// Start animation loop with timestamp
animate(performance.now());

// Handle window resize
window.addEventListener('resize', () => {
    const newWidth = window.innerWidth;
    const newHeight = window.innerHeight;
    
    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(newWidth, newHeight);
}); 