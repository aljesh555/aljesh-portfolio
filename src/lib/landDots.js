import { feature } from "topojson-client";
import worldTopo from "world-atlas/land-110m.json";

let cache = new Map();

/**
 * Build a Float32Array of 3D positions on a unit sphere where land exists.
 * We rasterize the world-atlas land geometry to a hidden canvas in
 * equirectangular projection and sample every `step` pixels.
 */
export function getLandDotPositions(radius = 1.55, step = 3, width = 720) {
  const key = `${radius}|${step}|${width}`;
  if (cache.has(key)) return cache.get(key);

  const W = width;
  const H = Math.round(width / 2);
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#fff";

  const land = feature(worldTopo, worldTopo.objects.land);

  const drawRing = (ring) => {
    ctx.beginPath();
    for (let i = 0; i < ring.length; i++) {
      const [lon, lat] = ring[i];
      const x = ((lon + 180) / 360) * W;
      const y = ((90 - lat) / 180) * H;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  };

  const drawGeom = (geom) => {
    if (!geom) return;
    if (geom.type === "Polygon") {
      geom.coordinates.forEach(drawRing);
    } else if (geom.type === "MultiPolygon") {
      geom.coordinates.forEach((poly) => poly.forEach(drawRing));
    }
  };

  if (land.type === "FeatureCollection") {
    land.features.forEach((f) => drawGeom(f.geometry));
  } else if (land.type === "Feature") {
    drawGeom(land.geometry);
  } else {
    drawGeom(land);
  }

  const data = ctx.getImageData(0, 0, W, H).data;
  const positions = [];

  for (let py = 0; py < H; py += step) {
    for (let px = 0; px < W; px += step) {
      const idx = (py * W + px) * 4;
      if (data[idx] > 128) {
        const lon = (px / W) * 360 - 180;
        const lat = 90 - (py / H) * 180;
        const phi = ((90 - lat) * Math.PI) / 180;
        const theta = ((lon + 180) * Math.PI) / 180;
        positions.push(
          -radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.cos(phi),
          radius * Math.sin(phi) * Math.sin(theta)
        );
      }
    }
  }

  const result = new Float32Array(positions);
  cache.set(key, result);
  return result;
}
