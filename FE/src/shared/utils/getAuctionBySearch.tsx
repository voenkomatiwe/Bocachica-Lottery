import { getToken } from 'providers/helpers';
import { IAuction } from 'providers/interfaces';
import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import Translate from 'shared/components/Translate';

import { displayBid } from './displayAmount';
import { EStatus } from './statusLocales';

const getAuctionBySearch = (
  filteredAuctions: IAuction[],
  auctionNfts: { [key: string]: NonFungibleTokenContract },
  auctionTokens: { [key: string]: FungibleTokenContract },
) => filteredAuctions.map((auction) => {
  const contractNft = auctionNfts[auction.nftContractId];
  const nft = contractNft.tokenMetadata[auction.nftTokenId];
  const token = getToken(auction.depositTokenId, auctionTokens);
  const label = auction.status === EStatus.Ended
    ? <Translate value="claim.finalBid" />
    : <Translate value="bid.currentBid" />;
  return {
    auctionId: auction.id,
    media: nft.metadata.media,
    title: nft.metadata.title,
    label,
    bid: token ? `${displayBid(auction.winnerBid, token.metadata.decimals)} ${token.metadata.symbol}` : '',
    status: auction.status,
  };
});

export default getAuctionBySearch;
