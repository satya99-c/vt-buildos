import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ConstructionTimeLapse3DProps {
  onStageChange?: (stage: {
    phase: string;
    floor: number;
    progressPct: number;
  }) => void;
}

// 1 ft = 0.25 Three.js world units -> 30' x 60' plot = 7.5 x 15.0 units
const FT = 0.25;
const toX = (ftX: number) => (ftX - 15) * FT;
const toZ = (ftZ: number) => (ftZ - 30) * FT;

interface WallDef {
  x1: number;
  z1: number;
  x2: number;
  z2: number;
  thickness: number; // in ft
  height: number; // in ft
  category: 'outer' | 'inner' | 'boundary';
  finish?: 'plaster' | 'stone' | 'wood';
  windowGap?: boolean;
  doorGap?: boolean;
}

// Exact 30' x 60' floor plan wall segments (0..30 ft X, 0..60 ft Z; Z=60 is Road-Facing Front)
const WALL_SEGMENTS: WallDef[] = [
  // --- PLOT COMPOUND BOUNDARY WALLS ---
  { x1: 0, z1: 0, x2: 30, z2: 0, thickness: 0.75, height: 6.5, category: 'boundary', finish: 'plaster' }, // Rear boundary
  { x1: 0, z1: 0, x2: 0, z2: 60, thickness: 0.75, height: 6.5, category: 'boundary', finish: 'plaster' }, // Left boundary
  { x1: 30, z1: 0, x2: 30, z2: 60, thickness: 0.75, height: 6.5, category: 'boundary', finish: 'plaster' }, // Right boundary
  // Front boundary wall (Z=60) split for 4'0" Pedestrian Gate (4..8) & 8'0" Vehicle Gate (12..20)
  { x1: 0, z1: 60, x2: 4, z2: 60, thickness: 0.9, height: 5.5, category: 'boundary', finish: 'stone' },
  { x1: 8, z1: 60, x2: 12, z2: 60, thickness: 0.9, height: 6.2, category: 'boundary', finish: 'stone' },
  { x1: 20, z1: 60, x2: 30, z2: 60, thickness: 0.9, height: 5.5, category: 'boundary', finish: 'stone' },

  // --- OUTER HOUSE SHELL WALLS (1-3s) ---
  // Rear wall of main house (leaving 4' OTS / setback at Z=0..4)
  { x1: 0, z1: 4, x2: 12, z2: 4, thickness: 0.75, height: 11.5, category: 'outer', finish: 'plaster', windowGap: true },
  { x1: 12, z1: 4, x2: 15, z2: 4, thickness: 0.75, height: 11.5, category: 'outer', finish: 'plaster' }, // 3'x4' OTS edge
  { x1: 15, z1: 4, x2: 30, z2: 4, thickness: 0.75, height: 11.5, category: 'outer', finish: 'plaster', windowGap: true }, // 14'10"x4' OTS edge
  // Left & Right main structural walls
  { x1: 0, z1: 4, x2: 0, z2: 43.5, thickness: 0.75, height: 11.5, category: 'outer', finish: 'plaster', windowGap: true },
  { x1: 30, z1: 4, x2: 30, z2: 43.5, thickness: 0.75, height: 11.5, category: 'outer', finish: 'plaster', windowGap: true },
  // Front facade wall facing Open Foyer (Z=43.5)
  { x1: 6, z1: 43.5, x2: 18, z2: 43.5, thickness: 0.85, height: 11.5, category: 'outer', finish: 'stone', doorGap: true },
  { x1: 18, z1: 43.5, x2: 30, z2: 43.5, thickness: 0.85, height: 11.5, category: 'outer', finish: 'wood', windowGap: true },
  // Washing area & Staircase enclosure front-left
  { x1: 0, z1: 43.5, x2: 6, z2: 43.5, thickness: 0.65, height: 11.5, category: 'outer', finish: 'plaster', doorGap: true },

  // --- INTERNAL ROOM WALLS (3-5s) ---
  // 15'6" x 12'0" Bedroom 1 (X: 0..15.5, Z: 4..16)
  { x1: 0, z1: 16, x2: 15.5, z2: 16, thickness: 0.5, height: 11.2, category: 'inner', doorGap: true },
  { x1: 15.5, z1: 4, x2: 15.5, z2: 16, thickness: 0.5, height: 11.2, category: 'inner' },
  // 5'8" x 4'0" Bathroom & 7'0" x 4'0" Toilet (between Bedroom 1 & 2)
  { x1: 15.5, z1: 8, x2: 21.5, z2: 8, thickness: 0.45, height: 11.2, category: 'inner' },
  { x1: 15.5, z1: 12, x2: 21.5, z2: 12, thickness: 0.45, height: 11.2, category: 'inner', doorGap: true },
  // 12'3" x 14'0" Bedroom 2 (X: 17.75..30, Z: 4..18)
  { x1: 17.75, z1: 18, x2: 30, z2: 18, thickness: 0.5, height: 11.2, category: 'inner', doorGap: true },
  { x1: 21.5, z1: 4, x2: 21.5, z2: 18, thickness: 0.5, height: 11.2, category: 'inner' },
  // 11'6" x 11'0" Bedroom 3 (X: 0..11.5, Z: 16..27)
  { x1: 0, z1: 27, x2: 11.5, z2: 27, thickness: 0.5, height: 11.2, category: 'inner', doorGap: true },
  { x1: 11.5, z1: 16, x2: 11.5, z2: 27, thickness: 0.5, height: 11.2, category: 'inner' },
  // 3'6" x 4'0" Bathroom & 3'6" x 3'6" W.C. (X: 11.5..15, Z: 16..23.5)
  { x1: 15, z1: 16, x2: 15, z2: 23.5, thickness: 0.45, height: 11.2, category: 'inner', doorGap: true },
  { x1: 11.5, z1: 20, x2: 15, z2: 20, thickness: 0.45, height: 11.2, category: 'inner' },
  { x1: 11.5, z1: 23.5, x2: 15, z2: 23.5, thickness: 0.45, height: 11.2, category: 'inner' },
  // 11'6" x 13'0" Kitchen & Dining (X: 18.5..30, Z: 18..31)
  { x1: 18.5, z1: 18, x2: 18.5, z2: 31, thickness: 0.5, height: 11.2, category: 'inner', doorGap: true },
  { x1: 18.5, z1: 31, x2: 30, z2: 31, thickness: 0.5, height: 11.2, category: 'inner' },
  // Staircase & Washing Area partition (X: 6, Z: 27..43.5)
  { x1: 6, z1: 27, x2: 6, z2: 43.5, thickness: 0.5, height: 11.2, category: 'inner', doorGap: true },
  // 5'6" Storage & 2'9" Reference Area (Z: 0..4, X: 0..8.5)
  { x1: 5.5, z1: 0, x2: 5.5, z2: 4, thickness: 0.45, height: 11.2, category: 'inner' },
  { x1: 8.5, z1: 0, x2: 8.5, z2: 4, thickness: 0.45, height: 11.2, category: 'inner' },
];

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp01(t), 3);
const easeInOutCubic = (t: number) => {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
};

/**
 * Draws the exact 2D architectural floorplan onto a crisp white paper texture
 * using the exact same WALL_SEGMENTS coordinates as the 3D extrusion geometry.
 */
function createExactBlueprintTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d')!;

  // White drafting paper
  ctx.fillStyle = '#F8FAFC';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle paper border
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, 1968, 1968);

  // Map 30' x 60' plot into centered area on the 2048x2048 paper
  // Paper world size = 11.5 x 19.0 units -> scale
  // Actually let's use exact UV mapping: plane is 11.0 (X: 44 ft) x 19.0 (Z: 76 ft)
  // Plot X: 0..30 ft maps to paper X: (44-30)/2 = 7 ft .. 37 ft
  // Plot Z: 0..60 ft maps to paper Z: (76-60)/2 = 8 ft .. 68 ft
  const pxPerFtX = 2048 / 44;
  const pxPerFtZ = 2048 / 76;
  const mapX = (ftX: number) => (ftX + 7) * pxPerFtX;
  const mapZ = (ftZ: number) => (ftZ + 8) * pxPerFtZ;

  // Faint blueprint grid
  ctx.strokeStyle = '#E2E8F0';
  ctx.lineWidth = 1.5;
  for (let gx = 0; gx <= 30; gx += 5) {
    ctx.beginPath();
    ctx.moveTo(mapX(gx), mapZ(-2));
    ctx.lineTo(mapX(gx), mapZ(64));
    ctx.stroke();
  }
  for (let gz = 0; gz <= 60; gz += 5) {
    ctx.beginPath();
    ctx.moveTo(mapX(-2), mapZ(gz));
    ctx.lineTo(mapX(32), mapZ(gz));
    ctx.stroke();
  }

  // O.T.S. cross-hatch markings
  ctx.save();
  ctx.strokeStyle = '#94A3B8';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 6]);
  // 3'0" x 4'0" OTS
  ctx.strokeRect(mapX(12), mapZ(0), 3 * pxPerFtX, 4 * pxPerFtZ);
  // 14'10" x 4'0" OTS
  ctx.strokeRect(mapX(15), mapZ(0), 15 * pxPerFtX, 4 * pxPerFtZ);
  ctx.restore();

  // Staircase steps printed on blueprint
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 2.5;
  for (let s = 0; s <= 10; s++) {
    const sz = 31 + s * 1.1;
    ctx.beginPath();
    ctx.moveTo(mapX(0.5), mapZ(sz));
    ctx.lineTo(mapX(5.5), mapZ(sz));
    ctx.stroke();
  }

  // Draw EVERY wall line exactly matching WALL_SEGMENTS
  WALL_SEGMENTS.forEach((w) => {
    ctx.strokeStyle = w.category === 'inner' ? '#1E293B' : '#0F172A';
    ctx.lineWidth = Math.max(4, w.thickness * pxPerFtX * 0.85);
    ctx.lineCap = 'square';
    ctx.beginPath();
    ctx.moveTo(mapX(w.x1), mapZ(w.z1));
    ctx.lineTo(mapX(w.x2), mapZ(w.z2));
    ctx.stroke();
  });

  // Gate labels & dashed arcs at Z=60
  ctx.strokeStyle = '#0284C7';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 6]);
  // 4'0" Pedestrian Gate
  ctx.beginPath();
  ctx.moveTo(mapX(4), mapZ(60));
  ctx.lineTo(mapX(8), mapZ(60));
  ctx.stroke();
  // 8'0" Vehicle Gate
  ctx.beginPath();
  ctx.moveTo(mapX(12), mapZ(60));
  ctx.lineTo(mapX(20), mapZ(60));
  ctx.stroke();
  ctx.setLineDash([]);

  // Dimension Callouts & Room Labels
  ctx.fillStyle = '#334155';
  ctx.font = 'bold 24px monospace';
  ctx.textAlign = 'center';
  ctx.fillText("BEDROOM 15'6\" × 12'0\"", mapX(7.75), mapZ(10));
  ctx.fillText("BEDROOM 12'3\" × 14'0\"", mapX(25.5), mapZ(11));
  ctx.fillText("BEDROOM 11'6\" × 11'0\"", mapX(5.75), mapZ(21.5));
  ctx.fillText("KITCHEN & DINING 11'6\" × 13'0\"", mapX(24.25), mapZ(24.5));
  ctx.fillText("LIVING HALL 16'3\" × 22'4\"", mapX(18), mapZ(35));
  ctx.fillText("OPEN FOYER / PARKING 25' × 16'4\"", mapX(16), mapZ(52));

  ctx.font = 'bold 18px monospace';
  ctx.fillStyle = '#475569';
  ctx.fillText("O.T.S. 3'×4'", mapX(13.5), mapZ(2.2));
  ctx.fillText("O.T.S. 14'10\" × 4'0\"", mapX(22.5), mapZ(2.2));
  ctx.fillText("STORAGE 5'6\"", mapX(2.75), mapZ(2.2));
  ctx.fillText("BATH", mapX(18.5), mapZ(6.2));
  ctx.fillText("TOILET", mapX(18.5), mapZ(10.2));
  ctx.fillText("STAIR", mapX(3), mapZ(36));
  ctx.fillText("4'0\" GATE", mapX(6), mapZ(62.2));
  ctx.fillText("8'0\" VEHICLE GATE", mapX(16), mapZ(62.2));

  // Plot Overall Dimensions & Road Facing Label
  ctx.fillStyle = '#0F172A';
  ctx.font = 'bold 28px monospace';
  ctx.fillText("30' - 0\" PLOT WIDTH", mapX(15), mapZ(-4.2));
  ctx.fillText("ROAD FACING FRONT ELEVATION", mapX(15), mapZ(66.5));

  ctx.save();
  ctx.translate(mapX(-4.2), mapZ(30));
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("60' - 0\" PLOT DEPTH", 0, 0);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates a natural oak/walnut architect's presentation tabletop texture
 */
function createStudioTableTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#2B241E';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle architectural wood grain streaks
  for (let i = 0; i < 160; i++) {
    const y = (i / 160) * 1024;
    ctx.strokeStyle = i % 3 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.12)';
    ctx.lineWidth = 2 + (i % 5);
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.bezierCurveTo(320, y + (i % 7) - 3, 700, y - (i % 5) + 2, 1024, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  return tex;
}

/**
 * Procedural stone texture for contemporary Indian facade accents
 */
function createStoneTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#B8B0A4';
  ctx.fillRect(0, 0, 512, 512);
  for (let y = 0; y < 512; y += 32) {
    ctx.strokeStyle = 'rgba(60, 52, 44, 0.25)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(512, y);
    ctx.stroke();
    const offset = (y / 32) % 2 === 0 ? 0 : 64;
    for (let x = offset; x < 512; x += 128) {
      ctx.fillStyle = `rgba(140, 130, 118, ${0.15 + ((x + y) % 5) * 0.06})`;
      ctx.fillRect(x + 2, y + 2, 124, 28);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

/**
 * Procedural teak wood louver texture for contemporary Indian elevation panels
 */
function createWoodTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#8B5A2B';
  ctx.fillRect(0, 0, 512, 512);
  for (let x = 0; x < 512; x += 24) {
    ctx.fillStyle = x % 48 === 0 ? '#784A21' : '#9B6836';
    ctx.fillRect(x, 0, 20, 512);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
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

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#18191C');
    scene.fog = new THREE.FogExp2('#18191C', 0.012);

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 150);
    // Locked ~42° elevated 3/4 architectural studio camera looking down at the 30'x60' blueprint
    const LOCKED_CAM_POS = new THREE.Vector3(10.5, 14.5, 16.5);
    const LOCKED_LOOK_AT = new THREE.Vector3(0, 0.6, 0.2);
    // Final road-facing front facade hero camera (smooth glide at 8-10s)
    const HERO_CAM_POS = new THREE.Vector3(4.2, 4.0, 14.8);
    const HERO_LOOK_AT = new THREE.Vector3(0, 1.35, 3.8);

    camera.position.copy(LOCKED_CAM_POS);
    camera.lookAt(LOCKED_LOOK_AT);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    container.appendChild(renderer.domElement);

    // Modern Architecture Studio Lighting (Soft Window Daylight + Warm Ambient)
    const hemiLight = new THREE.HemisphereLight('#FFFBEB', '#3F3A34', 0.95);
    scene.add(hemiLight);

    const studioWindowLight = new THREE.DirectionalLight('#FFF7ED', 2.1);
    studioWindowLight.position.set(14, 24, 16);
    studioWindowLight.castShadow = true;
    studioWindowLight.shadow.mapSize.width = 2048;
    studioWindowLight.shadow.mapSize.height = 2048;
    studioWindowLight.shadow.camera.near = 2;
    studioWindowLight.shadow.camera.far = 65;
    const d = 16;
    studioWindowLight.shadow.camera.left = -d;
    studioWindowLight.shadow.camera.right = d;
    studioWindowLight.shadow.camera.top = d;
    studioWindowLight.shadow.camera.bottom = -d;
    studioWindowLight.shadow.bias = -0.0004;
    scene.add(studioWindowLight);

    const coolRimLight = new THREE.DirectionalLight('#E0F2FE', 0.55);
    coolRimLight.position.set(-16, 12, -10);
    scene.add(coolRimLight);

    // Materials
    const plasterMat = new THREE.MeshStandardMaterial({ color: '#F5F2EB', roughness: 0.72, metalness: 0.02 });
    const innerPlasterMat = new THREE.MeshStandardMaterial({ color: '#ECE8DF', roughness: 0.78 });
    const stoneMat = new THREE.MeshStandardMaterial({ map: createStoneTexture(), roughness: 0.85 });
    const woodMat = new THREE.MeshStandardMaterial({ map: createWoodTexture(), roughness: 0.55 });
    const darkMetalMat = new THREE.MeshStandardMaterial({ color: '#1E293B', roughness: 0.3, metalness: 0.8 });
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: '#0F172A',
      roughness: 0.06,
      metalness: 0.15,
      transmission: 0.35,
      transparent: true,
      opacity: 0.85,
    });
    const warmLightMat = new THREE.MeshBasicMaterial({ color: '#FDE68A' });

    // -----------------------------------------------------------------------
    // 1. Studio Presentation Tabletop & Stationary 2D Blueprint Sheet
    // -----------------------------------------------------------------------
    const tablePlane = new THREE.Mesh(
      new THREE.PlaneGeometry(52, 52),
      new THREE.MeshStandardMaterial({ map: createStudioTableTexture(), roughness: 0.75 })
    );
    tablePlane.rotation.x = -Math.PI / 2;
    tablePlane.position.y = -0.04;
    tablePlane.receiveShadow = true;
    scene.add(tablePlane);

    // Stationary White Blueprint Paper (11.0 x 19.0 units = 44ft x 76ft)
    const blueprintPlane = new THREE.Mesh(
      new THREE.BoxGeometry(44 * FT, 0.04, 76 * FT),
      new THREE.MeshStandardMaterial({ map: createExactBlueprintTexture(), roughness: 0.85 })
    );
    blueprintPlane.position.set(0, -0.02, 0);
    blueprintPlane.receiveShadow = true;
    blueprintPlane.castShadow = true;
    scene.add(blueprintPlane);

    // Subtle Secondary Architect Studio Props around the paper
    const propsGroup = new THREE.Group();
    // Triangular aluminum architectural scale ruler
    const ruler = new THREE.Mesh(
      new THREE.CylinderGeometry(0.11, 0.11, 4.2, 3),
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', metalness: 0.7, roughness: 0.25 })
    );
    ruler.rotation.z = Math.PI / 2;
    ruler.rotation.y = 0.12;
    ruler.position.set(-7.6, 0.08, 4.5);
    ruler.castShadow = true;
    propsGroup.add(ruler);

    // Drafting pencil
    const pencil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 2.4, 8),
      new THREE.MeshStandardMaterial({ color: '#F59E0B', roughness: 0.4 })
    );
    pencil.rotation.z = Math.PI / 2;
    pencil.rotation.y = -0.35;
    pencil.position.set(-7.2, 0.04, 6.2);
    pencil.castShadow = true;
    propsGroup.add(pencil);

    // Rolled secondary blueprint tube
    const roll = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28, 0.28, 5.2, 16),
      new THREE.MeshStandardMaterial({ color: '#F1F5F9', roughness: 0.8 })
    );
    roll.rotation.x = Math.PI / 2;
    roll.rotation.z = 0.08;
    roll.position.set(7.4, 0.28, -3.5);
    roll.castShadow = true;
    propsGroup.add(roll);
    scene.add(propsGroup);

    // -----------------------------------------------------------------------
    // 2. Extruding Walls Anchored Exactly on Printed Blueprint Lines
    // -----------------------------------------------------------------------
    interface ExtrudingWall {
      mesh: THREE.Mesh;
      category: 'outer' | 'inner' | 'boundary';
      index: number;
    }
    const extrudingWalls: ExtrudingWall[] = [];
    const wallsGroup = new THREE.Group();

    WALL_SEGMENTS.forEach((w, idx) => {
      const dx = (w.x2 - w.x1) * FT;
      const dz = (w.z2 - w.z1) * FT;
      const length = Math.sqrt(dx * dx + dz * dz);
      const angle = Math.atan2(dx, dz);
      const h = w.height * FT;
      const t = w.thickness * FT;

      // Geometry translated by +h/2 so scale.y extrudes cleanly upward from y = 0!
      const geom = new THREE.BoxGeometry(t, h, length);
      geom.translate(0, h / 2, 0);

      let mat = innerPlasterMat;
      if (w.finish === 'stone') mat = stoneMat;
      else if (w.finish === 'wood') mat = woodMat;
      else if (w.category === 'outer' || w.category === 'boundary') mat = plasterMat;

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set((toX(w.x1) + toX(w.x2)) / 2, 0, (toZ(w.z1) + toZ(w.z2)) / 2);
      mesh.rotation.y = angle;
      mesh.scale.y = 0.001;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      wallsGroup.add(mesh);

      extrudingWalls.push({ mesh, category: w.category, index: idx });
    });
    scene.add(wallsGroup);

    // -----------------------------------------------------------------------
    // 3. Architectural Details (5-6.5s): Gates, Windows, Doors, Stairs, Balcony
    // -----------------------------------------------------------------------
    const detailsGroup = new THREE.Group();

    // 4'0" Pedestrian Gate (X: 4..8, Z: 60)
    const pedGate = new THREE.Mesh(new THREE.BoxGeometry(3.8 * FT, 5.2 * FT, 0.25 * FT), darkMetalMat);
    pedGate.position.set(toX(6), 2.6 * FT, toZ(60));
    pedGate.castShadow = true;
    detailsGroup.add(pedGate);

    // 8'0" Vehicle Gate (X: 12..20, Z: 60) with wooden slats
    const vehGate = new THREE.Mesh(new THREE.BoxGeometry(7.8 * FT, 5.2 * FT, 0.3 * FT), woodMat);
    vehGate.position.set(toX(16), 2.6 * FT, toZ(60));
    vehGate.castShadow = true;
    detailsGroup.add(vehGate);

    // Front Living Hall Grand Entrance Door & Sidelight Glass (Z=43.5, X=11..15)
    const frontDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(4.2 * FT, 8.5 * FT, 0.95 * FT), darkMetalMat);
    frontDoorFrame.position.set(toX(13), 4.25 * FT, toZ(43.5));
    const frontDoorWood = new THREE.Mesh(new THREE.BoxGeometry(3.6 * FT, 8.0 * FT, 1.02 * FT), woodMat);
    frontDoorWood.position.set(toX(13), 4.0 * FT, toZ(43.5));
    detailsGroup.add(frontDoorFrame, frontDoorWood);

    // Large Contemporary Windows on Front, Left, Right, and Rear Elevations
    const windowPlacements = [
      { x: 24, z: 43.5, w: 6.5, h: 6.0, rotY: 0 }, // Front Living window
      { x: 0, z: 10, w: 5.5, h: 5.5, rotY: Math.PI / 2 }, // Master Bedroom side window
      { x: 0, z: 21.5, w: 5.0, h: 5.5, rotY: Math.PI / 2 }, // Bedroom 3 window
      { x: 30, z: 11, w: 5.5, h: 5.5, rotY: Math.PI / 2 }, // Bedroom 2 side window
      { x: 30, z: 24.5, w: 5.5, h: 5.5, rotY: Math.PI / 2 }, // Kitchen window
      { x: 6, z: 4, w: 5.5, h: 5.5, rotY: 0 }, // Rear Master window
      { x: 23, z: 4, w: 5.5, h: 5.5, rotY: 0 }, // Rear Bedroom 2 window
    ];
    windowPlacements.forEach((wp) => {
      const winFrame = new THREE.Mesh(
        new THREE.BoxGeometry(wp.w * FT, wp.h * FT, 0.92 * FT),
        darkMetalMat
      );
      winFrame.position.set(toX(wp.x), 6.2 * FT, toZ(wp.z));
      winFrame.rotation.y = wp.rotY;

      const winGlass = new THREE.Mesh(
        new THREE.BoxGeometry((wp.w - 0.5) * FT, (wp.h - 0.5) * FT, 0.98 * FT),
        glassMat
      );
      winGlass.position.copy(winFrame.position);
      winGlass.rotation.y = wp.rotY;

      detailsGroup.add(winFrame, winGlass);
    });

    // Staircase Flights (Front-Left X: 0.5..5.5, Z: 31..42)
    for (let s = 0; s < 11; s++) {
      const step = new THREE.Mesh(new THREE.BoxGeometry(4.8 * FT, 0.7 * FT, 1.0 * FT), plasterMat);
      step.position.set(toX(3), (0.5 + s * 0.95) * FT, toZ(41.5 - s * 1.0));
      step.castShadow = true;
      detailsGroup.add(step);
    }

    // 25' x 5'0" Front Balcony Slab & Glass Railing (X: 2.5..27.5, Z: 43.5..48.5)
    const balconySlab = new THREE.Mesh(new THREE.BoxGeometry(25 * FT, 0.6 * FT, 5 * FT), plasterMat);
    balconySlab.position.set(toX(15), 11.2 * FT, toZ(46));
    balconySlab.castShadow = true;
    const balconyRail = new THREE.Mesh(new THREE.BoxGeometry(25 * FT, 3.2 * FT, 0.15 * FT), glassMat);
    balconyRail.position.set(toX(15), 13.0 * FT, toZ(48.4));
    const balconyTopBar = new THREE.Mesh(new THREE.BoxGeometry(25 * FT, 0.18 * FT, 0.25 * FT), darkMetalMat);
    balconyTopBar.position.set(toX(15), 14.6 * FT, toZ(48.4));
    detailsGroup.add(balconySlab, balconyRail, balconyTopBar);

    detailsGroup.scale.y = 0.001;
    scene.add(detailsGroup);

    // -----------------------------------------------------------------------
    // 4. Complete Roof Slab (with Exact O.T.S. Cutouts!), Car & Landscaping (6.5-8s)
    // -----------------------------------------------------------------------
    const completionGroup = new THREE.Group();

    // Main Contemporary Flat Roof Slab (Z: 4..43.5, X: 0..30) -> leaves O.T.S. at Z: 0..4 OPEN!
    const roofSlab = new THREE.Mesh(new THREE.BoxGeometry(30.4 * FT, 0.75 * FT, 39.8 * FT), plasterMat);
    roofSlab.position.set(toX(15), 11.7 * FT, toZ(23.75));
    roofSlab.castShadow = true;
    roofSlab.receiveShadow = true;
    completionGroup.add(roofSlab);

    // Roof Parapet Band + Contemporary Pergola Overhang above Balcony
    const parapetFront = new THREE.Mesh(new THREE.BoxGeometry(30.4 * FT, 2.2 * FT, 0.6 * FT), stoneMat);
    parapetFront.position.set(toX(15), 12.8 * FT, toZ(43.5));
    parapetFront.castShadow = true;
    completionGroup.add(parapetFront);

    // Staircase Headroom / Mumty on roof
    const mumty = new THREE.Mesh(new THREE.BoxGeometry(6.5 * FT, 7.5 * FT, 12.5 * FT), plasterMat);
    mumty.position.set(toX(3.25), 15.5 * FT, toZ(37));
    mumty.castShadow = true;
    completionGroup.add(mumty);

    // Warm Exterior Architectural Sconce Lights on Front Facade & Gate Pillars
    [8.2, 11.8, 18.0, 29.0].forEach((lx) => {
      const sconce = new THREE.Mesh(new THREE.BoxGeometry(0.45 * FT, 0.9 * FT, 0.35 * FT), warmLightMat);
      sconce.position.set(toX(lx), 6.2 * FT, toZ(lx < 15 ? 43.9 : 60.4));
      completionGroup.add(sconce);
    });

    // Paved Driveway & Parking Pad in Open Foyer (Z: 43.5..60)
    const drivewayPad = new THREE.Mesh(
      new THREE.BoxGeometry(29.2 * FT, 0.12 * FT, 16.0 * FT),
      new THREE.MeshStandardMaterial({ color: '#CBD5E1', roughness: 0.9 })
    );
    drivewayPad.position.set(toX(15), 0.06 * FT, toZ(51.8));
    drivewayPad.receiveShadow = true;
    completionGroup.add(drivewayPad);

    // Miniature Scale-Model Car Parked in Open Foyer (X: 16, Z: 52)
    const carGroup = new THREE.Group();
    const carBody = new THREE.Mesh(
      new THREE.BoxGeometry(5.6 * FT, 2.2 * FT, 12.5 * FT),
      new THREE.MeshStandardMaterial({ color: '#E2E8F0', roughness: 0.25, metalness: 0.65 })
    );
    carBody.position.y = 1.6 * FT;
    carBody.castShadow = true;
    const carCabin = new THREE.Mesh(
      new THREE.BoxGeometry(4.8 * FT, 1.7 * FT, 6.2 * FT),
      glassMat
    );
    carCabin.position.set(0, 3.3 * FT, -0.5 * FT);
    carGroup.add(carBody, carCabin);
    // 4 Wheels
    [
      [-2.7, 3.8],
      [2.7, 3.8],
      [-2.7, -3.8],
      [2.7, -3.8],
    ].forEach(([wx, wz]) => {
      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(1.1 * FT, 1.1 * FT, 0.8 * FT, 16), darkMetalMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.position.set(wx * FT, 1.1 * FT, wz * FT);
      carGroup.add(wheel);
    });
    carGroup.position.set(toX(16.5), 0.1 * FT, toZ(52));
    completionGroup.add(carGroup);

    // Miniature Landscaping: Grass patches & crisp architectural model shrubs
    const grassMat = new THREE.MeshStandardMaterial({ color: '#4D7C0F', roughness: 0.95 });
    const shrubMat = new THREE.MeshStandardMaterial({ color: '#3F6212', roughness: 0.85 });
    const grassStrip = new THREE.Mesh(new THREE.BoxGeometry(6.5 * FT, 0.18 * FT, 14 * FT), grassMat);
    grassStrip.position.set(toX(26), 0.09 * FT, toZ(52));
    grassStrip.receiveShadow = true;
    completionGroup.add(grassStrip);

    [
      [26.5, 46.5],
      [26.5, 51.5],
      [26.5, 56.5],
      [2.0, 56.5],
    ].forEach(([sx, sz]) => {
      const shrub = new THREE.Mesh(new THREE.DodecahedronGeometry(1.35 * FT, 1), shrubMat);
      shrub.position.set(toX(sx), 1.4 * FT, toZ(sz));
      shrub.castShadow = true;
      completionGroup.add(shrub);
    });

    completionGroup.scale.y = 0.001;
    scene.add(completionGroup);

    // -----------------------------------------------------------------------
    // 5. Controlled 10-Second Line-by-Line Extrusion & Hero Reveal Loop
    // -----------------------------------------------------------------------
    const CYCLE_DURATION = 11.5; // 10s build + 1.5s hold on front-facade hero
    const startTime = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);
      const elapsed = ((now - startTime) / 1000) % CYCLE_DURATION;

      // 1–3s: Outer & Boundary Walls extrude upward directly from printed lines
      // 3–5s: Internal Room Walls extrude upward sequentially
      extrudingWalls.forEach((ew) => {
        let startS = 1.0;
        let dur = 1.6;
        if (ew.category === 'outer') {
          startS = 1.0 + (ew.index % 5) * 0.12;
          dur = 1.4;
        } else if (ew.category === 'boundary') {
          startS = 1.6 + (ew.index % 4) * 0.15;
          dur = 1.3;
        } else {
          startS = 3.0 + (ew.index % 7) * 0.16;
          dur = 1.4;
        }
        const t = easeOutCubic((elapsed - startS) / dur);
        ew.mesh.scale.y = Math.max(0.001, t);
        ew.mesh.visible = t > 0.005;
      });

      // 5–6.5s: Doors, Windows, Gates, Staircase & Balcony assemble
      const detT = easeOutCubic((elapsed - 5.0) / 1.4);
      detailsGroup.scale.y = Math.max(0.001, detT);
      detailsGroup.visible = detT > 0.005;

      // 6.5–8s: Roof Slab, Exterior Finishes, Car & Landscaping complete
      const compT = easeOutCubic((elapsed - 6.4) / 1.5);
      completionGroup.scale.y = Math.max(0.001, compT);
      completionGroup.visible = compT > 0.005;

      // 8–10s: Locked camera glides smoothly forward & downward to Front Facade
      const camT = easeInOutCubic((elapsed - 8.0) / 2.0);
      camera.position.lerpVectors(LOCKED_CAM_POS, HERO_CAM_POS, camT);
      const currentLook = new THREE.Vector3().lerpVectors(LOCKED_LOOK_AT, HERO_LOOK_AT, camT);
      camera.lookAt(currentLook);

      if (onStageChange) {
        let phase = '2D ARCHITECTURAL BLUEPRINT';
        if (elapsed >= 1.0 && elapsed < 3.0) phase = 'EXTRUDING OUTER & BOUNDARY WALLS';
        else if (elapsed >= 3.0 && elapsed < 5.0) phase = 'EXTRUDING INTERNAL ROOMS & O.T.S.';
        else if (elapsed >= 5.0 && elapsed < 6.5) phase = 'ASSEMBLING GATES, DOORS & STAIRCASE';
        else if (elapsed >= 6.5 && elapsed < 8.0) phase = 'ROOF SLAB & EXTERIOR FINISHES';
        else if (elapsed >= 8.0) phase = 'FRONT-FACADE HERO REVEAL';
        onStageChange({
          phase,
          floor: elapsed >= 6.5 ? 1 : 0,
          progressPct: Math.min(100, Math.round((elapsed / 10.0) * 100)),
        });
      }

      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

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
      aria-label="3D Architectural Blueprint-to-House Extrusion"
    />
  );
};
