import Big from 'big.js';

import { ETypeClaim, IAuction } from 'providers/interfaces';
import { IAuctionAccount } from 'services/interfaces';
import { ZERO } from 'shared/constant';

import { EStatus } from './statusLocales';

const getTypeClaim = (
  auction: IAuction,
  userData: IAuctionAccount | undefined,
  accountId: string,
): ETypeClaim => {
  if (auction.status !== EStatus.Ended) return ETypeClaim.EMPTY;
  if (accountId === auction.winnerAccountId && auction.claimAvailable && !auction.nftClaimed) return ETypeClaim.CLAIM;
  if (userData
    && !userData.refunded
    && auction.refundAvailable
    && Big(userData.amount).gt(ZERO)
    && (accountId !== auction.winnerAccountId)
  ) return ETypeClaim.REFUND;
  return ETypeClaim.EMPTY;
};

export default getTypeClaim;
