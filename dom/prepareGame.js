import gameManager from '../gameManager.js';
import DOM from '../utils/elementGetters.js';
import { updateCellStyle } from '../utils/dom.js';
import placeShipsManually from '../placeShipsManually.js';
import startGame from './startGame.js';

function renderRandomPlacementBoard(currentGame) {
  DOM().primaryBoard1.replaceChildren();

  DOM().primaryBoard1.replaceWith(DOM().primaryBoard1);

  const boardCells = currentGame.player1.board.getBoard();
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      DOM().primaryBoard1.appendChild(cell);

      if (boardCells[i][j].shipPresent)
        updateCellStyle(DOM().primaryBoard1.classList[1], i, j, 'ship-present');
    }
  }
}

function handlePlaceShipsRandomly() {
  // Set up internally
  gameManager.newGameVsAI();
  gameManager.getCurrentGame().player1.placeAllShipsRandomly();

  // Set up DOM
  DOM().main.replaceChildren(DOM().randomPlacementMenuTemplate.content);
  renderRandomPlacementBoard(gameManager.getCurrentGame());
  DOM().placeShipsAgainBtn.addEventListener('click', () => {
    gameManager.newGameVsAI();
    gameManager.getCurrentGame().player1.placeAllShipsRandomly();
    renderRandomPlacementBoard(gameManager.getCurrentGame());
    DOM().boards.classList.add('reroll');
  });
  DOM().playBtn.addEventListener('click', () => startGame());
}

/**
 * Allow the player to set up their board (place their ships).
 */
export default function prepareGame() {
  DOM().placeShipsRandomlyBtn.addEventListener('click', () =>
    handlePlaceShipsRandomly(),
  );
  DOM().placeShipsManuallyBtn.addEventListener('click', () =>
    placeShipsManually(),
  );
}
