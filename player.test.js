import Player from './player';

describe('attack()', () => {
  test('player1 (human) attack on player2 [0,0] results in [0,0] having a wasAttacked flag', () => {
    const player1 = Player();
    const player2 = Player();
    expect(player2.board.getBoard()[0][0]).toHaveProperty('wasAttacked', false);
    player1.attack(player2, 0, 0);
    expect(player2.board.getBoard()[0][0]).toHaveProperty('wasAttacked', true);
  });
  test('Player can be made AI (from the default human)', () => {
    const player1 = Player();
    expect(player1.isHuman()).toBe(true);
    player1.makeAI();
    expect(player1.isHuman()).toBe(false);
  });
  test('player1 (ai) attack causes turn to flip', () => {
    const player1 = Player();
    const player2 = Player();
    player1.makeAI();
    player1.attackRandom(player2);
    expect(player1.turn).toBe(false);
  });
});

describe('placeShipsRandomly', () => {
  test('After running, ship list length should match expected number of 1 per ship, or more if ship limit was increased', () => {
    const player1 = Player();
    player1.placeShipsRandomly();
    if (player1.board.getShipTypes().destroyer.limit === 5) {
      expect(player1.board.getShips().length).toBe(9);
    } else if (player1.board.getShipTypes().destroyer.limit === 1) {
      expect(player1.board.getShips().length).toBe(5);
    }
  });
});
