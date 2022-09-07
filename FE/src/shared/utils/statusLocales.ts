import { ITranslationKeys } from 'services/translation';

export enum EStatus {
  Open,
  Soon,
  Ended,
}

export const StatusLocales: { [key: number]: ITranslationKeys } = {
  [EStatus.Open]: 'status.open',
  [EStatus.Soon]: 'status.soon',
  [EStatus.Ended]: 'status.ended',
};

export const StatusTimeLocales: { [key: number]: ITranslationKeys } = {
  [EStatus.Open]: 'status.endsIn',
  [EStatus.Soon]: 'status.leftToStart',
};
