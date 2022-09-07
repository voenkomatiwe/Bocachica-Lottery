import Big from 'big.js';

import { ZERO } from 'shared/constant';
import { EInputHelperText } from 'shared/interfaces';

export const getHelperTextForPlaceBid = (
  currentBid: string,
  bidAmount: string,
  balance: string,
  auctionMinStep: string | null,
  currentUserBid: string,
) => {
  const validCurrentBid = auctionMinStep ? Big(currentBid || ZERO).add(auctionMinStep) : currentBid;
  if (Big(bidAmount).gt(ZERO) && Big(bidAmount).lt(validCurrentBid)) return EInputHelperText.LOW_BID;
  if (Big(balance).add(currentUserBid).lt(bidAmount)) return EInputHelperText.LOW_BALANCE;
  if (Big(bidAmount).gt(ZERO)) return EInputHelperText.LOCKED_AMOUNT;
  return null;
};

export const getHelperTextForBuyTicket = (
  ticketAmount: string,
  balance: string,
  auctionStep: string,
) => {
  const priceTicket = Big(auctionStep).mul(ticketAmount || ZERO);
  if (Big(balance).eq(ZERO) || Big(balance).lt(priceTicket)) return EInputHelperText.LOW_BALANCE;
  if (Big(ticketAmount || ZERO).gt(ZERO)) return EInputHelperText.LOCKED_AMOUNT;
  return null;
};
