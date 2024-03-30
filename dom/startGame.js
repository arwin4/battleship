import gameManager from '../gameManager.js';
import {
  getCellInfo,
  renderPrimaryBoard,
  renderTrackingBoard,
} from '../utils/dom.js';
import { DOM } from './elementGetters.js';

export default function startGame() {
  const currentGame = gameManager.getCurrentGame();
  const { player1, player2 } = currentGame;

  function handleAttackClick(e) {
    const cellInfo = getCellInfo(e);
    const { row, column } = cellInfo;

    // Handle the attack and update the cell style on the appropriate boards
    const attack = currentGame.handleAttack(player1, row, column);
    // TODO: Check if following line is necessary
    if (!attack) return;

    renderTrackingBoard(DOM().trackingBoard1, player2);
    setTimeout(() => {
      renderPrimaryBoard(DOM().primaryBoard1, player1);
    }, 500);
  }

  // Remove setup elements
  DOM().placeShipsRandomlyBtn?.remove();
  DOM().playBtn?.remove();
  DOM().resetBoardBtn?.remove();
  DOM().placement?.remove();

  // Create and populate tracking board
  const trackingBoard1 = document.createElement('div');
  trackingBoard1.classList.add('player-1-tracking');
  DOM().primaryBoard1.after(trackingBoard1);

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
}
