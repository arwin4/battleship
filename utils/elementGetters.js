export default function DOM() {
  return {
    /* == Boards == */
    primaryBoard1: document.querySelectorAll('.board.player-1-primary')[0],
    trackingBoard1: document.querySelectorAll('.board.player-1-tracking')[0],

    /* == Templates == */
    randomPlacementMenuTemplate: document.querySelector(
      '.random-placement-menu',
    ),
    manualPlacementMenuTemplate: document.querySelector(
      '.manual-placement-menu',
    ),

    /* == Misc. elements == */
    randomMenu: document.querySelector('.random-menu'),
    placementInstructions: document.querySelector('.placement .instructions'),
    placement: document.querySelector('.placement'),
    orientation: document.querySelector('.orientation'),
    main: document.querySelector('main'),
    title: document.querySelector('h1'),
    gameEndDialog: document.querySelector('.game-end-dialog'),

    /* === Buttons === */
    placeShipsRandomlyBtn: document.querySelector('.place-ships-randomly-btn'),
    placeShipsAgainBtn: document.querySelector('.place-ships-again-btn'),
    placeShipsManuallyBtn: document.querySelector('.place-ships-manually-btn'),
    playBtn: document.querySelector('.play-btn'),

    /* == Placement buttons == */
    carrierBtn: document.querySelector('.placement-btn.carrier'),
    battleshipBtn: document.querySelector('.placement-btn.battleship'),
    cruiserBtn: document.querySelector('.placement-btn.cruiser'),
    submarineBtn: document.querySelector('.placement-btn.submarine'),
    destroyerBtn: document.querySelector('.placement-btn.destroyer'),
  };
}
