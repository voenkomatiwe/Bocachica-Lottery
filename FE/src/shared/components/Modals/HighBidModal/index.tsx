import Buttons from 'shared/components/Buttons';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';

import styles from './styles';

export interface IHighBidModal {
  handleConfirm: () => void;
  closeModal: () => void;
}

export default function HighBidModal({
  closeModal, handleConfirm,
}: IHighBidModal): JSX.Element{
  return (
    <ModalWrapper closeModal={closeModal} isCentered>
      <styles.Header>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>
      <styles.Body>
        <styles.WarningIcon />
        <styles.Title>
          <Translate value="modals.bedIsHighest" />
        </styles.Title>
        <styles.Label>
          <Translate value="modals.agreement" />
        </styles.Label>
      </styles.Body>
      <styles.Footer>
        <Buttons.Primary onClick={handleConfirm}>
          <Translate value="action.raiseMyBid" />
        </Buttons.Primary>
        <Buttons.Secondary onClick={closeModal}>
          <Translate value="action.cancel" />
        </Buttons.Secondary>
      </styles.Footer>
    </ModalWrapper>
  );
}
