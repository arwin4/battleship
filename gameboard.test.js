import Gameboard from './gameboard';

describe('Placing ships', () => {
  test(`Expect a ship with shipID 'destroyer' in the top left corner, horizontally, with length 5`, () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 5, 'horizontal');
    expect(board1.getBoard()[0][0]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[0][1]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[0][4]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[0][4].shipID.getName()).toBe('destroyer');

    expect(board1.getBoard()[0][7]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[0][9]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[2][7]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[1][0]).toHaveProperty('shipPresent', false);
  });

  test(`Expect a ship with shipID 'battleship' in the third row, fourth column, vertically, with length 4`, () => {
    const board1 = Gameboard();
    board1.placeShip(2, 3, 'battleship', 4, 'vertical');
    expect(board1.getBoard()[0][0]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[2][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[3][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[4][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[5][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[5][3].shipID.getName()).toBe('battleship');
    expect(board1.getBoard()[6][3]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[7][3]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[7][3]).toHaveProperty('shipPresent', false);
  });

  test('Same ship instance is referred to across locations', () => {
    const board1 = Gameboard();
    board1.placeShip(2, 3, 'battleship', 4, 'vertical');
    expect(board1.getBoard()[2][3].shipID).toBe(board1.getBoard()[3][3].shipID);
  });
});

describe('Attacking', () => {
  test('Ship registers hit', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'poor test ship', 1, 'horizontal');
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(true);
  });
  test('Ship is sunk (only) after neccessary number of hits', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'poor test ship', 2, 'horizontal');
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 1);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(true);
  });
  test('Attacking a ship in the same location twice cannot sink it', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'poor test ship', 2, 'horizontal');
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    board1.receiveAttack(0, 1);
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(true);
  });
  test('Missed attacks are properly registered on the board', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'poor test ship', 2, 'horizontal');
    expect(board1.getBoard()[1][1].wasAttacked).toBe(false);
    board1.receiveAttack(1, 1);
    expect(board1.getBoard()[1][1].wasAttacked).toBe(true);
    board1.receiveAttack(1, 1);
    expect(board1.getBoard()[1][1].wasAttacked).toBe(true);
  });
});

describe('allShipsSunk()', () => {
  test('Should report false if none of the ships are sunk', () => {
    /**
     * NOTE: I've asked around and searched high and low for a test that doesn't
     * use the other methods that aren't part of the test itself. But because
     * allShipsSunk() is a method of the Gameboard object, and isSunk()'s logic
     * and the hit count are both encapsulated, I can't find a way to decouple
     * the receiveAttack() and placeShip() methods from the test, or to mock the
     * return value for isSunk().
     */
    const board1 = Gameboard();
    expect(board1.allShipsSunk()).toBe(false);
    board1.placeShip(0, 0, 'Test ship 1', 1, 'vertical');
    board1.placeShip(2, 2, 'Test ship 2', 2, 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
  });

  test('Should return false if only some ships are sunk', () => {
    const board1 = Gameboard();
    expect(board1.allShipsSunk()).toBe(false);
    board1.placeShip(0, 0, 'poor ship', 1, 'vertical');
    board1.placeShip(2, 2, 'poor ship', 2, 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(3, 2);
    expect(board1.allShipsSunk()).toBe(false);
  });

  test('Should return true if all ships are sunk', () => {
    const board1 = Gameboard();
    expect(board1.allShipsSunk()).toBe(false);
    board1.placeShip(0, 0, 'Test ship 1', 1, 'vertical');
    board1.placeShip(2, 2, 'Test ship 2', 2, 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(3, 2);
    expect(board1.allShipsSunk()).toBe(true);
  });
});
