import { ETypeClaim, IAuction } from 'providers/interfaces';
import { FungibleTokenContract, NonFungibleTokenContract } from 'services/contracts';
import { ZERO } from 'shared/constant';

import { displayBid } from './displayAmount';
import { getBidDetailsArray, getCurrentBid } from './getBidDetailsArray';
import getClaimProps from './getClaimProps';
import { getAuctionSocials } from './socialLinks';

const isShowingMinMarkup = false;

const getAuctionData = (
  auction: IAuction | null,
  nfts: { [key: string]: NonFungibleTokenContract },
  token: FungibleTokenContract | null,
) => {
  if (!auction) return null;
  const contractNft = nfts[auction.nftContractId];
  const nft = contractNft.tokenMetadata[auction.nftTokenId];
  if (!token) return null;
  const currentBid = getCurrentBid(auction.initialPrice, auction.winnerBid);

  const bidArray = getBidDetailsArray({
    currentBid,
    yourBid: auction.userData?.amount,
    tickerPrice: auction.auctionStep,
    token,
    isShowingMinMarkup,
    auctionType: auction.auctionType,
  });

  const availableClaim = auction.typeClaim !== ETypeClaim.EMPTY;
  const titleBid = `${displayBid(auction.userData?.amount || ZERO, token.metadata.decimals)} ${token.metadata.symbol}`;
  const claimProps = getClaimProps(auction.typeClaim, token.metadata.symbol);
  const socials = getAuctionSocials(auction);
  const { projectLink } = auction.links;
  return {
    contractNft,
    nft,
    token,
    currentBid,
    bidArray,
    availableClaim,
    titleBid,
    claimProps,
    socials,
    projectLink,
  };
};

export default getAuctionData;
