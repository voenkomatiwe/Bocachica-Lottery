import Big from 'big.js';
import { useState } from 'react';

import { IAuction } from 'providers/interfaces';
import getConfig from 'services/config';
import { FungibleTokenContract } from 'services/contracts';
import { checkInvalidAmount } from 'shared/calculation';
import Buttons from 'shared/components/Buttons';
import InputPanel from 'shared/components/InputPanel';
import ModalWrapper from 'shared/components/Modals/ModalWrapper';
import Translate from 'shared/components/Translate';
import { EDimensions, ZERO } from 'shared/constant';
import useWindowDimensions from 'shared/hooks/useWindowDimensions';
import { EInputHelperText } from 'shared/interfaces';
import { getHelperTextForPlaceBid, parseTokenAmount } from 'shared/utils';
import { getBidDetailsArray, getCurrentBid, increaseValueArray } from 'shared/utils/getBidDetailsArray';

import HelperText from './HelperText';
import styles from './styles';

const config = getConfig();
export interface IDepositModal {
  handleConfirm: (amount: string) => void;
  closeModal: () => void;
  token: FungibleTokenContract;
  balance: string;
  isSignedIn: boolean;
  auction: IAuction;
}

export default function DepositModal({
  closeModal,
  handleConfirm,
  token,
  balance,
  isSignedIn,
  auction,
}: IDepositModal): JSX.Element{
  const dimension = useWindowDimensions();
  const [bidAmount, setBidAmount] = useState<string>('');

  const increaseArr = increaseValueArray(token.metadata.symbol);
  const currentBid = getCurrentBid(auction.initialPrice, auction.winnerBid);
  const amountForBid = Big(currentBid).add(auction.auctionMinStep || ZERO).toFixed();
  const parseBidAmount = parseTokenAmount(bidAmount || ZERO, token.metadata.decimals);
  const currentUserBid = auction.userData?.amount || ZERO;

  const bidArray = getBidDetailsArray({
    currentBid,
    minMarkup: auction.auctionMinStep,
    yourBid: auction.userData?.amount,
    token,
    auctionType: auction.auctionType,
  });

  const addBid = (value: number) => {
    const newAmount = Big(value).add(bidAmount || ZERO).toFixed();
    setBidAmount(newAmount);
  };

  const invalidInput = checkInvalidAmount(balance, token, bidAmount, currentUserBid);
  const canPlaceBid = !!bidAmount && isSignedIn && (Big(parseBidAmount).gte(amountForBid));
  const helper = getHelperTextForPlaceBid(currentBid, parseBidAmount, balance, auction.auctionMinStep, currentUserBid);

  return (
    <ModalWrapper
      closeModal={closeModal}
      isCentered={dimension !== EDimensions.SMALL}
      isFullWidth={dimension === EDimensions.SMALL}
    >
      <styles.Header>
        <p><Translate value="modals.yourBid" /></p>
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
        value={bidAmount}
        setValue={setBidAmount}
        balance={balance}
        auctionMinStep={auction.auctionMinStep}
        auctionType={auction.auctionType}
      />
      <HelperText
        helper={helper}
        bidAmount={bidAmount}
        tokenSymbol={token.metadata.symbol}
      />
      <styles.Footer>
        {
          helper === EInputHelperText.LOW_BALANCE
            ? (
              <Buttons.Secondary
                onClick={() => {
                  const url = `https://${config.dexUrl}/swap`;
                  window.open(url, '_blank', 'noopener noreferrer');
                }}
              >
                <Translate
                  value="action.buyOrDeposit"
                  dynamicValue={token.metadata.symbol}
                />
                <styles.ArrowRight />
              </Buttons.Secondary>
            )
            : (
              <Buttons.Primary
                disabled={!canPlaceBid || invalidInput}
                onClick={() => handleConfirm(bidAmount)}
              >
                <Translate value="action.bid" />
              </Buttons.Primary>
            )
        }

      </styles.Footer>
    </ModalWrapper>
  );
}
