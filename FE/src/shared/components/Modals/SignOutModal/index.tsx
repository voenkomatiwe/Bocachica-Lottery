import { FungibleTokenContract } from 'services/contracts';
import Buttons from 'shared/components/Buttons';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';
import { IBalanceArray } from 'shared/interfaces';
import { trimAccountId } from 'shared/utils';
import { displayBalance } from 'shared/utils/displayAmount';

import styles from './styles';

export interface ISignOutModal {
  handleConfirm: () => void;
  closeModal: () => void;
  changeAccount: () => void;
  accountId: string;
  tokenBalance: string,
  lockedAmount: string,
  token: FungibleTokenContract,
}

export default function SignOutModal({
  closeModal,
  handleConfirm,
  changeAccount,
  accountId,
  tokenBalance,
  lockedAmount,
  token,
}: ISignOutModal): JSX.Element {
  const confirmHandler = () => {
    handleConfirm();
    closeModal();
  };

  const balanceArray: IBalanceArray[] = [
    {
      title: 'modals.availableBalance',
      value: `${displayBalance(tokenBalance, token.metadata.decimals)} ${token.metadata.symbol}`,
    },
    {
      title: 'modals.locked',
      value: `${displayBalance(lockedAmount, token.metadata.decimals)} ${token.metadata.symbol}`,
    },
  ];

  return (
    <ModalWrapper closeModal={closeModal} isCentered>
      <styles.Header>
        <p><Translate value="modals.user" /></p>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>
      <styles.WalletWrapper>
        <styles.NearLogo />
        <p>{trimAccountId(accountId)}</p>
      </styles.WalletWrapper>
      <styles.BalanceWrapper>
        {balanceArray.map(({ title, value }) => (
          <styles.Row key={title}>
            <p><Translate value={title} /></p>
            <p>{value}</p>
          </styles.Row>
        ))}
      </styles.BalanceWrapper>
      <styles.Footer>
        <Buttons.Secondary onClick={confirmHandler}>
          <Translate value="action.disconnect" />
        </Buttons.Secondary>
        <Buttons.Secondary onClick={() => changeAccount()}>
          <Translate value="action.change" />
        </Buttons.Secondary>
      </styles.Footer>
    </ModalWrapper>
  );
}
