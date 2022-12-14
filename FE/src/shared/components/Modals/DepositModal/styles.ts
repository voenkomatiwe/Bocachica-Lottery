import styled from 'styled-components';

import { ReactComponent as ArrowRightIcon } from 'assets/images/icons/arrow-right-icon.svg';
import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as ErrorIcon } from 'assets/images/icons/error.svg';
import Buttons from 'shared/components/Buttons';

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  justify-content: center;
  & > p {
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.75rem;
  }
`;

const Close = styled.div`
  position: absolute;
  width: 24px;
  height: 24px;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  & > svg {
    fill: black;
  }
`;

const BidWrapper = styled.div`
  margin: 0 .5rem 3rem;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-row-gap: 1.5rem;
  & > div {
    display: flex;
    flex-direction: column;
  }
  & > div:nth-child(even) {
    align-items: flex-end;
  }
  & > div:nth-child(odd) {
    align-items: flex-start;
  }
`;

const BidTitle = styled.p`
  margin: 0;

  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  color: ${({ theme }) => theme.gray}
`;

const Bid = styled.p`
  margin-top: .375rem;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.black}
`;

const BidIncreaseWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
`;

const IncreaseBtn = styled(Buttons.Secondary)`
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  margin: 0 .25rem;
`;

const HelperText = styled.div<{ isErrorColor?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1rem;
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  color: ${({ theme, isErrorColor }) => (isErrorColor ? theme.lightRed : theme.black)};
  & > svg {
    margin-right: .5rem;
  }
`;

const Footer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  width: 100%;
  & > button {
    width: 100%;
    height: 100vh;
  }
`;

const ArrowRight = styled(ArrowRightIcon)`
  margin-left: 1rem;
  path {
    fill: ${({ theme }) => theme.pink}
  }
`;

export default {
  Header,
  BidWrapper,
  BidTitle,
  Bid,
  BidIncreaseWrapper,
  Close,
  IncreaseBtn,
  HelperText,
  ErrorIcon,
  Footer,
  ArrowRight,
  CloseIcon,
};
