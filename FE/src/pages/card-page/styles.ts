import styled from 'styled-components';

import { ReactComponent as CloseIcon } from 'assets/images/icons/close.svg';
import { ReactComponent as LinkIcon } from 'assets/images/icons/external-link.svg';
import { ReactComponent as Share } from 'assets/images/icons/share.svg';

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
`;

const CloseContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  width: 32px;
  height: 32px;
  background-color: ${({ theme }) => theme.grayOp06};
  border-radius: 50%;
  margin: .5rem 0;
  cursor: pointer;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    position: sticky;
    top: 16px;
    z-index: 2;
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
  display: flex;
  justify-content: center;
  max-width: 296px;
  max-height: 296px;
  height: 100%;
  width: 100%;
`;

const AuctionDataContainer = styled.div`
  max-width: 346px;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    max-width: 100%;
  `}
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
  flex: 1;
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

const ShareIcon = styled(Share)`
  margin-right: 1.125rem;
  color: ${({ theme }) => theme.gray};
  cursor: pointer;
`;

const BidBlock = styled.div`
  margin-top: .875rem;
  margin-bottom: 1.75rem;
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

const TemplateTitle = styled.p`
  margin: 0;

  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
  color: ${({ theme }) => theme.gray}
`;

const TemplateLabel = styled.p`
  margin-top: .375rem;
  margin-bottom: 0;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  color: ${({ theme }) => theme.black}
`;

const WrapperButtons = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: flex-end;
  & > button {
    height: 100vh;
    width: 100%;
    & > svg {
      width: 24px;
      height: 24px;
      margin-right: .5rem;
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1rem;
  `}
`;

const NftData = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  grid-row-gap: 2rem;
  margin: 3rem 1.5rem;
  & > div {
    display: flex;
    flex-direction: column;
  }
  & > div:nth-child(even) {
    align-items: flex-end;
  }
`;

const Description = styled.p`
  margin: 0 1.5rem 2rem;
  font-weight: 400;
  font-size: .875rem;
  line-height: 1.25rem;
  color: ${({ theme }) => theme.cardDescription};
`;

const ClaimContainer = styled.div`
  height: 100%;
  display: flex;
  align-items: flex-end;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 1rem;
  `}
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 0 1.5rem 1rem;
`;

const ProjectLink = styled.a`
  display: flex;
  align-items: center;
  cursor: pointer;
  text-decoration: none;
  & > p {
    margin: 0 1rem 0 0;
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.188rem;
    color: ${({ theme }) => theme.pink};

    ${({ theme }) => theme.mediaWidth.upToSmall`
      margin: 0 .5rem 0 0;
    `}
  }
  & > svg {
    width: 100%;
    max-width: 24px;
  }
`;

export default {
  Container,
  CloseContainer,
  CloseIcon,
  MainContainer,
  ImageContainer,
  AuctionDataContainer,
  TitleBlock,
  LabelBlock,
  LogoToken,
  Title,
  Label,
  ShareIcon,
  BidBlock,
  TemplateTitle,
  TemplateLabel,
  WrapperButtons,
  NftData,
  Description,
  ClaimContainer,
  Footer,
  ProjectLink,
  LinkIcon,
};
