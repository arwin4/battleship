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

      if (boardCells[i][j].shipPresent)
        updateCellStyle(board.className, i, j, 'ship-present');
    }
  }
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
