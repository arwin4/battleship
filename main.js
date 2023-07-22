import game from './game.js';

let game1;
let player1;
let player2;
let currentShipOrientation = 'horizontal';

function newGame() {
  game1 = game();
  player1 = game1.player1;
  player2 = game1.player2;
  // Hardcode ship placements for development
  player1.board.placeShip(0, 0, 'ship1', 2, 'horizontal');
  player2.board.placeShip(0, 0, 'ship1', 2, 'horizontal');
}

// DOM element getters
const primaryBoard1 = document.querySelector('.player-1-primary');
const primaryBoard2 = document.querySelector('.player-2-primary');

const trackingBoard1 = document.querySelector('.player-1-tracking');
const trackingBoard2 = document.querySelector('.player-2-tracking');
const trackingBoards = [trackingBoard1, trackingBoard2];

const player2boards = document.querySelector('.player-2-boards');

const shipsToPlace = document
  .querySelector('.ships-to-place')
  .content.cloneNode(true);

function updateCellStyle(boardClassName, row, column, style) {
  const cellToUpdate = document.querySelector(
    `.${boardClassName} > [row-number="${row}"][column-number="${column}"]`,
  );

  cellToUpdate.className = style;
}

// Render boards with ships visible
function renderPrimaryBoard(player, board) {
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

// Fill tracking board nodes with 10x10 cells
function renderTrackingBoards() {
  trackingBoards.forEach((board) => {
    board.replaceChildren();
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const cell = document.createElement('button');
        cell.setAttribute('column-number', j);
        cell.setAttribute('row-number', i);
        board.appendChild(cell);
      }
    }
  });
}

function getCellInfo(e) {
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

// Update the style of a cell whose status has changed, on both the primary and tracking board
function updateBoardsAfterAttack(cellInfo, opponent) {
  const { row } = cellInfo;
  const { column } = cellInfo;
  const { boardClassName } = cellInfo;
  const { opponentBoardClassName } = cellInfo;

  // Get the board with the cell whose status has changed
  const boardCells = opponent.board.getBoard();

  if (
    boardCells[row][column].wasAttacked &&
    !boardCells[row][column].shipPresent
  ) {
    updateCellStyle(boardClassName, row, column, 'miss');
    updateCellStyle(opponentBoardClassName, row, column, 'miss');
  }

  if (
    boardCells[row][column].shipPresent &&
    boardCells[row][column].wasAttacked
  ) {
    updateCellStyle(boardClassName, row, column, 'hit');
    updateCellStyle(opponentBoardClassName, row, column, 'hit');
  }
}

function handleAttackClick(e) {
  const cellInfo = getCellInfo(e);
  const { boardClassName } = cellInfo;
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Find out who is making this move and assign their opponent
  const currentPlayer =
    boardClassName === 'player-1-tracking' ? player1 : player2;
  const opponent = boardClassName === 'player-1-tracking' ? player2 : player1;

  // Handle the attack and update the cell style on the appropriate boards
  const attack = game1.handleAttack(currentPlayer, row, column);
  if (!attack) return;

  updateBoardsAfterAttack(cellInfo, opponent);

  // Update the board again if the AI has also made a move
  if (!opponent.isHuman()) {
    setTimeout(
      () => updateBoardsAfterAttack(opponent, attack[0], attack[1]),
      500,
    );
  }
}

function setTrackingBoardListeners() {
  trackingBoards.forEach((board) => {
    board.childNodes.forEach((cell) => {
      cell.addEventListener('click', (e) => handleAttackClick(e));
    });
  });
}

function prepareBoards() {
  renderPrimaryBoard(player1, primaryBoard1);
  renderPrimaryBoard(player2, primaryBoard2);
  renderTrackingBoards();
  setTrackingBoardListeners();
}

function newGameBtnHandler() {
  newGame();
  player2.makeHuman();
  prepareBoards();
  player2boards.classList.remove('hidden');
}

function renderShipPlacement(e, name, length) {
  const cellInfo = getCellInfo(e);
  const { boardClassName } = cellInfo;
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Place the ship on the internal board, if valid
  if (
    !player1.board.placeShip(row, column, name, length, currentShipOrientation)
  )
    return;

  const shipArray = player1.board.getShipArray(
    row,
    column,
    length,
    currentShipOrientation,
  );
  shipArray.forEach((location) =>
    updateCellStyle(boardClassName, location[0], location[1], 'ship-present'),
  );
}

function listenForShipPlacement(boardElem, name, length) {
  boardElem.childNodes.forEach((cell) => {
    cell.addEventListener('click', (e) =>
      renderShipPlacement(e, name, length, currentShipOrientation),
    );
  });
}

function renderNewOrientationText(orientationText) {
  const currentOrientationText = orientationText;
  if (currentShipOrientation === 'vertical') {
    currentOrientationText.textContent =
      'Currently placing the ship vertically from the cell of your choosing...';
  } else {
    currentOrientationText.textContent =
      'Currently placing the ship horizontally from the cell of your choosing...';
  }
}

function renderRotateShip() {
  const orientationContainer = document.querySelector('.orientation');
  orientationContainer.replaceChildren();

  const orientationText = document.createElement('p');
  orientationText.textContent =
    'Currently placing the ship horizontally from the cell of your choosing...';
  orientationContainer.appendChild(orientationText);

  const toggleOrientationBtn = document.createElement('button');
  toggleOrientationBtn.textContent = 'Change orientation';
  orientationContainer.appendChild(toggleOrientationBtn);

  toggleOrientationBtn.addEventListener('click', () => {
    currentShipOrientation =
      currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    renderNewOrientationText(orientationText);
  });
}

function activateShipsToPlaceButtons() {
  const carrierButton = document.querySelector('.ships-to-place-list .carrier');
  const boardElem = primaryBoard1;
  carrierButton.addEventListener(
    'click',
    () => {
      renderRotateShip();
      listenForShipPlacement(boardElem, 'Carrier', 5, currentShipOrientation);
    },
    // TODO: deactivate once this ship has been placed
  );
}

function playVScomputerBtnHandler() {
  // Set up new game internally
  newGame();
  player2.makeAI();

  // DOM
  prepareBoards();
  player2boards.classList.add('hidden');
  trackingBoard1.classList.add('hidden');
  primaryBoard1.after(shipsToPlace);
  activateShipsToPlaceButtons();
}

function activateButtons() {
  const newGameBtn = document.querySelector('.new-game');
  newGameBtn.addEventListener('click', () => newGameBtnHandler());

  const playVScomputerBtn = document.querySelector('.play-ai');
  playVScomputerBtn.addEventListener('click', () => playVScomputerBtnHandler());
}

newGame();
prepareBoards();
activateButtons();
