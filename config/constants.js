/*
File will be used later to map trade offer states when parsing trades from HTML
*/

export const TradeOfferState = {
  Invalid: 1,
  Active: 2,
  Accepted: 3,
  Countered: 4,
  Expired: 5,
  Canceled: 6,
  Declined: 7,
  InvalidItems: 8,
  CreatedNeedsConfirmation: 9,
  CancelledBySecondFactor: 10,
  InEscrow: 11,
};

export const BANNER_TO_STATE = {
  accepted: TradeOfferState.Accepted,
  counter: TradeOfferState.Countered,
  expired: TradeOfferState.Expired,
  cancel: TradeOfferState.Canceled,
  declined: TradeOfferState.Declined,
  invalid: TradeOfferState.InvalidItems,
  'mobile confirmation': TradeOfferState.CreatedNeedsConfirmation,
  escrow: TradeOfferState.InEscrow,
};