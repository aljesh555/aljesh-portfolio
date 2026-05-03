import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";
import { EDGES, HOME } from "../lib/edges";
import { getLandDotPositions } from "../lib/landDots";
import { getCountryBorderSegments } from "../lib/borders";

const RADIUS = 1.55;

function latLonToVec3(lat, lon, r = RADIUS) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  );
}

/* ============================================================
   Globe base — wine ocean with subtle Phong specular highlight.
============================================================ */
function GlobeBase() {
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 0.985, 96, 96]} />
      <meshPhongMaterial
        color="#220C14"
        emissive="#36101C"
        specular="#7A1F2B"
        shininess={22}
      />
    </mesh>
  );
}

/* ============================================================
   Procedural cloud layer — simplex noise rotating slightly faster
   than the surface, with edge fade & polar fade.
============================================================ */
const CLOUD_VERTEX = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
// Ashima Arts simplex noise (psrdnoise3) — open source
const CLOUD_FRAGMENT = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;
  uniform vec3 uColor;

  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+C.yyy;
    vec3 x3=x0-D.yyy;
    i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  float fbm(vec3 p){
    float v = 0.0;
    float a = 0.5;
    for (int i=0;i<5;i++){ v += a*snoise(p); p *= 2.05; a *= 0.5; }
    return v;
  }

  void main() {
    // Map UV onto a sphere position so noise is seamless
    float lon = (vUv.x - 0.5) * 6.28318;
    float lat = (vUv.y - 0.5) * 3.14159;
    float cl = cos(lat);
    vec3 pos = vec3(cos(lon)*cl, sin(lat), sin(lon)*cl) * 2.4;
    pos.x += uTime * 0.04;
    float n = fbm(pos);
    n = (n + 1.0) * 0.5;
    float clouds = smoothstep(0.58, 0.84, n);
    float poleFade = pow(sin(vUv.y * 3.14159), 0.6);
    float edge = pow(max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 0.6);
    float a = clouds * 0.32 * poleFade * edge;
    gl_FragColor = vec4(uColor, a);
  }
`;

function CloudLayer({ visible = true }) {
  const matRef = useRef(null);
  const meshRef = useRef(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#FBE9C9") },
    }),
    []
  );
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
    if (meshRef.current) meshRef.current.rotation.y = clock.getElapsedTime() * 0.012;
  });
  if (!visible) return null;
  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[RADIUS * 1.022, 96, 96]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={CLOUD_VERTEX}
        fragmentShader={CLOUD_FRAGMENT}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ============================================================
   Country borders + coastlines.
============================================================ */
function CountryBorders() {
  const positions = useMemo(() => getCountryBorderSegments(RADIUS * 1.008), []);
  const matRef = useRef(null);
  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.opacity = 0;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      const e = (performance.now() - t0) / 1800;
      const p = Math.min(e, 1);
      if (matRef.current) matRef.current.opacity = (1 - Math.pow(1 - p, 3)) * 0.5;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <lineBasicMaterial
        ref={matRef}
        color="#D4B070"
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </lineSegments>
  );
}

/* ============================================================
   Land — ~7k dots forming continents, fade-in reveal.
============================================================ */
function LandDots() {
  const positions = useMemo(() => getLandDotPositions(RADIUS, 3, 720), []);
  const matRef = useRef(null);

  useEffect(() => {
    if (!matRef.current) return;
    matRef.current.opacity = 0;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      const e = (performance.now() - t0) / 1500;
      const p = Math.min(e, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (matRef.current) matRef.current.opacity = eased * 1.0;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.02}
        color="#FFD68A"
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

/* ============================================================
   Edge cities — bright additive dots to trigger bloom.
============================================================ */
function CityDots({ excludeCodes }) {
  const matRef = useRef(null);
  const positions = useMemo(() => {
    const arr = [];
    for (const c of EDGES) {
      if (excludeCodes.has(c.code)) continue;
      const v = latLonToVec3(c.lat, c.lon, RADIUS * 1.014);
      arr.push(v.x, v.y, v.z);
    }
    return new Float32Array(arr);
  }, [excludeCodes]);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.size = 0.034 + Math.sin(clock.getElapsedTime() * 1.4) * 0.005;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.034}
        color="#FFE5B0"
        sizeAttenuation
        transparent
        opacity={1.0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   Pulse — Home & Visitor city markers with halo.
============================================================ */
function PulseCity({ city, color, ringColor, size = 0.05, faster = false }) {
  const innerRef = useRef(null);
  const ringRef = useRef(null);
  const ringMatRef = useRef(null);
  const haloRef = useRef(null);
  const haloMatRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (innerRef.current) innerRef.current.scale.setScalar(1 + Math.sin(t * 2.6) * 0.18);
    if (haloRef.current && haloMatRef.current) {
      haloRef.current.scale.setScalar(1 + Math.sin(t * 1.6) * 0.22);
      haloMatRef.current.opacity = 0.45 + Math.sin(t * 1.6) * 0.12;
    }
    if (ringRef.current && ringMatRef.current) {
      const speed = faster ? 0.9 : 0.6;
      const phase = (t * speed) % 1;
      ringRef.current.scale.setScalar(1 + phase * 5);
      ringMatRef.current.opacity = 0.7 * (1 - phase);
    }
  });

  const pos = latLonToVec3(city.lat, city.lon, RADIUS * 1.018);

  return (
    <group position={pos}>
      <mesh ref={haloRef}>
        <sphereGeometry args={[size * 1.35, 16, 16]} />
        <meshBasicMaterial
          ref={haloMatRef}
          color={ringColor || color}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.3}
        />
      </mesh>
      <mesh ref={ringRef}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          ref={ringMatRef}
          color={ringColor || color}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh ref={innerRef}>
        <sphereGeometry args={[size * 0.55, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ============================================================
   Visitor → Home arc with traveling packet.
============================================================ */
function VisitorArc({ from, to, color }) {
  const dotRef = useRef(null);
  const dotMatRef = useRef(null);
  const tubeMatRef = useRef(null);

  const curve = useMemo(() => {
    const start = latLonToVec3(from.lat, from.lon, RADIUS * 1.012);
    const end = latLonToVec3(to.lat, to.lon, RADIUS * 1.012);
    const distance = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(RADIUS + Math.min(distance * 0.46, 1.4));
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  useEffect(() => {
    if (!tubeMatRef.current) return;
    tubeMatRef.current.opacity = 0;
    let raf;
    const t0 = performance.now();
    const tick = () => {
      const e = (performance.now() - t0) / 1200;
      const p = Math.min(e, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      if (tubeMatRef.current) tubeMatRef.current.opacity = eased * 1.0;
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useFrame(({ clock }) => {
    if (!dotRef.current) return;
    const t = (clock.getElapsedTime() * 0.42) % 1;
    const point = curve.getPoint(t);
    dotRef.current.position.copy(point);
    const eased = Math.sin(t * Math.PI);
    dotRef.current.scale.setScalar(0.7 + eased * 1.7);
    if (dotMatRef.current) dotMatRef.current.opacity = 0.4 + eased * 0.6;
  });

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 96, 0.013, 10, false]} />
        <meshBasicMaterial
          ref={tubeMatRef}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.028, 14, 14]} />
        <meshBasicMaterial ref={dotMatRef} color="#FFE8C2" transparent />
      </mesh>
    </>
  );
}

/* ============================================================
   Ambient arcs — 8 background flows.
============================================================ */
function AmbientArc({ from, to, color, delay, period }) {
  const lineMatRef = useRef(null);
  const dotRef = useRef(null);
  const dotMatRef = useRef(null);

  const curve = useMemo(() => {
    const start = latLonToVec3(from.lat, from.lon, RADIUS * 1.008);
    const end = latLonToVec3(to.lat, to.lon, RADIUS * 1.008);
    const distance = start.distanceTo(end);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(RADIUS + Math.min(distance * 0.4, 1.2));
    return new THREE.QuadraticBezierCurve3(start, mid, end);
  }, [from, to]);

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() + delay) % period) / period;
    const opacity = t < 0.25 ? t / 0.25 : t < 0.75 ? 1 : Math.max(0, 1 - (t - 0.75) / 0.25);

    if (lineMatRef.current) lineMatRef.current.opacity = opacity * 0.55;
    if (dotRef.current) {
      const point = curve.getPoint(Math.min(t * 1.05, 1));
      dotRef.current.position.copy(point);
    }
    if (dotMatRef.current) {
      dotMatRef.current.opacity = t > 0.05 && t < 0.95 ? Math.min(opacity * 1.2, 1) : 0;
    }
  });

  return (
    <>
      <mesh>
        <tubeGeometry args={[curve, 64, 0.005, 8, false]} />
        <meshBasicMaterial
          ref={lineMatRef}
          color={color}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={dotRef}>
        <sphereGeometry args={[0.016, 10, 10]} />
        <meshBasicMaterial ref={dotMatRef} color={color} transparent opacity={0} />
      </mesh>
    </>
  );
}

function AmbientArcs() {
  const pairs = useMemo(() => {
    const out = [];
    const seen = new Set();
    let safety = 0;
    while (out.length < 8 && safety++ < 100) {
      const a = EDGES[Math.floor(Math.random() * EDGES.length)]; // eslint-disable-line react-hooks/purity
      const b = EDGES[Math.floor(Math.random() * EDGES.length)]; // eslint-disable-line react-hooks/purity
      if (a.code === b.code) continue;
      const key = [a.code, b.code].sort().join("-");
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        from: a, to: b,
        delay: Math.random() * 6, // eslint-disable-line react-hooks/purity
        period: 4 + Math.random() * 3.5, // eslint-disable-line react-hooks/purity
      });
    }
    return out;
  }, []);

  const palette = ["#E5C26B", "#FFB5A1", "#F5E7C9", "#E07084", "#C8A85C", "#FFD68A"];
  return (
    <>
      {pairs.map((p, i) => (
        <AmbientArc
          key={i}
          from={p.from} to={p.to}
          color={palette[i % palette.length]}
          delay={p.delay}
          period={p.period}
        />
      ))}
    </>
  );
}

/* ============================================================
   City ripples — sonar pings.
============================================================ */
function CityRipple({ city, color, period, delay }) {
  const ref = useRef(null);
  const matRef = useRef(null);
  const pos = useMemo(() => latLonToVec3(city.lat, city.lon, RADIUS * 1.013), [city]);

  useFrame(({ clock }) => {
    const t = ((clock.getElapsedTime() + delay) % period) / period;
    if (ref.current) ref.current.scale.setScalar(0.04 + t * 0.42);
    if (matRef.current) matRef.current.opacity = (1 - t) * 0.55;
  });

  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[1, 24, 24]} />
      <meshBasicMaterial
        ref={matRef}
        color={color}
        transparent
        opacity={0}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

function CityRipples() {
  const ripples = useMemo(() => {
    const out = [];
    const used = new Set();
    let safety = 0;
    while (out.length < 9 && safety++ < 50) {
      const c = EDGES[Math.floor(Math.random() * EDGES.length)]; // eslint-disable-line react-hooks/purity
      if (used.has(c.code)) continue;
      used.add(c.code);
      out.push({
        city: c,
        delay: Math.random() * 6, // eslint-disable-line react-hooks/purity
        period: 5 + Math.random() * 4, // eslint-disable-line react-hooks/purity
      });
    }
    return out;
  }, []);

  return ripples.map((r, i) => (
    <CityRipple
      key={i}
      city={r.city}
      color={i % 2 === 0 ? "#FFE0A6" : "#E07084"}
      period={r.period}
      delay={r.delay}
    />
  ));
}

/* ============================================================
   Polar aurora — dense glowing rings around each pole.
============================================================ */
function PolarAurora({ lat, color }) {
  const ref = useRef(null);
  const positions = useMemo(() => {
    const N = 180;
    const arr = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const lon = (i / N) * 360 - 180;
      const jitterLat = lat + (Math.random() - 0.5) * 10; // eslint-disable-line react-hooks/purity
      const r = RADIUS * (1.04 + Math.random() * 0.06); // eslint-disable-line react-hooks/purity
      const v = latLonToVec3(jitterLat, lon, r);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, [lat]);
  const matRef = useRef(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ref.current) ref.current.rotation.y = t * 0.25 * (lat > 0 ? 1 : -1);
    if (matRef.current) matRef.current.opacity = 0.7 + Math.sin(t * 0.8) * 0.2;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.034}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.95}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ============================================================
   Radar sweep — bright meridian + 6 trailing ghosts.
============================================================ */
function RadarSweep() {
  const groupRef = useRef(null);
  const points = useMemo(() => {
    const N = 64;
    const arr = new Float32Array((N + 1) * 3);
    for (let i = 0; i <= N; i++) {
      const lat = -90 + (i / N) * 180;
      const v = latLonToVec3(lat, 0, RADIUS * 1.024);
      arr[i * 3] = v.x;
      arr[i * 3 + 1] = v.y;
      arr[i * 3 + 2] = v.z;
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * 0.45;
  });

  const ghosts = [0, 0.05, 0.1, 0.16, 0.22, 0.3];
  const ghostOpacities = [1.0, 0.55, 0.35, 0.22, 0.13, 0.07];

  return (
    <group ref={groupRef}>
      {ghosts.map((offset, i) => (
        <group key={i} rotation={[0, -offset, 0]}>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[points, 3]} />
            </bufferGeometry>
            <lineBasicMaterial
              color="#FFEDC8"
              transparent
              opacity={ghostOpacities[i] * 0.55}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
        </group>
      ))}
    </group>
  );
}

/* ============================================================
   Background star field with breathing brightness.
============================================================ */
function Stars() {
  const positions = useMemo(() => {
    const arr = new Float32Array(900 * 3);
    for (let i = 0; i < 900; i++) {
      const r = 7 + Math.random() * 11; // eslint-disable-line react-hooks/purity
      const theta = Math.random() * Math.PI * 2; // eslint-disable-line react-hooks/purity
      const phi = Math.acos(2 * Math.random() - 1); // eslint-disable-line react-hooks/purity
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);
  const matRef = useRef(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.opacity = 0.6 + Math.sin(clock.getElapsedTime() * 0.6) * 0.18;
    }
  });

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={matRef}
        size={0.028}
        color="#F8EFD3"
        sizeAttenuation
        transparent
        opacity={0.7}
        depthWrite={false}
      />
    </points>
  );
}

/* ============================================================
   Atmosphere — Fresnel rim glow (restored + enhanced).
============================================================ */
const ATM_VERT = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ATM_FRAG = `
  varying vec3 vNormal;
  void main() {
    float intensity = pow(0.72 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
    vec3 inner = vec3(0.72, 0.18, 0.22);
    vec3 outer = vec3(0.28, 0.08, 0.38);
    vec3 col = mix(inner, outer, pow(intensity, 0.6));
    gl_FragColor = vec4(col * 1.8, 1.0) * intensity;
  }
`;
function AtmosphereGlow() {
  return (
    <mesh scale={1.22}>
      <sphereGeometry args={[RADIUS, 64, 64]} />
      <shaderMaterial
        vertexShader={ATM_VERT}
        fragmentShader={ATM_FRAG}
        side={THREE.BackSide}
        blending={THREE.AdditiveBlending}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ============================================================
   HexGrid — glowing geodesic hex overlay with pulsing cells.
============================================================ */
const HEX_VERT = `
  varying vec2 vUv;
  varying vec3 vNormal;
  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const HEX_FRAG = `
  varying vec2 vUv;
  varying vec3 vNormal;
  uniform float uTime;

  float hexDist(vec2 p) {
    p = abs(p);
    return max(dot(p, normalize(vec2(1.0, 1.73205))), p.x);
  }

  vec4 hexCoords(vec2 uv) {
    vec2 r = vec2(1.0, 1.73205);
    vec2 h = r * 0.5;
    vec2 a = mod(uv, r) - h;
    vec2 b = mod(uv - h, r) - h;
    vec2 gv = dot(a, a) < dot(b, b) ? a : b;
    float id = dot(floor(uv / r), vec2(127.1, 311.7));
    return vec4(gv, id, 0.0);
  }

  void main() {
    float poleFade = pow(sin(vUv.y * 3.14159), 0.5);
    float fresnel   = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 1.4);

    vec2 uv = vUv * vec2(30.0, 18.0);
    vec4 hc = hexCoords(uv);

    float d = hexDist(hc.xy);
    float edge = 1.0 - smoothstep(0.44, 0.49, d);

    float cellSeed = sin(hc.z * 1.0);
    float pulse = sin(uTime * 0.6 + cellSeed * 5.0) * 0.5 + 0.5;
    float flash = step(0.93, sin(uTime * 0.25 + cellSeed * 9.1) * 0.5 + 0.5);
    float activity = step(0.78, sin(uTime * 0.4 + cellSeed * 3.7) * 0.5 + 0.5);

    vec3 baseCol  = mix(vec3(0.55, 0.12, 0.18), vec3(0.90, 0.38, 0.10), pulse);
    vec3 flashCol = vec3(1.0, 0.85, 0.40);
    vec3 activeCol= mix(baseCol, vec3(1.0, 0.55, 0.15), activity * 0.6);
    vec3 col      = mix(activeCol, flashCol, flash);

    float alpha = edge * (0.25 + fresnel * 0.5) * poleFade;
    alpha *= (0.4 + pulse * 0.3 + flash * 0.9);

    gl_FragColor = vec4(col, alpha * 0.65);
  }
`;
function HexGrid() {
  const matRef = useRef(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);
  useFrame(({ clock }) => {
    if (matRef.current) matRef.current.uniforms.uTime.value = clock.getElapsedTime();
  });
  return (
    <mesh>
      <sphereGeometry args={[RADIUS * 1.004, 128, 128]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={HEX_VERT}
        fragmentShader={HEX_FRAG}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* ============================================================
   OrbitalRing — torus ring with moving satellite nodes.
============================================================ */
function OrbitalRing({ inclination = 0, speed = 0.18, color = "#00E8FF", nodeCount = 4, radius = 1.42 }) {
  const groupRef = useRef(null);
  const nodePositions = useMemo(
    () => Array.from({ length: nodeCount }, (_, i) => (i / nodeCount) * Math.PI * 2),
    [nodeCount]
  );
  useFrame(({ clock }) => {
    if (groupRef.current) groupRef.current.rotation.y = clock.getElapsedTime() * speed;
  });
  const R = RADIUS * radius;
  return (
    <group rotation={[inclination, 0, 0]}>
      {/* Ring torus */}
      <mesh>
        <torusGeometry args={[R, 0.003, 8, 200]} />
        <meshBasicMaterial color={color} transparent opacity={0.4} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Nodes */}
      <group ref={groupRef}>
        {nodePositions.map((angle, i) => (
          <group key={i}>
            {/* Node sphere */}
            <mesh position={[Math.cos(angle) * R, 0, Math.sin(angle) * R]}>
              <sphereGeometry args={[0.022, 8, 8]} />
              <meshBasicMaterial color={color} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            {/* Node halo */}
            <mesh position={[Math.cos(angle) * R, 0, Math.sin(angle) * R]}>
              <sphereGeometry args={[0.048, 8, 8]} />
              <meshBasicMaterial color={color} transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}

/* ============================================================
   ScanRing — horizontal ring that sweeps pole-to-pole.
============================================================ */
function ScanRing() {
  const groupRef = useRef(null);
  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime() * 0.22;
    const y = Math.sin(t) * RADIUS * 1.05;
    groupRef.current.position.y = y;
    const r = Math.sqrt(Math.max(0, (RADIUS * 1.06) ** 2 - y * y));
    groupRef.current.scale.set(r / RADIUS, 1, r / RADIUS);
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[RADIUS, 0.004, 8, 160]} />
        <meshBasicMaterial color="#FF6A2A" transparent opacity={0.7} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Inner glow ring */}
      <mesh>
        <torusGeometry args={[RADIUS, 0.012, 8, 160]} />
        <meshBasicMaterial color="#FF8840" transparent opacity={0.18} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

/* ============================================================
   Day/night sun — directional light orbiting Y axis.
============================================================ */
function OrbitingSun() {
  const ref = useRef(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * 0.06;
    ref.current.position.set(Math.cos(t) * 6, 2, Math.sin(t) * 6);
  });
  return <directionalLight ref={ref} intensity={1.4} color="#FFE8C2" />;
}

/* ============================================================
   Main rotating Earth group.
============================================================ */
function GlobeGroup({ visitor, pointer }) {
  const ref = useRef(null);
  const tilt = 23.5 * (Math.PI / 180);

  const initialRotation = useMemo(() => {
    if (!visitor) return [0.15, -((HOME.lon + 90) * Math.PI) / 180, 0];
    const midLon = (visitor.lon + HOME.lon) / 2;
    const midLat = (visitor.lat + HOME.lat) / 2;
    return [(-midLat * Math.PI) / 180 + 0.05, (-(midLon + 90) * Math.PI) / 180, 0];
  }, [visitor]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime();
    const px = pointer?.current?.x ?? 0;
    const py = pointer?.current?.y ?? 0;
    ref.current.rotation.y = initialRotation[1] + t * 0.05 + px * 0.5;
    ref.current.rotation.x = initialRotation[0] + py * 0.2;
  });

  const exclude = useMemo(() => {
    const s = new Set([HOME.code]);
    if (visitor && visitor.code !== HOME.code) s.add(visitor.code);
    return s;
  }, [visitor]);

  return (
    <group rotation={[0, 0, tilt]}>
      {/* Atmosphere sits outside the rotating group */}
      <AtmosphereGlow />
      {/* Orbital system — counter-rotates slightly against globe */}
      <OrbitalRing inclination={0}                    speed={0.14}  color="#00E8FF" nodeCount={4} radius={1.44} />
      <OrbitalRing inclination={Math.PI * 0.38}       speed={-0.10} color="#FF6A2A" nodeCount={3} radius={1.50} />
      <OrbitalRing inclination={Math.PI * 0.62}       speed={0.08}  color="#C0F5E0" nodeCount={5} radius={1.38} />
      <group ref={ref}>
        <GlobeBase />
        <CountryBorders />
        <LandDots />
        <HexGrid />
        <CloudLayer />
        <CityDots excludeCodes={exclude} />
        <CityRipples />
        <PolarAurora lat={78} color="#C0F5E0" />
        <PolarAurora lat={-78} color="#FFC9DD" />
        <AmbientArcs />
        <ScanRing />
        <PulseCity city={HOME} color="#FFE0A6" ringColor="#C8A85C" size={0.062} />
        {visitor && visitor.code !== HOME.code && (
          <>
            <PulseCity city={visitor} color="#FF8FA1" ringColor="#A93947" size={0.046} faster />
            <VisitorArc from={visitor} to={HOME} color="#E07084" />
          </>
        )}
      </group>
      <RadarSweep />
    </group>
  );
}

/* ============================================================
   WebGL support check.
============================================================ */
function checkWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/* ============================================================
   CSS fallback globe — shown when WebGL is unavailable.
============================================================ */
function GlobeFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
      <div className="relative w-full h-full">
        {/* Outer atmosphere glow */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle at 38% 38%, #7A1F2B44 0%, #A9394722 40%, transparent 70%)",
            animation: "pulse 4s ease-in-out infinite",
          }}
        />
        {/* Globe sphere */}
        <div
          className="absolute inset-[8%] rounded-full"
          style={{
            background:
              "radial-gradient(circle at 35% 35%, #36101C, #220C14 55%, #0a0508 100%)",
            boxShadow:
              "inset -12px -12px 40px rgba(122,31,43,0.5), inset 6px 6px 20px rgba(200,168,92,0.08), 0 0 60px rgba(169,57,71,0.25), 0 0 120px rgba(169,57,71,0.1)",
          }}
        >
          {/* Latitude lines */}
          {[30, 50, 70].map((top) => (
            <div
              key={top}
              className="absolute left-[10%] right-[10%]"
              style={{
                top: `${top}%`,
                height: "1px",
                background: "rgba(212,176,112,0.12)",
                borderRadius: "50%",
              }}
            />
          ))}
          {/* Longitude lines */}
          {[30, 50, 70].map((left) => (
            <div
              key={left}
              className="absolute top-[10%] bottom-[10%]"
              style={{
                left: `${left}%`,
                width: "1px",
                background: "rgba(212,176,112,0.08)",
              }}
            />
          ))}
          {/* Home marker — Kathmandu */}
          <div
            className="absolute"
            style={{
              top: "38%",
              left: "72%",
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "#FFE0A6",
              boxShadow: "0 0 0 4px rgba(255,224,166,0.25), 0 0 16px rgba(255,224,166,0.5)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          />
          {/* Specular highlight */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "radial-gradient(ellipse at 30% 28%, rgba(255,255,255,0.07) 0%, transparent 55%)",
            }}
          />
        </div>
        {/* Labels */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: "4%", fontSize: 9, letterSpacing: "0.32em", opacity: 0.45, color: "var(--fg)", textTransform: "uppercase" }}
        >
          ⌗ Local Studio · Global Reach
        </div>
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ bottom: "4%", fontSize: 9, letterSpacing: "0.32em", opacity: 0.45, color: "var(--fg)", textTransform: "uppercase" }}
        >
          N·27.71° / E·85.32° — KTM
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </div>
  );
}

/* ============================================================
   Public component.
============================================================ */
export default function EdgeGlobe({ visitor }) {
  const pointer = useRef({ x: 0, y: 0 });
  const wrap = useRef(null);
  const [webglOk] = useState(() => checkWebGL());

  useEffect(() => {
    const onMove = (e) => {
      if (!wrap.current) return;
      const r = wrap.current.getBoundingClientRect();
      pointer.current = {
        x: ((e.clientX - r.left) / r.width - 0.5) * 1.4,
        y: -((e.clientY - r.top) / r.height - 0.5) * 0.6,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  if (!webglOk) return <GlobeFallback />;

  return (
    <div ref={wrap} className="absolute inset-0" aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 4.4], fov: 38 }}
      >
        <ambientLight intensity={0.35} />
        <OrbitingSun />
        <directionalLight position={[-4, -2, -3]} intensity={0.55} color="#A93947" />
        <pointLight position={[3, 3, 3]} intensity={0.6} color="#00E8FF" distance={8} />
        <Suspense fallback={null}>
          <Stars />
          <GlobeGroup visitor={visitor} pointer={pointer} />
        </Suspense>
        <EffectComposer multisampling={0} disableNormalPass>
          <Bloom
            intensity={1.8}
            luminanceThreshold={0.3}
            luminanceSmoothing={0.6}
            mipmapBlur
            radius={0.9}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
