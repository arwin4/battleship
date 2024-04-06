import gameManager from '../gameManager.js';
import { renderPrimaryBoard } from '../utils/dom.js';
import DOM from '../utils/elementGetters.js';

export default function endGame() {
  const currentGame = gameManager.getCurrentGame();
  const { player1, player2 } = currentGame;

  const gameEndDialog = document.createElement('div');
  gameEndDialog.classList.add('game-end-dialog');

  const scoreAnnouncement = document.createElement('h1');
  scoreAnnouncement.classList.add('score-announcement');

  const playAgainBtn = document.createElement('button');
  playAgainBtn.classList.add('play-again');
  playAgainBtn.textContent = 'Play again';
  playAgainBtn.addEventListener('click', () => window.location.reload());

  DOM().main.prepend(gameEndDialog);
  DOM().gameEndDialog.prepend(playAgainBtn);
  DOM().gameEndDialog.prepend(scoreAnnouncement);

  if (gameManager.getCurrentGame().isGameDraw()) {
    DOM().trackingBoard1.classList.add('lose');
    DOM().primaryBoard1.classList.add('lose');
    scoreAnnouncement.textContent = `Wow! It's a draw!`;
  } else if (gameManager.getCurrentGame().findWinner() === player1) {
    DOM().trackingBoard1.classList.add('lose');
    DOM().primaryBoard1.classList.add('win');
    scoreAnnouncement.textContent = 'You win!';
  } else {
    DOM().trackingBoard1.classList.add('win');
    DOM().primaryBoard1.classList.add('lose');
    scoreAnnouncement.textContent = 'You lose!';

    // Reveal the enemy ships
    renderPrimaryBoard(DOM().trackingBoard1, player2);
  }
}
