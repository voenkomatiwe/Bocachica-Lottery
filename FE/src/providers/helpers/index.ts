import { WalletConnection } from 'near-api-js';

import { IAuction } from 'providers/interfaces';
import getConfig from 'services/config';
import { LotteryContract, FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import { EAuctionType, IAuctionOutput } from 'services/interfaces';
import { calcUserTicket } from 'shared/calculation';
import { DEFAULT_PAGE_LIMIT, NEAR_TOKEN_ID } from 'shared/constant';
import {
  formatAuction,
  getTypeClaim,
  isNotNullOrUndefined,
  onlyUniqueValues,
  toMap,
} from 'shared/utils';

const config = getConfig();

function assertFulfilled<T>(item: PromiseSettledResult<T>): item is PromiseFulfilledResult<T> {
  return item.status === 'fulfilled';
}

export async function retrieveAuctionResult(pages: number, contract: LotteryContract) {
  return (await Promise.allSettled(
    [...Array(pages)]
      .map((_, i) => contract.getAuctions(i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT)),
  )).filter(assertFulfilled)
    .map(({ value }) => value)
    .flat();
}

export function retrieveTokenAddresses(auctionsResult: IAuction[]): string[] {
  return onlyUniqueValues(
    [...auctionsResult
      .flatMap((auction) => auction.depositTokenId),
    NEAR_TOKEN_ID,
    config.wNearAddress,
    ],
  );
}

export function retrieveNFTTokenAddresses(auctionsResult: IAuction[]): string[] {
  return onlyUniqueValues(
    [...auctionsResult.flatMap((auction) => auction.nftContractId)],
  );
}

export async function retrieveFilteredTokenMetadata(
  wallet: WalletConnection,
  tokenAddresses: string[],
):Promise<FungibleTokenContract[]> {
  return Promise.all(tokenAddresses.map(async (address: string) => {
    const ftTokenContract: FungibleTokenContract = new FungibleTokenContract(
      { wallet, contractId: address },
    );
    await ftTokenContract.getMetadata();
    return ftTokenContract;
  }));
}

export function createNFTContracts(
  wallet: WalletConnection,
  nftAddresses: string[],
): { [key: string]: NonFungibleTokenContract } {
  return nftAddresses.reduce((acc, address) => {
    const contract = new NonFungibleTokenContract({ wallet, contractId: address });
    return {
      ...acc,
      [contract.contractId]: contract,
    };
  }, {});
}

export function tryToGetContract(
  wallet: WalletConnection,
  contracts: { [key: string]: NonFungibleTokenContract },
  contractId:string,
): NonFungibleTokenContract {
  return contracts[contractId] || new NonFungibleTokenContract(
    { wallet, contractId },
  );
}

export async function retrieveFilteredNFTMetadata(
  wallet: WalletConnection,
  nftAddresses: { nftAddress: string; nftId: string; }[],
  contracts: { [key: string]: NonFungibleTokenContract },
): Promise<NonFungibleTokenContract[]> {
  return Promise.all(nftAddresses.map(async (address) => {
    const nftTokenContract = tryToGetContract(wallet, contracts, address.nftAddress);
    const contractMetadata = await nftTokenContract.getNFTContractMetadata();
    await nftTokenContract.getNFTTokenMetadata(address.nftId, contractMetadata?.base_uri);
    return nftTokenContract;
  }));
}

export async function retrieveBalancesMap(
  tokensMetadataFiltered: FungibleTokenContract[],
  accountId: string,
): Promise<{ [key: string]: string; }> {
  const balancesArray: { contractId: string, balance: string }[] = await Promise.all(
    tokensMetadataFiltered.map(async (tokenContract: FungibleTokenContract) => {
      const balance: string = await tokenContract.getBalanceOf({ accountId }) || 0;
      return { contractId: tokenContract.contractId, balance };
    }),
  );

  return balancesArray.reduce((acc, curr) => (
    { ...acc, [curr.contractId]: curr.balance }
  ), {});
}

export const getToken = (
  tokenId: string,
  tokens: { [key: string]: FungibleTokenContract },
): FungibleTokenContract | null => (tokenId ? tokens[tokenId] ?? null : null);

export const getNFT = (
  nftId: string,
  nfts: { [key: string]: NonFungibleTokenContract },
): NonFungibleTokenContract | null => (nftId ? nfts[nftId] ?? null : null);

export async function retrieveTicketsFromAuction(
  auctionId: number,
  pages: number,
  lotteryContract: LotteryContract,
) {
  return (await Promise.allSettled(
    [...Array(pages)]
      .map((_, i) => lotteryContract.getTickets(auctionId, i * DEFAULT_PAGE_LIMIT, DEFAULT_PAGE_LIMIT)),
  )).filter(assertFulfilled)
    .map(({ value }) => value)
    .filter(isNotNullOrUndefined)
    .flat();
}

export async function retrieveAuctionArray(
  lotteryContract: LotteryContract,
) {
  const auctionsLength = await lotteryContract.getNumberOfAuctions();
  const pages = auctionsLength ? Math.ceil(auctionsLength / DEFAULT_PAGE_LIMIT) : 0;
  const auctionsResult = await retrieveAuctionResult(pages, lotteryContract);
  const auctionArray = Promise.all(auctionsResult
    .filter(isNotNullOrUndefined)
    .map(async (auction: IAuctionOutput) => {
      if (auction.auction_type === EAuctionType.Lottery) {
        const totalTickets = await lotteryContract.getNumTickets(auction.auction_id);
        const lotteryPages = totalTickets ? Math.ceil(totalTickets / DEFAULT_PAGE_LIMIT) : 0;
        const ticketIdAndUserArray = await retrieveTicketsFromAuction(
          auction.auction_id,
          lotteryPages,
          lotteryContract,
        );
        return formatAuction(auction, ticketIdAndUserArray);
      }

      return formatAuction(auction);
    }));
  return auctionArray;
}

export async function retrieveUserData(
  newAuctionArray: IAuction[],
  accountId: string,
){
  try {
    return await Promise.all(
      newAuctionArray.map(async (newAuction) => {
        let userTicket: number | undefined;
        const typeClaim = getTypeClaim(newAuction, accountId);
        if (newAuction.auctionType === EAuctionType.Lottery && newAuction.ticketIdAndUserArray) {
          userTicket = calcUserTicket(newAuction.ticketIdAndUserArray, accountId);
        }
        return {
          ...newAuction,
          userTicket,
          typeClaim,
        };
      }),
    );
  } catch (e){
    console.warn(`Error: ${e} while update user data`);
    return [];
  }
}

export async function retrieveInitialData(
  wallet: WalletConnection,
  lotteryContract: LotteryContract,
  isSignedIn: boolean,
  accountId: string,
): Promise<{
    metadataMap: { [key: string]: FungibleTokenContract };
    nftMetadataMap: { [key: string]: NonFungibleTokenContract };
    balancesMap: { [key: string]: string };
    auctionMap: { [key: string]: IAuction };
  }> {
  const auctionArray = await retrieveAuctionArray(lotteryContract);
  const tokenAddresses = retrieveTokenAddresses(auctionArray);
  const nftTokenAddresses = retrieveNFTTokenAddresses(auctionArray);
  const nftTokensAndIds = auctionArray.map((nftSale) => ({
    nftAddress: nftSale.nftContractId,
    nftId: nftSale.nftTokenId,
  }));

  const contracts = createNFTContracts(wallet, nftTokenAddresses);
  const [tokensMetadataFiltered, nftsMetadataFiltered] = await Promise.all([
    retrieveFilteredTokenMetadata(wallet, onlyUniqueValues(tokenAddresses)),
    retrieveFilteredNFTMetadata(wallet, nftTokensAndIds, contracts),
  ]);

  const newAuctionArray = auctionArray.filter(isNotNullOrUndefined);

  const metadataMap = tokensMetadataFiltered.reduce((acc, curr) => ({ ...acc, [curr.contractId]: curr }), {});
  const nftMetadataMap = nftsMetadataFiltered.reduce((acc, curr) => ({ ...acc, [curr.contractId]: curr }), {});

  if (isSignedIn) {
    const [auctionDataByUser, balancesMap] = await Promise.all([
      retrieveUserData(newAuctionArray, accountId),
      retrieveBalancesMap(tokensMetadataFiltered, accountId),
    ]);
    const auctionMap = toMap(auctionDataByUser);

    return {
      metadataMap,
      nftMetadataMap,
      balancesMap,
      auctionMap,
    };
  }
  const auctionMap = toMap(newAuctionArray);
  return {
    metadataMap,
    nftMetadataMap,
    balancesMap: {},
    auctionMap,
  };
}
