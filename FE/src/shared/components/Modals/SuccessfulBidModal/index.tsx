import { FungibleTokenContract } from 'services/contracts';
import Buttons from 'shared/components/Buttons';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';

import styles from './styles';

export interface ISuccessfulBidModal {
  token: FungibleTokenContract;
  yourBid: string;
  closeModal: () => void;
}

export default function SuccessfulBidModal({
  closeModal, yourBid, token,
}: ISuccessfulBidModal): JSX.Element{
  const subTitle = `${yourBid} ${token.metadata.symbol}`;
  return (
    <ModalWrapper closeModal={closeModal} isCentered>
      <styles.Header>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>
      <styles.Body>
        <styles.SuccessIcon />
        <styles.Title>
          <Translate value="modals.successfullyBid" />
        </styles.Title>
        <styles.SubTitle>
          {subTitle}
        </styles.SubTitle>
        <styles.Label>
          <Translate value="modals.lockedUntilTheEnd" />
        </styles.Label>
      </styles.Body>
      <styles.Footer>
        <Buttons.Primary onClick={closeModal}>
          <Translate value="action.ok" />
        </Buttons.Primary>
      </styles.Footer>
    </ModalWrapper>
  );
}
