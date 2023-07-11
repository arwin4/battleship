import ShipFactory from './ship.js';

const Gameboard = () => {
  /**
   * Keep an array of all ships. Sunk ships remain on the array.
   * This allows for easier and quicker access to ship data than by going over
   * the board array.
   */
  const ships = [];

  const locationProperties = {
    shipPresent: false,
    shipID: undefined,
    attackMissed: false,
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

  // Return an array of the coordinates a new ship should be placed on
  const getShipArray = (startRow, startColumn, length, direction) => {
    const shipArray = [];

    if (direction === 'horizontal') {
      let columnIndex = startColumn;
      for (let i = 0; i < length; i += 1) {
        shipArray.push([startRow, columnIndex]);
        columnIndex += 1;
      }
    } else {
      let rowIndex = startRow;
      for (let i = 0; i < length; i += 1) {
        shipArray.push([rowIndex, startColumn]);
        rowIndex += 1;
      }
    }

    return shipArray;
  };

  const placeShip = (startRow, startColumn, name, length, direction) => {
    const shipArray = getShipArray(startRow, startColumn, length, direction);
    const ship = ShipFactory(name, length);

    // Reject placement if any location is outside bounds or occupied
    if (
      shipArray.some(
        ([row, column]) =>
          !board[row]?.[column] || board[row][column].shipPresent,
      )
    )
      return false;

    // Add a reference to the ship to the board in each location it occupies
    shipArray.forEach(([row, column]) => {
      board[row][column].shipPresent = true;
      board[row][column].shipID = ship;
    });

    ships.push(ship);
    return true;
  };

  const receiveAttack = (row, column) => {
    const attackedLocation = board[row][column];

    // Ignore multiple attacks on same location
    if (attackedLocation.wasAttacked) return false;

    attackedLocation.wasAttacked = true;

    if (attackedLocation.shipPresent) {
      attackedLocation.shipID.hit();
    } else {
      attackedLocation.attackMissed = true;
    }
    return true;
  };

  const allShipsSunk = () => {
    if (ships.length === 0) return false;
    return ships.every((ship) => ship.isSunk());
  };

  const getBoard = () => board;

  return { getBoard, placeShip, receiveAttack, allShipsSunk };
};

export default Gameboard;
