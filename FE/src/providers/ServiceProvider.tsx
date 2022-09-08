import {
  createContext, useCallback, useContext, useEffect, useMemo, useState,
} from 'react';

import getConfig from 'services/config';
import { FungibleTokenContract } from 'services/contracts';
import LotteryContract from 'services/contracts/LotteryContract';
import { Action } from 'services/interfaces';
import { EModals } from 'shared/providers/interfaces';
import { useModalStore } from 'shared/providers/ModalProvider';
import { EStatus } from 'shared/utils';

import { AuctionServiceContextType, IAuction } from './interfaces';
import { useWalletData } from './NearWalletProvider';

const config = getConfig();

const ServiceContextHOC = createContext<AuctionServiceContextType>({} as AuctionServiceContextType);

export function ServiceProvider({ children }:{ children: JSX.Element }) {
  const [lotteryContract, setLotteryContract] = useState<LotteryContract | undefined>();
  const { showModal } = useModalStore();
  const {
    wallet, near, accountId, isSignedIn, sendTransaction,
  } = useWalletData();

  useEffect(() => {
    if (!near || !wallet) return;
    const createInstance = async () => {
      const instanceLotteryContract = new LotteryContract(accountId, config.lotteryContractId, near);
      const connectedToNearInstanceLotteryContract = instanceLotteryContract.withConnect(near);

      if (wallet && accountId) {
        connectedToNearInstanceLotteryContract.withWalletConnection(wallet);
      }
      setLotteryContract(connectedToNearInstanceLotteryContract);
    };

    createInstance();
  }, [accountId, near, wallet]);

  const sendBid = useCallback(async (auctionId: number, token: FungibleTokenContract, amount: string) => {
    try {
      if (!lotteryContract) return;
      const transactions: Action[] = [];
      const isJoined = await lotteryContract.hasAccount();
      if (!isJoined) {
        const joinFee = await lotteryContract?.getJoinFee();
        if (!joinFee) return;
        const join = lotteryContract.generateJoinTransaction(joinFee);
        transactions.push(...join);
      }
      const placeBid = await lotteryContract.generatePlaceBidTransaction(auctionId, token, amount);
      transactions.push(...placeBid);
      await sendTransaction(transactions);
    } catch (e){
      console.warn(`Error: ${e} while user SEND_BED in ServiceProvider`);
    }
  }, [lotteryContract, sendTransaction]);

  const buyTicket = useCallback(async (balance: string, auction: IAuction, token: FungibleTokenContract) => {
    if (
      (!auction || !token || !lotteryContract) && (auction.status !== EStatus.Open)
    ) return;
    showModal(EModals.BUY_TICKET_MODAL, {
      token,
      balance,
      isSignedIn,
      auction,
      handleConfirm: (amount: string | null) => {
        if (!amount) return;
        sendBid(auction.id, token, amount); // todo
      },
    });
  }, [lotteryContract, isSignedIn, sendBid, showModal]);

  const claimNFT = useCallback(async (auctionId: number) => {
    if (!lotteryContract) return;
    const transaction = lotteryContract.generateClaimNFTTransaction(auctionId);
    await sendTransaction(transaction);
  }, [lotteryContract, sendTransaction]);

  const getWinnerTicket = useCallback(async (auctionId: number) => {
    if (!lotteryContract) return;
    const transaction = lotteryContract.getWinnerTicket(auctionId);
    await sendTransaction(transaction);
  }, [lotteryContract, sendTransaction]);

  const auctionServiceData = useMemo(() => ({
    lotteryContract,
    claimNFT,
    buyTicket,
    getWinnerTicket,
  }), [lotteryContract, claimNFT, lotteryContract, buyTicket]);

  return (
    <ServiceContextHOC.Provider value={auctionServiceData}>
      {children}
    </ServiceContextHOC.Provider>
  );
}

export const useService = () => useContext(ServiceContextHOC);
