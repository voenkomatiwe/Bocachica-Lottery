import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as WarningIcon } from 'assets/images/icons/warning.svg';

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1.25rem;
  justify-content: flex-end;
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-bottom: 2rem;
`;

const Title = styled.p`
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: ${({ theme }) => theme.black};
  margin: .75rem 0;
`;

const Label = styled.p`
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.cardDescription};
  margin: 0;
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

export default {
  Header,
  Body,
  WarningIcon,
  Title,
  Label,
  Close,
  Footer,
  CloseIcon,
};
