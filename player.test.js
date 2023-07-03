import Player from './player';

describe('randomMove()', () => {
  test('Increases length of previousMoves array by 1 every call', () => {
    const player1 = Player();
    expect(player1.getPreviousMoves().length).toBe(0);
    player1.randomMove();
    expect(player1.getPreviousMoves().length).toBe(1);
    player1.randomMove();
    expect(player1.getPreviousMoves().length).toBe(2);
  });
});
