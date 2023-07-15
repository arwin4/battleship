import Player from './player.js';

const game = () => {
  const player1 = Player();
  const player2 = Player();

  // Allow player 1 select the first attack of the game
  player1.turn = true;

  /**
   * Return true when at least one side has lost, and both players have had an
   * equal amount of turns. This second condition ensures the game can be played
   * to a draw.
   */
  const isGameOver = () =>
    (player1.board.allShipsSunk() || player2.board.allShipsSunk()) &&
    player1.getCurrentTurnNumber() === player2.getCurrentTurnNumber();

  /**
   * Wait for an attack, then switch players.
   * Player parameter is the attacking player.
   * Return the attack if it was made by an AI player
   */
  const handleAttack = (player, row, column) => {
    // Deny attack if it's not that player's turn
    if (!player.turn) return false;
    // Deny attack if game is over
    if (isGameOver()) return false;

    // Find out who is making this move and assign their opponent
    const currentPlayer = player === player1 ? player1 : player2;
    const opponent = player === player1 ? player2 : player1;

    // Deny attack if invalid
    if (!currentPlayer.attack(opponent, row, column)) return false;

    currentPlayer.turn = false;
    opponent.turn = true;
    player.addTurn();

    // Have opponent make their move if it's an AI.
    // (Only player 2 should be made an AI.)
    if (!opponent.isHuman()) {
      const attack = opponent.attackRandom(currentPlayer);
      opponent.turn = false;
      currentPlayer.turn = true;
      opponent.addTurn();
      return attack;
    }
    return true;
  };

  return { player1, player2, handleAttack, isGameOver };
};

export default game;
