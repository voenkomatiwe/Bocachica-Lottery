import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 328px;
  max-height: 498px;
  justify-content: space-between;
  width: 100%;
  height: 100vh;
  background: ${({ theme }) => theme.white};
  box-shadow: 0px 4px 8px -4px ${({ theme }) => theme.boxShadowCard};
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  max-width: 296px;
  max-height: 296px;
  height: 100%;
  width: 100%;
`;

const TitleBlock = styled.div`
  margin-top: .875rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const LabelBlock = styled.div`
  margin-top: .25rem;

  display: flex;
  align-items: center;
`;

const LogoToken = styled.img`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  box-shadow: 0px 2px 4px ${({ theme }) => theme.blackOp015};
  align-self: center;
`;

const Title = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 1.25rem;
  line-height: 1.75rem;
  color: ${({ theme }) => theme.black}
`;

const Label = styled.p`
  margin: 0;
  margin-left: .5rem;
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  color: ${({ theme }) => theme.gray}
`;

const BidBlock = styled.div`
  margin-top: .875rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  & > div {
    display: flex;
    flex-direction: column;
  }
  & > div:last-child {
    align-items: flex-end;
  }
  & > div:first-child {
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

const BidLabel = styled.p`
  margin-top: .375rem;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.black}
`;

const Footer = styled.div<{ isShowingHelpBlock?: boolean }>`
  min-height: 28px;
  display: flex;
  justify-content: ${({ isShowingHelpBlock }) => (isShowingHelpBlock ? 'space-between' : 'flex-end')};
  margin-top: 1rem;
`;

const ArrowContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ClaimWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 223px;
  padding: 0 .5rem;
  background-color: ${({ theme }) => theme.pinkBgFooter};
  border-radius: 4px;
  width: 100%;

  color: ${({ theme }) => theme.black};
  font-style: normal;
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
`;

const Circle = styled.div`
  margin-right: .5rem;
  width: 8px;
  height: 8px;
  background-color: ${({ theme }) => theme.pinkCircle};
  border-radius: 50%;
`;

export default {
  Container,
  ImageContainer,
  TitleBlock,
  LabelBlock,
  Title,
  LogoToken,
  Label,
  BidBlock,
  BidTitle,
  BidLabel,
  Footer,
  ArrowContainer,

  ClaimWrapper,
  Circle,
};
