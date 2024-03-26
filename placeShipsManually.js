// import { primaryBoard1, trackingBoard1 } from './dom/elementGetters.js';
import { DOM } from './dom/elementGetters.js';
import startGame from './dom/startGame.js';
import gameManager from './gameManager.js';
import {
  getCellInfo,
  renderRotateShip,
  getCurrentShipOrientation,
  renderPrimaryBoard,
} from './utils/dom.js';

const shipsToPlace = document
  .querySelector('.ships-to-place')
  .content.cloneNode(true);

function showPlayButtonWhenBoardIsFull() {
  if (gameManager.getCurrentGame().player1.board.getShips().length === 5) {
    const playBtn = document.createElement('button');
    playBtn.classList.add('play-btn');
    playBtn.textContent = 'Play!';
    playBtn.addEventListener('click', () => startGame());
    DOM().primaryBoard1.after(playBtn);
  }
}

function activateRemoveShipListeners(board, player) {
  board.childNodes.forEach((cell) => {
    if (cell.className === 'ship-present') {
      cell.addEventListener('click', (e) => {
        const cellInfo = getCellInfo(e);
        const { row, column } = cellInfo;

        // Reactivate placement button
        const type = player.board.getBoard()[row][column].shipID.getType();
        const length = player.board.getBoard()[row][column].shipID.getLength();
        DOM()[`${type}Btn`].removeAttribute('disabled');
        DOM()[`${type}Btn`].textContent = `${type} - Length ${length}`;

        player.board.removeShip(row, column);
        renderPrimaryBoard(board, player);
      });
    }
  });
}

function renderShipPlacement(e, type, player) {
  const cellInfo = getCellInfo(e);
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Place the ship on the internal board, if valid
  const placedShip = player.board.placeShip(
    row,
    column,
    type,
    getCurrentShipOrientation(),
  );
  if (!placedShip) return;

  renderPrimaryBoard(DOM().primaryBoard1, player);
  activateRemoveShipListeners(DOM().primaryBoard1, player);
  DOM()[`${type}Btn`].textContent = 'Placed';
  DOM()[`${type}Btn`].setAttribute('disabled', '');
  DOM().orientation.replaceChildren();
  showPlayButtonWhenBoardIsFull();
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
  function resetButtons() {
    if (!DOM().carrierBtn.disabled)
      DOM().carrierBtn.textContent = 'Carrier - Length 5';

    if (!DOM().battleshipBtn.disabled)
      DOM().battleshipBtn.textContent = 'Battleship - Length 4';

    if (!DOM().cruiserBtn.disabled)
      DOM().cruiserBtn.textContent = 'Cruiser - Length 3';

    if (!DOM().submarineBtn.disabled)
      DOM().submarineBtn.textContent = 'Submarine - Length 3';

    if (!DOM().destroyerBtn.disabled)
      DOM().destroyerBtn.textContent = 'Destroyer - Length 2';
  }

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

  DOM().carrierBtn.addEventListener('click', (e) => {
    resetButtons();
    e.target.textContent = 'Placing...';
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    carrierPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'carrier',
    );
  });

  DOM().battleshipBtn.addEventListener('click', (e) => {
    resetButtons();
    e.target.textContent = 'Placing...';
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    battleshipPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'battleship',
    );
  });

  DOM().cruiserBtn.addEventListener('click', (e) => {
    resetButtons();
    e.target.textContent = 'Placing...';
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    cruiserPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'cruiser',
    );
  });

  DOM().submarineBtn.addEventListener('click', (e) => {
    resetButtons();
    e.target.textContent = 'Placing...';
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    submarinePlacementController = listenForShipPlacement(
      player,
      boardElem,
      'submarine',
    );
  });

  DOM().destroyerBtn.addEventListener('click', (e) => {
    resetButtons();
    e.target.textContent = 'Placing...';
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    destroyerPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'destroyer',
    );
  });
}

export default function placeShipsManually() {
  DOM().randomMenu.after(shipsToPlace);
  activateShipsToPlaceButtons(
    DOM().primaryBoard1,
    gameManager.getCurrentGame().player1,
  );

  DOM().randomMenu.remove();
  DOM().placeShipsManuallyBtn.remove();
}
