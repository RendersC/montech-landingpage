import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Edges, Environment } from '@react-three/drei';

/* ── Faceted crystal mesh (octahedron + edges) ────────────────────────────── */
const CrystalMesh = ({ mouse }) => {
  const group = useRef();
  const inner = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;
    // Slow auto-rotate
    group.current.rotation.y += delta * 0.18;
    // Slight tilt that follows mouse
    const targetX = mouse.current.y * 0.25;
    const targetZ = mouse.current.x * 0.25;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
    group.current.rotation.z += (targetZ - group.current.rotation.z) * 0.05;
    if (inner.current) inner.current.rotation.y -= delta * 0.4;
  });

  return (
    <group ref={group}>
      {/* Main crystal */}
      <mesh>
        <octahedronGeometry args={[1.4, 0]} />
        <meshPhysicalMaterial
          color="#1a4d80"
          metalness={0.3}
          roughness={0.18}
          transmission={0.55}
          thickness={1.4}
          ior={1.6}
          clearcoat={1}
          clearcoatRoughness={0.05}
          envMapIntensity={1.2}
          attenuationColor="#4FC3C3"
          attenuationDistance={2.5}
        />
        <Edges threshold={1} color="#7DD3D2" />
      </mesh>

      {/* Inner spinning core */}
      <mesh ref={inner} scale={0.55}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial
          color="#4FC3C3"
          emissive="#4FC3C3"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.2}
          wireframe
        />
      </mesh>

      {/* Orbiting tiny diamonds */}
      <OrbitDiamond radius={2.2} speed={0.6}  color="#E84B3A" size={0.18} phase={0}   />
      <OrbitDiamond radius={2.5} speed={-0.45} color="#4FC3C3" size={0.14} phase={2.1} />
      <OrbitDiamond radius={1.9} speed={0.3}  color="#ffffff" size={0.1}  phase={4.3} />
    </group>
  );
};

const OrbitDiamond = ({ radius, speed, color, size, phase }) => {
  const ref = useRef();
  useFrame((state) => {
    const t = state.clock.elapsedTime * speed + phase;
    if (ref.current) {
      ref.current.position.x = Math.cos(t) * radius;
      ref.current.position.z = Math.sin(t) * radius;
      ref.current.position.y = Math.sin(t * 1.4) * 0.4;
      ref.current.rotation.x += 0.02;
      ref.current.rotation.y += 0.03;
    }
  });
  return (
    <mesh ref={ref}>
      <octahedronGeometry args={[size, 0]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
};

/* ── Public component ───────────────────────────────────────────────────── */
const Crystal3D = ({ className, style }) => {
  const mouse = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouse.current.x = ((e.clientX - rect.left) / rect.width)  * 2 - 1;
    mouse.current.y = ((e.clientY - rect.top)  / rect.height) * 2 - 1;
  };

  return (
    <div
      className={className}
      style={style}
      onMouseMove={handleMouseMove}
    >
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 38 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]}   intensity={1.2} color="#4FC3C3" />
        <pointLight position={[-5, -3, 4]} intensity={0.8} color="#265077" />
        <pointLight position={[0, 4, -5]}  intensity={0.6} color="#E84B3A" />

        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.6}>
            <CrystalMesh mouse={mouse} />
          </Float>
          <Environment preset="night" />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Crystal3D;
