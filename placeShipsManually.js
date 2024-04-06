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
        updateCellStyle(DOM().primaryBoard1.classList[1], i, j, 'ship-present');
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
    DOM().placementInstructions.classList.add('hidden');
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

        player.board.removeShip(row, column);
        renderPrimaryBoard(board, player);

        // Render play button
        if (gameManager.getCurrentGame().player1.board.getShips().length < 5) {
          DOM().playBtn?.remove();
        }

        activateRemoveShipListeners(board, player);
      });
    }
  });
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
  deactivateShipRotation();
  getShipRotationHotkeyController().abort();
  activateRemoveShipListeners(DOM().primaryBoard1, player);
  DOM().placementInstructions?.classList.remove('hidden');
}

function listenForShipPlacement(player, boardElem, type) {
  boardElem.childNodes.forEach((cell) => {
    if (cell.className !== 'ship-present') {
      cell.addEventListener('click', (e) =>
        renderShipPlacement(e, type, player),
      );
    } else {
      // Remove remove ship listeners
      cell.replaceWith(cell.cloneNode(true));
    }
  });
}

function activateShipsToPlaceButtons(boardElem, player) {
  function resetShipButtons() {
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

  function prepareForPlacement(e, length) {
    resetShipButtons();
    e.target.textContent = 'Placing...';
    renderRotateShip(length);
    activateShipGhostListeners(length);
  }

  DOM().carrierBtn.addEventListener('click', (e) => {
    prepareForPlacement(e, 5);
    listenForShipPlacement(player, boardElem, 'carrier');
  });

  DOM().battleshipBtn.addEventListener('click', (e) => {
    prepareForPlacement(e, 4);
    listenForShipPlacement(player, boardElem, 'battleship');
  });

  DOM().cruiserBtn.addEventListener('click', (e) => {
    prepareForPlacement(e, 3);
    listenForShipPlacement(player, boardElem, 'cruiser');
  });

  DOM().submarineBtn.addEventListener('click', (e) => {
    prepareForPlacement(e, 3);
    listenForShipPlacement(player, boardElem, 'submarine');
  });

  DOM().destroyerBtn.addEventListener('click', (e) => {
    prepareForPlacement(e, 2);
    listenForShipPlacement(player, boardElem, 'destroyer');
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
