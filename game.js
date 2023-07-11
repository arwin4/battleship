import Player from './player.js';

const game = () => {
  const player1 = Player();
  const player2 = Player();
  player1.turn = true;

  // Ship placements are hardcoded for now
  player1.board.placeShip(0, 0, 'ship1', 2, 'vertical');
  player1.board.placeShip(5, 5, 'ship1', 1, 'horizontal');
  player2.board.placeShip(1, 1, 'ship1', 1, 'horizontal');
  player2.board.placeShip(3, 3, 'ship1', 2, 'vertical');

  // Wait for an attack, then switch players.
  // Player parameter is the attacking player
  const handleAttack = (player, row, column) => {
    // Deny attack if it's not that player's turn
    if (!player.turn) return false;
    // Handle attack for either player
    if (player === player1) {
      // Deny attack if invalid
      if (!player2.board.receiveAttack(row, column)) return false;
      player1.turn = false;
      player2.turn = true;
    } else {
      if (!player1.board.receiveAttack(row, column)) return false;
      player2.turn = false;
      player1.turn = true;
    }
    return true;
  };

  return { player1, player2, handleAttack };
};

export default game;
