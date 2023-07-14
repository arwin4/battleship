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

    // Find out who is making this move and assign their opponent
    const currentPlayer = player === player1 ? player1 : player2;
    const opponent = player === player1 ? player2 : player1;

    // Deny attack if invalid
    if (!currentPlayer.attack(opponent, row, column)) return;

    currentPlayer.turn = false;
    opponent.turn = true;

    // Have opponent make their move if it's an AI
    if (!opponent.isHuman()) {
      const attack = opponent.attackRandom(currentPlayer);
      opponent.turn = false;
      currentPlayer.turn = true;
      // eslint-disable-next-line consistent-return
      return attack;
    }
  };

  return { player1, player2, handleAttack };
};

export default game;
