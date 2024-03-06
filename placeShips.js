import {
  getCellInfo,
  renderRotateShip,
  updateCellStyle,
  getCurrentShipOrientation,
} from './utils/dom.js';

const shipsToPlace = document
  .querySelector('.ships-to-place')
  .content.cloneNode(true);

function renderShipPlacement(e, type, player) {
  const cellInfo = getCellInfo(e);
  const { boardClassName } = cellInfo;
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

  const shipArray = player.board.getShipArray(
    row,
    column,
    placedShip,
    getCurrentShipOrientation(),
  );
  shipArray.forEach((location) =>
    updateCellStyle(boardClassName, location[0], location[1], 'ship-present'),
  );
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

  const carrierButton = document.querySelector('.ships-to-place-list .carrier');
  carrierButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    carrierPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'carrier',
    );
  });

  const battleshipButton = document.querySelector(
    '.ships-to-place-list .battleship',
  );
  battleshipButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    battleshipPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'battleship',
    );
  });

  const cruiserButton = document.querySelector('.ships-to-place-list .cruiser');
  cruiserButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    cruiserPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'cruiser',
    );
  });

  const submarineButton = document.querySelector(
    '.ships-to-place-list .submarine',
  );
  submarineButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    submarinePlacementController = listenForShipPlacement(
      player,
      boardElem,
      'submarine',
    );
  });

  const destroyerButton = document.querySelector(
    '.ships-to-place-list .destroyer',
  );
  destroyerButton.addEventListener('click', () => {
    neutralizeShipPlacementListeners();
    renderRotateShip(getCurrentShipOrientation());

    destroyerPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'destroyer',
    );
  });
}

export default function playVScomputerBtnHandler(
  newGame,
  player1,
  player2,
  player2boards,
  trackingBoard1,
  primaryBoard1,
  prepareBoards,
) {
  // Set up new game internally
  newGame();
  player2.makeAI();

  // DOM
  prepareBoards();
  player2boards.classList.add('hidden');
  trackingBoard1.classList.add('hidden');
  primaryBoard1.after(shipsToPlace);
  activateShipsToPlaceButtons(primaryBoard1, player1);
}
