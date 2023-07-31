import game from './game.js';

let game1;
let player1;
let player2;
let currentShipOrientation = 'horizontal';

function newGame() {
  game1 = game();
  player1 = game1.player1;
  player2 = game1.player2;
  player2.placeAllShipsRandomly();
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

  if (boardCells[row][column].attackHit) {
    updateCellStyle(boardClassName, row, column, 'hit');
    updateCellStyle(opponentBoardClassName, row, column, 'hit');
  } else {
    updateCellStyle(boardClassName, row, column, 'miss');
    updateCellStyle(opponentBoardClassName, row, column, 'miss');
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

function renderShipPlacement(e, type, player) {
  const cellInfo = getCellInfo(e);
  const { boardClassName } = cellInfo;
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Place the ship on the internal board, if valid
  const placedShip = player.board.placeShip(
    row,
    column,
    type,
    currentShipOrientation,
  );
  if (!placedShip) return;

  const shipArray = player.board.getShipArray(
    row,
    column,
    placedShip,
    currentShipOrientation,
  );
  shipArray.forEach((location) =>
    updateCellStyle(boardClassName, location[0], location[1], 'ship-present'),
  );
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

function renderRotateShip() {
  const orientationContainer = document.querySelector('.orientation');
  orientationContainer.replaceChildren();

  const orientationText = document.createElement('p');
  renderOrientationText(orientationText);
  orientationContainer.appendChild(orientationText);

  const toggleOrientationBtn = document.createElement('button');
  toggleOrientationBtn.textContent = 'Change orientation';
  orientationContainer.appendChild(toggleOrientationBtn);

  toggleOrientationBtn.addEventListener('click', () => {
    currentShipOrientation =
      currentShipOrientation === 'horizontal' ? 'vertical' : 'horizontal';
    renderOrientationText(orientationText);
  });
}

function listenForShipPlacement(player, boardElem, type) {
  const shipPlacementController = new AbortController();

  boardElem.childNodes.forEach((cell) => {
    if (cell.className !== 'ship-present') {
      cell.addEventListener(
        'click',
        (e) => renderShipPlacement(e, type, player),
        { signal: shipPlacementController.signal },
      );
    }
  });
  return shipPlacementController;
}

function activateShipsToPlaceButtons(boardElem, player) {
  let carrierPlacementController = null;
  let battleshipPlacementController = null;
  let cruiserPlacementController = null;
  let submarinePlacementController = null;
  let destroyerPlacementController = null;

  /**
   * Deactivate cell listeners, allowing a new event listener to be attached, in
   * order to allow a different ship to be placed instead.
   */
  function neutralizeShipPlacementListeners() {
    if (battleshipPlacementController) battleshipPlacementController.abort();
    if (carrierPlacementController) carrierPlacementController.abort();
    if (cruiserPlacementController) cruiserPlacementController.abort();
    if (submarinePlacementController) submarinePlacementController.abort();
    if (destroyerPlacementController) destroyerPlacementController.abort();

    // Reset controllers to null so they may be created again.
    battleshipPlacementController = null;
    carrierPlacementController = null;
    cruiserPlacementController = null;
    submarinePlacementController = null;
    destroyerPlacementController = null;
  }

  const carrierButton = document.querySelector('.ships-to-place-list .carrier');
  carrierButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip();

    carrierPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'carrier',
    );
  });

  const battleshipButton = document.querySelector(
    '.ships-to-place-list .battleship',
  );
  battleshipButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip();

    battleshipPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'battleship',
    );
  });

  const cruiserButton = document.querySelector('.ships-to-place-list .cruiser');
  cruiserButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip();

    cruiserPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'cruiser',
    );
  });

  const submarineButton = document.querySelector(
    '.ships-to-place-list .submarine',
  );
  submarineButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip();

    submarinePlacementController = listenForShipPlacement(
      player,
      boardElem,
      'submarine',
    );
  });

  const destroyerButton = document.querySelector(
    '.ships-to-place-list .destroyer',
  );
  destroyerButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip();

    destroyerPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'destroyer',
    );
  });
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
  activateShipsToPlaceButtons(primaryBoard1, player1);
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
