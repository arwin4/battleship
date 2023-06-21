import ShipFactory from './ship';

test('Ship with different lengths are only sunk after the expected amount of hits', () => {
  const ship1 = ShipFactory(1);
  expect(ship1.isSunk()).toBe(false);

  const ship2 = ShipFactory(1);
  expect(ship2.isSunk()).toBe(false);
  ship2.hit(); // Should sink here
  expect(ship2.isSunk()).toBe(true);

  const ship3 = ShipFactory(2);
  expect(ship3.isSunk()).toBe(false);
  ship3.hit();
  expect(ship3.isSunk()).toBe(false);
  ship3.hit(); // Should sink here
  expect(ship3.isSunk()).toBe(true);

  const ship4 = ShipFactory(3);
  expect(ship4.isSunk()).toBe(false);
  ship4.hit();
  expect(ship4.isSunk()).toBe(false);
  ship4.hit();
  expect(ship4.isSunk()).toBe(false);
  ship4.hit(); // Should sink here
  expect(ship4.isSunk()).toBe(true);
});

test('Ship continues to be sunk even it continues to get hit', () => {
  const ship3 = ShipFactory(2);
  expect(ship3.isSunk()).toBe(false);
  ship3.hit();
  expect(ship3.isSunk()).toBe(false);
  ship3.hit();
  expect(ship3.isSunk()).toBe(true);
  ship3.hit(); // Was already sunk
  expect(ship3.isSunk()).toBe(true);
});
