import game from './game.js';

let game1;
let player1;
let player2;

function newGame() {
  game1 = game();
  player1 = game1.player1;
  player2 = game1.player2;
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
        cell.style.setProperty('background-color', 'green');

      if (boardCells[i][j].wasAttacked)
        cell.style.setProperty('background-color', 'darkgrey');

      if (boardCells[i][j].shipPresent && boardCells[i][j].wasAttacked)
        cell.style.setProperty('background-color', 'darkred');
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

// Update the style of a cell whose status has changed, on both the primary and tracking board
// TODO: refactor to use extracted functionality
function updateBoardAfterAttack(player, row, column) {
  // Get the cell on the primary board, depending on who just made a move
  // prettier-ignore
  const primaryCellToBeUpdated = player === player1
      ? document.querySelector(`.player-2-primary > [row-number="${row}"][column-number="${column}"]`)
      : document.querySelector(`.player-1-primary > [row-number="${row}"][column-number="${column}"]`);

  // Get the cell on the tracking board, depending on who just made a move
  // prettier-ignore
  const trackingCellToBeUpdated = player === player1
      ? document.querySelector(`.player-1-tracking > [row-number="${row}"][column-number="${column}"]`)
      : document.querySelector(`.player-2-tracking > [row-number="${row}"][column-number="${column}"]`);

  // Get the board with the cell whose status has changed
  const opponent = player === player1 ? player2 : player1;
  const boardCells = opponent.board.getBoard();

  // Change the style of the cells according to its new state
  if (boardCells[row][column].wasAttacked) {
    trackingCellToBeUpdated.style.setProperty('background-color', 'darkgrey');
    primaryCellToBeUpdated.style.setProperty('background-color', 'darkgrey');
  }

  if (
    boardCells[row][column].shipPresent &&
    boardCells[row][column].wasAttacked
  ) {
    trackingCellToBeUpdated.style.setProperty('background-color', 'darkred');
    primaryCellToBeUpdated.style.setProperty('background-color', 'darkred');
  }
}

function getCellInfo(e) {
  const row = Number.parseFloat(e.target.getAttribute('row-number'));
  const column = Number.parseFloat(e.target.getAttribute('column-number'));
  const boardElem = e.target.parentElement.className;
  return { row, column, boardElem };
}

function handleAttackClick(e) {
  const cellInfo = getCellInfo(e);
  const { boardElem } = cellInfo;
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Find out who is making this move and assign their opponent
  const currentPlayer = boardElem === 'player-1-tracking' ? player1 : player2;
  const opponent = boardElem === 'player-1-tracking' ? player2 : player1;

  // Handle the attack and update the cell style on the appropriate boards
  const attack = game1.handleAttack(currentPlayer, row, column);
  if (!attack) return;

  updateBoardAfterAttack(currentPlayer, row, column);

  // Update the board if the AI has also made a move
  if (!opponent.isHuman()) {
    setTimeout(
      () => updateBoardAfterAttack(opponent, attack[0], attack[1]),
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

function updateCellStyle(boardElem, row, column, style) {
  const boardClassName = boardElem.className;
  const cellToUpdate = document.querySelector(
    `.${boardClassName} > [row-number="${row}"][column-number="${column}"]`,
  );

  cellToUpdate.className = style;
}

function renderShipPlacement(boardElem, e, name, length, direction) {
  const cellInfo = getCellInfo(e);
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Place the ship on the internal board, if valid
  if (!player1.board.placeShip(row, column, name, length, direction)) return;

  const shipArray = player1.board.getShipArray(row, column, length, direction);
  shipArray.forEach((location) =>
    updateCellStyle(boardElem, location[0], location[1], 'ship-present'),
  );
}

function listenForShipPlacement(boardElem, name, length, direction) {
  boardElem.childNodes.forEach((cell) => {
    cell.addEventListener(
      'click',
      (e) => renderShipPlacement(boardElem, e, name, length, direction),
      { once: true },
    );
  });
}

function activateShipsToPlaceButtons() {
  const carrierButton = document.querySelector('.ships-to-place-list .carrier');
  // TODO: Allow changing the direction
  const direction = 'horizontal';
  const boardElem = primaryBoard1;
  carrierButton.addEventListener(
    'click',
    () => listenForShipPlacement(boardElem, 'Carrier', 5, direction),
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
