import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import { IGetTimeAndStatus } from 'shared/interfaces';
import { EStatus } from 'shared/utils/statusLocales';

dayjs.extend(duration);

export const getStatus = (startDate: number, endDate: number): EStatus => {
  const dateNow = dayjs().valueOf();

  if (dateNow > endDate) return EStatus.Ended;
  if (startDate > dateNow) return EStatus.Soon;
  if (dateNow > startDate && dateNow < endDate) return EStatus.Open;
  return EStatus.Ended;
};

const formatDate = (number: number) => (number > 9 ? number.toString() : `0${number}`);

export const getTimeAndStatus = (startDate: number, endDate: number): IGetTimeAndStatus => {
  const dateNow = dayjs().valueOf();

  const calcStatus = getStatus(startDate, endDate);
  let date: number;
  switch (calcStatus) {
    case EStatus.Soon: {
      date = startDate;
      break;
    }
    case EStatus.Open: {
      date = endDate;
      break;
    }
    default: date = 0;
  }
  const futureDate = dayjs(date);
  const leftTimeObj = dayjs.duration(futureDate.diff(dateNow));
  const dateInDays = Math.floor(leftTimeObj.asDays());
  if (futureDate.valueOf() > dateNow.valueOf()) {
    return {
      calcDate: [
        { id: 1, value: formatDate(dateInDays) },
        { id: 2, value: leftTimeObj.format('HH') },
        { id: 3, value: leftTimeObj.format('mm') },
        { id: 4, value: leftTimeObj.format('ss') },
      ],
      calcStatus,
    };
  }
  return {
    calcDate: [],
    calcStatus,
  };
};
