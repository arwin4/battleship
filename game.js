import Player from './player';

const game = () => {
  const player1 = Player();
  const player2 = Player();
  player1.board.placeShip(0, 0, 'ship1', 2, 'vertical');
  player1.board.placeShip(5, 5, 'ship1', 1, 'horizontal');
  player2.board.placeShip(1, 1, 'ship1', 1, 'horizontal');
  player2.board.placeShip(3, 3, 'ship1', 2, 'vertical');

  return { player1, player2 };
};

export default game;
