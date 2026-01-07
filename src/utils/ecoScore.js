export const CO2_FACTORS = {
  DRIVING: 170,
  TRANSIT: 80,
  BICYCLING: 0,
  WALKING: 0,
};

export function calculateEcoScore(mode, distanceKm) {
  const grams = (CO2_FACTORS[mode] || 0) * Number(distanceKm || 0);
  if (grams < 1000) return `${Math.round(grams)} g (est.)`;
  return `${(grams / 1000).toFixed(2)} kg (est.)`;
}
