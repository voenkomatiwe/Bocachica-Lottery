import { Contract, Near, WalletConnection } from 'near-api-js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import {
  Action, AuctionContractMethod, IAuctionOutput, NativeContract,
} from 'services/interfaces';
import {
  GAS_JOIN, NEAR_TOKEN_ID, ONE_YOCTO_NEAR, ZERO, SAMPLE_GAS,
} from 'shared/constant';

import { lotteryChangeMethods, lotteryViewMethods } from './contractMethods';
import FungibleTokenContract from './FungibleToken';

export default class LotteryContract {
  readonly contractId: string;

  accountId: string;

  near: Near | null;

  public constructor(accountId: string, contractId: string, near: Near | null) {
    this.contractId = contractId;
    this.accountId = accountId;
    this.near = near;
  }

  async initializeContract(accountId: string): Promise<NativeContract> {
    if (this.near == null) {
      throw new Error('Invalid near connection.');
    }
    const account = await this.near.account(this.accountId);
    const contract = new Contract(
      account,
      accountId,
      { viewMethods: lotteryViewMethods, changeMethods: lotteryChangeMethods },
    );
    return contract;
  }

  withConnect(near: Near) {
    this.near = near;
    return this;
  }

  withWalletConnection(wallet: WalletConnection) {
    // eslint-disable-next-line no-underscore-dangle
    this.near = wallet._near;
    this.accountId = wallet.getAccountId();
  }

  async getAuctions(from: number, limit: number): Promise<IAuctionOutput[] | undefined> {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_auctions?.({ from_index: from, limit });
  }

  async getNumberOfAuctions() {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_num_auctions?.();
  }

  async getAuction(auctionId: number) {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_auction?.({ auction_id: auctionId });
  }

  async hasAccount() {
    const contract = await this.initializeContract(this.contractId);
    return contract.has_account?.({ account_id: this.accountId });
  }

  async getJoinFee() {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_join_fee?.();
  }

  generateJoinTransaction(joinFee: string): Action[] {
    return [{
      receiverId: this.contractId,
      functionCalls: [{
        methodName: AuctionContractMethod.join,
        args: {},
        amount: formatNearAmount(joinFee) as string,
        gas: GAS_JOIN,
      }],
    }];
  }

  // eslint-disable-next-line class-methods-use-this
  async generatePlaceBidTransaction(
    auctionId: number,
    token: FungibleTokenContract,
    amount: string,
  ): Promise<Action[]> {
    if (token.contractId === NEAR_TOKEN_ID) {
      const depositNear = token.depositNear({ amount, auctionId });
      return depositNear;
    }
    const transactions: Action[] = [];
    const sendToken = await token.transfer(
      {
        inputToken: token.contractId,
        amount,
        message: auctionId.toString(),
      },
    );
    if (sendToken.length) transactions.push(...sendToken);

    return transactions;
  }

  generateClaimNFTTransaction(auctionId: number): Action[] {
    return [{
      receiverId: this.contractId,
      functionCalls: [{
        methodName: AuctionContractMethod.claimNFT,
        args: { auction_id: auctionId },
        amount: ONE_YOCTO_NEAR,
      }],
    }];
  }

  async generateClaimRefundTransaction(
    auctionId: number,
    accountId: string,
    depositToken: FungibleTokenContract,
  ): Promise<Action[]> {
    const transactions: Action[] = [];
    const checkTokenStorageBalance = await depositToken.checkStorageBalance({ accountId });
    transactions.push(...checkTokenStorageBalance);
    transactions.push({
      receiverId: this.contractId,
      functionCalls: [{
        methodName: AuctionContractMethod.claimRefund,
        args: { auction_id: auctionId },
        amount: ZERO,
        gas: SAMPLE_GAS,
      }],
    });

    return transactions;
  }

  async getNumTickets(auctionId: number): Promise<number | undefined> {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_num_tickets?.({ auction_id: auctionId });
  }

  async getTicketInfo(auctionId: number): Promise<string | undefined> {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_ticket_info?.({ auction_id: auctionId, account_id: this.accountId });
  }

  async getTickets(
    auctionId: number,
    fromIndex: number,
    limit: number,
  ): Promise<[string, string][] | undefined> {
    const contract = await this.initializeContract(this.contractId);
    return contract.get_tickets?.({ auction_id: auctionId, from_index: fromIndex, limit });
  }

  getWinnerTicket(auctionId: number): Action[] {
    return [{
      receiverId: this.contractId,
      functionCalls: [{
        methodName: AuctionContractMethod.get_winner_ticket,
        args: { auction_id: auctionId },
        amount: ZERO,
      }],
    }];
  }
}
