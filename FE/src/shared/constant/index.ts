import { toTGas } from 'shared/calculation/index';
import { EFilterByParticipation, EFilterByResult, EFilterByStatus } from 'shared/utils';

export const ZERO = '0';

export const ONE_SECOND = 1000;
export const UPDATE_AUCTION_INTERVAL = 3 * ONE_SECOND;
export const MICRO_SECOND = 1000 * ONE_SECOND;
export const ONE_MINUTE = 60 * ONE_SECOND;

export const NEAR_TOKEN_ID = 'near';
export const ONE_YOCTO_NEAR = '0.000000000000000000000001';
export const FT_GAS = '180000000000000';
export const STORAGE_TO_REGISTER_FT = '0.1';
export const STORAGE_TO_REGISTER_WNEAR = '0.00125';
export const DEFAULT_PAGE_LIMIT = 100;
export const NEAR_DECIMALS = 24;
export const DECIMALS_DEFAULT_VALUE = 0;
export const ICON_DEFAULT_VALUE = '';
export const GAS_JOIN = toTGas('30');
export const SAMPLE_GAS = toTGas('41');

export enum EDimensions {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE',
  EXTRA_LARGE = 'EXTRA_LARGE',
  UNKNOWN = 'UNKNOWN',
}

export const MEDIA_WIDTHS = {
  upToSmall: 600,
  upToMedium: 768,
  upToLarge: 1280,
};

export const INCREASE_VALUES = [1, 5, 10];

export const numberPlaceholderCard = Array.from(Array(5).keys());
export const PLACEHOLDERS_NFT_DATA_ARRAY = Array.from(Array(4).keys());
export const PLACEHOLDERS_DESC = ['100%', '100%', '100%', '40%'];

export const initialFilter = {
  filterByStatus: EFilterByStatus.ALL,
  filterByParticipation: EFilterByParticipation.ALL,
  filterByResult: EFilterByResult.ALL,
};

export const INITIAL_VALUE = '';
export const ACCOUNT_TRIM_LENGTH = 10;
export const DEFAULT_MIN_STEP = '1';
