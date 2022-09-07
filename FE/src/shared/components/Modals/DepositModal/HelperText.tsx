import Translate from 'shared/components/Translate';
import { EInputHelperText } from 'shared/interfaces';
import { displayBid } from 'shared/utils';

import styles from './styles';

interface IHelperText {
  helper: EInputHelperText | null,
  bidAmount: string,
  tokenSymbol: string,
}

export default function HelperText({
  helper,
  bidAmount,
  tokenSymbol,
}: IHelperText) {
  switch (helper) {
    case EInputHelperText.LOCKED_AMOUNT: {
      return (
        <styles.HelperText>
          <Translate
            value="helperText.lockedAmount"
            dynamicValue={`${displayBid(bidAmount)} ${tokenSymbol}`}
          />
        </styles.HelperText>
      );
    }
    case EInputHelperText.LOW_BID: {
      return (
        <styles.HelperText isErrorColor>
          <styles.ErrorIcon />
          <Translate value="helperText.lowBid" />
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
