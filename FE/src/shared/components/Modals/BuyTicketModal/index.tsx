import Big from 'big.js';
import { useCallback, useState } from 'react';

import { IAuction } from 'providers/interfaces';
import { FungibleTokenContract } from 'services/contracts';
import Buttons from 'shared/components/Buttons';
import InputPanel from 'shared/components/InputPanel';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';
import { EDimensions, ZERO } from 'shared/constant';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { formatTokenAmount, getHelperTextForBuyTicket } from 'shared/utils';
import { getBidDetailsArray, getCurrentBid, increaseValueArray } from 'shared/utils/getBidDetailsArray';

import HelperText from './HelperText';
import styles from './styles';

export interface IBuyTicketModal {
  handleConfirm: (amount: string | null) => void;
  closeModal: () => void;
  token: FungibleTokenContract;
  balance: string;
  isSignedIn: boolean;
  auction: IAuction;
}

export default function BuyTicketModal({
  closeModal,
  handleConfirm,
  token,
  balance,
  isSignedIn,
  auction,
}: IBuyTicketModal): JSX.Element{
  const dimension = useWindowDimensions();
  const currentBid = getCurrentBid(auction.initialPrice, auction.winnerBid);
  const [ticketAmount, setTicketAmount] = useState<string>('');

  const increaseArr = increaseValueArray('Ticket');
  const bidArray = getBidDetailsArray({
    currentBid,
    tickerPrice: auction.auctionStep,
    yourBid: auction.userData?.amount,
    token,
    auctionType: auction.auctionType,
  });
  const validBalance = !Big(balance).eq(ZERO) && Big(balance).gte(auction.auctionStep || ZERO);
  const canBuyTicket = !!ticketAmount && isSignedIn && validBalance;
  const formatAuctionStep = formatTokenAmount(auction.auctionStep || ZERO, token.metadata.decimals);

  const helper = getHelperTextForBuyTicket(ticketAmount, balance, formatAuctionStep);
  const addBid = (value: number) => {
    const newAmount = Big(value).add(ticketAmount || ZERO).toFixed();
    setTicketAmount(newAmount);
  };

  const buyTicket = useCallback(() => {
    const formattedAuctionStep = formatTokenAmount(auction.auctionStep || ZERO, token.metadata.decimals);
    const priceTicket = Big(formattedAuctionStep).mul(ticketAmount).toFixed();
    handleConfirm(priceTicket);
  }, [auction.auctionStep, handleConfirm, ticketAmount, token.metadata.decimals]);
  return (
    <ModalWrapper
      closeModal={closeModal}
      isCentered={dimension !== EDimensions.SMALL}
      isFullWidth={dimension === EDimensions.SMALL}
    >
      <styles.Header>
        <p><Translate value="modals.yourPurchase" /></p>
        <styles.Close onClick={closeModal}>
          <styles.CloseIcon />
        </styles.Close>
      </styles.Header>

      <styles.BidWrapper>
        {
          bidArray.map(({ title, value }) => (
            <div key={title}>
              <styles.BidTitle>
                <Translate value={title} />
              </styles.BidTitle>
              <styles.Bid>
                {value}
              </styles.Bid>
            </div>
          ))
        }
      </styles.BidWrapper>

      <styles.BidIncreaseWrapper>
        {increaseArr.map(({ title, value }) => (
          <styles.IncreaseBtn key={title} onClick={() => addBid(value)}>
            {title}
          </styles.IncreaseBtn>
        ))}
      </styles.BidIncreaseWrapper>
      <InputPanel
        token={token}
        value={ticketAmount}
        setValue={setTicketAmount}
        balance={balance}
        auctionType={auction.auctionType}
      />
      <HelperText
        helper={helper}
        totalTicket={auction.totalTickets || 0}
        yourTicket={auction.userTicket || 0}
        ticketAmount={ticketAmount}
        auctionStep={formatAuctionStep}
        tokenSymbol={token.metadata.symbol}
      />

      <styles.Footer>
        <Buttons.Primary
          disabled={!canBuyTicket}
          onClick={buyTicket}
        >
          <Translate value="action.buyTicket" />
        </Buttons.Primary>
        {!validBalance && (
          <styles.HelperText>
            <styles.ErrorIcon />
            <Translate value="helperText.lowBalance" />
          </styles.HelperText>
        )}
      </styles.Footer>
    </ModalWrapper>
  );
}
