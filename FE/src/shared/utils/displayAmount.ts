import Big from 'big.js';

import { formatTokenAmount } from './formatAmount';

export const removeTrailingZeros = (amount: string) => {
  if (amount.includes('.') || amount.includes(',')) {
    return amount.replace(/\.?0*$/, '');
  }
  return amount;
};

export const displayBid = (amount: string, decimals?: number) => {
  const formateAmount = formatTokenAmount(amount, decimals || 0);
  const amountBig = new Big(formateAmount);
  if (amountBig.eq('0')) return '-';
  if (amountBig.lte('0.01')) return '>0.01';
  return `${removeTrailingZeros(amountBig.toFixed(3))}`;
};

export const displayBalance = (amount: string, decimals: number) => {
  const formateAmount = formatTokenAmount(amount, decimals);
  const amountBig = new Big(formateAmount);
  if (amountBig.eq('0')) return '-';
  if (amountBig.lte('0.0001')) return '>0.0001';
  return `${removeTrailingZeros(amountBig.toFixed(3))}`;
};
