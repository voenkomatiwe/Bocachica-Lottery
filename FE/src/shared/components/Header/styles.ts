import styled from 'styled-components';

import { ReactComponent as BocaChica } from 'assets/images/boca-logo.svg';
import { ReactComponent as WalletLogo } from 'assets/images/icons/wallet.svg';
import Buttons from 'shared/components/Buttons';

const Container = styled.div`
  display: flex;
  z-index: 10;
  justify-content: space-between;
  padding: 1.5rem 2rem 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 328px;
    width: 100%;
    align-self: center;
    justify-content: space-between;
    padding: 1.5rem 0 0;
  `}
`;

const LeftRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled(Buttons.ConnectedButton)<{ isOpened: boolean }>`
  font-weight: 600;
  font-size: .75rem;
  line-height: .938rem;
  & > svg {
    margin-right: .5rem;
  };
  visibility: ${(({ isOpened }) => (!isOpened ? 'visible' : 'hidden'))};
`;

const BocaChicaLogo = styled(BocaChica)<{ isOpened: boolean }>`
  cursor: pointer;
  visibility: ${(({ isOpened }) => (!isOpened ? 'visible' : 'hidden'))};
`;

export default {
  Container,
  LeftRow,
  Button,
  WalletLogo,
  BocaChicaLogo,
};
