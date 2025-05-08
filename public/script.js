 // Helper validation functions
 function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  document
    .getElementById("registerForm")
    .addEventListener("submit", function (e) {
      e.preventDefault();

      // Clear previous errors
      [
        "firstName",
        "lastName",
        "email",
        "password",
        "confirmPassword",
      ].forEach((id) => {
        document.getElementById(id + "Error").textContent = "";
      });
      document.getElementById("successMessage").textContent = "";

      // Get values
      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;
      const confirmPassword =
        document.getElementById("confirmPassword").value;

      let valid = true;

      if (!firstName) {
        document.getElementById("firstNameError").textContent =
          "First name is required.";
        valid = false;
      }
      if (!lastName) {
        document.getElementById("lastNameError").textContent =
          "Last name is required.";
        valid = false;
      }
      if (!email) {
        document.getElementById("emailError").textContent =
          "Email is required.";
        valid = false;
      } else if (!validateEmail(email)) {
        document.getElementById("emailError").textContent =
          "Please enter a valid email.";
        valid = false;
      }
      if (!password) {
        document.getElementById("passwordError").textContent =
          "Password is required.";
        valid = false;
      } else if (password.length < 6) {
        document.getElementById("passwordError").textContent =
          "Password must be at least 6 characters.";
        valid = false;
      }
      if (!confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
          "Please confirm your password.";
        valid = false;
      } else if (password !== confirmPassword) {
        document.getElementById("confirmPasswordError").textContent =
          "Passwords do not match.";
        valid = false;
      }

      if (valid) {
        document.getElementById("successMessage").textContent =
          "Registration successful! 🎉";
        // Optionally, reset the form after a delay
        setTimeout(() => {
          document.getElementById("registerForm").reset();
          document.getElementById("successMessage").textContent = "";
        }, 2000);
      }
    });

  // -------------------------------------------------
  let scene, camera, renderer, objects = [];
  let canvas = document.getElementById('three-bg-canvas');

  function resizeRenderer() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function createShield() {
    const group = new THREE.Group();

    // Rim
    const rimGeometry = new THREE.TorusGeometry(1, 0.08, 16, 100);
    const rimMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.7, roughness: 0.2 });
    const rim = new THREE.Mesh(rimGeometry, rimMaterial);
    group.add(rim);

    // Face (rounded triangle)
    const shape = new THREE.Shape();
    shape.moveTo(0, 1.1);
    shape.lineTo(-0.95, -0.6);
    shape.quadraticCurveTo(0, -1.2, 0.95, -0.6);
    shape.lineTo(0, 1.1);

    const extrudeSettings = { depth: 0.18, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 4, steps: 1 };
    const faceGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    const faceMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.2, roughness: 0.7, transparent: true, opacity: 0.95 });
    const face = new THREE.Mesh(faceGeometry, faceMaterial);
    face.position.z = -0.09;
    group.add(face);

    group.position.set(-2.2, 1.2, -2.5);
    group.scale.set(1.2, 1.2, 1.2);
    return group;
  }

  function createUserIcon() {
    const group = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xf472b6, metalness: 0.5, roughness: 0.4 });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.y = 0.55;
    group.add(head);

    // Body
    const bodyGeometry = new THREE.CylinderGeometry(0.25, 0.32, 0.7, 32);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.6, roughness: 0.3 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.1;
    group.add(body);

    group.position.set(2.2, -1.1, -2.5);
    group.scale.set(1.3, 1.3, 1.3);
    return group;
  }

  function createFloatingCube() {
    const geometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const material = new THREE.MeshStandardMaterial({ color: 0x4338ca, metalness: 0.7, roughness: 0.2 });
    const cube = new THREE.Mesh(geometry, material);
    cube.position.set(-2.5, -1.5, -2.5);
    return cube;
  }

  function createFloatingSphere() {
    const geometry = new THREE.SphereGeometry(0.4, 32, 32);
    const material = new THREE.MeshStandardMaterial({ color: 0xf472b6, metalness: 0.6, roughness: 0.3 });
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(2.5, 1.5, -2.5);
    return sphere;
  }

  function createFloatingTorus() {
    const geometry = new THREE.TorusGeometry(0.35, 0.12, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.8, roughness: 0.2 });
    const torus = new THREE.Mesh(geometry, material);
    torus.position.set(0, 2.2, -2.5);
    return torus;
  }

  function initThree() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 5);

    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 0); // transparent

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    // 3D Objects
    const shield = createShield();
    scene.add(shield);
    objects.push({ mesh: shield, type: 'shield' });

    const userIcon = createUserIcon();
    scene.add(userIcon);
    objects.push({ mesh: userIcon, type: 'user' });

    const cube = createFloatingCube();
    scene.add(cube);
    objects.push({ mesh: cube, type: 'cube' });

    const sphere = createFloatingSphere();
    scene.add(sphere);
    objects.push({ mesh: sphere, type: 'sphere' });

    const torus = createFloatingTorus();
    scene.add(torus);
    objects.push({ mesh: torus, type: 'torus' });

    resizeRenderer();
    window.addEventListener('resize', resizeRenderer);
  }

  function animate() {
    requestAnimationFrame(animate);

    // Animate objects
    objects.forEach(obj => {
      if (obj.type === 'shield') {
        obj.mesh.rotation.z += 0.003;
        obj.mesh.rotation.y += 0.002;
        obj.mesh.position.y = 1.2 + Math.sin(Date.now() * 0.001) * 0.15;
      } else if (obj.type === 'user') {
        obj.mesh.rotation.y -= 0.002;
        obj.mesh.position.x = 2.2 + Math.sin(Date.now() * 0.0012) * 0.12;
      } else if (obj.type === 'cube') {
        obj.mesh.rotation.x += 0.01;
        obj.mesh.rotation.y += 0.012;
        obj.mesh.position.y = -1.5 + Math.sin(Date.now() * 0.0013) * 0.18;
      } else if (obj.type === 'sphere') {
        obj.mesh.position.x = 2.5 + Math.sin(Date.now() * 0.0011) * 0.18;
        obj.mesh.position.y = 1.5 + Math.cos(Date.now() * 0.0011) * 0.18;
      } else if (obj.type === 'torus') {
        obj.mesh.rotation.x += 0.008;
        obj.mesh.rotation.y += 0.008;
        obj.mesh.position.y = 2.2 + Math.cos(Date.now() * 0.0015) * 0.15;
      }
    });

    renderer.render(scene, camera);
  }

  initThree();
  animate();