import ShipFactory from './ship';

describe('Ship with different lengths are only sunk after the expected amount of hits', () => {
  test('Carrier (length 5) should only sink after 5 hits', () => {
    const carrier = ShipFactory('carrier');
    expect(carrier.isSunk()).toBe(false);
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
    carrier.hit();
    expect(carrier.isSunk()).toBe(false);
    carrier.hit();
    expect(carrier.isSunk()).toBe(true);
  });

  test('Destroyer (length 2) should only sink after 2 hits', () => {
    const destroyer = ShipFactory('destroyer');
    expect(destroyer.isSunk()).toBe(false);
    destroyer.hit();
    expect(destroyer.isSunk()).toBe(false);
    destroyer.hit();
    expect(destroyer.isSunk()).toBe(true);
  });
});

test('Ship continues to be sunk even it continues to get hit', () => {
  const destroyer = ShipFactory('destroyer');
  expect(destroyer.isSunk()).toBe(false);
  destroyer.hit();
  expect(destroyer.isSunk()).toBe(false);
  destroyer.hit(); // Sinks now
  expect(destroyer.isSunk()).toBe(true);
  destroyer.hit(); // Was already sunk
  expect(destroyer.isSunk()).toBe(true);
});

describe('Ship types', () => {
  test('Ship of type carrier should have length 5', () => {
    const newShip = ShipFactory('carrier');
    expect(newShip.getLength()).toBe(5);
  });
  test('Ship of type battleship should have length 4', () => {
    const newShip = ShipFactory('battleship');
    expect(newShip.getLength()).toBe(4);
  });
  test('Ship of type cruiser should have length 3', () => {
    const newShip = ShipFactory('cruiser');
    expect(newShip.getLength()).toBe(3);
  });
  test('Ship of type submarine should have length 3', () => {
    const newShip = ShipFactory('submarine');
    expect(newShip.getLength()).toBe(3);
  });
  test('Ship of type destroyer should have length 2', () => {
    const newShip = ShipFactory('destroyer');
    expect(newShip.getLength()).toBe(2);
  });
  test('Ship of type tugboat is an invalid type and should throw an error', () => {
    expect(() => {
      const newShip = ShipFactory('tugboat');
    }).toThrow();
  });
});
