import Big from 'big.js';

const BASE = 10;
Big.RM = Big.roundDown;
Big.DP = 30;

export const formatTokenAmount = (value: string, decimals = 18, precision?: number): string => value
  && Big(value).div(Big(BASE).pow(decimals)).toFixed(precision && precision);

export const parseTokenAmount = (value: string, decimals = 18): string => value
  && Big(value).times(Big(BASE).pow(decimals)).toFixed(0);
