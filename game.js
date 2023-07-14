import Player from './player.js';

const game = () => {
  const player1 = Player();
  const player2 = Player();
  // Allow player 1 select the first attack of the game
  player1.turn = true;

  // Ship placements are hardcoded for now
  player1.board.placeShip(0, 0, 'ship1', 2, 'vertical');
  player1.board.placeShip(5, 5, 'ship1', 1, 'horizontal');
  player2.board.placeShip(1, 1, 'ship1', 1, 'horizontal');
  player2.board.placeShip(3, 3, 'ship1', 2, 'vertical');

  /**
   * Wait for an attack, then switch players.
   * Player parameter is the attacking player.
   * Return the attack if it was made by an AI player
   */
  const handleAttack = (player, row, column) => {
    // Deny attack if it's not that player's turn
    if (!player.turn) return;

    // Handle attack if player 1 is attacking
    if (player === player1) {
      // Deny attack if invalid
      if (!player1.attack(player2, row, column)) return;

      player1.turn = false;
      player2.turn = true;

      // Have opponent make their move if it's an AI
      if (!player2.isHuman()) {
        const attack = player2.attackRandom(player1);
        player2.turn = false;
        player1.turn = true;
        // eslint-disable-next-line consistent-return
        return attack;
      }
      return;
    }

    // Handle attack if player 2 is attacking
    // Deny attack if invalid
    if (!player2.attack(player1, row, column)) return;

    player2.turn = false;
    player1.turn = true;

    // Have opponent make their move if it's an AI
    if (!player1.isHuman()) {
      const attack = player1.attackRandom(player2);
      player1.turn = false;
      player2.turn = true;
      // eslint-disable-next-line consistent-return
      return attack;
    }
  };

  return { player1, player2, handleAttack };
};

export default game;
