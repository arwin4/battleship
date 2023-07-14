import game from './game.js';

const game1 = game();
const { player1 } = game1;
const { player2 } = game1;
player2.makeAI();

const primaryBoard1 = document.querySelector('.player-1-primary');
const primaryBoard2 = document.querySelector('.player-2-primary');

const trackingBoard1 = document.querySelector('.player-1-tracking');
const trackingBoard2 = document.querySelector('.player-2-tracking');
const trackingBoards = [trackingBoard1, trackingBoard2];

// Render boards with ships visible
function renderPrimaryBoard(player, board) {
  const boardCells = player.board.getBoard();
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      cell.classList.add('cell');
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
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const cell = document.createElement('button');
        cell.setAttribute('column-number', j);
        cell.setAttribute('row-number', i);
        cell.classList.add('cell');
        board.appendChild(cell);
      }
    }
  });
}

// Update the style of a cell whose status has changed, on both the primary and tracking board
function updateCellStyle(player, row, column) {
  if (player === player1) {
    const primaryCellToBeUpdated = document.querySelector(
      `.player-2-primary > [row-number="${row}"][column-number="${column}"]`,
    );
    const trackingCellToBeUpdated = document.querySelector(
      `.player-1-tracking > [row-number="${row}"][column-number="${column}"]`,
    );

    const boardCells = player2.board.getBoard();
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
    return;
  }

  const primaryCellToBeUpdated = document.querySelector(
    `.player-1-primary > [row-number="${row}"][column-number="${column}"]`,
  );
  const trackingCellToBeUpdated = document.querySelector(
    `.player-2-tracking > [row-number="${row}"][column-number="${column}"]`,
  );

  const boardCells = player1.board.getBoard();
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

function handleAttackClick(e) {
  // Get the row and column numbers of the clicked cell
  const row = e.target.getAttribute('row-number');
  const column = e.target.getAttribute('column-number');
  // Get the board that was clicked on
  const board = e.target.parentElement.className;

  // Find out who is making this move and assign their opponent
  const currentPlayer = board === 'player-1-tracking' ? player1 : player2;
  const opponent = board === 'player-1-tracking' ? player2 : player1;

  // Handle the attack and update the cell style on the appropriate boards
  const attack = game1.handleAttack(currentPlayer, row, column);
  updateCellStyle(currentPlayer, row, column);

  // Update the board if the AI has also made a move
  if (!opponent.isHuman()) {
    setTimeout(() => updateCellStyle(opponent, attack[0], attack[1]), 500);
  }
}

function setTrackingBoardListeners() {
  trackingBoards.forEach((board) => {
    board.childNodes.forEach((cell) => {
      cell.addEventListener('click', (e) => handleAttackClick(e));
    });
  });
}

renderPrimaryBoard(player1, primaryBoard1);
renderPrimaryBoard(player2, primaryBoard2);

renderTrackingBoards();

setTrackingBoardListeners();
