import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface NetworkNode {
  id: string;
  type: 'client' | 'dns' | 'server';
  position: THREE.Vector3;
  color: number;
}

const NetworkGraph = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    canvasRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create nodes
    const nodes: NetworkNode[] = [
      { id: 'client', type: 'client', position: new THREE.Vector3(-8, 0, 0), color: 0x00d9ff },
      { id: 'dns1', type: 'dns', position: new THREE.Vector3(0, 3, 0), color: 0xb537f2 },
      { id: 'dns2', type: 'dns', position: new THREE.Vector3(0, -3, 0), color: 0xff2e97 },
      { id: 'server', type: 'server', position: new THREE.Vector3(8, 0, 0), color: 0x00ff88 },
    ];

    const nodeObjects: THREE.Mesh[] = [];
    
    nodes.forEach((node) => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: node.color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.copy(node.position);
      
      // Add glow effect
      const glowGeometry = new THREE.SphereGeometry(0.7, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: node.color,
        transparent: true,
        opacity: 0.3,
      });
      const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
      glowMesh.position.copy(node.position);
      
      scene.add(mesh);
      scene.add(glowMesh);
      nodeObjects.push(mesh);
    });

    // Create connections
    const lineMaterial = new THREE.LineBasicMaterial({ 
      color: 0x00d9ff, 
      transparent: true, 
      opacity: 0.3 
    });

    const connections = [
      [nodes[0].position, nodes[1].position],
      [nodes[0].position, nodes[2].position],
      [nodes[1].position, nodes[3].position],
      [nodes[2].position, nodes[3].position],
    ];

    connections.forEach(([start, end]) => {
      const points = [start, end];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const line = new THREE.Line(geometry, lineMaterial);
      scene.add(line);
    });

    // Create moving particles
    const particles: THREE.Mesh[] = [];
    const particleCount = 10;
    
    for (let i = 0; i < particleCount; i++) {
      const particleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
      const particleMaterial = new THREE.MeshBasicMaterial({ 
        color: Math.random() > 0.5 ? 0x00d9ff : 0xff2e97 
      });
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      const randomConnection = connections[Math.floor(Math.random() * connections.length)];
      particle.position.copy(randomConnection[0]);
      particle.userData = {
        start: randomConnection[0].clone(),
        end: randomConnection[1].clone(),
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.01,
      };
      
      scene.add(particle);
      particles.push(particle);
    }

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // Rotate nodes slightly
      nodeObjects.forEach((node, i) => {
        node.rotation.y += 0.01;
        node.position.y += Math.sin(Date.now() * 0.001 + i) * 0.002;
      });

      // Move particles
      particles.forEach((particle) => {
        particle.userData.progress += particle.userData.speed;
        
        if (particle.userData.progress > 1) {
          particle.userData.progress = 0;
          const randomConnection = connections[Math.floor(Math.random() * connections.length)];
          particle.userData.start = randomConnection[0].clone();
          particle.userData.end = randomConnection[1].clone();
        }

        particle.position.lerpVectors(
          particle.userData.start,
          particle.userData.end,
          particle.userData.progress
        );
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="glass rounded-xl p-6 h-[500px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Network Topology</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-blue rounded-full animate-pulse"></div>
            <span className="text-gray-400">Client</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-purple rounded-full animate-pulse"></div>
            <span className="text-gray-400">DNS Server</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-cyber-green rounded-full animate-pulse"></div>
            <span className="text-gray-400">Target Server</span>
          </div>
        </div>
      </div>
      <div ref={canvasRef} className="w-full h-[420px] rounded-lg overflow-hidden" />
    </div>
  );
};

export default NetworkGraph;