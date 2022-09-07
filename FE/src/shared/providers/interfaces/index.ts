import BuyTicketModal, { IBuyTicketModal } from 'shared/components/Modals/BuyTicketModal';
import DepositModal, { IDepositModal } from 'shared/components/Modals/DepositModal';
import FilterModal, { IFilterModal } from 'shared/components/Modals/FilterModal';
import HighBidModal, { IHighBidModal } from 'shared/components/Modals/HighBidModal';
import SearchModal, { ISearchModal } from 'shared/components/Modals/SearchModal';
import SignOutModal, { ISignOutModal } from 'shared/components/Modals/SignOutModal';
import SuccessfulBidModal, { ISuccessfulBidModal } from 'shared/components/Modals/SuccessfulBidModal';

export enum EModals {
  SIGN_OUT_MODAL = 'SIGN_OUT_MODAL',
  DEPOSIT_MODAL = 'DEPOSIT_MODAL',
  HIGH_BET_MODAL = 'HIGH_BET_MODAL',
  SUCCESSFUL_BID_MODAL = 'SUCCESSFUL_BID_MODAL',
  SEARCH_MODAL = 'SEARCH_MODAL',
  FILTER_MODAL = 'FILTER_MODAL',
  BUY_TICKET_MODAL = 'BUY_TICKET_MODAL',
  EMPTY = 'EMPTY',
}

export type IModalsProps = {
  [EModals.SIGN_OUT_MODAL]: ISignOutModal;
  [EModals.DEPOSIT_MODAL]: IDepositModal;
  [EModals.HIGH_BET_MODAL]: IHighBidModal;
  [EModals.SUCCESSFUL_BID_MODAL]: ISuccessfulBidModal;
  [EModals.SEARCH_MODAL]: ISearchModal;
  [EModals.FILTER_MODAL]: IFilterModal;
  [EModals.BUY_TICKET_MODAL]: IBuyTicketModal;
  [EModals.EMPTY]: any;
};
export type ModalProps<T extends EModals> = Omit<IModalsProps[T], 'closeModal'>;

type IModals = {
  [EModals.SIGN_OUT_MODAL]: React.FC<ISignOutModal>;
  [EModals.DEPOSIT_MODAL]: React.FC<IDepositModal>;
  [EModals.HIGH_BET_MODAL]: React.FC<IHighBidModal>;
  [EModals.SUCCESSFUL_BID_MODAL]: React.FC<ISuccessfulBidModal>;
  [EModals.SEARCH_MODAL]: React.FC<ISearchModal>;
  [EModals.FILTER_MODAL]: React.FC<IFilterModal>;
  [EModals.BUY_TICKET_MODAL]: React.FC<IBuyTicketModal>;
  [EModals.EMPTY]: any;
};

export const MODALS: IModals = {
  [EModals.SIGN_OUT_MODAL]: SignOutModal,
  [EModals.DEPOSIT_MODAL]: DepositModal,
  [EModals.HIGH_BET_MODAL]: HighBidModal,
  [EModals.SUCCESSFUL_BID_MODAL]: SuccessfulBidModal,
  [EModals.SEARCH_MODAL]: SearchModal,
  [EModals.FILTER_MODAL]: FilterModal,
  [EModals.BUY_TICKET_MODAL]: BuyTicketModal,
  [EModals.EMPTY]: null,
};

export type ModalContextType = {
  modal: EModals;
  props: IModalsProps[EModals];
  showModal: <T extends EModals>(modal: T, props: ModalProps<T>) => void;
  closeModal: () => void;
};

export interface IInternalProviderModalState {
  modal: EModals;
  props: IModalsProps[EModals];
}

export const initialModalState: IInternalProviderModalState = {
  modal: EModals.EMPTY,
  props: null,
};
