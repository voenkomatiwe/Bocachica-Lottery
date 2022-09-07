import Big from 'big.js';
import { formatNearAmount } from 'near-api-js/lib/utils/format';

import nearIcon from 'assets/images/icons/near-icon.svg';
import wNearIcon from 'assets/images/icons/wnear-icon.svg';
import getConfig from 'services/config';
import { createContract } from 'services/helpers';
import {
  FTTokenContractMethod,
  FungibleTokenContractInterface,
  ITokenMetadata,
  Action,
  IStorageBalance,
  IStorageBalanceBounds,
} from 'services/interfaces';
import {
  DECIMALS_DEFAULT_VALUE,
  FT_GAS,
  ICON_DEFAULT_VALUE,
  NEAR_DECIMALS,
  NEAR_TOKEN_ID,
  ONE_YOCTO_NEAR,
  STORAGE_TO_REGISTER_FT,
  STORAGE_TO_REGISTER_WNEAR,
  ZERO,
} from 'shared/constant';
import { parseTokenAmount } from 'shared/utils';

import { ftChangeMethods, ftViewMethods } from './contractMethods';

const config = getConfig();
const CONTRACT_ID = config.contractId;

const NEAR_TOKEN = {
  decimals: NEAR_DECIMALS,
  icon: nearIcon,
  name: 'Near token',
  version: '0',
  symbol: 'NEAR',
  reference: '',
};

const defaultMetadata = {
  decimals: DECIMALS_DEFAULT_VALUE,
  icon: ICON_DEFAULT_VALUE,
  name: 'Token',
  version: '0',
  symbol: 'TKN',
  reference: '',
};

export default class FungibleTokenContract {
  constructor(props: FungibleTokenContractInterface) {
    this.contract = createContract(
      props.wallet,
      props.contractId,
      ftViewMethods,
      ftChangeMethods,
    );
    this.contractId = props.contractId;
    this.wallet = props.wallet;
  }

  wallet;

  contract: any;

  contractId;

  metadata: ITokenMetadata = defaultMetadata;

  async getMetadata(): Promise<ITokenMetadata | null> {
    try {
      if (this.contractId === NEAR_TOKEN_ID) {
        this.metadata = { ...NEAR_TOKEN };
        return NEAR_TOKEN;
      }

      if (
        this.metadata.decimals !== DECIMALS_DEFAULT_VALUE
      && this.metadata.icon !== ICON_DEFAULT_VALUE
      ) return this.metadata;

      const metadata = await this.contract.ft_metadata();
      if (this.contractId === config.wNearAddress) metadata.icon = wNearIcon;

      this.metadata = { ...metadata };
      return metadata;
    } catch (e) {
      console.warn(`Error while loading ${this.contractId}`);
    }
    return null;
  }

  async getBalanceOf({ accountId }: { accountId: string }) {
    if (this.contractId === NEAR_TOKEN_ID) {
      return this.wallet.account().getAccountBalance()
        .then((balances) => balances.available);
    }
    return this.contract.ft_balance_of({ account_id: accountId });
  }

  async getStorageBalanceBounce(): Promise<IStorageBalanceBounds | undefined> {
    return this.contract.storage_balance_bounds();
  }

  async getStorageBalance({ accountId } : { accountId: string }): Promise<IStorageBalance | undefined> {
    return this.contract.storage_balance_of({ account_id: accountId });
  }

  async checkStorageBalance({ accountId }: { accountId: string }): Promise<Action[]> {
    try {
      if (this.contractId === NEAR_TOKEN_ID || this.contractId === config.usn) return [];
      const storageBalance = await this.getStorageBalance({ accountId });
      const storageBalanceBounds = await this.getStorageBalanceBounce();
      if (!storageBalance || Big(storageBalance.total).lt(storageBalanceBounds?.min || ZERO)) {
        const defaultStorageAmount = this.contractId === config.wNearAddress
          ? STORAGE_TO_REGISTER_WNEAR
          : STORAGE_TO_REGISTER_FT;

        let storageAmount = defaultStorageAmount;
        if (storageBalanceBounds && Big(storageBalanceBounds.min).gt(storageBalance?.total || ZERO)) {
          const newStorageAmount = Big(storageBalanceBounds.min).minus(storageBalance?.total || ZERO).toFixed();
          const formattedAmount = formatNearAmount(newStorageAmount);
          storageAmount = formattedAmount;
        }

        return [
          {
            receiverId: this.contractId,
            functionCalls: [{
              methodName: FTTokenContractMethod.storageDeposit,
              args: {
                registration_only: true,
                account_id: accountId,
              },
              amount: storageAmount,
            }],
          },
        ];
      }
      return [];
    } catch (e) {
      return [];
    }
  }

  async transfer({
    inputToken,
    amount,
    message = '',
  }:
  {
    inputToken: string,
    amount: string,
    message?: string,
  }): Promise<Action[]> {
    const transactions: Action[] = [];
    const formattedAmount = parseTokenAmount(amount, this.metadata.decimals);
    transactions.push({
      receiverId: inputToken,
      functionCalls: [{
        methodName: FTTokenContractMethod.ftTransferCall,
        args: {
          receiver_id: CONTRACT_ID,
          amount: formattedAmount,
          msg: message,
        },
        amount: ONE_YOCTO_NEAR,
        gas: FT_GAS,
      }],
    });
    return transactions;
  }

  // eslint-disable-next-line class-methods-use-this
  depositNear({ amount, auctionId }:{ amount: string, auctionId: number }) {
    const transactions: Action[] = [];
    transactions.push({
      receiverId: CONTRACT_ID,
      functionCalls: [{
        methodName: FTTokenContractMethod.depositNear,
        amount,
        args: {
          auction_id: auctionId,
        },
      }],
    });
    return transactions;
  }
}
