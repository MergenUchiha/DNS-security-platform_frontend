import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useI18n } from '../../i18n';
import type { DNSQuery } from '../../types';

interface Props {
  queries: DNSQuery[];
}

const cameraRef = { current: null as THREE.PerspectiveCamera | null };
const rendererRef = { current: null as THREE.WebGLRenderer | null };

const SimpleNetworkGraph = ({ queries }: Props) => {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 15);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(0x00d9ff, 1, 50);
    light1.position.set(5, 5, 5);
    scene.add(light1);

    const light2 = new THREE.PointLight(0xff2e97, 1, 50);
    light2.position.set(-5, -5, 5);
    scene.add(light2);

    // Create 4 nodes
    const nodeData = [
      { pos: [-8, 0, 0], color: 0x00d9ff },
      { pos: [-2, 3, 0], color: 0xb537f2 },
      { pos: [-2, -3, 0], color: 0xff2e97 },
      { pos: [8, 0, 0], color: 0x00ff88 },
    ];

    nodeData.forEach(({ pos, color }) => {
      // Main sphere
      const geometry = new THREE.SphereGeometry(0.6, 32, 32);
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.4,
        metalness: 0.5,
        roughness: 0.3,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(pos[0], pos[1], pos[2]);
      scene.add(mesh);
      nodesRef.current.push(mesh);

      // Outer glow ring
      const ringGeometry = new THREE.TorusGeometry(0.9, 0.03, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.set(pos[0], pos[1], pos[2]);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    // Create connection lines
    const connections = [
      [nodeData[0].pos, nodeData[1].pos],
      [nodeData[0].pos, nodeData[2].pos],
      [nodeData[1].pos, nodeData[3].pos],
      [nodeData[2].pos, nodeData[3].pos],
    ];

    connections.forEach(([start, end]) => {
      const points = [
        new THREE.Vector3(start[0], start[1], start[2]),
        new THREE.Vector3(end[0], end[1], end[2]),
      ];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.3,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // Animation
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Gentle rotation
      nodesRef.current.forEach((node, i) => {
        node.rotation.y += 0.005;
        node.position.y += Math.sin(time + i) * 0.005;
      });

      // Slight camera movement
      camera.position.x = Math.sin(time * 0.1) * 0.5;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  const stats = {
    total: queries.length,
    blocked: queries.filter(q => q.status === 'blocked').length,
    spoofed: queries.filter(q => q.status === 'spoofed').length,
  };

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{t.dashboard.networkTopology}</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse" />
              <span className="text-gray-400">{t.dashboard.client}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-purple rounded-full animate-pulse" />
              <span className="text-gray-400">{t.dashboard.dns}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
              <span className="text-gray-400">{t.dashboard.server}</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[400px] relative">
        <div className="absolute top-4 left-4 glass rounded-lg p-3 space-y-1 text-xs z-10">
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">{t.simulation.totalQueries}:</span>
            <span className="text-white font-bold">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">{t.simulation.blocked}:</span>
            <span className="text-cyber-green font-bold">{stats.blocked}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">{t.simulation.spoofedAttacks}:</span>
            <span className="text-cyber-pink font-bold">{stats.spoofed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleNetworkGraph;