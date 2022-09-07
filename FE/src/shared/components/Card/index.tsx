import { useNavigate } from 'react-router-dom';

import { useData } from 'providers/DataProvider';
import { IAuction } from 'providers/interfaces';
import { toAuction } from 'routes/constant';
import NFTMedia from 'shared/components/NFTMedia';
import Status from 'shared/components/Status';
import Translate from 'shared/components/Translate';
import useAuctionDynamicData from 'shared/hooks/useAuctionDynamicData';
import useDateAndStatus from 'shared/hooks/useDateAndStatus';
import useImageDataUpload from 'shared/hooks/useImageDataUpload';
import { getBidDetailsArray, getCurrentBid } from 'shared/utils/getBidDetailsArray';

import Footer from './Footer';
import styles from './styles';

const isShowingMinMarkup = false;

export default function Card({ auction }: { auction: IAuction }): JSX.Element | null {
  const { nfts, tokens } = useData();
  const navigate = useNavigate();
  const { timeLeft, status } = useDateAndStatus(
    auction.startDate,
    auction.endDate,
    auction.status,
  );
  const { winnerBid, yourBid, typeClaim } = useAuctionDynamicData(auction, status);
  const contractNft = nfts[auction.nftContractId] || null;
  const nft = contractNft?.tokenMetadata?.[auction.nftTokenId] || null;
  const token = tokens[auction.depositTokenId] || null;
  const { media, isLoading, typeImage } = useImageDataUpload(nft.metadata.media, nft.metadata.mime_type);

  if (!nft || !token || !contractNft) return null;
  const currentBid = getCurrentBid(auction.initialPrice, winnerBid);

  const bidArray = getBidDetailsArray({
    currentBid,
    yourBid,
    token,
    auctionType: auction.auctionType,
    isShowingMinMarkup,
  });

  return (
    <styles.Container onClick={() => navigate(toAuction(auction.id))}>
      <styles.ImageContainer>
        <NFTMedia
          media={media}
          isLoading={isLoading}
        />
      </styles.ImageContainer>
      <styles.TitleBlock>
        <styles.Title>{nft.metadata.title}</styles.Title>
        <Status type={status} />
      </styles.TitleBlock>

      <styles.LabelBlock>
        <styles.LogoToken src={token.metadata.icon} alt="deposit token logo" />
        <styles.Label>
          {token.metadata.symbol}
          {' '}
          &bull;
          {' '}
          {typeImage}
        </styles.Label>
      </styles.LabelBlock>

      <styles.BidBlock>
        {
          bidArray.map(({ title, value }) => (
            <div key={title}>
              <styles.BidTitle>
                <Translate value={title} />
              </styles.BidTitle>
              <styles.BidLabel>
                {value}
              </styles.BidLabel>
            </div>
          ))
        }
      </styles.BidBlock>
      <Footer
        status={status}
        timeLeft={timeLeft}
        typeClaim={typeClaim}
        refundToken={token.metadata.symbol}
      />
    </styles.Container>
  );
}
