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

  // AI
  let smartMoveEnabled = false;
  let smartMoves = [];
  let firstRevealedCellsOfTarget = [];
  let orientationOfTargetShip;
  let probingDirection;

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

  const attack = (opponent, row, column) =>
    opponent.board.receiveAttack(row, column);

  const getPreviousMove = () => {
    if (previousMoves.length === 0) return new Error('No previous moves found');
    return previousMoves.at(-1);
  };

  const didPreviousMoveHit = (opponent) => {
    if (previousMoves.length === 0)
      return new Error('No moves have been made yet.');

    const [row, column] = getPreviousMove();
    return opponent.board.getBoard()[row][column].attackHit;
  };

  const isCellWithinBoardBounds = (cell) =>
    cell[0] >= 0 && cell[0] <= 9 && cell[1] >= 0 && cell[1] <= 9;

  const getAdjacentCells = (row, column) => {
    const adjacentCellsArray = [
      [row - 1, column],
      [row, column - 1],
      [row, column + 1],
      [row + 1, column],
    ];

    return adjacentCellsArray.filter((cell) => isCellWithinBoardBounds(cell));
  };

  const wasMoveMadeBefore = (move) => {
    const [row, column] = move;
    return (
      previousMoves
        .map((oldMove) => JSON.stringify(oldMove))
        .filter((oldMove) => oldMove === `[${row},${column}]`).length > 0
    );
  };

  const getAttackableAdjacentCells = (row, column) => {
    // Filter out cells that have already been attacked
    const adjacentCells = getAdjacentCells(row, column);
    return adjacentCells.filter((cell) => !wasMoveMadeBefore(cell));
  };

  const validateMove = (move) =>
    !wasMoveMadeBefore(move) && isCellWithinBoardBounds(move);

  const reverseProbe = () => {
    // The target hasn't been sunk yet, so reverse the probe

    // Get the first revealed cell and calculate the cell in the opposite direction form before
    const firstHitCell = firstRevealedCellsOfTarget[0];

    let smartMove;

    if (probingDirection === 'down') {
      probingDirection = 'up';
      smartMove = [firstHitCell[0] - 1, firstHitCell[1]];
    } else if (probingDirection === 'up') {
      probingDirection = 'down';
      smartMove = [firstHitCell[0] + 1, firstHitCell[1]];
    } else if (probingDirection === 'right') {
      probingDirection = 'left';
      smartMove = [firstHitCell[0], firstHitCell[1] - 1];
    } else if (probingDirection === 'left') {
      probingDirection = 'right';
      smartMove = [firstHitCell[0], firstHitCell[1] + 1];
    }

    smartMoves = [smartMove];
  };

  const makeDumbMove = (opponent) => {
    smartMoveEnabled = false;
    let move;
    let needAnotherMove = false;

    do {
      move = getRandomMove();
      if (wasMoveMadeBefore(move)) {
        needAnotherMove = true;
      } else {
        needAnotherMove = false;
      }
    } while (needAnotherMove);

    // Make the move
    previousMoves.push(move);
    attack(opponent, ...move);

    if (didPreviousMoveHit(opponent)) {
      firstRevealedCellsOfTarget.push(move);
      smartMoveEnabled = true;

      // Set up the first smart moves for this target
      smartMoves = getAttackableAdjacentCells(...move);
    }

    return move;
  };

  const followUpSmartHit = (lastHitCell) => {
    if (probingDirection) {
      // The smart attack hit and we know in which direction to go, so continue in
      // that direction

      if (probingDirection === 'up') {
        return [lastHitCell[0] - 1, lastHitCell[1]];
      }
      if (probingDirection === 'down') {
        return [lastHitCell[0] + 1, lastHitCell[1]];
      }
      if (probingDirection === 'left') {
        return [lastHitCell[0], lastHitCell[1] - 1];
      }
      if (probingDirection === 'right') {
        return [lastHitCell[0], lastHitCell[1] + 1];
      }
    }

    // The smart attack hit, but we don't know where to probe next
    firstRevealedCellsOfTarget.push(lastHitCell);

    // Detect the target's orientation
    orientationOfTargetShip =
      firstRevealedCellsOfTarget[0][0] === firstRevealedCellsOfTarget[1][0]
        ? 'horizontal'
        : 'vertical';

    // Determine and save probing direction
    if (orientationOfTargetShip === 'vertical') {
      if (firstRevealedCellsOfTarget[1][0] > firstRevealedCellsOfTarget[0][0]) {
        probingDirection = 'down';
        return [lastHitCell[0] + 1, lastHitCell[1]];
      }
      probingDirection = 'up';
      return [lastHitCell[0] - 1, lastHitCell[1]];
    }
    // If horizontal
    if (firstRevealedCellsOfTarget[1][1] > firstRevealedCellsOfTarget[0][1]) {
      probingDirection = 'right';
      return [lastHitCell[0], lastHitCell[1] + 1];
    }
    probingDirection = 'left';
    return [lastHitCell[0], lastHitCell[1] - 1];
  };

  const calculateNewSmartMove = (opponent) => {
    const hit = didPreviousMoveHit(opponent);

    if (hit) {
      const lastHitCell = getPreviousMove();
      const newSmartMove = followUpSmartHit(lastHitCell);

      if (!validateMove(newSmartMove)) {
        // The new smart move is invalid because it's off the board or was made
        // before
        reverseProbe();
      } else {
        smartMoves = [newSmartMove];
      }
    }

    // The attack missed because it hit an empty cell
    if (!hit) reverseProbe();
  };

  const makeSmartMove = (opponent) => {
    // TODO: randomize order (shuffle array)

    // Make the smart move calculated in the previous turn...
    const move = smartMoves.pop();
    previousMoves.push(move);

    // ... then if the ship is still afloat, set up the next smart move
    const { isShipSunk } = attack(opponent, ...move);
    if (isShipSunk) {
      smartMoveEnabled = false;
      firstRevealedCellsOfTarget = [];
      orientationOfTargetShip = undefined;
      probingDirection = undefined;
    } else {
      const hit = didPreviousMoveHit(opponent);

      // The attack missed and no probingDirection has been determined, so we're
      // still trying out the smartMoves calculated after the first hit. Will
      // attack with the next smartMove next turn.
      if (!hit && !probingDirection) return move;

      calculateNewSmartMove(opponent);
    }

    return move;
  };

  const AIAttack = (opponent) => {
    /**
     * == Overview of the attack algorithm ==
     *
     * The move for the next turn is set after attacking in the current turn.
     *
     * The AI makes random moves until it hits a ship. It then enables "smart
     * mode":
     *
     * It probes around the hit cell. When it's hit the second cell, it
     * continues attacking in that direction. When it can't continue in this
     * direction, it attacks in the opposite direction from the cell that was
     * first hit.
     */

    let move;

    if (smartMoveEnabled) {
      move = makeSmartMove(opponent);
    } else {
      move = makeDumbMove(opponent);
    }

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
