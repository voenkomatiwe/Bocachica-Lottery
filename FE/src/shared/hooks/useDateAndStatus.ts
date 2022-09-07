import { useEffect, useState } from 'react';

import { ONE_SECOND } from 'shared/constant';
import { ITimeLeft } from 'shared/interfaces';
import { EStatus, getTimeAndStatus } from 'shared/utils';

const useDateAndStatus = (startDate: number, endDate: number, auctionStatus: EStatus | undefined) => {
  const { calcDate, calcStatus } = getTimeAndStatus(startDate, endDate);
  const [timeLeft, setTimeLeft] = useState<ITimeLeft[]>(calcDate);
  const [status, setStatus] = useState<EStatus>(auctionStatus || calcStatus);

  useEffect(() => {
    const updateStatus = () => {
      if (auctionStatus === EStatus.Ended) return;
      const {
        calcDate: newCalcDate,
        calcStatus: newCalcStatus,
      } = getTimeAndStatus(startDate, endDate);
      setTimeLeft(newCalcDate);
      setStatus(newCalcStatus);
    };
    updateStatus();
    const interval = setInterval(updateStatus, ONE_SECOND);
    return () => clearInterval(interval);
  }, [auctionStatus, endDate, startDate]);

  return ({ timeLeft, status });
};

export default useDateAndStatus;
