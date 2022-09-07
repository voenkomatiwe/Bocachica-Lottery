import { ETypeClaim, IAuction } from 'providers/interfaces';

import { EStatus } from './statusLocales';

const getTypeClaim = (
  auction: IAuction,
  accountId: string,
): ETypeClaim => {
  if (auction.status !== EStatus.Ended) return ETypeClaim.EMPTY;
  if (accountId === auction.winnerAccountId && auction.claimAvailable && !auction.nftClaimed) return ETypeClaim.CLAIM;
  return ETypeClaim.EMPTY;
};

export default getTypeClaim;
