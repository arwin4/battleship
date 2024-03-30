import prepareGame from './dom/prepareGame.js';
import gameManager from './gameManager.js';

gameManager.newGameVsAI();
prepareGame('vs-ai');

export default function renderPage() {
  gameManager.newGameVsAI();
  prepareGame('vs-ai');
}
