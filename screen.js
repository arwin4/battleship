import prepareGame from './dom/prepareGame.js';
import gameManager from './gameManager.js';

function activateButtons() {
  const newGameVsAIBtn = document.querySelector('.vs-ai');
  newGameVsAIBtn.addEventListener('click', () => {
    gameManager.newGameVsAI();
    prepareGame('vs-ai');
  });
}

export default function renderPage() {
  activateButtons();
}
