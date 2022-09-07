import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
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

const Body = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 360px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
  `}
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1.5rem;
`;

const TitleWrapper = styled.p`
  margin: 0;
  margin-bottom: .75rem;
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  color: ${({ theme }) => theme.gray};
`;

const WrapperBtn = styled.div`
  display: flex;
  align-items: center;
`;

const FilterBtn = styled(Buttons.Primary)`
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  margin-right: .5rem;
  padding: 0 .75rem;
  border-radius: 4px;
`;

const ApplyBtn = styled(Buttons.Secondary)`
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  margin: 0 .25rem;
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

export default {
  Header,
  Close,
  Body,
  Wrapper,
  TitleWrapper,
  FilterBtn,
  WrapperBtn,
  ApplyBtn,
  Footer,
  CloseIcon,
};
