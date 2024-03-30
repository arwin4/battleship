import Gameboard from './gameboard';

describe('Placing ships', () => {
  test(`Expect a carrier placed at [0,0] horizontally to occupy the first 5 cells in the first row, and nowhere else`, () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'carrier', 'horizontal');
    expect(board1.getBoard()[0][0]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[0][1]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[0][4]).toHaveProperty('shipPresent', true);

    expect(board1.getBoard()[0][7]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[0][9]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[2][7]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[1][0]).toHaveProperty('shipPresent', false);
  });
  test(`Expect a ship with shipID 'battleship' in the third row, fourth column, vertically`, () => {
    const board1 = Gameboard();
    board1.placeShip(2, 3, 'battleship', 'vertical');
    expect(board1.getBoard()[0][0]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[2][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[3][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[4][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[5][3]).toHaveProperty('shipPresent', true);
    expect(board1.getBoard()[5][3].shipID.getType()).toBe('battleship');
    expect(board1.getBoard()[6][3]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[7][3]).toHaveProperty('shipPresent', false);
    expect(board1.getBoard()[7][3]).toHaveProperty('shipPresent', false);
  });
  test('Same ship instance is referred to across locations', () => {
    const board1 = Gameboard();
    board1.placeShip(2, 3, 'battleship', 'vertical');
    expect(board1.getBoard()[2][3].shipID).toBe(board1.getBoard()[3][3].shipID);
  });
  test('Return false when placing ship on occupied location', () => {
    const testBoard = Gameboard();
    expect(testBoard.placeShip(0, 0, 'destroyer', 'horizontal')).toBeTruthy();
    expect(testBoard.placeShip(0, 0, 'destroyer', 'horizontal')).toBe(false);
  });
  test('Returns false when ship is placed out of column bounds', () => {
    const testBoard = Gameboard();
    expect(testBoard.placeShip(0, -1, 'submarine', 'horizontal')).toBe(false);
    expect(testBoard.placeShip(5, 9, 'submarine', 'horizontal')).toBe(false);
  });
  test('Returns false when ship is placed out of row bounds', () => {
    const testBoard = Gameboard();
    expect(testBoard.placeShip(-1, 0, 'submarine', 'horizontal')).toBe(false);
    expect(testBoard.placeShip(9, 0, 'submarine', 'vertical')).toBe(false);
  });
  describe('Ship Limits', () => {
    test('Returns false when placing carrier, while a carrier has already been placed', () => {
      const testBoard = Gameboard();
      expect(testBoard.placeShip(0, 0, 'carrier', 'horizontal')).toBeTruthy();
      expect(testBoard.placeShip(1, 0, 'carrier', 'horizontal')).toBeFalsy();
    });
    test('Returns false when placing destroyer, while destroyer limits are exceeded', () => {
      const testBoard = Gameboard();
      expect(testBoard.placeShip(0, 0, 'destroyer', 'horizontal')).toBeTruthy();
      if (testBoard.getShipTypes().destroyer.limit === 1) {
        expect(
          testBoard.placeShip(1, 0, 'destroyer', 'horizontal'),
        ).toBeFalsy();
      } else if (testBoard.getShipTypes().destroyer.limit === 5) {
        expect(
          testBoard.placeShip(1, 0, 'destroyer', 'horizontal'),
        ).toBeTruthy();
        expect(
          testBoard.placeShip(2, 0, 'destroyer', 'horizontal'),
        ).toBeTruthy();
        expect(
          testBoard.placeShip(3, 0, 'destroyer', 'horizontal'),
        ).toBeTruthy();
        expect(
          testBoard.placeShip(4, 0, 'destroyer', 'horizontal'),
        ).toBeTruthy();
        expect(
          testBoard.placeShip(5, 0, 'destroyer', 'horizontal'),
        ).toBeFalsy();
      }
    });
    test('Placing a new ship after removing a ship at the same location is possible', () => {
      const testBoard = Gameboard();
      testBoard.placeShip(0, 0, 'destroyer', 'horizontal');
      testBoard.removeShip(0, 0);
      expect(testBoard.placeShip(0, 0, 'destroyer', 'horizontal')).toBeTruthy();
    });
  });
  describe('Ships should not touch', () => {
    test('Ship placement touching ship should be disallowed', () => {
      const testBoard = Gameboard();
      testBoard.placeShip(2, 2, 'submarine', 'horizontal');
      expect(testBoard.placeShip(3, 2, 'destroyer', 'horizontal')).toBeFalsy();
      expect(testBoard.placeShip(3, 2, 'destroyer', 'horizontal')).toBeFalsy();
    });
  });
});

describe('Removing ships', () => {
  test('Expect [0,0] and [0,1] to not have destroyer (length 2) present after removeShip(0,0)', () => {
    const testBoard = Gameboard();
    testBoard.placeShip(0, 0, 'destroyer', 'horizontal');
    testBoard.removeShip(0, 0);
    expect(testBoard.getBoard()[0][0]).toHaveProperty('shipPresent', false);
    expect(testBoard.getBoard()[0][1]).toHaveProperty('shipPresent', false);
  });
  test('Expect [0,0] and [0,1] to have shipPresent = false after removing destroyer (length 2) at 0,0', () => {
    const testBoard = Gameboard();
    testBoard.placeShip(0, 0, 'destroyer', 'horizontal');
    testBoard.removeShip(0, 0);
    expect(testBoard.getBoard()[0][0]).toHaveProperty('shipPresent', false);
    expect(testBoard.getBoard()[0][1]).toHaveProperty('shipPresent', false);
  });
  test('Expect [0,0] and [0,1] to have shipID = undefined after removing destroyer (length 2) at 0,0', () => {
    const testBoard = Gameboard();
    testBoard.placeShip(0, 0, 'destroyer', 'horizontal');
    testBoard.removeShip(0, 0);
    expect(testBoard.getBoard()[0][0]).toHaveProperty('shipID', undefined);
    expect(testBoard.getBoard()[0][1]).toHaveProperty('shipID', undefined);
  });
});

describe('Attacking', () => {
  test('Board registers hit', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 'horizontal');
    expect(board1.getBoard()[0][0].wasAttacked).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.getBoard()[0][0].wasAttacked).toBe(true);
  });
  test('Ship is sunk (only) after neccessary number of hits', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 'horizontal');
    expect(board1.getBoard()[0][0].shipID.isSunk()).toBe(false);
    const attack1 = board1.receiveAttack(0, 0);
    expect(attack1.isShipSunk).toBe(false);
    const attack2 = board1.receiveAttack(0, 1);
    expect(attack2.isShipSunk).toBe(true);
  });
  test('Missed attacks are properly registered on the board', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 'horizontal');
    expect(board1.getBoard()[1][1].wasAttacked).toBe(false);
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
    board1.placeShip(0, 0, 'carrier', 'vertical');
    board1.placeShip(2, 2, 'cruiser', 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
  });

  test('Should return false if only some ships are sunk', () => {
    const board1 = Gameboard();
    expect(board1.allShipsSunk()).toBe(false);
    board1.placeShip(0, 0, 'carrier', 'vertical');
    board1.placeShip(2, 2, 'destroyer', 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(3, 2);
    expect(board1.allShipsSunk()).toBe(false);
  });

  test('Should return true if all ships are sunk', () => {
    const board1 = Gameboard();
    expect(board1.allShipsSunk()).toBe(false);
    board1.placeShip(0, 0, 'destroyer', 'vertical');
    board1.placeShip(2, 2, 'submarine', 'vertical');
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(0, 0);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(1, 0);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(2, 2);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(3, 2);
    expect(board1.allShipsSunk()).toBe(false);
    board1.receiveAttack(4, 2);
    expect(board1.allShipsSunk()).toBe(true);
  });
});

describe('isBoardEmpty()', () => {
  test('Should return true if no ships have been placed', () => {
    const board1 = Gameboard();
    expect(board1.isBoardEmpty()).toBe(true);
  });

  test('Should return false if 1 ship has been placed', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 'vertical');
    expect(board1.isBoardEmpty()).toBe(false);
  });

  test('Should return false if multiple ships have been placed', () => {
    const board1 = Gameboard();
    board1.placeShip(0, 0, 'destroyer', 'vertical');
    expect(board1.isBoardEmpty()).toBe(false);
    board1.placeShip(2, 2, 'cruiser', 'vertical');
    expect(board1.isBoardEmpty()).toBe(false);
  });
});
