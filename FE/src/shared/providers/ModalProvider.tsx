import {
  createContext, useCallback, useContext, useMemo, useState,
} from 'react';

import {
  EModals, IInternalProviderModalState, IModalsProps, initialModalState, ModalContextType, ModalProps, MODALS,
} from './interfaces';

const initialModalContextState: ModalContextType = {
  modal: EModals.EMPTY,
  props: null,
  showModal: () => undefined,
  closeModal: () => undefined,
};

const ModalContext = createContext<ModalContextType>(initialModalContextState);

export function ModalProvider({ children }:{ children: JSX.Element }) {
  const [modalState, setModalState] = useState<IInternalProviderModalState>(initialModalState);
  const closeModal = useCallback(() => {
    setModalState(initialModalState);
  }, []);

  const showModal = <T extends EModals>(modal: T, props: ModalProps<T>) => {
    setModalState({ modal, props });
  };

  const Component: IModalsProps[EModals] = MODALS[modalState.modal];

  const modalStore = useMemo(() => ({
    ...modalState,
    showModal,
    closeModal,
  }), [closeModal, modalState]);

  return (
    <ModalContext.Provider value={modalStore}>
      {children}

      {Component && <Component closeModal={closeModal} {...modalState.props} />}
    </ModalContext.Provider>
  );
}

export const useModalStore = () => useContext(ModalContext);
