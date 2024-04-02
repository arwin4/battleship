export default function DOM() {
  return {
    /* == Boards == */
    primaryBoard1: document.querySelector('.player-1-primary'),
    trackingBoard1: document.querySelector('.player-1-tracking'),
    boards: document.querySelector('.boards'),

    /* == Templates == */
    randomPlacementMenuTemplate: document.querySelector(
      '.random-placement-menu',
    ),
    manualPlacementMenuTemplate: document.querySelector(
      '.manual-placement-menu',
    ),

    /* == Misc. elements == */
    randomMenu: document.querySelector('.random-menu'),
    placement: document.querySelector('.placement'),
    orientation: document.querySelector('.orientation'),
    main: document.querySelector('main'),

    /* === Buttons === */
    placeShipsRandomlyBtn: document.querySelector('.place-ships-randomly-btn'),
    placeShipsAgainBtn: document.querySelector('.place-ships-again-btn'),
    placeShipsManuallyBtn: document.querySelector('.place-ships-manually-btn'),
    removeShipBtn: document.querySelector('.remove-ship-btn'),
    playBtn: document.querySelector('.play-btn'),

    /* == Placement buttons == */
    carrierBtn: document.querySelector('.placement-btn.carrier'),
    battleshipBtn: document.querySelector('.placement-btn.battleship'),
    cruiserBtn: document.querySelector('.placement-btn.cruiser'),
    submarineBtn: document.querySelector('.placement-btn.submarine'),
    destroyerBtn: document.querySelector('.placement-btn.destroyer'),
  };
}
