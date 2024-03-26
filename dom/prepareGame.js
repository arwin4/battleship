import gameManager from '../gameManager.js';
import { DOM, body } from './elementGetters.js';
import { updateCellStyle } from '../utils/dom.js';
import startGame from './startGame.js';
import placeShipsManually from '../placeShipsManually.js';

let placementBoardElem;

function renderPlacementBoard(currentGame) {
  placementBoardElem = document.querySelector('.player-1-primary');
  placementBoardElem.replaceChildren();
  const boardCells = currentGame.player1.board.getBoard();

  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      placementBoardElem.appendChild(cell);

      if (boardCells[i][j].shipPresent)
        updateCellStyle(placementBoardElem.className, i, j, 'ship-present');
    }
  }
}

function handlePlaceShipsRandomly() {
  gameManager.newGameVsAI();
  gameManager.getCurrentGame().player1.placeAllShipsRandomly();
  renderPlacementBoard(gameManager.getCurrentGame());

  DOM().playBtn.removeAttribute('disabled');
  DOM().resetBoardBtn.removeAttribute('disabled');
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
  body.replaceChildren(DOM().prepareGameTemplate.content);
  renderPlacementBoard(gameManager.getCurrentGame());

  DOM().placeShipsRandomlyBtn.addEventListener('click', () =>
    handlePlaceShipsRandomly(),
  );
  DOM().playBtn.addEventListener('click', () => startGame());
  DOM().resetBoardBtn.addEventListener('click', (e) => handleResetBoard(e));
  DOM().placeShipsManuallyBtn.addEventListener('click', () =>
    placeShipsManually(),
  );
}
