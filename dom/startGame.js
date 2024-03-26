import gameManager from '../gameManager.js';
import { getCellInfo, updateCellStyle } from '../utils/dom.js';
import { DOM } from './elementGetters.js';

export default function startGame() {
  const currentGame = gameManager.getCurrentGame();
  const { player1, player2 } = currentGame;

  function updateBoardsAfterUserAttack(cellInfo) {
    const { row, column } = cellInfo;
    const boardCells = player2.board.getBoard();

    if (boardCells[row][column].attackHit) {
      updateCellStyle('player-1-tracking', row, column, 'hit');
    } else {
      updateCellStyle('player-1-tracking', row, column, 'miss');
    }
  }

  function updateBoardsAfterAIAttack(attack) {
    const [row, column] = attack;
    const boardCells = player1.board.getBoard();

    if (boardCells[row][column].attackHit) {
      updateCellStyle('player-1-primary', row, column, 'hit');
    } else {
      updateCellStyle('player-1-primary', row, column, 'miss');
    }
  }

  function handleAttackClick(e) {
    const cellInfo = getCellInfo(e);
    const { row } = cellInfo;
    const { column } = cellInfo;

    // Handle the attack and update the cell style on the appropriate boards
    const attack = currentGame.handleAttack(player1, row, column);
    // TODO: Check if following line is necessary
    if (!attack) return;

    updateBoardsAfterUserAttack(cellInfo);
    setTimeout(() => updateBoardsAfterAIAttack(attack), 500);
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
