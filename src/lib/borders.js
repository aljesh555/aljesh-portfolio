import { mesh } from "topojson-client";
import countriesTopo from "world-atlas/countries-110m.json";

let cache = new Map();

/**
 * Build a Float32Array of line segments (pairs of 3D points) for the world's
 * country borders + coastlines, projected on a sphere of `radius`.
 */
export function getCountryBorderSegments(radius = 1.55) {
  if (cache.has(radius)) return cache.get(radius);

  const borders = mesh(countriesTopo, countriesTopo.objects.countries);
  const segments = [];

  for (const line of borders.coordinates) {
    for (let i = 0; i < line.length - 1; i++) {
      const [lon1, lat1] = line[i];
      const [lon2, lat2] = line[i + 1];
      // skip segments that wrap around the antimeridian
      if (Math.abs(lon2 - lon1) > 180) continue;
      const phi1 = ((90 - lat1) * Math.PI) / 180;
      const theta1 = ((lon1 + 180) * Math.PI) / 180;
      const phi2 = ((90 - lat2) * Math.PI) / 180;
      const theta2 = ((lon2 + 180) * Math.PI) / 180;
      segments.push(
        -radius * Math.sin(phi1) * Math.cos(theta1),
        radius * Math.cos(phi1),
        radius * Math.sin(phi1) * Math.sin(theta1),
        -radius * Math.sin(phi2) * Math.cos(theta2),
        radius * Math.cos(phi2),
        radius * Math.sin(phi2) * Math.sin(theta2)
      );
    }
  }

  const arr = new Float32Array(segments);
  cache.set(radius, arr);
  return arr;
}
