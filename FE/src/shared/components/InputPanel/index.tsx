import Big from 'big.js';
import { useCallback } from 'react';

import { FungibleTokenContract } from 'services/contracts';
import { EAuctionType } from 'services/interfaces';
import Input from 'shared/components/Input';
import { DEFAULT_MIN_STEP, ZERO } from 'shared/constant';
import { formatTokenAmount } from 'shared/utils';
import { displayBalance } from 'shared/utils/displayAmount';

import Translate from '../Translate';
import styles from './styles';

export default function InputPanel({
  token,
  value,
  setValue,
  balance,
  auctionMinStep,
  auctionType,
}:
{
  token: FungibleTokenContract,
  value: string,
  setValue: (value: string) => void,
  balance: string,
  auctionMinStep?: string | null,
  auctionType: EAuctionType,
}) {
  const minusValue = useCallback(() => {
    if (Big(value || ZERO).lte(ZERO)) return;
    const formatMinStep = auctionMinStep
      ? formatTokenAmount(auctionMinStep, token.metadata.decimals)
      : DEFAULT_MIN_STEP;
    const subtraction = Big(value || ZERO).sub(formatMinStep).toFixed();
    if (Big(subtraction).lte(ZERO)) {
      setValue(ZERO);
      return;
    }
    setValue(subtraction);
  }, [auctionMinStep, setValue, token.metadata.decimals, value]);

  const plusValue = useCallback(() => {
    const formatMinStep = auctionMinStep
      ? formatTokenAmount(auctionMinStep, token.metadata.decimals)
      : DEFAULT_MIN_STEP;
    const sum = Big(value || ZERO).add(formatMinStep).toFixed();
    setValue(sum);
  }, [auctionMinStep, setValue, token.metadata.decimals, value]);

  return (
    <styles.Container>
      <styles.InputLabel>
        <styles.WalletInformation>
          <styles.LogoWallet />
          {displayBalance(balance, token.metadata.decimals)}
        </styles.WalletInformation>
      </styles.InputLabel>
      <styles.InputWrapper>
        <styles.Minus onClick={minusValue} />
        <styles.InputContainer>
          {auctionType === EAuctionType.Auction && (
            <styles.LogoToken src={token.metadata.icon} alt={token.metadata.symbol} />
          )}
          <Input
            value={value}
            setValue={setValue}
          />
          <styles.TokenContainer>
            {auctionType === EAuctionType.Auction
              ? token.metadata.symbol
              : <Translate value="lottery.ticket" />}
          </styles.TokenContainer>
        </styles.InputContainer>
        <styles.Plus onClick={plusValue} />
      </styles.InputWrapper>
    </styles.Container>
  );
}
