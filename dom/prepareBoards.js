import {
  getCellInfo,
  renderPrimaryBoard,
  updateCellStyle,
} from '../utils/dom.js';
import { primaryBoard2 } from './elementGetters.js';

const trackingBoard1 = document.querySelector('.player-1-tracking');
const trackingBoard2 = document.querySelector('.player-2-tracking');
const trackingBoards = [trackingBoard1, trackingBoard2];

// Fill tracking board nodes with 10x10 cells
function renderTrackingBoards() {
  trackingBoards.forEach((board) => {
    board.replaceChildren();
    for (let i = 0; i < 10; i += 1) {
      for (let j = 0; j < 10; j += 1) {
        const cell = document.createElement('button');
        cell.setAttribute('column-number', j);
        cell.setAttribute('row-number', i);
        board.appendChild(cell);
      }
    }
  });
}

function updateBoardsAfterUserAttack(cellInfo, opponent) {
  const { row } = cellInfo;
  const { column } = cellInfo;
  const { boardClassName } = cellInfo;
  const { opponentBoardClassName } = cellInfo;

  // Get the board with the cell whose status has changed
  const boardCells = opponent.board.getBoard();

  if (boardCells[row][column].attackHit) {
    updateCellStyle(boardClassName, row, column, 'hit');
    updateCellStyle(opponentBoardClassName, row, column, 'hit');
  } else {
    updateCellStyle(boardClassName, row, column, 'miss');
    updateCellStyle(opponentBoardClassName, row, column, 'miss');
  }
}

function updateBoardsAfterAIAttack(attack, currentPlayer) {
  const [row, column] = attack;

  const boardCells = currentPlayer.board.getBoard();
  if (boardCells[row][column].attackHit) {
    updateCellStyle('player-1-primary', row, column, 'hit');
    updateCellStyle('player-2-tracking', row, column, 'hit');
  } else {
    updateCellStyle('player-1-primary', row, column, 'miss');
    updateCellStyle('player-2-tracking', row, column, 'miss');
  }
}

function handleAttackClick(e, player1, player2, currentGame) {
  // TODO: disable click handler for already attacked cells
  const cellInfo = getCellInfo(e);
  const { boardClassName } = cellInfo;
  const { row } = cellInfo;
  const { column } = cellInfo;

  // Find out who is making this move and assign their opponent
  const currentPlayer =
    boardClassName === 'player-1-tracking' ? player1 : player2;
  const opponent = boardClassName === 'player-1-tracking' ? player2 : player1;

  // Handle the attack and update the cell style on the appropriate boards
  const attack = currentGame.handleAttack(currentPlayer, row, column);
  if (!attack) return;

  updateBoardsAfterUserAttack(cellInfo, opponent);

  // Update the board again if the AI has also made a move
  if (!opponent.isHuman()) {
    setTimeout(() => updateBoardsAfterAIAttack(attack, currentPlayer), 500);
  }
}

function setTrackingBoardListeners(player1, player2, currentGame) {
  trackingBoards.forEach((board) => {
    board.childNodes.forEach((cell) => {
      cell.addEventListener('click', (e) =>
        handleAttackClick(e, player1, player2, currentGame),
      );
    });
  });
}

export default function prepareBoards(player1, player2, currentGame) {
  renderPrimaryBoard(player1, primaryBoard1);
  renderPrimaryBoard(player2, primaryBoard2);
  renderTrackingBoards();
  setTrackingBoardListeners(player1, player2, currentGame);
}
