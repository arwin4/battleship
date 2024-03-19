import showPlaceShips from './dom/setupGame.js';
import gameManager from './gameManager.js';

function activateButtons() {
  const newGameVsAIBtn = document.querySelector('.vs-ai');
  newGameVsAIBtn.addEventListener('click', () => {
    gameManager.newGameVsAI();
    showPlaceShips('vs-ai');
  });
}

export default function renderPage() {
  activateButtons();
}
