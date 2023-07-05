function renderBoardContainer(boardElem) {
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 10; j += 1) {
      const cell = document.createElement('button');
      cell.setAttribute('column-number', j + 1);
      cell.setAttribute('row-number', i + 1);
      cell.classList.add('cell');
      boardElem.appendChild(cell);
    }
  }
}

const board1 = document.querySelector('.board-player-1');
const board2 = document.querySelector('.board-player-2');
renderBoardContainer(board1);
renderBoardContainer(board2);
