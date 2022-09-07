import { ETypeClaim, IAuction } from 'providers/interfaces';
import { IAuctionOutput } from 'services/interfaces';
import { nanosecondsToMilliSeconds } from 'shared/calculation';

import { statusOrderMap } from './filterAuctions';
import { getStatus } from './getTimeAndStatus';

const formatAuction = (
  auction: IAuctionOutput,
  ticketIdAndUserArray?: [string, string][],
  totalTickets?: number,
): IAuction => {
  const startDate = nanosecondsToMilliSeconds(auction.start_date);
  const endDate = nanosecondsToMilliSeconds(auction.end_date);
  const status = getStatus(startDate, endDate);
  return {
    id: auction.auction_id,
    depositTokenId: auction.deposit_token_id,
    initialPrice: auction.initial_price,
    auctionStep: auction.auction_step,
    auctionMinStep: auction.auction_min_step,
    buyoutPrice: auction.buyout_price,
    collectedAmount: auction.collected_amount,
    nftContractId: auction.nft_contract_id,
    nftTokenId: auction.nft_token_id,
    nftClaimed: auction.nft_claimed,
    claimAvailable: auction.claim_available,
    refundAvailable: auction.refund_available,
    numAuctionAccounts: auction.num_auction_accounts,
    winnerAccountId: auction.winner_id,
    winnerBid: auction.winner_bid,
    addedTime: auction.added_time,
    startDate,
    endDate,
    typeClaim: ETypeClaim.EMPTY,
    status,
    filterByStatus: statusOrderMap[status],
    links: {
      projectLink: auction.metadata.project_link,
      twitterLink: auction.metadata.twitter_link,
      mediumLink: auction.metadata.medium_link,
      telegramLink: auction.metadata.telegram_link,
    },
    auctionType: auction.auction_type,
    totalTickets,
    ticketIdAndUserArray,
  };
};

export default formatAuction;
