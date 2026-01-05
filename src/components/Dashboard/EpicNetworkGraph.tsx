import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { DNSQuery } from '../../types';

interface Props {
  queries: DNSQuery[];
}

const EpicNetworkGraph = ({ queries }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const nodesRef = useRef<THREE.Mesh[]>([]);
  const particlesRef = useRef<THREE.Points | null>(null);
  const [stats, setStats] = useState({ total: 0, blocked: 0, spoofed: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    scene.fog = new THREE.Fog(0x0a0e27, 10, 50);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 5, 20);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x00d9ff, 2, 50);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff2e97, 2, 50);
    pointLight2.position.set(-10, -10, 10);
    scene.add(pointLight2);

    // Create network nodes
    const nodePositions = [
      { pos: new THREE.Vector3(-10, 0, 0), color: 0x00d9ff, label: 'Client' },
      { pos: new THREE.Vector3(0, 5, 0), color: 0xb537f2, label: 'DNS 1' },
      { pos: new THREE.Vector3(0, -5, 0), color: 0xff2e97, label: 'DNS 2' },
      { pos: new THREE.Vector3(10, 0, 0), color: 0x00ff88, label: 'Server' },
    ];

    nodePositions.forEach(({ pos, color }) => {
      // Main node
      const geometry = new THREE.SphereGeometry(0.8, 32, 32);
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.3,
        shininess: 100,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(pos);
      scene.add(mesh);
      nodesRef.current.push(mesh);

      // Glow effect
      const glowGeometry = new THREE.SphereGeometry(1.2, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.2,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(pos);
      scene.add(glowMesh);

      // Outer ring
      const ringGeometry = new THREE.TorusGeometry(1.5, 0.05, 16, 100);
      const ringMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      ring.position.copy(pos);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);
    });

    // Create connections
    const connections = [
      [nodePositions[0].pos, nodePositions[1].pos],
      [nodePositions[0].pos, nodePositions[2].pos],
      [nodePositions[1].pos, nodePositions[3].pos],
      [nodePositions[2].pos, nodePositions[3].pos],
    ];

    connections.forEach(([start, end]) => {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0x00d9ff,
        transparent: true,
        opacity: 0.3,
        linewidth: 2,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);
    });

    // Particle system for background
    const particleCount = 1000;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 50;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 50;

      const color = new THREE.Color();
      color.setHSL(Math.random(), 0.7, 0.5);
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // Animation loop
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;

      // Rotate nodes
      nodesRef.current.forEach((node, i) => {
        node.rotation.y += 0.01;
        node.position.y += Math.sin(time + i) * 0.01;
      });

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.y += 0.0005;
        particlesRef.current.rotation.x += 0.0003;
      }

      // Animate camera
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current || !camera || !renderer) return;
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

  // Update stats from queries
  useEffect(() => {
    const total = queries.length;
    const blocked = queries.filter(q => q.status === 'blocked').length;
    const spoofed = queries.filter(q => q.status === 'spoofed').length;
    setStats({ total, blocked, spoofed });
  }, [queries]);

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Network Topology Visualization</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse" />
              <span className="text-gray-400">Client</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-purple rounded-full animate-pulse" />
              <span className="text-gray-400">DNS</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse" />
              <span className="text-gray-400">Server</span>
            </div>
          </div>
        </div>
      </div>

      <div ref={containerRef} className="w-full h-[500px] relative">
        {/* Stats overlay */}
        <div className="absolute top-4 left-4 glass rounded-lg p-3 space-y-1 text-xs">
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">Total Queries:</span>
            <span className="text-white font-bold">{stats.total}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">Blocked:</span>
            <span className="text-cyber-green font-bold">{stats.blocked}</span>
          </div>
          <div className="flex items-center justify-between space-x-4">
            <span className="text-gray-400">Spoofed:</span>
            <span className="text-cyber-pink font-bold">{stats.spoofed}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpicNetworkGraph;