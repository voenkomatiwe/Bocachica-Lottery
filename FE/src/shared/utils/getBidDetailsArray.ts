import Big from 'big.js';

import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import { EAuctionType, INFTTokenMetadata } from 'services/interfaces';
import { ITranslationKeys } from 'services/translation';
import { ZERO, INCREASE_VALUES, EDimensions } from 'shared/constant';
import { IBidArray, INftDataArray } from 'shared/interfaces';

import { displayBid } from './displayAmount';
import { formatTokenAmount } from './formatAmount';
import { copy, isNotNullOrUndefined } from './index';
import { trimString } from './stringOperation';

interface IBidDetails {
  currentBid: string,
  yourBid?: string,
  minMarkup?: string | null,
  tickerPrice?: string | null,
  token: FungibleTokenContract,
  isShowingMinMarkup?: boolean,
  auctionType: EAuctionType,
}
interface IColumn {

  title: ITranslationKeys,
  value: string,
  symbol?: string,
  condition?: boolean,
}

const generateColumn = ({
  title,
  value,
  symbol,
  condition = true,
}: IColumn) => {
  if (condition && symbol) return { title, value: `${value} ${symbol}` };
  if (condition && !symbol) return { title, value };
  return null;
};

export const getBidDetailsArray = ({
  currentBid,
  yourBid,
  minMarkup,
  tickerPrice,
  token,
  auctionType,
  isShowingMinMarkup = true,
}: IBidDetails): IBidArray[] => {
  switch (auctionType) {
    case EAuctionType.Lottery: {
      const formattedTickerPrice = formatTokenAmount(tickerPrice || ZERO, token.metadata.decimals);
      const bidArray = [
        generateColumn({
          title: 'lottery.totalTicket',
          value: '1234', // todo add total ticket
        }),
        generateColumn({
          title: 'lottery.ticketPrice',
          value: formattedTickerPrice,
          symbol: token.metadata.symbol,
          condition: isShowingMinMarkup,
        }),
        generateColumn({
          title: 'lottery.yourTicket',
          value: '2', // todo add your ticket
          condition: Big(yourBid || ZERO).gt(ZERO),
        }),
      ].filter(isNotNullOrUndefined);
      return bidArray;
    }
    default: {
      const winnerBid = displayBid(currentBid, token.metadata.decimals);
      const formattedYourBid = displayBid(yourBid || ZERO, token.metadata.decimals);
      const formattedMinMarkup = formatTokenAmount(minMarkup || ZERO, token.metadata.decimals);
      const auctionMinStep = minMarkup ? formattedMinMarkup : '-';
      const bidArray = [
        generateColumn({
          title: 'bid.currentBid',
          value: winnerBid,
          symbol: token.metadata.symbol,
        }),
        generateColumn({
          title: 'bid.minMarkup',
          value: auctionMinStep,
          symbol: token.metadata.symbol,
          condition: isShowingMinMarkup,
        }),
        generateColumn({
          title: 'bid.yourBid',
          value: formattedYourBid,
          symbol: token.metadata.symbol,
          condition: Big(yourBid || ZERO).gt(ZERO),
        }),
      ].filter(isNotNullOrUndefined);
      return bidArray;
    }
  }
};

export const increaseValueArray = (symbol: string) => INCREASE_VALUES.map((value) => ({
  title: `+ ${value} ${symbol}`,
  value,
}));

export const nftData = (
  dimension: EDimensions,
  contractNft: NonFungibleTokenContract,
  nft: INFTTokenMetadata,
  token: FungibleTokenContract,
  auctionMinStep: string | null,
  auctionType: EAuctionType,
  auctionStep: string | null,
): INftDataArray[] => {
  const formattedMinMarkup = formatTokenAmount(auctionMinStep || ZERO, token.metadata.decimals);
  const formattedAuctionStep = formatTokenAmount(auctionStep || ZERO, token.metadata.decimals);
  const contractAddress = trimString(dimension === EDimensions.SMALL, contractNft.contractId);
  const owner = trimString(dimension === EDimensions.SMALL, nft.owner_id);
  const minMarkup = auctionMinStep ? formattedMinMarkup : '-';
  const nftDataArray: INftDataArray[] = [
    {
      title: 'nftData.contractAddress',
      value: contractAddress,
      onClick: () => copy(contractNft.contractId),
      show: true,
    },
    {
      title: 'nftData.owner',
      value: owner,
      onClick: () => copy(nft.owner_id),
      show: true,
    },
    {
      title: 'bid.minMarkup',
      value: `${minMarkup} ${token.metadata.symbol}`,
      show: auctionType === EAuctionType.Auction,
    },
    {
      title: 'lottery.ticketPrice',
      value: `${formattedAuctionStep} ${token.metadata.symbol}`,
      show: auctionType === EAuctionType.Lottery,
    },
    {
      title: 'nftData.tokenID',
      value: nft.token_id,
      onClick: () => copy(nft.token_id),
      show: true,
    },
    {
      title: 'nftData.rewardReceived',
      value: 'Yes', // todo
      show: auctionType === EAuctionType.Lottery,
    },
  ];
  return nftDataArray.filter((el) => el.show);
};

export const getCurrentBid = (initialPrice: string, winnerBid: string): string => (
  (Big(initialPrice).gt(ZERO) && Big(initialPrice).gt(winnerBid)) ? initialPrice : winnerBid
);
