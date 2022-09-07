import Big from 'big.js';
import { providers, WalletConnection } from 'near-api-js';
import { useEffect } from 'react';
import { toast, Slide } from 'react-toastify';
import styled from 'styled-components';

import { getToken } from 'providers/helpers';
import { IAuction } from 'providers/interfaces';
import getConfig from 'services/config';
import { FungibleTokenContract } from 'services/contracts';
import { ITranslationKeys } from 'services/translation';
import Translate from 'shared/components/Translate';
import { EModals, ModalProps } from 'shared/providers/interfaces';
import { useModalStore } from 'shared/providers/ModalProvider';
import { displayBid, toArray } from 'shared/utils';

const config = getConfig();
const PROPERTY_NAME = 'FunctionCall';
const TRANSACTION_HASHES = 'transactionHashes';
const ERROR_CODE = 'errorCode';
const ERROR_MESSAGE = 'errorMessage';

const Link = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  & > p {
    color: ${({ theme }) => theme.grey};
    margin: 0;
    font-size: .75rem;
  }
`;

enum ToastType {
  Success,
  Error,
}

const getToast = (href: string, title: ITranslationKeys, type: ToastType) => {
  const link = (
    <Link href={href} target="_blank" rel="noreferrer">
      <Translate value={title} />
      <p>Open Transaction</p>
    </Link>
  );
  if (type === ToastType.Success) {
    return toast.success(link, {
      theme: 'colored',
      position: 'top-center',
      transition: Slide,
      closeOnClick: false,
    });
  }
  return toast.error(link, {
    theme: 'colored',
    position: 'top-center',
    transition: Slide,
    closeOnClick: false,
  });
};

enum TransactionType {
  None = 0,
  Bid,
  DepositNear,
  ClaimNFT,
  ClaimRefund,
}

enum StatusType {
  None,
  SuccessValue,
  Failure,
}

const methodName: { [key: string]: string } = {
  placeBid: 'ft_transfer_call',
  depositNear: 'deposit_near',
  claimNFT: 'claim_nft',
  claimRefund: 'claim_refund',
  confirm: 'confirm',
};

const detailsTransaction = (transaction: any, type: TransactionType) => {
  const { hash } = transaction.transaction;

  const successStatus = Object.prototype.hasOwnProperty.call(transaction.status, 'SuccessValue');
  if (type === TransactionType.Bid) {
    const buff = Buffer.from(transaction.status.SuccessValue, 'base64');
    const successValue = buff.toString('ascii');
    const swapStatus = Big(successValue.replace(/"/g, '') || 0).gt(0);

    return {
      hash,
      status: swapStatus && successStatus ? StatusType.SuccessValue : StatusType.Failure,
    };
  }
  return {
    hash,
    status: successStatus ? StatusType.SuccessValue : StatusType.Failure,
  };
};

const getTransaction = (transactions: any, method: { [key: string]: string }) => {
  const [transaction] = transactions.filter((tx:any) => toArray(method)
    .indexOf(tx.transaction.actions[0][PROPERTY_NAME].method_name) !== -1);

  switch (transaction.transaction.actions[0][PROPERTY_NAME].method_name) {
    case method.placeBid: {
      return { type: TransactionType.Bid, transaction };
    }
    case method.depositNear: {
      return { type: TransactionType.DepositNear, transaction };
    }
    case method.claimNFT: {
      return { type: TransactionType.ClaimNFT, transaction };
    }
    case method.claimRefund: {
      return { type: TransactionType.ClaimRefund, transaction };
    }
    default: {
      return { type: TransactionType.None, transaction };
    }
  }
};

export function analyzeTransactions(
  transactions: any,
): { type: TransactionType, status: StatusType, hash: string } {
  const { type, transaction } = getTransaction(transactions, methodName);
  if (!transaction || type === TransactionType.None) {
    return {
      type,
      status: StatusType.None,
      hash: '',
    };
  }
  const { hash, status } = detailsTransaction(transaction, type);
  return {
    type,
    status,
    hash,
  };
}

const clearHash = (queryParams: URLSearchParams) => {
  const url = new URL(window.location.href);
  if (queryParams.has(TRANSACTION_HASHES)) queryParams.delete(TRANSACTION_HASHES);

  if (queryParams.has(ERROR_CODE) || queryParams.has(ERROR_MESSAGE)) {
    queryParams.delete(ERROR_CODE);
    queryParams.delete(ERROR_MESSAGE);
  }
  window.history.replaceState({}, document.title, url.pathname);
};

function parseTransactions(
  txs: any,
  showModal: <T extends EModals>(modal: T, props: ModalProps<T>) => void,
  auction: IAuction | null,
  tokens: { [key: string]: FungibleTokenContract },
  queryParams: URLSearchParams,
) {
  const result: {
    type: TransactionType,
    status: StatusType,
    hash: string
  } = analyzeTransactions(txs);
  const href = `${config.explorerUrl}/transactions/${result.hash}`;

  switch (result.type) {
    case TransactionType.Bid:
      if (result.status === StatusType.SuccessValue) {
        const token = getToken(auction?.depositTokenId || '', tokens);
        if (!auction || !token || !auction.userData) return;
        clearHash(queryParams);
        showModal(EModals.SUCCESSFUL_BID_MODAL, {
          yourBid: displayBid(auction.userData.amount, token.metadata.decimals),
          token,
        });
      } else if (result.status === StatusType.Failure) {
        clearHash(queryParams);
        getToast(href, 'toast.bidFailed', ToastType.Error);
      }
      break;
    case TransactionType.DepositNear:
      if (result.status === StatusType.SuccessValue) {
        const token = getToken(auction?.depositTokenId || '', tokens);
        if (!auction || !token || !auction.userData) return;
        clearHash(queryParams);
        showModal(EModals.SUCCESSFUL_BID_MODAL, {
          yourBid: displayBid(auction.userData.amount, token.metadata.decimals),
          token,
        });
      } else if (result.status === StatusType.Failure) {
        clearHash(queryParams);
        getToast(href, 'toast.bidFailed', ToastType.Error);
      }
      break;
    case TransactionType.ClaimNFT:
      clearHash(queryParams);
      if (result.status === StatusType.SuccessValue) {
        getToast(href, 'toast.claimNFT', ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, 'toast.claimNFT', ToastType.Error);
      }
      break;
    case TransactionType.ClaimRefund:
      clearHash(queryParams);
      if (result.status === StatusType.SuccessValue) {
        getToast(href, 'toast.claimRefund', ToastType.Success);
      } else if (result.status === StatusType.Failure) {
        getToast(href, 'toast.claimRefund', ToastType.Error);
      }
      break;
    default: {
      break;
    }
  }
}

export default function useTransactionHash(
  query: string | undefined,
  wallet: WalletConnection | null,
  auction: IAuction | null,
  tokens: { [key: string]: FungibleTokenContract },
) {
  const { showModal, modal } = useModalStore();

  return useEffect(() => {
    if (wallet && auction) {
      const queryParams = new URLSearchParams(query);
      const transactions = queryParams?.get(TRANSACTION_HASHES);
      const errorCode = queryParams?.get(ERROR_CODE);
      const errorMessage = queryParams?.get(ERROR_MESSAGE);
      if (errorCode || errorMessage) {
        toast.error(<Translate value="toast.userRejected" />, {
          theme: 'colored',
          position: 'top-center',
          transition: Slide,
        });
      }
      clearHash(queryParams);

      if (transactions) {
        const provider = new providers.JsonRpcProvider(
          config.nodeUrl,
        );
        try {
          Promise.all(transactions.split(',').map(
            (txHash) => provider.txStatus(txHash, wallet.getAccountId()),
          )).then(
            (res) => parseTransactions(res, showModal, auction, tokens, queryParams),
          );
        } catch (e) {
          console.warn(`${e} error while loading tx`);
        }
      }
    }
  }, [query, auction, wallet, modal]);
}
