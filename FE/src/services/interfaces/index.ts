import { WalletConnection, Contract } from 'near-api-js';

export enum FTTokenContractMethod {
  ftTransferCall = 'ft_transfer_call',
  depositNear = 'deposit_near',
  storageDeposit = 'storage_deposit',
}

export interface Action {
  receiverId: string;
  functionCalls: {
    gas?: string;
    amount?: string;
    methodName: string;
    args?: {
      registration_only?: boolean,
      account_id?: string,
      receiver_id?: string,
      amount?: string,
      msg?: string,
      auction_id?: number,
    };
  }[];
}

export interface ITokenMetadata {
  version: string;
  name: string;
  symbol: string;
  reference: string;
  decimals: number;
  icon: string;
}

export interface FungibleTokenContractInterface {
  wallet: WalletConnection;
  contractId: string;
}

export interface NonFungibleTokenContractInterface {
  wallet: WalletConnection;
  contractId: string;
}

export interface INFTMetadata {
  spec: string,
  name: string,
  symbol: string,
  icon: string,
  base_uri: string | null,
  reference: string | null,
  reference_hash: string | null,
}

export interface INFTTokenMetadata {
  token_id: string,
  owner_id: string,
  metadata: {
    title: string,
    description: string,
    media: string,
    media_hash: string | null,
    copies: number | null,
    issued_at: number | null,
    expires_at: number | null,
    starts_at: number | null,
    updated_at: number | null,
    extra: string[] | null,
    reference: string | null,
    reference_hash: string | null,
    category: string | null,
    tags: string[] | null,
    store: string | null,
    type: string | null,
    mime_type?: string,
  }
}

export interface Metadata {
  project_link: string | null,
  twitter_link: string | null,
  medium_link: string | null,
  telegram_link: string | null,
}

export enum EAuctionType {
  Auction = 'Auction',
  Lottery = 'Lottery',
}

export interface IAuctionOutput {
  auction_id: number,
  nft_contract_id: string,
  nft_token_id: string,
  nft_claimed: boolean,
  deposit_token_id: string,
  claim_available: boolean,
  refund_available: boolean,
  buyout_price: string,
  start_date: number,
  end_date: number,
  collected_amount: string,
  num_auction_accounts: number,
  initial_price: string,
  auction_step: string | null,
  auction_min_step: string | null,
  winner_id: string,
  winner_bid: string,
  added_time: string | null,
  metadata: Metadata,
  auction_type: EAuctionType,
}

export interface IAuctionAccount {
  amount: string,
  refunded: boolean,
}

export interface NativeContract extends Contract {
  get_num_tickets?(params: { auction_id?: number }): number | undefined,
  get_ticket_info?(params: { auction_id?: number, account_id?: string }): string | undefined
  get_tickets?(params: { auction_id?: number, from_index?: number, limit?: number }): [string, string][] | undefined
  get_num_auctions?(): number | undefined
  get_auction?(params: { auction_id?: number }): IAuctionOutput
  get_auctions?(params: { from_index?: number, limit?: number }): IAuctionOutput[] | undefined
  get_num_accounts?(): number | undefined
  get_auctions_accounts?(params: { auction_id?: number }): number | undefined
  get_winner?(params: { auction_id?: number }): string | undefined
  get_auction_account?(params: { auction_id?: number, account_id?: string }): IAuctionAccount | undefined
  has_account?(params: { account_id?: string }): string | undefined
  get_join_fee?(): string | undefined
}

export enum AuctionContractMethod {
  join = 'join',
  claimNFT = 'claim_nft',
  claimRefund = 'claim_refund',
}

export interface IStorageBalance {
  total: string,
  available: string,
}

export interface IStorageBalanceBounds {
  min: string,
  max: string
}
