import { ReactComponent as WalletLogo } from 'assets/images/icons/wallet.svg';
import { useWalletData } from 'providers/NearWalletProvider';
import Translate from 'shared/components/Translate';
import { ETypeButton } from 'shared/interfaces';

import Buttons from './index';

interface IRenderButton {
  typeButton: ETypeButton,
  handleConfirm: () => void,
  disabled?: boolean,
}

const currentTitle = (variant: ETypeButton) => {
  switch (variant) {
    case ETypeButton.PLACE_BID:
      return <Translate value="action.bid" />;
    case ETypeButton.BUY_TICKET:
      return <Translate value="action.buyTicket" />;
    case ETypeButton.WINNER_TICKET:
      return <Translate value="action.winnerTicket" />;
    default:
      return null;
  }
};

export default function Button({
  typeButton,
  handleConfirm,
  disabled = false,
}: IRenderButton): JSX.Element {
  const { requestSignIn, isSignedIn } = useWalletData();

  const title = isSignedIn
    ? currentTitle(typeButton)
    : <Translate value="action.connectWallet" />;

  if (isSignedIn) {
    return (
      <Buttons.Primary
        onClick={handleConfirm}
        disabled={disabled}
      >
        {title}
      </Buttons.Primary>
    );
  }

  return (
    <Buttons.Primary
      onClick={requestSignIn}
    >
      <WalletLogo />
      {title}
    </Buttons.Primary>
  );
}
