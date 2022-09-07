import { Near, WalletConnection } from 'near-api-js';
import { Dispatch, SetStateAction } from 'react';

import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import LotteryContract from 'services/contracts/LotteryContract';
import { Action, EAuctionType } from 'services/interfaces';
import {
  EFilterByStatus, EFilterByParticipation, EFilterByResult, EStatus,
} from 'shared/utils';

export enum ETypeClaim {
  CLAIM,
  REFUND,
  EMPTY,
}

export type WalletContextType = {
  near: Near | null;
  wallet: WalletConnection | null;
  isSignedIn: boolean,
  accountId: string,
  requestSignIn: () => void,
  signOut: (tokenBalance: string, lockedAmount: string, token: FungibleTokenContract | null) => void,
  sendTransaction: (action: Action[]) => Promise<void>,
};

export interface ILinks {
  projectLink: string | null,
  twitterLink: string | null,
  mediumLink: string | null,
  telegramLink: string | null,
}

export interface IAuction {
  id: number,
  depositTokenId: string,
  claimAvailable: boolean,
  refundAvailable: boolean,
  initialPrice: string,
  auctionStep: string | null,
  auctionMinStep: string | null,
  buyoutPrice:string,
  collectedAmount: string,
  nftContractId: string,
  nftTokenId: string,
  nftClaimed: boolean,
  numAuctionAccounts: number,
  winnerAccountId: string,
  winnerBid: string,
  addedTime: string | null,
  startDate: number,
  endDate: number,
  userData?: {
    amount: string,
    refunded: boolean,
  }
  typeClaim: ETypeClaim
  status: EStatus,
  filterByStatus: EFilterByStatus,
  filterByParticipation?: EFilterByParticipation,
  filterByResult?: EFilterByResult,
  links: ILinks,
  auctionType: EAuctionType,
  totalTickets?: number,
  ticketIdAndUserArray?: [string, string][]
  userTicket?: number,
}

export type DataContextType = {
  loading: boolean,
  auctions: { [key: string]: IAuction };
  tokens: { [key: string]: FungibleTokenContract };
  nfts: { [key: string]: NonFungibleTokenContract };
  balances: { [key: string]: string };
  setBalances: Dispatch<SetStateAction<{ [key: string]: string }>>;
  getTokenBalance: (tokenId: string | undefined) => string;
};

export type AuctionServiceContextType = {
  lotteryContract?: LotteryContract;
  claimNFT: (auctionId: number) => Promise<void>;
  buyTicket: (balance: string, auction: IAuction, token: FungibleTokenContract) => Promise<void>;
};
