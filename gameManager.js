import game from './game/game.js';

const gameManager = (() => {
  let currentGame;
  const newGameVsAI = () => {
    currentGame = game();
    currentGame.player2.makeAI();
    currentGame.player2.placeAllShipsRandomly();
  };
  const getCurrentGame = () => currentGame;

  return { newGameVsAI, getCurrentGame };
})();

export default gameManager;
