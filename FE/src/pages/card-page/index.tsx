import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useData } from 'providers/DataProvider';
import { getToken, retrieveTicketsFromAuction } from 'providers/helpers';
import { ETypeClaim, IAuction } from 'providers/interfaces';
import { useWalletData } from 'providers/NearWalletProvider';
import { useService } from 'providers/ServiceProvider';
import { APP_ROUTES } from 'routes/constant';
import { FungibleTokenContract } from 'services/contracts';
import useTransactionHash from 'services/helpers/receiptsService';
import { EAuctionType } from 'services/interfaces';
import Button from 'shared/components/Buttons/Button';
import Claim from 'shared/components/Claim';
import NFTMedia from 'shared/components/NFTMedia';
import BigSkeleton from 'shared/components/Placeholder/BigSkeleton';
import Status from 'shared/components/Status';
import Timestamp from 'shared/components/Timestamp';
import Translate from 'shared/components/Translate';
import {
  UPDATE_AUCTION_INTERVAL, EDimensions, ZERO, DEFAULT_PAGE_LIMIT,
} from 'shared/constant';
import useDateAndStatus from 'shared/hooks/useDateAndStatus';
import useImageDataUpload from 'shared/hooks/useImageDataUpload';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { ETypeButton } from 'shared/interfaces';
import { EModals } from 'shared/providers/interfaces';
import { useModalStore } from 'shared/providers/ModalProvider';
import {
  EStatus,
  formatAuction,
  getAuctionData,
  nftData,
  StatusTimeLocales,
  checkAuctionShouldUpdate,
  copy,
} from 'shared/utils';

import Footer from './Footer';
import styles from './styles';

export default function CardPage(): JSX.Element {
  const { modal } = useModalStore();
  const { wallet, isSignedIn, accountId } = useWalletData();
  const { lotteryContract, buyTicket, claimNFT } = useService();
  const {
    auctions,
    loading,
    nfts,
    tokens,
    getTokenBalance,
  } = useData();
  const url = new URL(window.location.href);
  const { id } = useParams();
  const navigate = useNavigate();
  const [auction, setAuction] = useState<IAuction | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [token, setToken] = useState<FungibleTokenContract | null>(null);

  useTransactionHash(url.search, wallet, auction, tokens);
  const { timeLeft, status } = useDateAndStatus(
    auction?.startDate || 0,
    auction?.endDate || 0,
    auction?.status,
  );
  const dimension = useWindowDimensions();

  useEffect(() => {
    if (id && auctions[id] && (!auction || auction !== auctions[id])) {
      setAuction(auctions[id]);
    }
  }, [id, loading]);

  useEffect(() => {
    if (!token && auction) {
      const depositToken = getToken(auction.depositTokenId, tokens);
      setToken(depositToken);
    }
    if (!balance && auction) {
      const tokenBalance = getTokenBalance(auction.depositTokenId);
      setBalance(tokenBalance);
    }
    const updateData = async () => {
      const shouldUpdate = checkAuctionShouldUpdate(auction, status);
      if (!token || !auction || !shouldUpdate) return;
      try {
        if (!lotteryContract) return;
        const updatedAuction = await lotteryContract.getAuction(auction.id);
        if (!updatedAuction) return;
        const totalTickets = await lotteryContract.getNumTickets(auction.id);
        let newBalance = balance;
        let ticketIdAndUserArray: [string, string][] | undefined;
        if (isSignedIn) {
          if (auction.auctionType === EAuctionType.Lottery) {
            const lotteryPages = totalTickets ? Math.ceil(totalTickets / DEFAULT_PAGE_LIMIT) : 0;
            ticketIdAndUserArray = await retrieveTicketsFromAuction(
              auction.id,
              lotteryPages,
              lotteryContract,
            );
          }
          const retrievedBalance = await token.getBalanceOf({ accountId }) || '0';
          newBalance = retrievedBalance;
        }
        const newUpdatedAuction = formatAuction(updatedAuction, ticketIdAndUserArray);
        if (newUpdatedAuction.totalTickets === auction.totalTickets
          && newUpdatedAuction.typeClaim === auction.typeClaim
          && newBalance === balance
        ) return;
        setBalance(newBalance);
        setAuction(newUpdatedAuction);
        if (modal !== EModals.DEPOSIT_MODAL) return;
        buyTicket(balance || ZERO, newUpdatedAuction, token);
      } catch (e){
        console.warn(`Error: ${e} while update auction data`);
      }
    };
    const interval = setInterval(updateData, UPDATE_AUCTION_INTERVAL);
    return () => clearInterval(interval);
  }, [auction, lotteryContract, wallet, modal, isSignedIn, token, balance, accountId, status]);

  const auctionData = useMemo(() => getAuctionData(auction, nfts, token), [auction, nfts, token]);
  const {
    media, isLoading, typeImage,
  } = useImageDataUpload(auctionData?.nft.metadata.media, auctionData?.nft.metadata.mime_type);
  const handleConfirm = useCallback(() => {
    if (!auction || !token) return;
    if (auction.typeClaim === ETypeClaim.CLAIM) claimNFT(auction.id);
  }, [auction, token]);

  if (loading || !auction || !auctionData) return <BigSkeleton />;

  const typeButton = auction.auctionType === EAuctionType.Lottery ? ETypeButton.BUY_TICKET : ETypeButton.PLACE_BID;
  const nftDataArray = nftData(
    dimension,
    auctionData.contractNft,
    auctionData.nft,
    auctionData.token,
    auction.auctionMinStep,
    auction.auctionType,
    auction.auctionStep,
  );

  return (
    <styles.Container>
      <styles.CloseContainer onClick={() => {
        setAuction(null);
        navigate(APP_ROUTES.HOME);
      }}
      >
        <styles.CloseIcon />
      </styles.CloseContainer>
      <styles.MainContainer>
        <styles.ImageContainer>
          <NFTMedia
            media={media}
            isLoading={isLoading}
          />
        </styles.ImageContainer>
        <styles.AuctionDataContainer>

          <styles.TitleBlock>
            <styles.Title>{auctionData.nft.metadata.title}</styles.Title>
            <styles.ShareIcon onClick={() => copy(window.location.href)} />
            <Status type={status} />
          </styles.TitleBlock>

          <styles.LabelBlock>
            <styles.LogoToken src={auctionData.token.metadata.icon} alt="deposit token logo" />
            <styles.Label>
              {auctionData.token.metadata.symbol}
              {' '}
              &bull;
              {' '}
              {typeImage}
            </styles.Label>
          </styles.LabelBlock>

          {
            !auctionData.availableClaim && (
              <styles.BidBlock>
                {
                      auctionData.bidArray.map(({ title, value }) => (
                        <div key={title}>
                          <styles.TemplateTitle>
                            <Translate value={title} />
                          </styles.TemplateTitle>
                          <styles.TemplateLabel>
                            {value}
                          </styles.TemplateLabel>
                        </div>
                      ))
                    }
              </styles.BidBlock>
            )
          }

          {
            status === EStatus.Ended && (
            <>
              <Timestamp
                title={StatusTimeLocales[status]}
                minWidth={dimension === EDimensions.SMALL ? undefined : 346}
                date={timeLeft}
              />
              <styles.WrapperButtons>
                <Button
                  typeButton={typeButton}
                  // disabled={status !== EStatus.Open}
                  handleConfirm={() => {
                    if (auction.auctionType === EAuctionType.Auction) {
                    // todo: placeBid
                    } else {
                      buyTicket(balance || ZERO, auction, auctionData.token);
                    }
                  }}
                />
              </styles.WrapperButtons>
            </>
            )
          }

          {
            status === EStatus.Ended && auctionData.availableClaim && auctionData.claimProps && (
            <styles.ClaimContainer>
              <Claim
                titleBid={auctionData.titleBid}
                handleConfirm={handleConfirm}
                typeClaim={auction.typeClaim}
                {...auctionData.claimProps}
              />
            </styles.ClaimContainer>
            )
          }

        </styles.AuctionDataContainer>
      </styles.MainContainer>

      <styles.NftData>
        {nftDataArray.map(({ title, value, onClick }) => (
          <div key={title}>
            <styles.TemplateTitle>
              <Translate value={title} />
            </styles.TemplateTitle>
            <styles.TemplateLabel onClick={onClick}>
              {value}
            </styles.TemplateLabel>
          </div>
        ))}
      </styles.NftData>
      {auctionData.nft.metadata.description && (
        <styles.Description>{auctionData.nft.metadata.description}</styles.Description>
      )}

      <Footer
        socials={auctionData.socials}
        projectLink={auctionData.projectLink}
      />
    </styles.Container>
  );
}
