import Gameboard from './gameboard.js';

const Player = () => {
  // Make player human by default. Allow this state to be changed.
  let human = true;
  const isHuman = () => human;
  const makeHuman = () => {
    human = true;
  };
  const makeAI = () => {
    human = false;
  };

  let currentTurnNumber = 1;
  const getCurrentTurnNumber = () => currentTurnNumber;
  const addTurn = () => {
    currentTurnNumber += 1;
  };

  const turn = false;
  const board = Gameboard();
  const previousRandomMoves = [];

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
      const previouslyMadeMove = previousRandomMoves
        .map((oldMove) => JSON.stringify(oldMove))
        .filter((oldMove) => oldMove === `[${randomRow},${randomColumn}]`);

      if (previouslyMadeMove.length === 0) {
        // Move wasn't made before
        previousRandomMoves.push(newMove);
        needAnotherMove = false;
      } else {
        // Move was made before, roll another
        needAnotherMove = true;
      }
    } while (needAnotherMove);

    return newMove;
  };

  const attack = (opponent, row, column) => {
    if (!opponent.board.receiveAttack(row, column)) return false;
    return true;
  };

  const attackRandom = (opponent) => {
    const move = randomMove();
    opponent.board.receiveAttack(move[0], move[1]);
    return move;
  };

  return {
    board,
    attackRandom,
    turn,
    getCurrentTurnNumber,
    addTurn,
    isHuman,
    makeHuman,
    makeAI,
    attack,
  };
};

export default Player;
