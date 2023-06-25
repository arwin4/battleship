const ShipFactory = (name, length) => {
  const getName = () => name;
  const getLength = () => length;

  // Hits
  let hits = 0;
  const hit = () => {
    hits += 1;
  };

  const isSunk = () => hits >= length;

  return { hit, isSunk, getName, getLength };
};

export default ShipFactory;
