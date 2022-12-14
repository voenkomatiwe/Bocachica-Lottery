import Big from 'big.js';

import Translate from 'shared/components/Translate';
import { EInputHelperText } from 'shared/interfaces';
import { displayBid } from 'shared/utils';

import styles from './styles';

interface IHelperText {
  helper: EInputHelperText | null,
  auctionStep: string,
  ticketAmount: string,
  tokenSymbol: string,
}

export default function HelperText({
  helper,
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
            value="helperText.willPay"
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
