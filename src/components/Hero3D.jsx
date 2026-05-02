import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Float, Environment } from "@react-three/drei";


function LiquidObject({ pointer }) {
  const ref = useRef(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    ref.current.rotation.y = t * 0.18 + pointer.current.x * 0.6;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.08 + pointer.current.y * 0.4;
    ref.current.position.y = Math.sin(t * 0.6) * 0.05;
  });

  return (
    <Float floatIntensity={1.2} rotationIntensity={0.6} speed={1.4}>
      <mesh ref={ref} castShadow receiveShadow scale={1.55}>
        <icosahedronGeometry args={[1.05, 64]} />
        <MeshDistortMaterial
          color={"#7A1F2B"}
          emissive={"#3A0F16"}
          emissiveIntensity={0.35}
          distort={0.42}
          speed={1.5}
          metalness={0.55}
          roughness={0.18}
          envMapIntensity={1.1}
        />
      </mesh>
    </Float>
  );
}

function Particles() {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      const r = 2.4 + Math.random() * 1.6; // eslint-disable-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2; // eslint-disable-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1); // eslint-disable-line react-hooks/purity
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.getElapsedTime() * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.012} color={"#C8A85C"} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
}

export default function Hero3D() {
  const pointer = useRef({ x: 0, y: 0 });

  const onPointer = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pointer.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 1.4,
      y: -((e.clientY - rect.top) / rect.height - 0.5) * 1.0,
    };
  };

  return (
    <div className="absolute inset-0 z-0" onPointerMove={onPointer} aria-hidden>
      <Canvas
        dpr={[1, 1.8]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.4], fov: 36 }}
      >
        <color attach="background" args={["#00000000"]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 5, 4]} intensity={1.2} color={"#FFE8C2"} />
        <directionalLight position={[-3, -2, -3]} intensity={0.6} color={"#A93947"} />
        <Suspense fallback={null}>
          <Environment preset="studio" />
          <LiquidObject pointer={pointer} />
          <Particles />
        </Suspense>
      </Canvas>
    </div>
  );
}
