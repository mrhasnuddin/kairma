import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

export class Web3OrbitSystem {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) throw new Error(`Container #${containerId} not found`);

    this.onSelect = options.onSelect || (() => {});
    this.onDeselect = options.onDeselect || (() => {});

    this.networks = options.networks || [];
    this.protocols = options.protocols || [];
    this.assets = options.assets || [];

    // State
    this.selectedNode = null;
    this.hoveredNode = null;
    this.draggedRing = null;
    this.isDragging = false;
    this.prevMouseX = 0;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.initThree();
    this.buildScene();
    this.addEventListeners();
    this.animate();
  }

  initThree() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0a0c, 0.04);

    this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    this.camera.position.set(0, 3.5, 7.5);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // Group to hold all interactive elements
    this.world = new THREE.Group();
    this.scene.add(this.world);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x5af1b0, 2, 20);
    pointLight.position.set(0, 5, 5);
    this.scene.add(pointLight);

    const topLight = new THREE.DirectionalLight(0xffffff, 0.8);
    topLight.position.set(0, 10, 0);
    this.scene.add(topLight);
  }

  buildScene() {
    this.textureLoader = new THREE.TextureLoader();

    // 1. Central Glowing Spine
    this.createSpine();

    // 2. Three Interactive Rings
    this.rings = [];
    this.ringGroups = [];

    // Ring 3: Networks (Top)
    this.networkRingGroup = new THREE.Group();
    this.networkRingGroup.position.y = 1.8;
    this.world.add(this.networkRingGroup);
    this.createRing(this.networkRingGroup, 1.2, this.networks, 'network', 0x5af1b0);

    // Ring 2: Protocols (Middle)
    this.protocolRingGroup = new THREE.Group();
    this.protocolRingGroup.position.y = 0.0;
    this.world.add(this.protocolRingGroup);
    this.createRing(this.protocolRingGroup, 1.8, this.protocols, 'protocol', 0x7b3fe4);

    // Ring 1: Assets (Bottom)
    this.assetsRingGroup = new THREE.Group();
    this.assetsRingGroup.position.y = -1.8;
    this.world.add(this.assetsRingGroup);
    this.createRing(this.assetsRingGroup, 2.4, this.assets, 'asset', 0xe1ff69);
  }

  createSpine() {
    // Glowing central core tube
    const geometry = new THREE.CylinderGeometry(0.04, 0.04, 5, 16);
    const material = new THREE.MeshBasicMaterial({
      color: 0x2e6f52,
      transparent: true,
      opacity: 0.6
    });
    const cylinder = new THREE.Mesh(geometry, material);
    this.world.add(cylinder);

    // Add cascading dots (particles) along the spine
    const dotCount = 100;
    const dotGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(dotCount * 3);
    const speeds = [];

    for (let i = 0; i < dotCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.08;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.08;
      speeds.push(0.005 + Math.random() * 0.01);
    }

    dotGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const dotMaterial = new THREE.PointsMaterial({
      color: 0x5af1b0,
      size: 0.03,
      transparent: true,
      opacity: 0.8
    });

    this.spineParticles = new THREE.Points(dotGeometry, dotMaterial);
    this.spineParticles.userData = { speeds };
    this.world.add(this.spineParticles);
  }

  createRing(group, radius, items, category, colorHex) {
    // Draw the faint orbit ring line
    const segments = 64;
    const geometry = new THREE.RingGeometry(radius - 0.01, radius + 0.01, segments);
    const material = new THREE.MeshBasicMaterial({
      color: colorHex,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.15
    });
    const torus = new THREE.Mesh(geometry, material);
    torus.rotation.x = Math.PI / 2;
    group.add(torus);

    // Orbit particles (dust revolving around ring)
    const particleCount = category === 'network' ? 300 : category === 'protocol' ? 500 : 800;
    const partGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const angles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + Math.random() * 0.2;
      const r = radius + (Math.random() - 0.5) * 0.12;
      positions[i * 3] = Math.cos(angle) * r;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 0.05;
      positions[i * 3 + 2] = Math.sin(angle) * r;
      angles.push(angle);
    }

    partGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const partMaterial = new THREE.PointsMaterial({
      color: colorHex,
      size: 0.02,
      transparent: true,
      opacity: 0.5
    });

    const particles = new THREE.Points(partGeometry, partMaterial);
    particles.userData = { angles, radius };
    group.add(particles);

    // Create interactive nodes (icons) along the ring
    const count = items.length;
    const ringNodes = [];

    items.forEach((item, index) => {
      const angle = (index / count) * Math.PI * 2;
      const nodeGroup = new THREE.Group();

      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      nodeGroup.position.set(x, 0, z);

      // Node mesh: outer glow ring
      const ringGeo = new THREE.RingGeometry(0.18, 0.20, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x444444,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      nodeGroup.add(ringMesh);

      // Node icon image billboard
      const iconTexture = this.textureLoader.load(`./icons/${item.icon}`);
      const iconGeo = new THREE.PlaneGeometry(0.28, 0.28);
      const iconMat = new THREE.MeshBasicMaterial({
        map: iconTexture,
        transparent: true,
        side: THREE.DoubleSide
      });
      const iconMesh = new THREE.Mesh(iconGeo, iconMat);
      nodeGroup.add(iconMesh);

      // Hit area (invisible box for raycasting)
      const hitGeo = new THREE.BoxGeometry(0.45, 0.45, 0.1);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      nodeGroup.add(hitMesh);

      // Store node metadata
      nodeGroup.userData = {
        item,
        category,
        index,
        angle,
        ringGroup: group,
        colorHex,
        ringMesh,
        iconMesh
      };

      group.add(nodeGroup);
      ringNodes.push(nodeGroup);
      this.rings.push(nodeGroup);
    });

    group.userData = {
      radius,
      category,
      colorHex,
      nodes: ringNodes,
      particles,
      targetRotationY: 0
    };

    this.ringGroups.push(group);
  }

  addEventListeners() {
    this.container.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.container.addEventListener('mousedown', this.onMouseDown.bind(this));
    window.addEventListener('mouseup', this.onMouseUp.bind(this));
    window.addEventListener('resize', this.onResize.bind(this));
  }

  onMouseMove(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    // 1. Handle Ring Dragging
    if (this.isDragging && this.draggedRing) {
      const deltaX = event.clientX - this.prevMouseX;
      this.draggedRing.rotation.y += deltaX * 0.007;
      this.draggedRing.userData.targetRotationY = this.draggedRing.rotation.y;
      this.prevMouseX = event.clientX;
      return;
    }

    // 2. Raycast to detect node hover
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.world.children, true);

    let foundNode = null;
    for (const intersect of intersects) {
      // Find parent group that holds the node
      let p = intersect.object.parent;
      while (p && p !== this.scene) {
        if (p.userData && p.userData.item) {
          foundNode = p;
          break;
        }
        p = p.parent;
      }
      if (foundNode) break;
    }

    if (foundNode) {
      if (this.hoveredNode !== foundNode) {
        this.clearHover();
        this.hoveredNode = foundNode;
        document.body.style.cursor = 'pointer';

        // Animate Hover State (Glow and scale)
        gsap.to(this.hoveredNode.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.25, ease: 'power2.out' });
        this.hoveredNode.userData.ringMesh.material.color.setHex(foundNode.userData.colorHex);
      }
    } else {
      if (this.hoveredNode) {
        this.clearHover();
        document.body.style.cursor = 'default';
      }
    }
  }

  clearHover() {
    if (this.hoveredNode) {
      // Reset scale and color
      const isSelected = this.selectedNode === this.hoveredNode;
      gsap.to(this.hoveredNode.scale, {
        x: isSelected ? 1.15 : 1.0,
        y: isSelected ? 1.15 : 1.0,
        z: isSelected ? 1.15 : 1.0,
        duration: 0.25,
        ease: 'power2.out'
      });
      if (!isSelected) {
        this.hoveredNode.userData.ringMesh.material.color.setHex(0x444444);
      }
      this.hoveredNode = null;
    }
  }

  onMouseDown(event) {
    const rect = this.renderer.domElement.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.world.children, true);

    let clickedNode = null;
    for (const intersect of intersects) {
      let p = intersect.object.parent;
      while (p && p !== this.scene) {
        if (p.userData && p.userData.item) {
          clickedNode = p;
          break;
        }
        p = p.parent;
      }
      if (clickedNode) break;
    }

    if (clickedNode) {
      // Clicked on a Node
      this.selectNode(clickedNode);
    } else {
      // Check if clicked near a ring plane for dragging
      let clickedRing = null;
      for (const intersect of intersects) {
        let p = intersect.object.parent;
        if (p && p.userData && p.userData.radius) {
          clickedRing = p;
          break;
        }
      }

      if (clickedRing) {
        this.isDragging = true;
        this.draggedRing = clickedRing;
        this.prevMouseX = event.clientX;
        document.body.style.cursor = 'grabbing';
      }
    }
  }

  onMouseUp() {
    if (this.isDragging && this.draggedRing) {
      this.isDragging = false;
      document.body.style.cursor = 'default';
      this.snapRing(this.draggedRing);
      this.draggedRing = null;
    }
  }

  selectNode(node) {
    if (this.selectedNode === node) {
      // Deselect if clicked again
      this.deselectCategory(node.userData.category);
      return;
    }

    // Deselect other nodes in the same category
    this.ringGroups.forEach(g => {
      if (g.userData.category === node.userData.category) {
        g.userData.nodes.forEach(n => {
          n.userData.ringMesh.material.color.setHex(0x444444);
          gsap.to(n.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
        });
      }
    });

    this.selectedNode = node;
    node.userData.ringMesh.material.color.setHex(node.userData.colorHex);
    gsap.to(node.scale, { x: 1.15, y: 1.15, z: 1.15, duration: 0.25 });

    // Rotate ring to align the selected node forward (facing camera, angle = Math.PI/2 or 3*Math.PI/2)
    // Looking from camera (0, 3.5, 7.5), forward is angle = -Math.PI / 2
    const targetAngle = -node.userData.angle - Math.PI / 2;
    this.rotateRingToAngle(node.userData.ringGroup, targetAngle);

    // Trigger select callback
    this.onSelect(node.userData.category, node.userData.item);
  }

  deselectCategory(category) {
    if (this.selectedNode && this.selectedNode.userData.category === category) {
      this.selectedNode.userData.ringMesh.material.color.setHex(0x444444);
      gsap.to(this.selectedNode.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 });
      this.selectedNode = null;
      this.onDeselect(category);
    }
  }

  rotateRingToAngle(ringGroup, targetAngle) {
    // Keep rotation interpolation clean
    const currentRot = ringGroup.rotation.y;
    const diff = ((targetAngle - currentRot + Math.PI) % (Math.PI * 2)) - Math.PI;
    ringGroup.userData.targetRotationY = currentRot + diff;

    gsap.killTweensOf(ringGroup.rotation);
    gsap.to(ringGroup.rotation, {
      y: ringGroup.userData.targetRotationY,
      duration: 0.85,
      ease: 'power3.out'
    });
  }

  snapRing(ringGroup) {
    // Find the node currently closest to the front (angle = -Math.PI / 2 relative to rotation)
    const currentRot = ringGroup.rotation.y;
    let closestNode = null;
    let minDiff = Infinity;

    ringGroup.userData.nodes.forEach(node => {
      // Node absolute angle in world space is (node.angle + ringGroup.rotation.y)
      const absAngle = node.userData.angle + currentRot;
      const targetFacing = -Math.PI / 2;
      const diff = Math.abs(((absAngle - targetFacing + Math.PI) % (Math.PI * 2)) - Math.PI);

      if (diff < minDiff) {
        minDiff = diff;
        closestNode = node;
      }
    });

    if (closestNode) {
      this.selectNode(closestNode);
    }
  }

  onResize() {
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }

  animate() {
    requestAnimationFrame(this.animate.bind(this));

    const time = performance.now() * 0.001;

    // 1. Rotate the nodes to face the camera (billboard effect on Y axis)
    this.rings.forEach(node => {
      node.rotation.y = -node.parent.rotation.y;
      node.rotation.x = -0.3; // Tilt slightly up to match camera view angle
    });

    // 2. Animate central spine particles cascade down
    if (this.spineParticles) {
      const positions = this.spineParticles.geometry.attributes.position.array;
      const speeds = this.spineParticles.userData.speeds;
      const count = positions.length / 3;

      for (let i = 0; i < count; i++) {
        positions[i * 3 + 1] -= speeds[i]; // Move down
        if (positions[i * 3 + 1] < -2.5) {
          positions[i * 3 + 1] = 2.5; // Loop back to top
        }
      }
      this.spineParticles.geometry.attributes.position.needsUpdate = true;
    }

    // 3. Ambient rotation for unselected / idle rings
    this.ringGroups.forEach(g => {
      if (!this.isDragging && (!this.selectedNode || this.selectedNode.userData.ringGroup !== g)) {
        // Very slow drifting rotation
        g.rotation.y += 0.0008;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
