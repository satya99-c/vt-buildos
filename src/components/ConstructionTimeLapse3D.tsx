import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ConstructionTimeLapse3DProps {
  onStageChange?: (stage: {
    phase: string;
    floor: number;
    progressPct: number;
  }) => void;
}

// Helper: smooth clamp 0..1
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Helper: easeOutCubic
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);

// Helper: easeInOutCubic
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/**
 * Creates a crisp procedural 2D architectural floorplan texture on a Canvas
 * resembling the blueprint sheet at the start of the time-lapse.
 */
function createBlueprintTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Crisp drafting paper background
  ctx.fillStyle = '#F1F5F9';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle paper grain / outer border
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 4;
  ctx.strokeRect(36, 36, 952, 952);
  ctx.strokeStyle = '#CBD5E1';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(48, 48, 928, 928);

  // Faint drafting grid
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1;
  for (let i = 64; i < 960; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 48);
    ctx.lineTo(i, 976);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(48, i);
    ctx.lineTo(976, i);
    ctx.stroke();
  }

  // Structural Axis Grid Lines (dashed)
  const axesX = [256, 426, 598, 768];
  const axesY = [256, 426, 598, 768];
  const labelsX = ['A', 'B', 'C', 'D'];
  const labelsY = ['1', '2', '3', '4'];

  ctx.save();
  ctx.setLineDash([10, 6]);
  ctx.strokeStyle = '#64748B';
  ctx.lineWidth = 1.5;
  axesX.forEach((x) => {
    ctx.beginPath();
    ctx.moveTo(x, 120);
    ctx.lineTo(x, 904);
    ctx.stroke();
  });
  axesY.forEach((y) => {
    ctx.beginPath();
    ctx.moveTo(120, y);
    ctx.lineTo(904, y);
    ctx.stroke();
  });
  ctx.restore();

  // Axis Bubbles
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  axesX.forEach((x, idx) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, 100, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.fillText(labelsX[idx], x, 101);
  });
  axesY.forEach((y, idx) => {
    ctx.fillStyle = '#FFFFFF';
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(100, y, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#0F172A';
    ctx.fillText(labelsY[idx], 100, y + 1);
  });

  // Architectural Floorplan Walls (thick CAD lines)
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 6;
  ctx.strokeRect(256, 256, 512, 512);

  // Internal room partitions
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(426, 256);
  ctx.lineTo(426, 598);
  ctx.moveTo(598, 256);
  ctx.lineTo(598, 768);
  ctx.moveTo(256, 426);
  ctx.lineTo(768, 426);
  ctx.moveTo(256, 598);
  ctx.lineTo(598, 598);
  ctx.stroke();

  // Staircase hatching in front-center bay
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 2;
  for (let s = 0; s < 10; s++) {
    const sy = 610 + s * 14;
    ctx.beginPath();
    ctx.moveTo(440, sy);
    ctx.lineTo(584, sy);
    ctx.stroke();
  }

  // Dimension Callouts
  ctx.fillStyle = '#475569';
  ctx.font = 'bold 16px monospace';
  ctx.fillText('4500', 341, 165);
  ctx.fillText('4500', 512, 165);
  ctx.fillText('4500', 683, 165);
  ctx.fillText('13500 MM · 5-STORY RCC', 512, 855);

  // Room labels
  ctx.fillStyle = '#64748B';
  ctx.font = '14px monospace';
  ctx.fillText('LOBBY / CORE', 512, 512);
  ctx.fillText('WING A', 341, 341);
  ctx.fillText('WING B', 683, 341);
  ctx.fillText('STAIR BAY', 512, 680);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a realistic urban corner street texture (asphalt roads, crosswalks, sidewalks)
 * that fades in as the 5-story building completes.
 */
function createUrbanCornerTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Urban ground base
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(0, 0, 1024, 1024);

  // Asphalt Roads (L-shaped corner intersection around the plot)
  ctx.fillStyle = '#27272A';
  // Bottom road (horizontal)
  ctx.fillRect(0, 760, 1024, 220);
  // Right road (vertical)
  ctx.fillRect(760, 0, 220, 1024);
  // Left & top subtle roads
  ctx.fillRect(0, 0, 1024, 90);
  ctx.fillRect(0, 0, 90, 1024);

  // Sidewalk / Concrete Plot Plaza
  ctx.fillStyle = '#94A3B8';
  ctx.fillRect(110, 110, 630, 630);
  ctx.fillStyle = '#CBD5E1';
  ctx.fillRect(130, 130, 590, 590);

  // Building footprint pad
  ctx.fillStyle = '#64748B';
  ctx.fillRect(280, 280, 320, 320);

  // Dashed white lane dividers
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 4;
  ctx.setLineDash([28, 22]);
  ctx.beginPath();
  ctx.moveTo(0, 870);
  ctx.lineTo(1024, 870);
  ctx.moveTo(870, 0);
  ctx.lineTo(870, 1024);
  ctx.stroke();

  // Crosswalk stripes at intersection
  ctx.setLineDash([]);
  ctx.fillStyle = '#F8FAFC';
  for (let i = 0; i < 6; i++) {
    ctx.fillRect(775 + i * 32, 710, 18, 42);
    ctx.fillRect(710, 775 + i * 32, 42, 18);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

export const ConstructionTimeLapse3D: React.FC<ConstructionTimeLapse3DProps> = ({
  onStageChange,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#090D16');
    scene.fog = new THREE.FogExp2('#090D16', 0.014);

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 200);
    camera.position.set(11, 14, 15);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    // Architectural Studio + Daylight Lighting
    const hemiLight = new THREE.HemisphereLight('#E0F2FE', '#1E293B', 0.85);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight('#FFF7ED', 2.2);
    sunLight.position.set(16, 28, 14);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 2;
    sunLight.shadow.camera.far = 70;
    const d = 18;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight('#38BDF8', 0.45);
    fillLight.position.set(-14, 10, -12);
    scene.add(fillLight);

    // Shared Materials
    const concreteMat = new THREE.MeshStandardMaterial({
      color: '#CBD5E1',
      roughness: 0.78,
      metalness: 0.05,
    });
    const darkConcreteMat = new THREE.MeshStandardMaterial({
      color: '#94A3B8',
      roughness: 0.82,
      metalness: 0.08,
    });
    const rebarMat = new THREE.MeshStandardMaterial({
      color: '#334155',
      roughness: 0.4,
      metalness: 0.85,
    });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      emissive: '#F59E0B',
      emissiveIntensity: 0.14,
      roughness: 0.08,
      metalness: 0.2,
      transmission: 0.35,
      transparent: true,
      opacity: 0.86,
    });
    const claddingMat = new THREE.MeshStandardMaterial({
      color: '#E2E8F0',
      roughness: 0.5,
      metalness: 0.15,
    });
    const railingMat = new THREE.MeshStandardMaterial({
      color: '#1E293B',
      roughness: 0.3,
      metalness: 0.8,
    });
    const cyanLaserMat = new THREE.MeshBasicMaterial({
      color: '#00E5FF',
      transparent: true,
      opacity: 0.9,
    });

    // -----------------------------------------------------------------------
    // 1. Ground: Blueprint Sheet + Urban Corner Plane
    // -----------------------------------------------------------------------
    const blueprintTex = createBlueprintTexture();
    const blueprintMat = new THREE.MeshStandardMaterial({
      map: blueprintTex,
      roughness: 0.85,
      metalness: 0.0,
      transparent: true,
      opacity: 1,
    });
    const blueprintPlane = new THREE.Mesh(new THREE.PlaneGeometry(18, 18), blueprintMat);
    blueprintPlane.rotation.x = -Math.PI / 2;
    blueprintPlane.position.y = 0.01;
    blueprintPlane.receiveShadow = true;
    scene.add(blueprintPlane);

    const urbanTex = createUrbanCornerTexture();
    const urbanMat = new THREE.MeshStandardMaterial({
      map: urbanTex,
      roughness: 0.9,
      transparent: true,
      opacity: 0,
    });
    const urbanPlane = new THREE.Mesh(new THREE.PlaneGeometry(34, 34), urbanMat);
    urbanPlane.rotation.x = -Math.PI / 2;
    urbanPlane.position.y = -0.01;
    urbanPlane.receiveShadow = true;
    scene.add(urbanPlane);

    // Glowing Cyan Blueprint Trace Lines
    const laserGroup = new THREE.Group();
    const gridCoords = [-3.0, -1.0, 1.0, 3.0];
    const laserBars: THREE.Mesh[] = [];
    gridCoords.forEach((pos) => {
      const barX = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.03, 0.06), cyanLaserMat.clone());
      barX.position.set(0, 0.03, pos);
      laserGroup.add(barX);
      laserBars.push(barX);

      const barZ = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 6.4), cyanLaserMat.clone());
      barZ.position.set(pos, 0.03, 0);
      laserGroup.add(barZ);
      laserBars.push(barZ);
    });
    scene.add(laserGroup);

    // -----------------------------------------------------------------------
    // 2. Foundation Footings & 16 Vertical Columns with Rebar
    // -----------------------------------------------------------------------
    const footingsGroup = new THREE.Group();
    const footings: THREE.Mesh[] = [];
    const columnsGroup = new THREE.Group();
    const columns: { mesh: THREE.Group; targetHeight: number }[] = [];

    const totalFloors = 5;
    const floorHeight = 1.45;
    const totalBuildingHeight = totalFloors * floorHeight;

    gridCoords.forEach((gx) => {
      gridCoords.forEach((gz) => {
        // Concrete Pad Footing
        const footing = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.25, 0.75), darkConcreteMat);
        footing.position.set(gx, 0.125, gz);
        footing.castShadow = true;
        footing.receiveShadow = true;
        footing.scale.set(1, 0.001, 1);
        footingsGroup.add(footing);
        footings.push(footing);

        // Column + 4 Rebar Dowels
        const colContainer = new THREE.Group();
        colContainer.position.set(gx, 0.25, gz);

        const colMesh = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, totalBuildingHeight, 0.32),
          concreteMat
        );
        colMesh.position.y = totalBuildingHeight / 2;
        colMesh.castShadow = true;
        colMesh.receiveShadow = true;
        colContainer.add(colMesh);

        // 4 Steel Rebar rods sticking out the top
        const rebarOffsets = [
          [-0.09, -0.09],
          [0.09, -0.09],
          [-0.09, 0.09],
          [0.09, 0.09],
        ];
        rebarOffsets.forEach(([rx, rz]) => {
          const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.55, 6), rebarMat);
          rod.position.set(rx, totalBuildingHeight + 0.25, rz);
          colContainer.add(rod);
        });

        colContainer.scale.set(1, 0.001, 1);
        columnsGroup.add(colContainer);
        columns.push({ mesh: colContainer, targetHeight: totalBuildingHeight });
      });
    });
    scene.add(footingsGroup);
    scene.add(columnsGroup);

    // -----------------------------------------------------------------------
    // 3. 5-Story Structural Slabs, Beams, Core & Staircases
    // -----------------------------------------------------------------------
    interface FloorAssembly {
      group: THREE.Group;
      slab: THREE.Group;
      stairs: THREE.Group;
      facade: THREE.Group;
      baseY: number;
    }

    const floors: FloorAssembly[] = [];
    const buildingGroup = new THREE.Group();

    for (let f = 0; f < totalFloors; f++) {
      const baseY = 0.25 + (f + 1) * floorHeight;
      const floorGroup = new THREE.Group();

      // Slab + Perimeter Beams
      const slabGroup = new THREE.Group();
      const slabMesh = new THREE.Mesh(new THREE.BoxGeometry(6.5, 0.18, 6.5), concreteMat);
      slabMesh.position.y = baseY;
      slabMesh.castShadow = true;
      slabMesh.receiveShadow = true;
      slabGroup.add(slabMesh);

      // Structural Beams along grid
      gridCoords.forEach((pos) => {
        const beamX = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.22, 0.22), darkConcreteMat);
        beamX.position.set(0, baseY - 0.14, pos);
        beamX.castShadow = true;
        slabGroup.add(beamX);

        const beamZ = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 6.3), darkConcreteMat);
        beamZ.position.set(pos, baseY - 0.14, 0);
        beamZ.castShadow = true;
        slabGroup.add(beamZ);
      });

      // Central Elevator / Shear Core Wall Segment
      const coreMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.75, floorHeight, 1.75),
        darkConcreteMat
      );
      coreMesh.position.set(0, baseY - floorHeight / 2, -0.5);
      coreMesh.castShadow = true;
      coreMesh.receiveShadow = true;
      slabGroup.add(coreMesh);

      floorGroup.add(slabGroup);

      // Zig-zag Concrete Staircase Flight in Front-Center Bay
      const stairsGroup = new THREE.Group();
      const numSteps = 7;
      for (let s = 0; s < numSteps; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.12, 0.26), concreteMat);
        const t = s / (numSteps - 1);
        const sy = baseY - floorHeight + 0.1 + t * (floorHeight - 0.2);
        const sz = 1.6 + (f % 2 === 0 ? t * 1.1 : (1 - t) * 1.1);
        step.position.set(0, sy, sz);
        step.castShadow = true;
        stairsGroup.add(step);
      }
      floorGroup.add(stairsGroup);

      // Facade: Glass Curtain Walls, Architectural Fins & Balcony Railings
      const facadeGroup = new THREE.Group();
      const bayHeight = floorHeight - 0.2;
      const midY = baseY - floorHeight / 2 - 0.05;

      // 4-sided modern architectural glazing + spandrel cladding
      const sides = [
        { x: 0, z: 3.12, rotY: 0 },
        { x: 0, z: -3.12, rotY: Math.PI },
        { x: 3.12, z: 0, rotY: Math.PI / 2 },
        { x: -3.12, z: 0, rotY: -Math.PI / 2 },
      ];

      sides.forEach((side) => {
        const sideGrp = new THREE.Group();
        sideGrp.position.set(side.x, midY, side.z);
        sideGrp.rotation.y = side.rotY;

        // Window glass bays
        const glassLeft = new THREE.Mesh(new THREE.BoxGeometry(1.7, bayHeight, 0.08), glassMat);
        glassLeft.position.set(-2.0, 0, 0);
        sideGrp.add(glassLeft);

        const glassRight = new THREE.Mesh(new THREE.BoxGeometry(1.7, bayHeight, 0.08), glassMat);
        glassRight.position.set(2.0, 0, 0);
        sideGrp.add(glassRight);

        // Center architectural glass (leaving stair bay partially visible on front)
        const glassCenter = new THREE.Mesh(new THREE.BoxGeometry(1.7, bayHeight, 0.08), glassMat);
        glassCenter.position.set(0, 0, 0);
        sideGrp.add(glassCenter);

        // Sleek vertical concrete cladding mullions
        [-2.95, -1.0, 1.0, 2.95].forEach((mx) => {
          const mullion = new THREE.Mesh(
            new THREE.BoxGeometry(0.24, floorHeight, 0.22),
            claddingMat
          );
          mullion.position.set(mx, 0, 0.04);
          mullion.castShadow = true;
          sideGrp.add(mullion);
        });

        // Balcony railing strip along slab edge
        const railTop = new THREE.Mesh(new THREE.BoxGeometry(6.3, 0.05, 0.05), railingMat);
        railTop.position.set(0, -bayHeight / 2 + 0.42, 0.14);
        sideGrp.add(railTop);

        const railGlass = new THREE.Mesh(
          new THREE.BoxGeometry(6.2, 0.38, 0.02),
          new THREE.MeshPhysicalMaterial({
            color: '#38BDF8',
            transparent: true,
            opacity: 0.25,
            roughness: 0.1,
          })
        );
        railGlass.position.set(0, -bayHeight / 2 + 0.22, 0.14);
        sideGrp.add(railGlass);

        facadeGroup.add(sideGrp);
      });

      floorGroup.add(facadeGroup);
      buildingGroup.add(floorGroup);

      floors.push({
        group: floorGroup,
        slab: slabGroup,
        stairs: stairsGroup,
        facade: facadeGroup,
        baseY,
      });
    }

    // Rooftop Parapet & MEP Penthouse Crown (on top of Floor 5)
    const roofGroup = new THREE.Group();
    const roofY = 0.25 + totalFloors * floorHeight;
    const parapetWalls = [
      new THREE.BoxGeometry(6.6, 0.45, 0.2),
      new THREE.BoxGeometry(6.6, 0.45, 0.2),
      new THREE.BoxGeometry(0.2, 0.45, 6.6),
      new THREE.BoxGeometry(0.2, 0.45, 6.6),
    ];
    const parapetPos = [
      [0, roofY + 0.28, 3.2],
      [0, roofY + 0.28, -3.2],
      [3.2, roofY + 0.28, 0],
      [-3.2, roofY + 0.28, 0],
    ];
    parapetWalls.forEach((geom, idx) => {
      const w = new THREE.Mesh(geom, claddingMat);
      w.position.set(parapetPos[idx][0], parapetPos[idx][1], parapetPos[idx][2]);
      w.castShadow = true;
      roofGroup.add(w);
    });
    const pentCore = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.95, 2.1), darkConcreteMat);
    pentCore.position.set(0, roofY + 0.55, -0.5);
    pentCore.castShadow = true;
    roofGroup.add(pentCore);
    buildingGroup.add(roofGroup);

    scene.add(buildingGroup);

    // -----------------------------------------------------------------------
    // 4. Urban Environment Props (Trees & Animated Cars for Final Stage)
    // -----------------------------------------------------------------------
    const urbanPropsGroup = new THREE.Group();
    const trunkMat = new THREE.MeshStandardMaterial({ color: '#78350F', roughness: 0.9 });
    const foliageMat = new THREE.MeshStandardMaterial({ color: '#15803D', roughness: 0.8 });

    const treePositions = [
      [-5.5, 5.2],
      [-2.0, 5.6],
      [2.2, 5.6],
      [5.4, 5.2],
      [5.6, 1.5],
      [5.6, -2.5],
      [-5.6, -1.5],
      [-5.6, 2.0],
    ];

    treePositions.forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 0.65, 6), trunkMat);
      trunk.position.y = 0.325;
      trunk.castShadow = true;
      const crown = new THREE.Mesh(new THREE.DodecahedronGeometry(0.55, 1), foliageMat);
      crown.position.y = 0.95;
      crown.castShadow = true;
      tree.add(trunk, crown);
      tree.position.set(tx, 0, tz);
      urbanPropsGroup.add(tree);
    });

    // Subtle moving cars on the corner streets
    const carMat1 = new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.3, metalness: 0.5 });
    const carMat2 = new THREE.MeshStandardMaterial({ color: '#38BDF8', roughness: 0.3, metalness: 0.5 });
    const car1 = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.38, 0.5), carMat1);
    car1.position.set(-10, 0.22, 8.2);
    car1.castShadow = true;
    const car2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.38, 0.95), carMat2);
    car2.position.set(8.2, 0.22, 10);
    car2.castShadow = true;
    urbanPropsGroup.add(car1, car2);

    urbanPropsGroup.scale.set(1, 0.001, 1);
    urbanPropsGroup.visible = false;
    scene.add(urbanPropsGroup);

    // -----------------------------------------------------------------------
    // 5. Animation Timeline Loop (13.5 seconds total cycle)
    // -----------------------------------------------------------------------
    const CYCLE_DURATION = 13.5;
    let startTime = performance.now();
    let frameId = 0;
    let lastReportedFloor = -1;
    let lastPhase = '';

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);

      const elapsed = ((now - startTime) / 1000) % CYCLE_DURATION;

      // Stage 1: Blueprint & Laser Trace (0.0s - 1.8s)
      const laserFade = elapsed < 2.2 ? easeOutCubic(elapsed / 0.8) : clamp01(1 - (elapsed - 2.2) / 0.8);
      laserBars.forEach((bar, i) => {
        const mat = bar.material as THREE.MeshBasicMaterial;
        const pulse = 0.65 + 0.35 * Math.sin(elapsed * 5 + i * 0.5);
        mat.opacity = laserFade * pulse;
        bar.visible = mat.opacity > 0.02;
      });

      // Stage 2: Footings (1.2s - 2.2s) & Columns (1.8s - 3.4s)
      const footingT = easeOutCubic((elapsed - 1.1) / 0.8);
      footings.forEach((f, idx) => {
        const stagger = easeOutCubic((elapsed - 1.0 - idx * 0.03) / 0.5);
        f.scale.y = Math.max(0.001, stagger);
        f.visible = stagger > 0.01;
      });

      columns.forEach((c, idx) => {
        const colT = easeOutCubic((elapsed - 1.7 - (idx % 4) * 0.08) / 1.3);
        c.mesh.scale.y = Math.max(0.001, colT);
        c.mesh.visible = colT > 0.01;
      });

      // Stage 3: 5-Story RCC Frame Assembly (2.8s - 7.0s)
      let activeFloorCount = 0;
      floors.forEach((fl, fIdx) => {
        const startFloor = 2.8 + fIdx * 0.72;
        const slabT = easeOutCubic((elapsed - startFloor) / 0.65);
        const stairT = easeOutCubic((elapsed - (startFloor + 0.25)) / 0.55);

        if (slabT > 0.05) activeFloorCount = fIdx + 1;

        // Slab drops smoothly from above
        fl.slab.visible = slabT > 0.01;
        fl.slab.position.y = (1 - slabT) * 2.4;
        fl.slab.scale.setScalar(0.85 + 0.15 * slabT);

        // Stairs drop in right after slab
        fl.stairs.visible = stairT > 0.01;
        fl.stairs.position.y = (1 - stairT) * 1.8;

        // Stage 4: Facade, Glass & Railings (6.8s - 9.0s)
        const facadeStart = 6.6 + fIdx * 0.3;
        const facadeT = easeOutCubic((elapsed - facadeStart) / 0.8);
        fl.facade.visible = facadeT > 0.01;
        fl.facade.scale.set(1, Math.max(0.001, facadeT), 1);
      });

      // Rooftop Crown (8.3s - 9.2s)
      const roofT = easeOutCubic((elapsed - 8.2) / 0.7);
      roofGroup.visible = roofT > 0.01;
      roofGroup.position.y = (1 - roofT) * 1.5;

      // Stage 5: Urban Corner & Environment Reveal (8.8s - 10.6s)
      const urbanT = easeInOutCubic((elapsed - 8.6) / 1.5);
      blueprintMat.opacity = 1 - urbanT;
      blueprintPlane.visible = blueprintMat.opacity > 0.02;
      urbanMat.opacity = urbanT;
      urbanPlane.visible = urbanT > 0.02;

      const propsT = easeOutCubic((elapsed - 9.0) / 1.0);
      urbanPropsGroup.visible = propsT > 0.01;
      urbanPropsGroup.scale.y = Math.max(0.001, propsT);

      // Animate cars on street
      car1.position.x = -12 + ((elapsed * 3.2) % 24);
      car2.position.z = 12 - ((elapsed * 2.8) % 24);

      // Background sky transitions smoothly from dark studio (#090D16) to architectural dusk/daylight (#1E293B / #334155)
      const skyColor = new THREE.Color('#090D16').lerp(new THREE.Color('#1E293B'), urbanT);
      scene.background = skyColor;
      (scene.fog as THREE.FogExp2).color = skyColor;

      // Smooth Dynamic Camera Choreography (mimicking video zoom-out & orbit)
      const camZoomOut = easeInOutCubic((elapsed - 1.2) / 8.5);
      const orbitAngle = 0.68 + camZoomOut * 0.22 + Math.sin(elapsed * 0.3) * 0.03;
      const radius = 12.0 + camZoomOut * 8.5;
      const camY = 9.5 - footingT * 2.0 + camZoomOut * 4.5;
      const lookY = 0.5 + camZoomOut * 3.2;

      camera.position.set(
        Math.sin(orbitAngle) * radius,
        camY,
        Math.cos(orbitAngle) * radius
      );
      camera.lookAt(0, lookY, 0);

      // Notify parent HUD of stage progress
      let phase = 'BLUEPRINT CAD TRACE';
      if (elapsed >= 1.2 && elapsed < 2.8) phase = 'FOOTINGS & RCC COLUMNS';
      else if (elapsed >= 2.8 && elapsed < 6.8) phase = `ASSEMBLING 5-STORY RCC (L${activeFloorCount}/5)`;
      else if (elapsed >= 6.8 && elapsed < 9.0) phase = 'GLAZING & FACADE CLADDING';
      else if (elapsed >= 9.0) phase = '5-STORY PROJECT COMPLETE';

      if (onStageChange && (phase !== lastPhase || activeFloorCount !== lastReportedFloor)) {
        lastPhase = phase;
        lastReportedFloor = activeFloorCount;
        onStageChange({
          phase,
          floor: activeFloorCount,
          progressPct: Math.round(clamp01(elapsed / 10.5) * 100),
        });
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onStageChange]);

  return (
    <div
      ref={mountRef}
      className="w-full h-full relative overflow-hidden"
      aria-label="3D 5-Story Building Construction Time-Lapse"
    />
  );
};
