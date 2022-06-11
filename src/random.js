/* eslint-disable default-param-last */
export function random(first = 1, second) {
  const [min, max] = second ? [first, second] : [0, first];
  return min + (max - min) * Math.random();
}

export function randomInt(first = 1, second) {
  return Math.round(random(first, second));
}
