export { default as getAuctionData } from './auctionData';
export { default as getClaimProps } from './getClaimProps';
export { default as formatAuction } from './formatAuction';
export { default as getTypeClaim } from './getTypeClaim';
export { default as getImageFileExtensions } from './imageFileExtensions';
export { default as getAuctionBySearch } from './getAuctionBySearch';
export { default as checkAuctionShouldUpdate } from './checkAuctionShouldUpdate';
export { default as copy } from './copy';
export * from './getInputHelperText';
export * from './getBidDetailsArray';
export * from './burgerMenuLists';
export * from './displayAmount';
export * from './filterAuctions';
export * from './formatAmount';
export * from './getTimeAndStatus';
export * from './socialLinks';
export * from './statusLocales';
export * from './stringOperation';

export function isNotNullOrUndefined<T extends Object>(input: null | undefined | T): input is T {
  return input != null;
}

export function onlyUniqueValues(values: string[]) {
  return Array.from(new Set(values));
}

export const toArray = (map: { [key: string]: any }) => Object.values(map);
export const toMap = (array: any[]) => array.reduce((acc, item) => ({ ...acc, [item.id]: item }), {});

export const inputRegex = RegExp('^\\d*(?:\\\\[.])?\\d*$');

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const enforcer = (
  target: HTMLInputElement,
  setValue: (value: string) => void,
) => {
  const nextUserInput = target.value.replace(/,/g, '.');
  if (nextUserInput[0] === '.' || nextUserInput[0] === ',') {
    return setValue(`0${nextUserInput}`);
  }
  if (nextUserInput === '' || inputRegex.test(escapeRegExp(nextUserInput))) {
    setValue(nextUserInput);
  }
  return null;
};
