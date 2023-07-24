const ShipFactory = (type) => {
  let length;
  if (type === 'carrier') {
    length = 5;
  } else if (type === 'battleship') {
    length = 4;
  } else if (type === 'cruiser') {
    length = 3;
  } else if (type === 'submarine') {
    length = 3;
  } else if (type === 'destroyer') {
    length = 2;
  } else {
    throw new Error(
      'Ship type invalid. Must be carrier, battleship, cruiser, submarine or destroyer.',
    );
  }

  // Hits
  let hits = 0;
  const hit = () => {
    hits += 1;
  };

  const getType = () => type;
  const getLength = () => length;
  const isSunk = () => hits >= length;

  return { hit, isSunk, getType, getLength };
};

export default ShipFactory;
