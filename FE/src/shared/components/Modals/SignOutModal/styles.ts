import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as NearIcon } from 'assets/images/icons/near-icon.svg';

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: space-between;
  & > p {
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`;

const Close = styled.div`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & > svg {
    fill: black;
  }
`;

const WalletWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  & > p {
    margin: 0;
    margin-left: 1rem;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.375rem;
  }
`;

const BalanceWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 .5rem 2rem;
  & > div:first-child {
    margin-bottom: 1.5rem;
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > p {
    margin: 0;
    font-weight: 500;
    font-size: .75rem;
    line-height: 1.063rem;
  }
  & > p:first-child {
    color: ${({ theme }) => theme.gray};
  }
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & > button {
    width: 100%;
    height: 100vh;
  }

  & > button:first-child {
    margin-bottom: 1rem;
  }
`;

const NearLogo = styled(NearIcon)`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0px 2px 4px ${({ theme }) => theme.blackOp015};
  align-self: center;
`;

export default {
  Header,
  Close,
  WalletWrapper,
  NearLogo,
  BalanceWrapper,
  Row,
  Footer,
  CloseIcon,
};
