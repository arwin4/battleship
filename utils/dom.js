let currentShipOrientation = 'horizontal';
const toggleCurrentShipOrientation = () => {
  currentShipOrientation =
    currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
};
const getCurrentShipOrientation = () => currentShipOrientation;

let shipRotationActive = false;
const activateShipRotation = () => {
  shipRotationActive = true;
};
const deactivateShipRotation = () => {
  shipRotationActive = false;
};
const isShipRotationActive = () => shipRotationActive;

let shipRotationHotkeyController = new AbortController();
const getShipRotationHotkeyController = () => shipRotationHotkeyController;

export function getCellInfo(e) {
  const row = Number.parseFloat(e.target.getAttribute('row-number'));
  const column = Number.parseFloat(e.target.getAttribute('column-number'));
  const boardElem = e.target.parentElement;
  const boardClassName = e.target.parentElement.className;

  const opponentBoardClassName =
    boardClassName === 'player-1-tracking'
      ? 'player-2-primary'
      : 'player-1-primary';

  return { row, column, boardElem, boardClassName, opponentBoardClassName };
}

export function updateCellStyle(boardClassName, row, column, style) {
  const cellToUpdate = document.querySelector(
    `.${boardClassName} > [row-number="${row}"][column-number="${column}"]`,
  );

  cellToUpdate.className = style;
}

export function renderPrimaryBoard(board, player) {
  board.replaceChildren();
  const boardCells = player.board.getBoard();
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      board.appendChild(cell);

      if (boardCells[i][j].shipPresent && !boardCells[i][j].wasAttacked) {
        updateCellStyle(board.className, i, j, 'ship-present');
      } else if (boardCells[i][j].wasAttacked && !boardCells[i][j].attackHit) {
        updateCellStyle(board.className, i, j, 'miss');
      } else if (
        boardCells[i][j].attackHit &&
        !boardCells[i][j].shipID?.isSunk()
      ) {
        updateCellStyle(board.className, i, j, 'hit');
      } else if (boardCells[i][j].shipID?.isSunk()) {
        updateCellStyle(board.className, i, j, 'sunk');
      }
    }
  }
}

export function renderTrackingBoard(board, player) {
  const boardCells = player.board.getBoard();

  board.childNodes.forEach((cellElement) => {
    const row = cellElement.getAttribute('row-number');
    const column = cellElement.getAttribute('column-number');

    if (
      boardCells[row][column].wasAttacked &&
      !boardCells[row][column].attackHit
    ) {
      updateCellStyle(board.className, row, column, 'miss');
    } else if (
      boardCells[row][column].attackHit &&
      !boardCells[row][column].shipID?.isSunk()
    ) {
      updateCellStyle(board.className, row, column, 'hit');
    } else if (boardCells[row][column].shipID?.isSunk()) {
      updateCellStyle(board.className, row, column, 'sunk');
    }
  });
}

function renderOrientationText(orientationText) {
  const currentOrientationText = orientationText;
  if (currentShipOrientation === 'vertical') {
    currentOrientationText.textContent = 'Placing vertically...';
  } else {
    currentOrientationText.textContent = 'Placing horizontally...';
  }
}

/**
 * List all cells to render a ghost image on
 */
export function getGhostCells(e, length) {
  const startRow = e.target.getAttribute('row-number');
  const startColumn = e.target.getAttribute('column-number');
  let ghostCellQuery = `[row-number="${startRow}"][column-number="${startColumn}"]`;

  if (getCurrentShipOrientation() === 'horizontal') {
    for (let i = 0; i < length - 1; i += 1) {
      ghostCellQuery += `,[row-number="${startRow}"][column-number="${
        parseFloat(startColumn) + 1 + i
      }"]`;
    }
  } else {
    for (let i = 0; i < length - 1; i += 1) {
      ghostCellQuery += `,[row-number="${
        parseFloat(startRow) + 1 + i
      }"][column-number="${startColumn}"]`;
    }
  }

  return document.querySelectorAll(ghostCellQuery);
}

export function showGhosts(e, length) {
  const ghostCells = getGhostCells(e, length);
  ghostCells.forEach((ghostCell) => ghostCell.classList.add('ghost'));
}

export function hideGhosts() {
  document
    .querySelectorAll('.ghost')
    .forEach((ghostCell) => ghostCell.classList.remove('ghost'));
}

function rotateShipOnHotkey(orientationText, length) {
  toggleCurrentShipOrientation();
  renderOrientationText(orientationText);
  hideGhosts();

  // Get the cell hovered over in order to display the rotated ghost ship
  const cell = Array.from(document.querySelectorAll(':hover')).at(-1);
  const simulatedEvent = {};
  simulatedEvent.target = cell;
  showGhosts(simulatedEvent, length);
}

export function renderRotateShip(length) {
  activateShipRotation();

  const orientationContainer = document.querySelector('.orientation');
  orientationContainer.replaceChildren();

  const orientationText = document.createElement('p');
  renderOrientationText(orientationText);
  orientationContainer.appendChild(orientationText);

  const toggleOrientationBtn = document.createElement('button');
  toggleOrientationBtn.textContent = 'Rotate ship (hotkey: R)';
  orientationContainer.appendChild(toggleOrientationBtn);

  toggleOrientationBtn.addEventListener('click', () => {
    toggleCurrentShipOrientation();
    renderOrientationText(orientationText);
  });

  shipRotationHotkeyController = new AbortController();
  document.addEventListener(
    'keyup',
    (e) => {
      if (e.key === 'r' && isShipRotationActive()) {
        rotateShipOnHotkey(orientationText, length);
      }
    },
    { signal: shipRotationHotkeyController.signal },
  );
}

export function getShipPlacementButtonText(type) {
  let length;
  if (type === 'carrier') length = 5;
  if (type === 'battleship') length = 4;
  if (type === 'cruiser') length = 3;
  if (type === 'submarine') length = 3;
  if (type === 'destroyer') length = 2;

  let visualLength = '';
  for (let i = length; i > 0; i -= 1) {
    visualLength += '▪️';
  }

  return `${type} ${visualLength}`;
}

export {
  getCurrentShipOrientation,
  activateShipRotation,
  deactivateShipRotation,
  getShipRotationHotkeyController,
};
