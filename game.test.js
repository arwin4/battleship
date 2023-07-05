import game from './game';

describe('Setup', () => {
  test('Should initialize two players', () => {
    const testGame = game();
    expect(testGame).toHaveProperty('player1');
    expect(testGame).toHaveProperty('player2');
  });
});
