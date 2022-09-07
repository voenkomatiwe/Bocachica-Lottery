import { ETypeClaim } from 'providers/interfaces';
import { ITranslationKeys } from 'services/translation';

import Buttons from '../Buttons';
import Translate from '../Translate';
import styles from './styles';

interface IClaim {
  title: ITranslationKeys,
  additionalTitle?: ITranslationKeys,
  label: ITranslationKeys,
  titleBid: string,
  titleButton: ITranslationKeys | string,
  handleConfirm: () => void,
  typeClaim: ETypeClaim,
}

const getTitleButton = (typeClaim: ETypeClaim, titleButton: ITranslationKeys | string) => {
  switch (typeClaim) {
    case ETypeClaim.CLAIM:
      return <Translate value={titleButton as ITranslationKeys} />;
    case ETypeClaim.REFUND:
      return (
        <Translate
          value="action.claim"
          dynamicValue={titleButton}
        />
      );
    default: return '';
  }
};

export default function Claim({
  title, additionalTitle, label, titleBid, titleButton, handleConfirm, typeClaim,
}: IClaim): JSX.Element {
  return (
    <styles.Container>
      {typeClaim === ETypeClaim.CLAIM && additionalTitle
        ? (
          <>
            <styles.Title>
              <Translate value={title} />
            </styles.Title>
            <styles.AdditionalTitle>
              <Translate value={additionalTitle} />
            </styles.AdditionalTitle>
          </>
        )
        : (
          <styles.Title>
            <Translate value={title} />
          </styles.Title>
        )}

      <styles.Label>
        <Translate value={label} />
      </styles.Label>
      <styles.Amount>{titleBid}</styles.Amount>
      <styles.Footer>
        <Buttons.Primary onClick={handleConfirm}>
          {getTitleButton(typeClaim, titleButton)}
        </Buttons.Primary>
      </styles.Footer>
    </styles.Container>
  );
}
