import gameManager from '../gameManager.js';
import {
  getCellInfo,
  renderPrimaryBoard,
  renderTrackingBoard,
} from '../utils/dom.js';
import DOM from '../utils/elementGetters.js';
import endGame from './endGame.js';

export default function startGame() {
  const currentGame = gameManager.getCurrentGame();
  const { player1, player2 } = currentGame;

  function handleAttackClick(e) {
    const cellInfo = getCellInfo(e);
    const { row, column } = cellInfo;

    // Handle the attack and update the cell style on the appropriate boards
    currentGame.handleAttack(player1, row, column);

    if (gameManager.getCurrentGame().isGameOver()) endGame();

    renderTrackingBoard(DOM().trackingBoard1, player2);
    setTimeout(() => {
      renderPrimaryBoard(DOM().primaryBoard1, player1);
    }, 500);
  }

  DOM().title.remove();
  DOM().main.replaceChildren();

  DOM().main.classList.remove('prepare-game');
  DOM().main.classList.add('ongoing-game');

  // Render primary board
  const primaryBoard1 = document.createElement('div');
  primaryBoard1.classList.add('board');
  primaryBoard1.classList.add('player-1-primary');
  DOM().main.prepend(primaryBoard1);
  renderPrimaryBoard(primaryBoard1, player1);

  // Create and populate tracking board
  const trackingBoard1 = document.createElement('div');
  trackingBoard1.classList.add('board');
  trackingBoard1.classList.add('player-1-tracking');
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      trackingBoard1.appendChild(cell);
    }
  }

  trackingBoard1.childNodes.forEach((cell) => {
    cell.addEventListener('click', (e) => handleAttackClick(e));
  });
  DOM().main.prepend(trackingBoard1);

  // Add board headers
  const primaryBoardHeader = document.createElement('h3');
  primaryBoardHeader.classList.add('player-board-header');
  primaryBoardHeader.textContent = 'Your board';
  DOM().main.prepend(primaryBoardHeader);
  const trackingBoardHeader = document.createElement('h3');
  trackingBoardHeader.classList.add('tracking-board-header');
  trackingBoardHeader.textContent = '⬇ Attack here ⬇';
  DOM().main.prepend(trackingBoardHeader);
}
