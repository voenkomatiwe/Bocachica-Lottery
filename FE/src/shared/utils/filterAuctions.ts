import Big from 'big.js';

import { ETypeClaim, IAuction } from 'providers/interfaces';
import { IAuctionAccount } from 'services/interfaces';
import { ZERO } from 'shared/constant';
import { IFilter } from 'shared/interfaces';

import { EStatus } from './statusLocales';

export enum EFilterByStatus {
  ALL = 'ALL',
  OPEN = 'OPEN',
  SOON = 'SOON',
  ENDED = 'ENDED',
}

export enum EFilterByParticipation {
  ALL = 'ALL',
  JOINED = 'JOINED',
}

export enum EFilterByResult {
  ALL = 'ALL',
  CLAIM = 'CLAIM',
  REFUND = 'REFUND',
}

export const statusOrderMap = {
  [EStatus.Open]: EFilterByStatus.OPEN,
  [EStatus.Soon]: EFilterByStatus.SOON,
  [EStatus.Ended]: EFilterByStatus.ENDED,
};

export const getFilteredAuctionArray = (auctions: IAuction[]) => {
  const activeAuctions = auctions
    .filter((auction) => auction.status === EStatus.Open)
    .sort((a, b) => a.endDate - b.endDate);

  const pendingAuctions = auctions
    .filter((auction) => auction.status === EStatus.Soon)
    .sort((a, b) => a.startDate - b.startDate);

  const completedAuctions = auctions
    .filter((auction) => auction.status === EStatus.Ended)
    .sort((a, b) => b.endDate - a.endDate)
    .sort((a, b) => a.typeClaim - b.typeClaim);

  const activePendingAuctions = activeAuctions.concat(pendingAuctions);
  const filteredAuctions = activePendingAuctions.concat(completedAuctions);
  return filteredAuctions;
};

export const getUserDataFilter = (
  typeClaim: ETypeClaim,
  userData: IAuctionAccount | undefined,
): {
  filterByParticipation: EFilterByParticipation,
  filterByResult: EFilterByResult
} => {
  let filterByParticipation: EFilterByParticipation = EFilterByParticipation.ALL;
  let filterByResult: EFilterByResult = EFilterByResult.ALL;
  if (typeClaim === ETypeClaim.CLAIM) filterByResult = EFilterByResult.CLAIM;
  if (typeClaim === ETypeClaim.REFUND) filterByResult = EFilterByResult.REFUND;
  if (userData && Big(userData.amount).gt(ZERO)) filterByParticipation = EFilterByParticipation.JOINED;
  return {
    filterByParticipation,
    filterByResult,
  };
};

export const getAuctionsByFilter = (
  auctions: IAuction[],
  filter: IFilter,
) => {
  const { filterByStatus, filterByParticipation, filterByResult } = filter;
  const filters: { key: string, value:(EFilterByStatus | EFilterByParticipation | EFilterByResult) }[] = [];
  if (filterByStatus !== EFilterByStatus.ALL) filters.push({ key: 'filterByStatus', value: filterByStatus });
  if (filterByParticipation !== EFilterByParticipation.ALL) {
    filters.push({ key: 'filterByParticipation', value: filterByParticipation });
  }
  if (filterByResult !== EFilterByResult.ALL) filters.push({ key: 'filterByResult', value: filterByResult });

  if (!filters.length) return auctions;

  return auctions.filter((auction) => !filters.some(
    ({ key, value }) => auction[key as keyof typeof auction] !== value,
  ));
};
