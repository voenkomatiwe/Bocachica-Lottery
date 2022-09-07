import { ACCOUNT_TRIM_LENGTH } from 'shared/constant';

export const trimString = (isSmallDimension: boolean, string: string): string => {
  const strLength = string.length;
  if (!isSmallDimension || strLength < 17) return string;
  const leftPartStr = string.substring(0, 8);
  const rightPartStr = string.substring(strLength - 8, strLength);
  return `${leftPartStr}...${rightPartStr}`;
};

export const strToNumber = (str: string) => Number(str);
export const lowerCaseExceptFirst = (str: string) => str.charAt(0) + str.slice(1).toLowerCase();

export const trimAccountId = (accountId: string, isMobile?: boolean) => {
  if (accountId.length > 20) {
    return `${accountId.slice(0, ACCOUNT_TRIM_LENGTH)}...`;
  }
  return (isMobile ? `${accountId.slice(0, ACCOUNT_TRIM_LENGTH)}...` : accountId);
};

function onlyNumbers(str: string) {
  return /^[0-9]+$/.test(str);
}

export const getSaleIdByURL = (pathName: string) => {
  const strWithoutFirstChar = pathName.substring(1);
  const isOnlyNumbers = onlyNumbers(strWithoutFirstChar);
  if (!isOnlyNumbers) return null;

  const match = (strWithoutFirstChar).match(/\d+/g);
  if (!match) return null;
  const id = match[0];
  return id;
};
