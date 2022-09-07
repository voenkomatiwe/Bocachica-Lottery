import { useEffect, useState } from 'react';

import { ETypeClaim, IAuction } from 'providers/interfaces';
import { useWalletData } from 'providers/NearWalletProvider';
import { useService } from 'providers/ServiceProvider';
import { UPDATE_AUCTION_INTERVAL, ZERO } from 'shared/constant';
import {
  checkAuctionShouldUpdate, EStatus, formatAuction, getTypeClaim,
} from 'shared/utils';

const useAuctionDynamicData = (auction: IAuction, status: EStatus) => {
  const { isSignedIn, accountId } = useWalletData();
  const { lotteryContract } = useService();

  const [totalTickets, setTotalTickets] = useState<number>(auction.totalTickets);
  const [yourBid, setYourBid] = useState<string>(auction.userData?.amount || ZERO);
  const [typeClaim, setTypeClaim] = useState<ETypeClaim>(auction.typeClaim);

  useEffect(() => {
    const updateDynamicData = async () => {
      try {
        const shouldUpdate = checkAuctionShouldUpdate(auction, status);
        if (!lotteryContract || !shouldUpdate) return;
        const updatedAuction = await lotteryContract.getAuction(auction.id);
        if (!updatedAuction) return;
        const newUpdatedAuction = formatAuction(updatedAuction);
        if (isSignedIn) {
          newUpdatedAuction.typeClaim = getTypeClaim(newUpdatedAuction, accountId);
        }
        setTotalTickets(newUpdatedAuction.totalTickets);
        setYourBid(newUpdatedAuction.userData?.amount || ZERO);
        setTypeClaim(newUpdatedAuction.typeClaim);
      } catch (e){
        console.warn(`Error: ${e} while update auction data`);
      }
    };
    updateDynamicData();
    const interval = setInterval(updateDynamicData, UPDATE_AUCTION_INTERVAL);
    return () => clearInterval(interval);
  }, [lotteryContract, isSignedIn, auction, accountId, status]);

  return ({ totalTickets, yourBid, typeClaim });
};

export default useAuctionDynamicData;
