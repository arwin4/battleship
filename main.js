import game from './game.js';

const game1 = game();
const { player1 } = game1;
const { player2 } = game1;

const primaryBoard1 = document.querySelector('.player-1-primary');
const primaryBoard2 = document.querySelector('.player-2-primary');
const trackingBoard1 = document.querySelector('.player-1-tracking');
const trackingBoard2 = document.querySelector('.player-2-tracking');

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

function renderTrackingBoard(player, board) {
  let boardCells;
  if (player === player1) {
    boardCells = player2.board.getBoard();
  } else {
    boardCells = player1.board.getBoard();
  }

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      cell.classList.add('cell');
      board.appendChild(cell);

      if (boardCells[i][j].wasAttacked)
        cell.style.setProperty('background-color', 'darkgrey');

      if (boardCells[i][j].shipPresent && boardCells[i][j].wasAttacked)
        cell.style.setProperty('background-color', 'darkred');
    }
  }
}

console.log(game1.player1.board.getBoard());

renderPrimaryBoard(player1, primaryBoard1);
renderPrimaryBoard(player2, primaryBoard2);

renderTrackingBoard(player1, trackingBoard1);
renderTrackingBoard(player2, trackingBoard2);

// Handle events
function boardListener(board) {
  board.childNodes.forEach((cell) => {
    cell.addEventListener('click', (e) => console.log(e.target));
  });
}

boardListener(trackingBoard1);
boardListener(trackingBoard2);
