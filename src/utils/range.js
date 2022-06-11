export default function range(first, second, step = 1) {
  if (!second) {
    const stop = first;
    return [...Array(stop).keys()];
  }
  const [start, stop] = [first, second];
  if (start > stop) return [];
  const n = Math.ceil((stop - start) / step);
  return [...Array(n).keys()]
    .map((i) => start + i * step);
}
