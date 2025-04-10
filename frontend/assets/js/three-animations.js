/**
 * Three.js animations for the technical presentation
 */

// Tech Stack 3D Visualization
function initTechStackVisualization() {
    const container = document.querySelector('#tech-stack-container');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create tech stack cubes
    const technologies = [
        { name: 'Node.js', color: 0x68A063 },
        { name: 'Express', color: 0x000000 },
        { name: 'MongoDB', color: 0x4DB33D },
        { name: 'Supabase', color: 0x3ECF8E },
        { name: 'HTML5', color: 0xE34F26 },
        { name: 'CSS3', color: 0x1572B6 },
        { name: 'JavaScript', color: 0xF7DF1E },
        { name: 'Tailwind', color: 0x38B2AC }
    ];

    const cubes = [];
    const cubeSize = 1;
    const radius = 4;

    technologies.forEach((tech, index) => {
        // Create cube
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshPhongMaterial({
            color: tech.color,
            shininess: 100,
            specular: 0x111111
        });
        const cube = new THREE.Mesh(geometry, material);

        // Position in a circle
        const angle = (index / technologies.length) * Math.PI * 2;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.z = Math.sin(angle) * radius;
        cube.position.y = 0;

        // Add to scene
        scene.add(cube);
        cubes.push({
            mesh: cube,
            initialY: cube.position.y,
            speed: 0.01 + Math.random() * 0.01,
            rotationSpeed: 0.01 + Math.random() * 0.01
        });
    });

    // Position camera
    camera.position.z = 10;
    camera.position.y = 3;
    camera.lookAt(0, 0, 0);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate and float cubes
        cubes.forEach((cube, index) => {
            cube.mesh.rotation.x += cube.rotationSpeed;
            cube.mesh.rotation.y += cube.rotationSpeed * 0.8;

            // Floating animation
            cube.mesh.position.y = cube.initialY + Math.sin(Date.now() * cube.speed) * 0.3;
        });

        // Rotate camera slowly around the scene
        const time = Date.now() * 0.0001;
        camera.position.x = Math.sin(time) * 12;
        camera.position.z = Math.cos(time) * 12;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Data Flow 3D Visualization
function initDataFlowVisualization() {
    const container = document.querySelector('.data-flow-container');
    if (!container) return;

    // Clear previous content
    container.innerHTML = '';

    // Set up scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Create nodes
    const nodes = [
        { name: 'Frontend', position: new THREE.Vector3(-5, 0, 0), color: 0x3B82F6 },
        { name: 'API Server', position: new THREE.Vector3(0, 0, 0), color: 0xEF4444 },
        { name: 'MongoDB', position: new THREE.Vector3(5, 2, 0), color: 0x4DB33D },
        { name: 'Supabase', position: new THREE.Vector3(5, -2, 0), color: 0x3ECF8E }
    ];

    // Create node meshes
    const nodeMeshes = nodes.map(node => {
        const geometry = new THREE.SphereGeometry(0.8, 32, 32);
        const material = new THREE.MeshPhongMaterial({
            color: node.color,
            shininess: 100,
            specular: 0x111111
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(node.position);
        scene.add(mesh);
        return mesh;
    });

    // Create connections
    const connections = [
        { from: 0, to: 1 },  // Frontend to API
        { from: 1, to: 2 },  // API to MongoDB
        { from: 1, to: 3 }   // API to Supabase
    ];

    // Create data particles
    const particles = [];
    const particleGeometry = new THREE.SphereGeometry(0.2, 16, 16);

    connections.forEach(connection => {
        const fromNode = nodes[connection.from];
        const toNode = nodes[connection.to];

        // Create line between nodes
        const points = [
            fromNode.position,
            toNode.position
        ];

        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const lineMaterial = new THREE.LineBasicMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.5
        });
        const line = new THREE.Line(lineGeometry, lineMaterial);
        scene.add(line);

        // Create particles that travel along the connection
        for (let i = 0; i < 3; i++) {
            const material = new THREE.MeshPhongMaterial({
                color: fromNode.color,
                shininess: 100,
                emissive: fromNode.color,
                emissiveIntensity: 0.5
            });
            const particle = new THREE.Mesh(particleGeometry, material);
            particle.position.copy(fromNode.position);

            // Add to scene and particles array
            scene.add(particle);
            particles.push({
                mesh: particle,
                from: fromNode.position,
                to: toNode.position,
                progress: Math.random(),  // Random starting position
                speed: 0.005 + Math.random() * 0.005
            });
        }
    });

    // Position camera
    camera.position.z = 10;
    camera.lookAt(0, 0, 0);

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Animate particles along connections
        particles.forEach(particle => {
            // Update progress
            particle.progress += particle.speed;
            if (particle.progress > 1) {
                particle.progress = 0;
            }

            // Interpolate position
            particle.mesh.position.lerpVectors(
                particle.from,
                particle.to,
                particle.progress
            );

            // Pulse size
            const scale = 0.8 + Math.sin(Date.now() * 0.005) * 0.2;
            particle.mesh.scale.set(scale, scale, scale);
        });

        // Rotate nodes slightly
        nodeMeshes.forEach(mesh => {
            mesh.rotation.y += 0.01;
        });

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Initialize animations when needed
document.addEventListener('DOMContentLoaded', () => {
    // These will be called by the presentation controller when needed
    window.initTechStackVisualization = initTechStackVisualization;
    window.initDataFlowVisualization = initDataFlowVisualization;
});

