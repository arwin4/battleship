import game from './game';

describe('Setup', () => {
  test('Should initialize two players', () => {
    const testGame = game();
    expect(testGame).toHaveProperty('player1');
    expect(testGame).toHaveProperty('player2');
  });
});

describe('Turns', () => {
  test('First turn goes to player 1', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    expect(player1).toHaveProperty('turn', true);
    expect(player2).toHaveProperty('turn', false);
  });
  test('Turn flips after every attack', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    testGame.handleAttack(player1, 0, 0);
    expect(player1).toHaveProperty('turn', false);
    expect(player2).toHaveProperty('turn', true);
    testGame.handleAttack(player2, 0, 0);
    expect(player1).toHaveProperty('turn', true);
    expect(player2).toHaveProperty('turn', false);
    testGame.handleAttack(player1, 1, 0);
    expect(player1).toHaveProperty('turn', false);
    expect(player2).toHaveProperty('turn', true);
  });
  test('Turn does not flip if same location is attacked again', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    testGame.handleAttack(player1, 0, 0);
    testGame.handleAttack(player2, 0, 0);
    expect(player1).toHaveProperty('turn', true);
    testGame.handleAttack(player1, 0, 0);
    expect(player1).toHaveProperty('turn', true);
  });
  test('Deny more than one attack by one player', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    expect(testGame.handleAttack(player1, 0, 0)).toBe(true);
    expect(testGame.handleAttack(player1, 0, 0)).toBe(false);
    expect(testGame.handleAttack(player1, 0, 0)).toBe(false);
    expect(testGame.handleAttack(player2, 0, 0)).toBe(true);
    expect(testGame.handleAttack(player2, 0, 0)).toBe(false);
    expect(testGame.handleAttack(player2, 0, 0)).toBe(false);
  });
});
