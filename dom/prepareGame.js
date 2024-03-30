import gameManager from '../gameManager.js';
import { DOM } from './elementGetters.js';
import { updateCellStyle } from '../utils/dom.js';
import placeShipsManually from '../placeShipsManually.js';
import startGame from './startGame.js';

function renderPlacementBoard(currentGame) {
  DOM().primaryBoard1.replaceChildren();

  const boardCells = currentGame.player1.board.getBoard();
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      DOM().primaryBoard1.appendChild(cell);

      if (boardCells[i][j].shipPresent)
        updateCellStyle(DOM().primaryBoard1.className, i, j, 'ship-present');
    }
  }
}

function handlePlaceShipsRandomly() {
  // Set up internally
  gameManager.newGameVsAI();
  gameManager.getCurrentGame().player1.placeAllShipsRandomly();

  // Set up DOM
  DOM().main.replaceChildren(DOM().randomPlacementMenuTemplate.content);
  renderPlacementBoard(gameManager.getCurrentGame());
  DOM().placeShipsAgainBtn.addEventListener('click', () => {
    gameManager.newGameVsAI();
    gameManager.getCurrentGame().player1.placeAllShipsRandomly();
    renderPlacementBoard(gameManager.getCurrentGame());
  });
  DOM().playBtn.addEventListener('click', () => startGame());
}

function handleResetBoard(e) {
  gameManager.newGameVsAI();
  renderPlacementBoard(gameManager.getCurrentGame());
  DOM().playBtn.setAttribute('disabled', '');
  e.target.setAttribute('disabled', '');
}

/**
 * Allow the player to set up their board (place their ships).
 */
export default function prepareGame() {
  // body.replaceChildren(DOM().prepareGameTemplate.content);
  // renderPlacementBoard(gameManager.getCurrentGame());

  DOM().placeShipsRandomlyBtn.addEventListener('click', () =>
    handlePlaceShipsRandomly(),
  );
  // DOM().playBtn.addEventListener('click', () => startGame());
  // DOM().resetBoardBtn.addEventListener('click', (e) => handleResetBoard(e));
  DOM().placeShipsManuallyBtn.addEventListener('click', () =>
    placeShipsManually(),
  );
}
