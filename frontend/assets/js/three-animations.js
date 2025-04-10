/**
 * Three.js animations for the technical presentation
 */

const THREE = require('three');

// Tech Stack 3D Visualization
function initTechStackVisualization() {
    console.log('Initializing Tech Stack Visualization');
    const container = document.querySelector('#tech-stack-container');
    if (!container) {
      console.error('Tech stack container not found');
      return;
    }
  
    try {
      // Clear previous content
      container.innerHTML = '';
  
      // Set up scene, camera, and renderer
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
  
      // Create technology cubes arranged in a circle
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
        // Create a cube geometry and material for each technology
        const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const material = new THREE.MeshPhongMaterial({
          color: tech.color,
          shininess: 100,
          specular: 0x111111
        });
        const cube = new THREE.Mesh(geometry, material);
        // Position cubes in a circle
        const angle = (index / technologies.length) * Math.PI * 2;
        cube.position.x = Math.cos(angle) * radius;
        cube.position.z = Math.sin(angle) * radius;
        cube.position.y = 0;
        scene.add(cube);
        cubes.push({
          mesh: cube,
          initialY: cube.position.y,
          speed: 0.01 + Math.random() * 0.01,
          rotationSpeed: 0.01 + Math.random() * 0.01
        });
      });
  
      // Position camera and start animation loop
      camera.position.z = 10;
      camera.position.y = 3;
      camera.lookAt(0, 0, 0);
  
      function animate() {
        const animationId = requestAnimationFrame(animate);
        container.dataset.animationId = animationId;
  
        // Animate each cube (rotation and floating effect)
        cubes.forEach(cube => {
          cube.mesh.rotation.x += cube.rotationSpeed;
          cube.mesh.rotation.y += cube.rotationSpeed * 0.8;
          cube.mesh.position.y = cube.initialY + Math.sin(Date.now() * cube.speed) * 0.3;
        });
  
        // Slowly rotate the camera around the scene center
        const time = Date.now() * 0.0001;
        camera.position.x = Math.sin(time) * 12;
        camera.position.z = Math.cos(time) * 12;
        camera.lookAt(0, 0, 0);
        renderer.render(scene, camera);
      }
      animate();
  
      // Handle window resizing
      const resizeHandler = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', resizeHandler);
      container.dataset.resizeHandler = true;
  
      console.log('Tech Stack Visualization initialized successfully');
    // After
} catch (error) {
    console.error('Error initializing Tech Stack Visualization:', error);
    const fallbackTech = ['Node.js', 'Express', 'MongoDB', 'Supabase', 'HTML5', 'CSS3', 'JavaScript', 'Tailwind'];
    container.innerHTML = `
      <div class="flex flex-wrap justify-center gap-4 p-4">
        ${fallbackTech.map(tech =>
          `<div class="bg-gray-800 text-white p-4 rounded-lg shadow-lg">${tech}</div>`
        ).join('')}
      </div>
    `;
  }
  }
  // Data Flow 3D Visualization
  function initDataFlowVisualization() {
    console.log('Initializing Data Flow Visualization');
    const container = document.querySelector('.data-flow-container');
    if (!container) {
      console.error('Data flow container not found');
      return;
    }
  
    try {
      container.innerHTML = '';
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(container.clientWidth, container.clientHeight);
      container.appendChild(renderer.domElement);
  
      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(0, 10, 10);
      scene.add(directionalLight);
  
      // Define nodes for the data flow (Client, API, Auth, Database, Storage)
      const nodes = [
        { name: 'Client', position: { x: -8, y: 0, z: 0 }, color: 0x3498db },
        { name: 'API', position: { x: -4, y: 0, z: 0 }, color: 0x2ecc71 },
        { name: 'Auth', position: { x: 0, y: 2, z: 0 }, color: 0xe74c3c },
        { name: 'Database', position: { x: 4, y: 0, z: 0 }, color: 0xf39c12 },
        { name: 'Storage', position: { x: 0, y: -2, z: 0 }, color: 0x9b59b6 }
      ];
      const nodeMeshes = [];
      const nodeSize = 1;
  
      nodes.forEach(node => {
        const geometry = new THREE.SphereGeometry(nodeSize, 32, 32);
        const material = new THREE.MeshPhongMaterial({ color: node.color, shininess: 100, specular: 0x111111 });
        const sphere = new THREE.Mesh(geometry, material);
        sphere.position.set(node.position.x, node.position.y, node.position.z);
        scene.add(sphere);
        nodeMeshes.push(sphere);
      });
  
      // Create connection lines between nodes
      const connections = [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
        { from: 2, to: 3 }
      ];
      connections.forEach(connection => {
        const fromNode = nodeMeshes[connection.from];
        const toNode = nodeMeshes[connection.to];
        const points = [fromNode.position.clone(), toNode.position.clone()];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({ color: 0xaaaaaa, opacity: 0.7, transparent: true });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      });
  
      // Create moving particles along the connections
      const particles = [];
      const particleCount = 50;
      for (let i = 0; i < particleCount; i++) {
        const connectionIndex = Math.floor(Math.random() * connections.length);
        const connection = connections[connectionIndex];
        const fromNode = nodeMeshes[connection.from];
        const toNode = nodeMeshes[connection.to];
  
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8 });
        const particle = new THREE.Mesh(geometry, material);
        particle.position.copy(fromNode.position);
        scene.add(particle);
        particles.push({
          mesh: particle,
          from: fromNode.position.clone(),
          to: toNode.position.clone(),
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.01
        });
      }
  
      camera.position.z = 15;
      camera.lookAt(0, 0, 0);
      function animate() {
        const animationId = requestAnimationFrame(animate);
        container.dataset.animationId = animationId;
  
        particles.forEach(particle => {
          particle.progress += particle.speed;
          if (particle.progress >= 1) {
            particle.progress = 0;
            const connectionIndex = Math.floor(Math.random() * connections.length);
            const connection = connections[connectionIndex];
            particle.from = nodeMeshes[connection.from].position.clone();
            particle.to = nodeMeshes[connection.to].position.clone();
          }
          particle.mesh.position.lerpVectors(particle.from, particle.to, particle.progress);
        });
        nodeMeshes.forEach(node => {
          node.rotation.y += 0.01;
        });
        renderer.render(scene, camera);
      }
      animate();
  
      // Handle window resize
      const resizeHandler = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      };
      window.addEventListener('resize', resizeHandler);
      container.dataset.resizeHandler = true;
  
      console.log('Data Flow Visualization initialized successfully');
    } catch (error) {
      console.error('Error initializing Data Flow Visualization:', error);
      // After
container.innerHTML = `
<div class="p-4 text-center">
  <div class="text-lg font-semibold mb-4">Data Flow Visualization</div>
  <div class="flex flex-wrap justify-center gap-4">
    <div class="bg-blue-500 text-white p-3 rounded-lg">Client</div>
    <div class="bg-green-500 text-white p-3 rounded-lg">API</div>
    <div class="bg-red-500 text-white p-3 rounded-lg">Auth</div>
    <div class="bg-yellow-500 text-white p-3 rounded-lg">Database</div>
    <div class="bg-purple-500 text-white p-3 rounded-lg">Storage</div>
  </div>
</div>
`;
    }
  }
  