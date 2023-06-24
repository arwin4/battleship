import Gameboard from './gameboard';

test(`Expect a ship with shipID 'destroyer' in the top left corner, horizontally, with length 5`, () => {
  const board1 = Gameboard();
  board1.placeShip(0, 0, 'destroyer', 5, 'horizontal');
  expect(board1.board[0][0]).toHaveProperty('shipPresent', true);
  expect(board1.board[0][1]).toHaveProperty('shipPresent', true);
  expect(board1.board[0][4]).toHaveProperty('shipPresent', true);
  expect(board1.board[0][4].shipID.getName()).toBe('destroyer');

  expect(board1.board[0][7]).toHaveProperty('shipPresent', false);
  expect(board1.board[0][9]).toHaveProperty('shipPresent', false);
  expect(board1.board[2][7]).toHaveProperty('shipPresent', false);
  expect(board1.board[1][0]).toHaveProperty('shipPresent', false);
});

test(`Expect a ship with shipID 'battleship' in the third row, fourth column, vertically, with length 4`, () => {
  const board1 = Gameboard();
  board1.placeShip(2, 3, 'battleship', 4, 'vertical');
  expect(board1.board[0][0]).toHaveProperty('shipPresent', false);
  expect(board1.board[2][3]).toHaveProperty('shipPresent', true);
  expect(board1.board[3][3]).toHaveProperty('shipPresent', true);
  expect(board1.board[4][3]).toHaveProperty('shipPresent', true);
  expect(board1.board[5][3]).toHaveProperty('shipPresent', true);
  expect(board1.board[5][3].shipID.getName()).toBe('battleship');
  expect(board1.board[6][3]).toHaveProperty('shipPresent', false);
  expect(board1.board[7][3]).toHaveProperty('shipPresent', false);
  expect(board1.board[7][3]).toHaveProperty('shipPresent', false);
});

test('Same ship instance is referred to across locations', () => {
  const board1 = Gameboard();
  board1.placeShip(2, 3, 'battleship', 4, 'vertical');
  expect(board1.board[2][3].shipID).toBe(board1.board[3][3].shipID);
});
