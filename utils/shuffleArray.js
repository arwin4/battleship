/* eslint-disable no-param-reassign */

// Fisher-Yates shuffle from https://stackoverflow.com/a/6274381/22857578
export default function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}
