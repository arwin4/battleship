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
    testGame.handleAttack(player1, 0, 0);
    expect(player1.turn).toBe(false);
    testGame.handleAttack(player1, 0, 0);
    expect(player1.turn).toBe(false);
  });
});

describe('AI', () => {
  test('Player 1 should be human, player 2 should be an AI', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;

    player2.makeAI();
    expect(player1.isHuman()).toBe(true);
    expect(player2.isHuman()).toBe(false);
  });
  test('After player 1 (user) makes a move, player 2 (AI) should make a move', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    player2.makeAI();
    testGame.handleAttack(player1, 0, 0);
    expect(player1.turn).toBe(true);
    expect(player2.turn).toBe(false);
  });
});

describe('Game end', () => {
  test('Reject attacks on player1 if their ships are all sunk', () => {
    const testGame = game();
    const player1 = testGame.player1;
  });
});
