import Player from './player.js';

const game = () => {
  const player1 = Player();
  const player2 = Player();

  // Allow player 1 select the first attack of the game
  player1.turn = true;

  let currentTurnNumber = 1;
  const getCurrentTurnNumber = () => currentTurnNumber;

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

    // If the attack was made by player 2, this is the end of a turn
    if (currentPlayer === player2) currentTurnNumber += 1;

    // Have opponent make their move if it's an AI.
    // (Only player 2 should be made an AI.)
    if (!opponent.isHuman()) {
      const attack = opponent.attackRandom(currentPlayer);
      opponent.turn = false;
      currentPlayer.turn = true;
      currentTurnNumber += 1;
      // eslint-disable-next-line consistent-return
      return attack;
    }
  };

  return { player1, player2, handleAttack, getCurrentTurnNumber };
};

export default game;
