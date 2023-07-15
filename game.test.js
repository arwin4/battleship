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
  test('Turn number before any moves are made should be 1 for both players', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    expect(testGame.player1.getCurrentTurnNumber()).toBe(1);
    expect(testGame.player2.getCurrentTurnNumber()).toBe(1);
  });
  test('Turn number after player 1 attacks should be 2 for player 1 and 1 for player 2', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    testGame.handleAttack(player1, 0, 0);
    expect(testGame.player1.getCurrentTurnNumber()).toBe(2);
    expect(testGame.player2.getCurrentTurnNumber()).toBe(1);
  });
  test('Turn number after each player attacks should be 2 for both players', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    testGame.handleAttack(player1, 0, 0);
    testGame.handleAttack(player2, 0, 0);
    expect(testGame.player1.getCurrentTurnNumber()).toBe(2);
    expect(testGame.player2.getCurrentTurnNumber()).toBe(2);
  });
  test(`If player 2 is an AI, their turn number should be 2 after player1's attack`, () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    player2.makeAI();
    testGame.handleAttack(player1, 0, 0);
    expect(testGame.player2.getCurrentTurnNumber()).toBe(2);
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
  test('After player 2 has all their ships sunk, player 1 should not be allowed another attack', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    player1.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    player2.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    testGame.handleAttack(player1, 0, 0);
    testGame.handleAttack(player2, 0, 0);
    expect(testGame.handleAttack(player1, 1, 1)).toBe(false);
  });
  test('After player 2 has all their ships sunk, player 2 should be allowed another attack (to attempt a draw)', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    player1.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    player2.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    testGame.handleAttack(player1, 0, 0);
    // Player 2 can't win (but still gets to make an attack for this round to attempt a draw)
    expect(testGame.handleAttack(player2, 0, 0)).toBe(true);
  });
  test('After player 2 has all their ships sunk, and player 2 makes one more attack, no more attacks by either player are allowed', () => {
    const testGame = game();
    const player1 = testGame.player1;
    const player2 = testGame.player2;
    player1.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    player2.board.placeShip(0, 0, 'ship1', 1, 'horizontal');
    testGame.handleAttack(player1, 0, 0);
    testGame.handleAttack(player2, 1, 1);
    expect(testGame.handleAttack(player1, 5, 5)).toBe(false);
    expect(testGame.handleAttack(player2, 5, 5)).toBe(false);
  });
});
