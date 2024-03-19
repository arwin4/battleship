import {
  DOM,
  body,
  shipsToPlaceTemplate,
  trackingBoard1template,
} from './dom/elementGetters.js';
import gameManager from './gameManager.js';
import {
  getCellInfo,
  getCurrentShipOrientation,
  renderRotateShip,
  updateCellStyle,
} from './utils/dom.js';

let placementBoardElem;

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

function renderPlacementBoard() {
  placementBoardElem = document.querySelector('.player-1-primary');
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j);
      cell.setAttribute('row-number', i);
      placementBoardElem.appendChild(cell);
    }
  }
}

function startGame() {
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

  // Remove the placement info, add the tracking board
  const placementElem = document.querySelector('.placement');
  placementElem.after(trackingBoard1template.content);
  placementElem.remove();

  // Populate the tracking board
  const { trackingBoard1 } = DOM();
  trackingBoard1.replaceChildren();
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

function showPlaceShips(type) {
  const { player1 } = gameManager.getCurrentGame();
  body.replaceChildren(shipsToPlaceTemplate.content);
  renderPlacementBoard();
  activateShipsToPlaceButtons(placementBoardElem, player1);

  const playBtn = document.querySelector('.play-btn');
  playBtn.addEventListener('click', () => startGame());
}

function activateButtons() {
  const newGameVsAIBtn = document.querySelector('.vs-ai');
  newGameVsAIBtn.addEventListener('click', () => {
    gameManager.newGameVsAI();
    showPlaceShips('vs-ai');
  });
}

export default function renderPage() {
  activateButtons();
}
