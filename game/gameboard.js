import ShipFactory from './ship.js';

const Gameboard = () => {
  const locationProperties = {
    shipPresent: false,
    shipID: undefined,
    attackHit: false,
    wasAttacked: false,
  };

  // Fill a 10x10 array with the initial location properties
  const board = [];
  for (let i = 0; i < 10; i += 1) {
    board[i] = [];
    for (let j = 0; j < 10; j += 1) {
      board[i].push({ ...locationProperties });
    }
  }

  /**
   * Keep an array of all ships. Sunk ships remain on the array.
   * This allows for easier and quicker access to ship data than by going over
   * the board array.
   */
  let ships = [];
  const getShips = () => ships;

  const shipTypes = {
    carrier: { limit: 1 },
    battleship: { limit: 1 },
    cruiser: { limit: 1 },
    submarine: { limit: 1 },
    destroyer: { limit: 1 },
  };

  const getShipTypes = () => shipTypes;

  // Return an array of the coordinates a new ship should be placed on
  const getShipArray = (startRow, startColumn, ship, orientation) => {
    const shipArray = [];

    if (orientation === 'horizontal') {
      let columnIndex = startColumn;
      for (let i = 0; i < ship.getLength(); i += 1) {
        shipArray.push([startRow, columnIndex]);
        columnIndex += 1;
      }
    } else {
      let rowIndex = startRow;
      for (let i = 0; i < ship.getLength(); i += 1) {
        shipArray.push([rowIndex, startColumn]);
        rowIndex += 1;
      }
    }

    return shipArray;
  };

  const checkShipOutsideBounds = (shipArray) =>
    shipArray.some(([row, column]) => !board[row]?.[column]);

  const checkLocationOccupied = (shipArray) =>
    shipArray.some(([row, column]) => board[row][column].shipPresent);

  const checkShipTypeLimitReached = (shipToCheck) => {
    const type = shipToCheck.getType();

    let numberOfThisTypeAlreadyPresent = 0;
    ships.forEach((ship) => {
      if (ship.getType() === type) numberOfThisTypeAlreadyPresent += 1;
    });

    return numberOfThisTypeAlreadyPresent >= shipTypes[type].limit;
  };

  const getValidSurroundingCells = (row, column) => {
    const adjacentCells = [];
    adjacentCells.push(
      [row - 1, column - 1],
      [row - 1, column],
      [row - 1, column + 1],
      [row, column - 1],
      [row, column + 1],
      [row + 1, column - 1],
      [row + 1, column],
      [row + 1, column + 1],
    );

    return adjacentCells.filter(
      (cell) => cell[0] >= 0 && cell[0] <= 9 && cell[1] >= 0 && cell[1] <= 9,
    );
  };

  /**
   * Return true if a new ship would be placed adjacent to an existing ship.
   * Ships must have one unoccupied cell between them, including diagonals.
   */
  const checkShipsTouching = (shipArray) =>
    shipArray.some((cell) => {
      const [row, column] = cell;
      const surroundingCells = getValidSurroundingCells(row, column);
      return surroundingCells.some((surroundingCell) => {
        const [surroundingRow, surroundingColumn] = surroundingCell;
        return board[surroundingRow][surroundingColumn].shipPresent;
      });
    });

  const placeShip = (startRow, startColumn, type, orientation) => {
    const ship = ShipFactory(type);
    const shipArray = getShipArray(startRow, startColumn, ship, orientation);

    if (
      checkShipOutsideBounds(shipArray) ||
      checkLocationOccupied(shipArray) ||
      checkShipTypeLimitReached(ship) ||
      checkShipsTouching(shipArray)
    )
      return false;

    // Add a reference to the ship to the board in each location it occupies
    shipArray.forEach(([row, column]) => {
      board[row][column].shipPresent = true;
      board[row][column].shipID = ship;
    });

    ship.setShipLocations(shipArray);
    ships.push(ship);

    return ship;
  };

  const removeShip = (row, column) => {
    const ship = board[row][column].shipID;
    const shipLocations = ship.getShipLocations();

    ships = ships.filter((shipInArray) => shipInArray !== ship);

    ship.setShipLocations(null);

    shipLocations.forEach(([boardRow, boardColumn]) => {
      board[boardRow][boardColumn].shipPresent = false;
      board[boardRow][boardColumn].shipID = undefined;
    });
  };

  const receiveAttack = (row, column) => {
    const attackedLocation = board[row][column];

    // Ignore when a location is attacked more than once
    if (attackedLocation.wasAttacked) return false;

    attackedLocation.wasAttacked = true;

    if (attackedLocation.shipPresent) {
      attackedLocation.shipID.hit();
      attackedLocation.attackHit = true;
    }

    if (attackedLocation.shipID?.isSunk()) return { isShipSunk: true };

    return { isShipSunk: false };
  };

  const allShipsSunk = () => {
    if (ships.length === 0) return false;
    return ships.every((ship) => ship.isSunk());
  };

  const isBoardEmpty = () => ships.length === 0;

  const getBoard = () => board;

  return {
    getBoard,
    getShips,
    getShipTypes,
    placeShip,
    removeShip,
    receiveAttack,
    allShipsSunk,
    getShipArray,
    isBoardEmpty,
  };
};

export default Gameboard;
