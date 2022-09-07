import styles from './styles';

interface IModalWrapper {
  children: any,
  closeModal: any,
  isCentered?: boolean,
  isFullWidth?: boolean,
  isFullHeight?: boolean,
}

export default function ModalWrapper({
  children, closeModal, isCentered, isFullWidth, isFullHeight,
}: IModalWrapper): JSX.Element{
  return (
    <>
      <styles.BackgroundLayout onClick={closeModal} />
      <styles.Modal
        isCentered={isCentered}
        isFullWidth={isFullWidth}
        isFullHeight={isFullHeight}
      >
        {children}
      </styles.Modal>
    </>
  );
}
