import { calculateEcoScore } from '../ecoScore';

test('calculates driving emissions', () => {
  expect(calculateEcoScore('DRIVING', 10)).toBe('1700 g (est.)');
});

test('calculates transit emissions and formatting', () => {
  expect(calculateEcoScore('TRANSIT', 1234)).toBe('98.72 kg (est.)');
});

test('returns zero for walking', () => {
  expect(calculateEcoScore('WALKING', 5)).toBe('0 g (est.)');
});
