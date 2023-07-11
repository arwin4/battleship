import Gameboard from './gameboard.js';

const Player = () => {
  const turn = false;
  const board = Gameboard();
  const previousMoves = [];
  const getPreviousMoves = () => previousMoves;

  const randomMove = () => {
    function getRandomIntInclusive(min, max) {
      const minNum = Math.ceil(min);
      const maxNum = Math.floor(max);
      return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
    }

    let needAnotherMove = false;
    let newMove;

    do {
      const randomRow = getRandomIntInclusive(0, 9);
      const randomColumn = getRandomIntInclusive(0, 9);
      newMove = [randomRow, randomColumn];

      /**
       * Compare the rolled move against the previously made ones.
       * Map the moves to strings to allow filtering.
       */
      const previouslyMadeMove = previousMoves
        .map((oldMove) => JSON.stringify(oldMove))
        .filter((oldMove) => oldMove === `[${randomRow},${randomColumn}]`);

      if (previouslyMadeMove.length === 0) {
        // Move wasn't made before
        previousMoves.push(newMove);
        needAnotherMove = false;
      } else {
        // Move was made before, roll another
        needAnotherMove = true;
      }
    } while (needAnotherMove);

    return newMove;
  };

  return { board, randomMove, getPreviousMoves, turn };
};

export default Player;
