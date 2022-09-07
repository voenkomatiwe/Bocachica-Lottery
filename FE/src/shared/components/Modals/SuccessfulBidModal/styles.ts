import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as SuccessIcon } from 'assets/images/icons/success.svg';

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
  max-width: 328px;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: ${({ theme }) => theme.black};
  margin: .75rem 0;
  text-align: center;
`;

const SubTitle = styled.p`
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188;
  color: ${({ theme }) => theme.black};
  margin: 1.5rem 0 .5rem;
  text-align: center;
`;

const Label = styled.p`
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.cardDescription};
  margin: 0;
  text-align: center;
`;

const Footer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  & > button {
    width: 100%;
    height: 100vh;
  }
`;

export default {
  Header,
  Body,
  SuccessIcon,
  Title,
  SubTitle,
  Label,
  Close,
  Footer,
  CloseIcon,
};
