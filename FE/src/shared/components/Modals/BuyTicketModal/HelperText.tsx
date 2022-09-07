import Big from 'big.js';

import Translate from 'shared/components/Translate';
import { EInputHelperText } from 'shared/interfaces';
import { displayBid } from 'shared/utils';

import styles from './styles';

interface IHelperText {
  helper: EInputHelperText | null,
  totalTicket: number,
  yourTicket: number,
  auctionStep: string,
  ticketAmount: string,
  tokenSymbol: string,
}

export default function HelperText({
  helper,
  totalTicket,
  yourTicket,
  auctionStep,
  ticketAmount,
  tokenSymbol,
}: IHelperText) {
  switch (helper) {
    case EInputHelperText.LOCKED_AMOUNT: {
      const priceTicket = Big(auctionStep).mul(ticketAmount).toFixed();
      return (
        <styles.HelperText>
          <Translate
            value="helperText.lockedAmount"
            dynamicValue={`${displayBid(priceTicket)} ${tokenSymbol}`}
          />
        </styles.HelperText>
      );
    }
    case EInputHelperText.LOW_BALANCE: {
      return (
        <styles.HelperText isErrorColor>
          <styles.ErrorIcon />
          <Translate value="helperText.lowBalance" />
        </styles.HelperText>
      );
    }

    default: return null;
  }
}
