import { ReactComponent as ArrowRightIcon } from 'assets/images/icons/arrow-right-icon.svg';
import { ETypeClaim } from 'providers/interfaces';
import Timestamp from 'shared/components/Timestamp';
import Translate from 'shared/components/Translate';
import { ITimeLeft } from 'shared/interfaces';
import { EStatus, StatusTimeLocales } from 'shared/utils/statusLocales';

import styles from './styles';

interface IFooter {
  status: EStatus,
  timeLeft: ITimeLeft[],
  typeClaim: ETypeClaim,
  refundToken: string
}

export default function Footer({
  status, timeLeft, typeClaim, refundToken,
}: IFooter): JSX.Element {
  const isShowingData = (status !== EStatus.Ended) || (typeClaim !== ETypeClaim.EMPTY);
  const title = typeClaim === ETypeClaim.CLAIM
    ? <Translate value="miniCardFooter.claim" />
    : (
      <Translate
        value="miniCardFooter.refund"
        dynamicValue={refundToken}
      />
    );

  return (
    <styles.Footer isShowingHelpBlock={isShowingData}>
      {
        status !== EStatus.Ended && (
          <Timestamp
            title={StatusTimeLocales[status]}
            minWidth={223}
            date={timeLeft}
          />
        )
      }
      {
        status === EStatus.Ended && (typeClaim !== ETypeClaim.EMPTY) && (
          <styles.ClaimWrapper>
            <styles.Circle />
            {title}
          </styles.ClaimWrapper>
        )
      }
      <styles.ArrowContainer>
        <ArrowRightIcon />
      </styles.ArrowContainer>
    </styles.Footer>
  );
}
