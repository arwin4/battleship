export const body = document.querySelector('body');

export const primaryBoard2 = document.querySelector('.player-2-primary');

export const trackingBoard2 = document.querySelector('.player-2-tracking');

export const boards = document.querySelector('.boards');

export function DOM() {
  return {
    primaryBoard1: document.querySelector('.player-1-primary'),
    trackingBoard1: document.querySelector('.player-1-tracking'),
    trackingBoard1template: document.querySelector('.player-1-tracking'),
    prepareGameTemplate: document.querySelector('.prepare-game'),
    randomMenu: document.querySelector('.random-menu'),
    placement: document.querySelector('.placement'),
    orientation: document.querySelector('.orientation'),

    boards: document.querySelector('.boards'),
    main: document.querySelector('main'),

    /* == Templates == */
    randomPlacementMenuTemplate: document.querySelector(
      '.random-placement-menu',
    ),
    manualPlacementMenuTemplate: document.querySelector(
      '.manual-placement-menu',
    ),

    /* == Buttons == */
    placeShipsRandomlyBtn: document.querySelector('.place-ships-randomly-btn'),
    placeShipsAgainBtn: document.querySelector('.place-ships-again-btn'),
    placeShipsManuallyBtn: document.querySelector('.place-ships-manually-btn'),
    removeShipBtn: document.querySelector('.remove-ship-btn'),
    playBtn: document.querySelector('.play-btn'),
    resetBoardBtn: document.querySelector('.reset-board-btn'),

    // Placement buttons
    carrierBtn: document.querySelector('.placement-btn.carrier'),
    battleshipBtn: document.querySelector('.placement-btn.battleship'),
    cruiserBtn: document.querySelector('.placement-btn.cruiser'),
    submarineBtn: document.querySelector('.placement-btn.submarine'),
    destroyerBtn: document.querySelector('.placement-btn.destroyer'),
  };
}
