import DOM from './utils/elementGetters.js';
import startGame from './dom/startGame.js';
import gameManager from './gameManager.js';
import {
  getCellInfo,
  renderRotateShip,
  renderPrimaryBoard,
  updateCellStyle,
  showGhosts,
  getGhostCells,
  hideGhosts,
  deactivateShipRotation,
  getCurrentShipOrientation,
  getShipRotationHotkeyController,
  getShipPlacementButtonText,
} from './utils/dom.js';

function renderManualPlacementBoard(currentGame) {
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

function activateShipGhostListeners(length) {
  /**
   * If the placement is invalid, show an error shake
   */
  function showInvalidGhosts(e) {
    const ghostCells = getGhostCells(e, length);
    ghostCells.forEach((cell) => cell.classList.add('invalid'));
    setTimeout(() => {
      ghostCells.forEach((cell) => cell.classList.remove('invalid'));
    }, 300);
  }

  DOM().primaryBoard1.childNodes.forEach((cell) => {
    cell.addEventListener('mouseover', (e) => showGhosts(e, length));
    cell.addEventListener('click', (e) => showInvalidGhosts(e));
    cell.addEventListener('mouseout', () => hideGhosts());
  });
}

function showPlayButtonWhenBoardIsFull() {
  if (gameManager.getCurrentGame().player1.board.getShips().length === 5) {
    const playBtn = document.createElement('button');
    playBtn.classList.add('play-btn');
    playBtn.textContent = 'Play!';
    playBtn.addEventListener('click', () => startGame());
    DOM().placement.prepend(playBtn);
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
        DOM()[`${type}Btn`].removeAttribute('disabled');
        DOM()[`${type}Btn`].textContent = getShipPlacementButtonText(type);

        // Reset ship remove btn
        DOM().removeShipBtn.textContent = 'Remove a ship';
        DOM().removeShipBtn.removeAttribute('disabled');

        player.board.removeShip(row, column);
        renderPrimaryBoard(board, player);

        // Render conditional buttons
        if (gameManager.getCurrentGame().player1.board.getShips().length < 5) {
          DOM().playBtn?.remove();
        }
        if (
          gameManager.getCurrentGame().player1.board.getShips().length === 0
        ) {
          DOM().removeShipBtn.remove();
        }
      });
    }
  });
}

function showRemoveShipButton(player) {
  const removeShipBtn = document.createElement('button');
  removeShipBtn.classList.add('remove-ship-btn');
  removeShipBtn.textContent = 'Remove a ship';
  removeShipBtn.addEventListener('click', (e) => {
    activateRemoveShipListeners(DOM().primaryBoard1, player);
    e.target.textContent = 'Click on a ship to remove it...';
    e.target.setAttribute('disabled', '');
  });
  DOM().placement.prepend(removeShipBtn);
}

function renderShipPlacement(e, type, player) {
  const cellInfo = getCellInfo(e);
  const { row, column } = cellInfo;

  // Place the ship on the internal board, if valid
  const placedShip = player.board.placeShip(
    row,
    column,
    type,
    getCurrentShipOrientation(),
  );
  if (!placedShip) return;

  // Update DOM after placing ship
  renderPrimaryBoard(DOM().primaryBoard1, player);
  DOM()[`${type}Btn`].textContent = 'Placed';
  DOM()[`${type}Btn`].setAttribute('disabled', '');
  DOM().orientation.replaceChildren();
  showPlayButtonWhenBoardIsFull();
  if (!DOM().removeShipBtn) showRemoveShipButton(player);
  deactivateShipRotation();
  getShipRotationHotkeyController().abort();
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
    DOM().removeShipBtn?.remove();

    if (!DOM().carrierBtn.disabled)
      DOM().carrierBtn.textContent = getShipPlacementButtonText('carrier');

    if (!DOM().battleshipBtn.disabled)
      DOM().battleshipBtn.textContent =
        getShipPlacementButtonText('battleship');

    if (!DOM().cruiserBtn.disabled)
      DOM().cruiserBtn.textContent = getShipPlacementButtonText('cruiser');

    if (!DOM().submarineBtn.disabled)
      DOM().submarineBtn.textContent = getShipPlacementButtonText('submarine');

    if (!DOM().destroyerBtn.disabled)
      DOM().destroyerBtn.textContent = getShipPlacementButtonText('destroyer');
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
    renderRotateShip(5);
    activateShipGhostListeners(5);

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
    renderRotateShip(4);
    activateShipGhostListeners(4);

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
    renderRotateShip(3);
    activateShipGhostListeners(3);

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
    renderRotateShip(3);
    activateShipGhostListeners(3);

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
    renderRotateShip(2);
    activateShipGhostListeners(2);

    destroyerPlacementController = listenForShipPlacement(
      player,
      boardElem,
      'destroyer',
    );
  });
}

export default function placeShipsManually() {
  // Set up internally
  gameManager.newGameVsAI();
  const { player1 } = gameManager.getCurrentGame();

  // Set up DOM
  DOM().main.replaceChildren(DOM().manualPlacementMenuTemplate.content);
  renderManualPlacementBoard(gameManager.getCurrentGame());
  activateShipsToPlaceButtons(DOM().primaryBoard1, player1);
}
