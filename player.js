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
  const previousMoves = [];

  const getRandomIntInclusive = (min, max) => {
    const minNum = Math.ceil(min);
    const maxNum = Math.floor(max);
    return Math.floor(Math.random() * (maxNum - minNum + 1) + minNum);
  };

  const placeAllShipsRandomly = () => {
    const shipTypes = board.getShipTypes();
    Object.entries(shipTypes).forEach((type) => {
      let needToTryAnotherPlacement = false;
      const typeName = type[0];
      const { limit } = type[1];

      for (let i = 0; i < limit; i += 1) {
        do {
          const randomRow = getRandomIntInclusive(0, 9);
          const randomColumn = getRandomIntInclusive(0, 9);
          const coinToss = Math.floor(2 * Math.random());
          const randomOrientation = coinToss === 0 ? 'horizontal' : 'vertical';

          const shipPlaced = board.placeShip(
            randomRow,
            randomColumn,
            typeName,
            randomOrientation,
          );

          if (!shipPlaced) {
            needToTryAnotherPlacement = true;
          } else needToTryAnotherPlacement = false;
        } while (needToTryAnotherPlacement);
      }
    });
  };

  const getRandomMove = () => {
    const randomRow = getRandomIntInclusive(0, 9);
    const randomColumn = getRandomIntInclusive(0, 9);

    return [randomRow, randomColumn];
  };

  const attack = (opponent, row, column) => {
    if (!opponent.board.receiveAttack(row, column)) return false;
    return true;
  };

  const AIAttack = (opponent) => {
    let needAnotherMove = false;
    let move;

    do {
      let row;
      let column;

      /**
       * TODO:
       * If previous move was a miss || If no previous moves were made -> get a random move
       * Else (if previous move was a hit) -> get a 'smart' move
       */
      if (true) {
        [row, column] = getRandomMove();
        move = [row, column];
      }

      /**
       * Compare the rolled move against the previously made ones.
       * Map the moves to strings to allow filtering.
       */
      const previouslyMadeMove = previousMoves
        .map((oldMove) => JSON.stringify(oldMove))
        .filter((oldMove) => oldMove === `[${row},${column}]`);

      if (previouslyMadeMove.length === 0) {
        // Move wasn't made before
        needAnotherMove = false;
        previousMoves.push(move);
        attack(opponent, row, column);
      } else {
        // Move was made before, roll another
        needAnotherMove = true;
      }
    } while (needAnotherMove);

    return move;
  };

  return {
    board,
    placeAllShipsRandomly,
    AIAttack,
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
