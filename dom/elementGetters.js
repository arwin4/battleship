export const body = document.querySelector('body');

export const primaryBoard1 = document.querySelector('.player-1-primary');
export const primaryBoard2 = document.querySelector('.player-2-primary');

export const trackingBoard1 = document.querySelector('.player-1-tracking');
export const trackingBoard2 = document.querySelector('.player-2-tracking');
export const trackingBoards = [trackingBoard1, trackingBoard2];

export const boards = document.querySelector('.boards');

export const shipsToPlaceTemplate = document.querySelector('.ships-to-place');
export const trackingBoard1template =
  document.querySelector('#player-1-tracking');

export function DOM() {
  return {
    trackingBoard1: document.querySelector('.player-1-tracking'),
  };
}
