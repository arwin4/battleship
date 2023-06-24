const Gameboard = () => {
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
    const array = getShipArray(startRow, startColumn, length, direction);
    // The following TODOs should be checked when the UI placing functionality
    // is determined:
    // TODO: check if ship fits on board completely
    // TODO: check if there is no ship present
    // TODO: check if there is no ship adjacent

    array.forEach(([row, column]) => {
      board[row][column].shipPresent = true;
      board[row][column].shipID = name;
    });
  };

  return { board, placeShip };
};

export default Gameboard;
