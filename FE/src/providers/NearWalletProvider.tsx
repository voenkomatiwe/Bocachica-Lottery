import {
  connect, WalletConnection, Near, keyStores,
} from 'near-api-js';
import { Transaction } from 'near-api-js/lib/transaction';
import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

import getConfig from 'services/config';
import { FungibleTokenContract } from 'services/contracts';
import { createNearTransaction } from 'services/helpers';
import { Action } from 'services/interfaces';
import { EModals } from 'shared/providers/interfaces';
import { useModalStore } from 'shared/providers/ModalProvider';

import { WalletContextType } from './interfaces';

const config = getConfig();

export const initialWalletState: WalletContextType = {
  near: null,
  wallet: null,
  isSignedIn: false,
  accountId: '',
  requestSignIn: () => {},
  signOut: () => {},
  sendTransaction: async () => {},
};

const WalletContextHOC = createContext<WalletContextType>(initialWalletState);

export function WalletProvider({ children }:{ children: JSX.Element }) {
  const { showModal } = useModalStore();

  const [near, setNear] = useState<Near | null>(initialWalletState.near);
  const [wallet, setWallet] = useState<WalletConnection | null>(initialWalletState.wallet);

  useEffect(() => {
    const setupNearConnection = async () => {
      const newNear = await connect({
        ...config,
        headers: {},
        keyStore: new keyStores.BrowserLocalStorageKeyStore(),
      });
      const newWallet = new WalletConnection(newNear, config.lotteryContractId);
      setNear(newNear);
      setWallet(newWallet);
    };

    setupNearConnection();
  }, []);

  const requestSignIn = useCallback(() => wallet?.requestSignIn(config.lotteryContractId), [wallet]);

  const isSignedIn = useMemo(() => wallet?.isSignedIn() ?? false, [wallet]);
  const accountId: string = useMemo(() => (isSignedIn ? wallet?.getAccountId() : ''), [isSignedIn, wallet]);

  const signOut = useCallback((tokenBalance: string, lockedAmount: string, token: FungibleTokenContract | null) => {
    if (!wallet || !near || !token) return;
    showModal(EModals.SIGN_OUT_MODAL, {
      handleConfirm: () => {
        wallet?.signOut();
        window.location.reload();
      },
      changeAccount: () => {
        wallet?.signOut();
        requestSignIn();
      },
      accountId,
      tokenBalance,
      lockedAmount,
      token,
    });
  }, [wallet, near, showModal, accountId]);

  const sendTransaction = useCallback(async (action: Action[]) => {
    if (!wallet || !near) return;
    try {
      const nearTransactions: Transaction[] = await Promise.all(
        createNearTransaction(near, wallet, accountId, action),
      );
      wallet.requestSignTransactions({ transactions: nearTransactions });
    } catch (e){
      console.log(e);
    }
  }, [accountId, near, wallet]);

  const walletStore = useMemo(() => ({
    near,
    wallet,
    isSignedIn,
    accountId,
    requestSignIn,
    signOut,
    sendTransaction,
  }), [accountId, isSignedIn, near, requestSignIn, sendTransaction, signOut, wallet]);

  return (
    <WalletContextHOC.Provider value={walletStore}>
      {children}
    </WalletContextHOC.Provider>
  );
}

export const useWalletData = () => useContext(WalletContextHOC);
