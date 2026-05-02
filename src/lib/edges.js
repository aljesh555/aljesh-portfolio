// Representative Cloudflare edge cities. Codes are the IATA airport codes that
// Cloudflare uses in its `colo` field on /cdn-cgi/trace. Lat/lon used to plot
// dots on the 3D globe in EdgeGlobe.

export const HOME = { name: "Kathmandu", code: "KTM", country: "NP", lat: 27.7172, lon: 85.3240 };

export const EDGES = [
  { name: "Kathmandu",       code: "KTM", country: "NP", lat: 27.7172, lon: 85.3240 },
  { name: "Mumbai",          code: "BOM", country: "IN", lat: 19.0760, lon: 72.8777 },
  { name: "New Delhi",       code: "DEL", country: "IN", lat: 28.6139, lon: 77.2090 },
  { name: "Bengaluru",       code: "BLR", country: "IN", lat: 12.9716, lon: 77.5946 },
  { name: "Chennai",         code: "MAA", country: "IN", lat: 13.0827, lon: 80.2707 },
  { name: "Hyderabad",       code: "HYD", country: "IN", lat: 17.3850, lon: 78.4867 },
  { name: "Kolkata",         code: "CCU", country: "IN", lat: 22.5726, lon: 88.3639 },
  { name: "Karachi",         code: "KHI", country: "PK", lat: 24.8607, lon: 67.0011 },
  { name: "Lahore",          code: "LHE", country: "PK", lat: 31.5497, lon: 74.3436 },
  { name: "Dhaka",           code: "DAC", country: "BD", lat: 23.8103, lon: 90.4125 },
  { name: "Colombo",         code: "CMB", country: "LK", lat: 6.9271,  lon: 79.8612 },
  { name: "Singapore",       code: "SIN", country: "SG", lat: 1.3521,  lon: 103.8198 },
  { name: "Kuala Lumpur",    code: "KUL", country: "MY", lat: 3.1390,  lon: 101.6869 },
  { name: "Bangkok",         code: "BKK", country: "TH", lat: 13.7563, lon: 100.5018 },
  { name: "Jakarta",         code: "CGK", country: "ID", lat: -6.2088, lon: 106.8456 },
  { name: "Manila",          code: "MNL", country: "PH", lat: 14.5995, lon: 120.9842 },
  { name: "Hanoi",           code: "HAN", country: "VN", lat: 21.0285, lon: 105.8542 },
  { name: "Hong Kong",       code: "HKG", country: "HK", lat: 22.3193, lon: 114.1694 },
  { name: "Taipei",          code: "TPE", country: "TW", lat: 25.0330, lon: 121.5654 },
  { name: "Shanghai",        code: "SHA", country: "CN", lat: 31.2304, lon: 121.4737 },
  { name: "Tokyo",           code: "NRT", country: "JP", lat: 35.6762, lon: 139.6503 },
  { name: "Osaka",           code: "KIX", country: "JP", lat: 34.6937, lon: 135.5023 },
  { name: "Seoul",           code: "ICN", country: "KR", lat: 37.5665, lon: 126.9780 },
  { name: "Sydney",          code: "SYD", country: "AU", lat: -33.8688, lon: 151.2093 },
  { name: "Melbourne",       code: "MEL", country: "AU", lat: -37.8136, lon: 144.9631 },
  { name: "Perth",           code: "PER", country: "AU", lat: -31.9505, lon: 115.8605 },
  { name: "Auckland",        code: "AKL", country: "NZ", lat: -36.8485, lon: 174.7633 },

  { name: "Dubai",           code: "DXB", country: "AE", lat: 25.2048, lon: 55.2708 },
  { name: "Doha",            code: "DOH", country: "QA", lat: 25.2854, lon: 51.5310 },
  { name: "Riyadh",          code: "RUH", country: "SA", lat: 24.7136, lon: 46.6753 },
  { name: "Tel Aviv",        code: "TLV", country: "IL", lat: 32.0853, lon: 34.7818 },
  { name: "Istanbul",        code: "IST", country: "TR", lat: 41.0082, lon: 28.9784 },
  { name: "Cairo",           code: "CAI", country: "EG", lat: 30.0444, lon: 31.2357 },
  { name: "Casablanca",      code: "CMN", country: "MA", lat: 33.5731, lon: -7.5898 },
  { name: "Lagos",           code: "LOS", country: "NG", lat: 6.5244,  lon: 3.3792 },
  { name: "Nairobi",         code: "NBO", country: "KE", lat: -1.2921, lon: 36.8219 },
  { name: "Johannesburg",    code: "JNB", country: "ZA", lat: -26.2041, lon: 28.0473 },
  { name: "Cape Town",       code: "CPT", country: "ZA", lat: -33.9249, lon: 18.4241 },

  { name: "London",          code: "LHR", country: "GB", lat: 51.5074, lon: -0.1278 },
  { name: "Manchester",      code: "MAN", country: "GB", lat: 53.4808, lon: -2.2426 },
  { name: "Dublin",          code: "DUB", country: "IE", lat: 53.3498, lon: -6.2603 },
  { name: "Paris",           code: "CDG", country: "FR", lat: 48.8566, lon: 2.3522 },
  { name: "Marseille",       code: "MRS", country: "FR", lat: 43.2965, lon: 5.3698 },
  { name: "Amsterdam",       code: "AMS", country: "NL", lat: 52.3676, lon: 4.9041 },
  { name: "Brussels",        code: "BRU", country: "BE", lat: 50.8503, lon: 4.3517 },
  { name: "Frankfurt",       code: "FRA", country: "DE", lat: 50.1109, lon: 8.6821 },
  { name: "Munich",          code: "MUC", country: "DE", lat: 48.1351, lon: 11.5820 },
  { name: "Berlin",          code: "TXL", country: "DE", lat: 52.5200, lon: 13.4050 },
  { name: "Zurich",          code: "ZRH", country: "CH", lat: 47.3769, lon: 8.5417 },
  { name: "Vienna",          code: "VIE", country: "AT", lat: 48.2082, lon: 16.3738 },
  { name: "Milan",           code: "MXP", country: "IT", lat: 45.4642, lon: 9.1900 },
  { name: "Rome",            code: "FCO", country: "IT", lat: 41.9028, lon: 12.4964 },
  { name: "Madrid",          code: "MAD", country: "ES", lat: 40.4168, lon: -3.7038 },
  { name: "Barcelona",       code: "BCN", country: "ES", lat: 41.3851, lon: 2.1734 },
  { name: "Lisbon",          code: "LIS", country: "PT", lat: 38.7223, lon: -9.1393 },
  { name: "Athens",          code: "ATH", country: "GR", lat: 37.9838, lon: 23.7275 },
  { name: "Warsaw",          code: "WAW", country: "PL", lat: 52.2297, lon: 21.0122 },
  { name: "Prague",          code: "PRG", country: "CZ", lat: 50.0755, lon: 14.4378 },
  { name: "Stockholm",       code: "ARN", country: "SE", lat: 59.3293, lon: 18.0686 },
  { name: "Oslo",            code: "OSL", country: "NO", lat: 59.9139, lon: 10.7522 },
  { name: "Copenhagen",      code: "CPH", country: "DK", lat: 55.6761, lon: 12.5683 },
  { name: "Helsinki",        code: "HEL", country: "FI", lat: 60.1699, lon: 24.9384 },
  { name: "Reykjavík",       code: "KEF", country: "IS", lat: 64.1466, lon: -21.9426 },
  { name: "Moscow",          code: "DME", country: "RU", lat: 55.7558, lon: 37.6173 },

  { name: "New York",        code: "EWR", country: "US", lat: 40.7128, lon: -74.0060 },
  { name: "Boston",          code: "BOS", country: "US", lat: 42.3601, lon: -71.0589 },
  { name: "Washington",      code: "IAD", country: "US", lat: 38.9072, lon: -77.0369 },
  { name: "Atlanta",         code: "ATL", country: "US", lat: 33.7490, lon: -84.3880 },
  { name: "Miami",           code: "MIA", country: "US", lat: 25.7617, lon: -80.1918 },
  { name: "Chicago",         code: "ORD", country: "US", lat: 41.8781, lon: -87.6298 },
  { name: "Dallas",          code: "DFW", country: "US", lat: 32.7767, lon: -96.7970 },
  { name: "Houston",         code: "IAH", country: "US", lat: 29.7604, lon: -95.3698 },
  { name: "Denver",          code: "DEN", country: "US", lat: 39.7392, lon: -104.9903 },
  { name: "Phoenix",         code: "PHX", country: "US", lat: 33.4484, lon: -112.0740 },
  { name: "Seattle",         code: "SEA", country: "US", lat: 47.6062, lon: -122.3321 },
  { name: "Portland",        code: "PDX", country: "US", lat: 45.5152, lon: -122.6784 },
  { name: "San Francisco",   code: "SFO", country: "US", lat: 37.7749, lon: -122.4194 },
  { name: "San Jose",        code: "SJC", country: "US", lat: 37.3382, lon: -121.8863 },
  { name: "Los Angeles",     code: "LAX", country: "US", lat: 34.0522, lon: -118.2437 },
  { name: "Las Vegas",       code: "LAS", country: "US", lat: 36.1699, lon: -115.1398 },
  { name: "Toronto",         code: "YYZ", country: "CA", lat: 43.6532, lon: -79.3832 },
  { name: "Montreal",        code: "YUL", country: "CA", lat: 45.5017, lon: -73.5673 },
  { name: "Vancouver",       code: "YVR", country: "CA", lat: 49.2827, lon: -123.1207 },

  { name: "Mexico City",     code: "MEX", country: "MX", lat: 19.4326, lon: -99.1332 },
  { name: "Bogotá",          code: "BOG", country: "CO", lat: 4.7110,  lon: -74.0721 },
  { name: "Lima",            code: "LIM", country: "PE", lat: -12.0464, lon: -77.0428 },
  { name: "Santiago",        code: "SCL", country: "CL", lat: -33.4489, lon: -70.6693 },
  { name: "Buenos Aires",    code: "EZE", country: "AR", lat: -34.6037, lon: -58.3816 },
  { name: "São Paulo",       code: "GRU", country: "BR", lat: -23.5505, lon: -46.6333 },
  { name: "Rio de Janeiro",  code: "GIG", country: "BR", lat: -22.9068, lon: -43.1729 },
];

export function findEdgeByCode(code) {
  if (!code) return null;
  return EDGES.find((e) => e.code === code) || null;
}

export function findNearestEdge(lat, lon) {
  if (lat == null || lon == null) return null;
  let best = EDGES[0];
  let bestD = Infinity;
  for (const e of EDGES) {
    const d = haversine(lat, lon, e.lat, e.lon);
    if (d < bestD) { bestD = d; best = e; }
  }
  return best;
}

function haversine(lat1, lon1, lat2, lon2) {
  const toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(a));
}
