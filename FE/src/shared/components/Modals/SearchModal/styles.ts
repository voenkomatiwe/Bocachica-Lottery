import styled from 'styled-components';

import { ReactComponent as ClearSearchIcon } from 'assets/images/icons/clear-search.svg';
import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as SearchIcon } from 'assets/images/icons/search.svg';

const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 2rem;
  justify-content: center;
  & > p {
    margin: 0;
    font-weight: 600;
    font-size: 1.25rem;
    line-height: 1.75rem;
  };
`;

const StyledInput = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: 2px solid ${({ theme }) => theme.pinkOp01};
  border-radius: 8px;
  margin-right: 2.5rem;
  min-height: 48px;
  transition: box-shadow .2s, border .2s;
  :focus-within, hover {
    border: 2px solid ${({ theme }) => theme.pink};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.boxShadowInput};
  };
`;

const Input = styled.input`
  margin: 0 48px;
  background: none;
  border: none;
  outline: none;
  width: 100%;
  font-style: normal;
  font-weight: 500;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.black};
`;

const ClearSearch = styled(ClearSearchIcon)`
  position: absolute;
  width: 22px;
  height: 22px;
  right: 14px;
`;

const Search = styled(SearchIcon)`
  position: absolute;
  width: 24px;
  height: 24px;
  left: 14px;
  fill: black;
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
  flex: 1;
  overflow: scroll;
  display: flex;
  flex-direction: column;
  min-width: 540px;
  min-height: 400px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: 100%;
    height: 100vh;
  `};
`;

const Row = styled.div`
  display: flex;
  margin: .75rem 0;
  justify-content: space-between;
  align-items: center;
  min-height: 48px;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 48px;
  max-height: 48px;
  height: 100%;
  width: 100%;
`;

const Image = styled.img`
  height: 100%;
  max-width: 48px;
  max-height: 48px;
`;

const WrapperDescription = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 48px;
  margin-left: .75rem;
`;

const Title = styled.p`
  margin: 0;
  font-style: normal;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.375rem;
  color: ${({ theme }) => theme.black};
`;

const Label = styled.p`
  margin: 0;
  font-style: normal;
  font-weight: 400;
  font-size: .75rem;
  line-height: 1.063rem;
  color: ${({ theme }) => theme.gray};
`;

const NoResultsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  align-self: center;
  max-width: 320px;
`;

const NoResultsTitle = styled.p`
  margin: 1.5rem 0 .75rem;
  font-style: normal;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: ${({ theme }) => theme.black};
  text-align: center;
`;

const NoResultsLabel = styled.p`
  margin: 0;
  font-style: normal;
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.gray};
  text-align: center;
`;

const NoResultsIcon = styled(SearchIcon)`
  width: 27px;
  height: 27px;
  fill: black;
`;

export default {
  Header,
  StyledInput,
  Search,
  Input,
  ClearSearch,
  Close,
  Body,
  Row,
  ImageContainer,
  Image,
  WrapperDescription,
  Title,
  Label,
  NoResultsWrapper,
  NoResultsTitle,
  NoResultsLabel,
  NoResultsIcon,
  CloseIcon,
};
