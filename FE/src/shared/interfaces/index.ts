import { ITranslationKeys } from 'services/translation';
import { EFilterByParticipation, EFilterByResult, EFilterByStatus } from 'shared/utils';
import { EStatus } from 'shared/utils/statusLocales';

export interface ITimeLeft {
  id: number,
  value: string,
}
export enum ESocial {
  Medium,
  Telegram,
  Twitter,
}
export interface ISocials {
  value: string | null;
  type: ESocial;
}

export interface IBurgerMenu {
  title: ITranslationKeys,
  logo: React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  link: string,
}

export interface IGetTimeAndStatus {
  calcDate: ITimeLeft[],
  calcStatus: EStatus,
}

export interface IBidArray {
  title: ITranslationKeys,
  value: string,
}

export interface INftDataArray {
  title: ITranslationKeys,
  value: string,
  onClick?: () => void,
  show: boolean,
}

export interface IBalanceArray {
  title: ITranslationKeys;
  value: string;
}

export enum EImage {
  JPEG = 'JPEG',
  JPG = 'JPG',
  PNG = 'PNG',
  SVG = 'SVG',
  GIF = 'GIF',
}

export interface IClaimProps {
  title: ITranslationKeys;
  additionalTitle?: ITranslationKeys;
  label: ITranslationKeys;
  titleButton: ITranslationKeys | string;
}

export interface IFilter {
  filterByStatus: EFilterByStatus,
  filterByParticipation: EFilterByParticipation,
  filterByResult: EFilterByResult,
}

export enum ETypeButton {
  PLACE_BID,
  BUY_TICKET,
  WINNER_TICKET,
}

export enum EInputHelperText {
  LOCKED_AMOUNT,
  LOW_BID,
  LOW_BALANCE,
}
