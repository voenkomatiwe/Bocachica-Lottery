import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  min-width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 600;
  font-size: .75rem;
  line-height: .938rem;
  margin-top: 2.5rem;
  margin-bottom: 1.75rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    min-width: auto;
    max-width: 328px;
    width: 100%;
    align-self: center;
    justify-content: space-between;
  `}
`;

const LogoContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  & > svg {
    cursor: pointer;
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex: 0;
  `}
`;

const WrapperCards = styled.div`
  max-width: 100vw;
  display: grid;
  grid-template-columns: repeat(3, minmax(328px, 1fr));

  grid-gap: 1.5rem;
  margin: 0 auto;

  ${({ theme }) => theme.mediaWidth.upToLarge`
    grid-template-columns: repeat(auto-fit, minmax(328px, 1fr));
  `}
`;

export default {
  Container,
  Header,
  LogoContainer,
  WrapperCards,
};
