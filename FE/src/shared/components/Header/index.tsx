import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useData } from 'providers/DataProvider';
import { getToken } from 'providers/helpers';
import { useWalletData } from 'providers/NearWalletProvider';
import { APP_ROUTES } from 'routes/constant';
import { FungibleTokenContract } from 'services/contracts';
import { calcLockedAmount } from 'shared/calculation';
import BurgerToggle from 'shared/components/BurgerToggle';
import Translate from 'shared/components/Translate';
import { EDimensions, NEAR_TOKEN_ID } from 'shared/constant';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { getSaleIdByURL, toArray, trimAccountId } from 'shared/utils';
import { displayBalance } from 'shared/utils/displayAmount';

import styles from './styles';

interface IHeader {
  isOpened: boolean,
  setIsOpened: (v: boolean) => void,
}

export default function Header({ isOpened, setIsOpened }: IHeader): JSX.Element | null {
  const {
    requestSignIn, isSignedIn, signOut, accountId,
  } = useWalletData();
  const {
    tokens, getTokenBalance, loading, auctions,
  } = useData();
  const navigate = useNavigate();
  const dimension = useWindowDimensions();

  const url = new URL(window.location.href);
  const id = getSaleIdByURL(url.pathname);
  const [lockedAmount, setLockedAmount] = useState<string>('0');
  const [balance, setBalance] = useState<string | null>(null);
  const [depositToken, setDepositToken] = useState<FungibleTokenContract | null>(null);

  const nearToken = getToken(NEAR_TOKEN_ID, tokens);
  const nearBalance = getTokenBalance(NEAR_TOKEN_ID);

  const buttonAction = () => (
    isSignedIn
      ? signOut(nearBalance, lockedAmount, nearToken)
      : requestSignIn()
  );

  const balanceTitle = balance && depositToken
    ? `${displayBalance(balance, depositToken.metadata.decimals)} ${depositToken.metadata.symbol}`
    : trimAccountId(accountId, dimension === EDimensions.SMALL);

  const title = isSignedIn && !loading
    ? balanceTitle
    : <Translate value="action.connectWallet" />;

  useEffect(() => {
    if (isSignedIn) {
      if (id && auctions[id]) {
        const auction = auctions[id];
        const tokenBalance = getTokenBalance(auction.depositTokenId);
        const token = getToken(auction.depositTokenId, tokens);
        setDepositToken(token);
        setBalance(tokenBalance);
      } else {
        setDepositToken(null);
        setBalance(null);
      }
      const auctionsArray = toArray(auctions);
      const newLockedAmount = calcLockedAmount(auctionsArray, accountId);
      setLockedAmount(newLockedAmount);
    }
  }, [auctions, isSignedIn, id, tokens, accountId]);

  return (
    <styles.Container>
      <styles.LeftRow>
        <BurgerToggle
          isOpened={isOpened}
          setIsOpened={setIsOpened}
        />
        <styles.BocaChicaLogo
          onClick={() => navigate(APP_ROUTES.HOME)}
          isOpened={isOpened}
        />
      </styles.LeftRow>
      <styles.Button
        onClick={buttonAction}
        isSignedIn={isSignedIn}
        isOpened={isOpened}
      >
        <styles.WalletLogo />
        {title}
      </styles.Button>
    </styles.Container>
  );
}
