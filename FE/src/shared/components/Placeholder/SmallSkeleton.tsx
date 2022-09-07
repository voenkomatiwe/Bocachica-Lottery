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
`;

const ImageContainer = styled.div`
  max-width: 296px;
  max-height: 296px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
`;

const TitleBlock = styled.div`
  margin-top: 1.25rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.placeholder};
  max-width: 129px;
  max-height: 12px;
  height: 100%;
  width: 100%;
`;

const LabelBlock = styled.div`
  margin-top: .25rem;
  display: flex;
  align-items: center;
`;

const LogoToken = styled.div`
  width: 24px;
  height: 24px;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 50%;
`;

const Label = styled.div`
  margin-left: .5rem;
  max-width: 63px;
  max-height: 8px;
  height: 100%;
  width: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.placeholder};
`;

const BidTitle = styled.div`
  margin-top: .875rem;
  max-width: 43px;
  max-height: 8px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
`;

const BidLabel = styled.div`
  margin-top: .375rem;
  max-width: 78px;
  max-height: 12px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
`;

const Footer = styled.div`
  margin-top: 1rem;
  display: flex;
  max-width: 223px;
  min-height: 28px;
  width: 100%;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.placeholder};
`;

export default function SmallSkeleton() {
  return (
    <Container>
      <ImageContainer />
      <TitleBlock />
      <LabelBlock>
        <LogoToken />
        <Label />
      </LabelBlock>
      <BidTitle />
      <BidLabel />
      <Footer />
    </Container>
  );
}
