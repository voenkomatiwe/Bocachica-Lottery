import {
  createContext, useContext, useState, useEffect, useMemo, useCallback,
} from 'react';

import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';

import { retrieveInitialData } from './helpers';
import { DataContextType, IAuction } from './interfaces';
import { useWalletData } from './NearWalletProvider';
import { useService } from './ServiceProvider';

export const initialDataState: DataContextType = {
  loading: false,
  auctions: {},
  tokens: {},
  nfts: {},
  balances: {},
  setBalances: () => {},
  getTokenBalance: () => '0',
};

const DataContextHOC = createContext<DataContextType>(initialDataState);

export function DataProvider({ children }:{ children: JSX.Element }) {
  const { isSignedIn, accountId, wallet } = useWalletData();
  const { lotteryContract } = useService();

  const [loading, setLoading] = useState<boolean>(initialDataState.loading);
  const [auctions, setAuctions] = useState<{ [key:string]: IAuction }>(initialDataState.auctions);
  const [tokens, setTokens] = useState<{ [key: string]: FungibleTokenContract }>(initialDataState.tokens);
  const [nfts, setNfts] = useState<{ [key: string]: NonFungibleTokenContract }>(initialDataState.nfts);
  const [balances, setBalances] = useState<{ [key:string]: string }>(initialDataState.balances);

  useEffect(() => {
    const initialLoading = async () => {
      try {
        if (!wallet || !lotteryContract) return;
        setLoading(true);
        const {
          metadataMap,
          nftMetadataMap,
          balancesMap,
          auctionMap,
        } = await retrieveInitialData(wallet, lotteryContract, isSignedIn, accountId);

        setTokens(metadataMap);
        setNfts(nftMetadataMap);
        setBalances(balancesMap);
        setAuctions(auctionMap);
      } catch (e) {
        console.warn(`Error: ${e} while initial loading`);
      } finally {
        setLoading(false);
      }
    };

    initialLoading();
  }, [accountId, lotteryContract, isSignedIn, wallet]);

  const getTokenBalance = useCallback(
    (tokenId: string | undefined) => (tokenId ? balances[tokenId] ?? '0' : '0'),
    [balances],
  );

  const data = useMemo(() => ({
    loading,
    auctions,
    tokens,
    nfts,
    balances,
    setBalances,
    getTokenBalance,
  }), [
    auctions,
    balances,
    getTokenBalance,
    loading,
    nfts,
    tokens,
  ]);

  return (
    <DataContextHOC.Provider value={data}>
      {children}
    </DataContextHOC.Provider>
  );
}

export const useData = () => useContext(DataContextHOC);
