import cloneDeep from './cloneDeep.js';

export default function shuffle(array) {
  const shuffled = cloneDeep(array);
  let currentIndex = shuffled.length;
  let randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    [
      shuffled[currentIndex], shuffled[randomIndex],
    ] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  return shuffled;
}
