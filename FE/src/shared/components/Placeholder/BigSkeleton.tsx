import styled from 'styled-components';

import { PLACEHOLDERS_DESC, PLACEHOLDERS_NFT_DATA_ARRAY } from 'shared/constant';

const Container = styled.div`
  display: flex;
  align-self: center;
  flex-direction: column;
  max-width: 690px;
  max-height: 1100px;
  width: 100%;
  background-color: ${({ theme }) => theme.white};
  border-radius: 16px;
  box-shadow: 0px 4px 8px -4px ${({ theme }) => theme.boxShadowCard};
  margin-top: 2.25rem;
  padding: 0 .5rem;
  position: relative;
`;

const CloseContainer = styled.div`
  align-self: flex-end;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 50%;
  margin: .5rem 0;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    display: none;
  `}
`;

const MainContainer = styled.div`
  display: flex;
  justify-content: space-between;
  max-height: 296px;
  height: 100vh;
  width: 100%;
  padding: 0 .5rem;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    max-height: 600px;
    align-items: center;
    margin-top: 1rem;
    height: 100%;
  `}
`;

const ImageContainer = styled.div`
  max-width: 296px;
  max-height: 296px;
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
`;

const AuctionDataContainer = styled.div`
  max-width: 346px;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1.375rem;
    max-width: 100%;
  `}
`;

const TitleBlock = styled.div`
  margin-top: 1.5rem;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.placeholder};
  max-width: 129px;
  max-height: 12px;
  height: 100%;
  width: 100%;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0;
    height: 100vh;
  `}
`;

const LabelBlock = styled.div`
  margin-top: .75rem;
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
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 8px;
  `}
`;

const BidTitle = styled.div`
  margin-top: 1.25rem;
  max-width: 43px;
  max-height: 8px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 8px;
  `}
`;

const BidLabel = styled.div`
  margin-top: .75rem;
  max-width: 78px;
  max-height: 12px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: 12px;
  `}
`;

const WrapperButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: 100%;
  width: 100%;
  align-items: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1rem;
  `}
`;

const TimestampBlock = styled.div`
  margin-top: 1.75rem;
  max-width:  346px;
  max-height: 28px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 100%;
    height: 28px;
  `}
`;

const BidButton = styled.div`
  max-width:  346px;
  max-height: 48px;
  height: 100%;
  width: 100%;
  background-color: ${({ theme }) => theme.placeholder};
  border-radius: 4px;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 100%;
    height: 48px;
  `}
`;

const NftData = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 2rem;
  margin: 3rem 1.5rem 0;
  & > div {
    display: flex;
    flex-direction: column;
    & > div:first-child {
      margin-bottom: .75rem;
    }
  }
  & > div:nth-child(even) {
    align-items: flex-end;
  }
`;

const Description = styled.div`
  display: flex;
  flex-direction: column;
  margin: 3rem 1.5rem 2rem;
  & > div {
    margin: .5rem 0;
  }
`;

const Row = styled.div<{ width?: string, height?: string }>`
  background-color: ${({ theme }) => theme.placeholder};
  width: ${({ width }) => width};
  height: ${({ height }) => height};
  border-radius: 4px;
`;

export default function BigSkeleton() {
  return (
    <Container>
      <CloseContainer />
      <MainContainer>
        <ImageContainer />
        <AuctionDataContainer>

          <TitleBlock />

          <LabelBlock>
            <LogoToken />
            <Label />
          </LabelBlock>
          <BidTitle />
          <BidLabel />
          <TimestampBlock />
          <WrapperButtons>
            <BidButton />
          </WrapperButtons>
        </AuctionDataContainer>
      </MainContainer>

      <NftData>
        {PLACEHOLDERS_NFT_DATA_ARRAY.map((row, index) => (
          <div key={`row-index-${row + index}`}>
            <Row
              width="43px"
              height="8px"
            />
            <Row
              width="78px"
              height="12px"
            />
          </div>
        ))}
      </NftData>

      <Description>
        {
          PLACEHOLDERS_DESC.map((row, index) => (
            <Row
              key={`row-index-${row + index}`}
              width={row}
              height="8px"
            />
          ))
        }
      </Description>
    </Container>
  );
}
