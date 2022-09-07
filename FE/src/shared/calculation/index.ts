import Big from 'big.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { IAuction } from 'providers/interfaces';
import { FungibleTokenContract } from 'services/contracts';
import { ZERO, MICRO_SECOND, NEAR_TOKEN_ID } from 'shared/constant';
import { parseTokenAmount } from 'shared/utils/formatAmount';

dayjs.extend(duration);

const ORDER_TERRA_GAS = 12;
const BASE = 10;

export const toTGas = (gas: string) => Big(gas).times(Big(BASE).pow(ORDER_TERRA_GAS)).toFixed(0);

export const calcLockedAmount = (auctions: IAuction[], accountId: string): string => {
  const lockedAmount = auctions.reduce((acc, auction: IAuction) => {
    if (auction.userData?.refunded || auction.winnerAccountId === accountId) return acc;
    if (auction.depositTokenId === NEAR_TOKEN_ID) {
      if (!auction.userData?.refunded) {
        return Big(acc).add(auction.userData?.amount || ZERO).toFixed();
      }
    }
    return acc;
  }, ZERO);

  return lockedAmount;
};

export const checkInvalidAmount = (
  balance: string,
  token: FungibleTokenContract | null,
  amount: string,
  currentUserBid: string,
) => {
  if (amount === '') return true;
  if (!token) return false;
  const bidAmountWithDecimals = parseTokenAmount(amount, token?.metadata?.decimals);
  const balanceWithLocked = Big(balance).add(currentUserBid);
  return Big(bidAmountWithDecimals).gt(balanceWithLocked);
};

export const nanosecondsToMilliSeconds = (date: number): number => date / MICRO_SECOND;

export const calcUserTicket = (ticketIdAndUserArray: [string, string][], accountId: string) => {
  const userTicket = ticketIdAndUserArray.reduce((sum, [, accountIdFromArray]) => {
    if (accountId !== accountIdFromArray) return sum;
    return Big(sum).plus(1);
  }, new Big(0));
  return Number(userTicket.toFixed());
};
