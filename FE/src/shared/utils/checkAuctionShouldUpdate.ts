import dayjs from 'dayjs';

import { IAuction } from 'providers/interfaces';
import { ONE_MINUTE } from 'shared/constant';

import { EStatus } from './statusLocales';

const checkAuctionShouldUpdate = (auction: IAuction | null, status: EStatus) => {
  if (!auction) return false;
  if (status === EStatus.Open) return true;
  const dateNow = dayjs().valueOf();
  const dateBeforeStart = auction.startDate - ONE_MINUTE;
  const dateAfterEnd = auction.endDate + ONE_MINUTE;
  if (status === EStatus.Soon && dateBeforeStart < dateNow) return true;
  if (status === EStatus.Ended && dateAfterEnd > dateNow) return true;
  return false;
};

export default checkAuctionShouldUpdate;
