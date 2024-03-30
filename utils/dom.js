let currentShipOrientation = 'horizontal';
const toggleCurrentShipOrientation = () => {
  currentShipOrientation =
    currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
};
const getCurrentShipOrientation = () => currentShipOrientation;

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
    currentOrientationText.textContent =
      'Currently placing the ship vertically from the cell of your choosing...';
  } else {
    currentOrientationText.textContent =
      'Currently placing the ship horizontally from the cell of your choosing...';
  }
}

export function renderRotateShip() {
  const orientationContainer = document.querySelector('.orientation');
  orientationContainer.replaceChildren();

  const orientationText = document.createElement('p');
  renderOrientationText(orientationText);
  orientationContainer.appendChild(orientationText);

  const toggleOrientationBtn = document.createElement('button');
  toggleOrientationBtn.textContent = 'Change orientation';
  orientationContainer.appendChild(toggleOrientationBtn);

  toggleOrientationBtn.addEventListener('click', () => {
    toggleCurrentShipOrientation();
    renderOrientationText(orientationText);
  });
}

export { getCurrentShipOrientation };
