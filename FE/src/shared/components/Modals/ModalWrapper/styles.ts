import styled from 'styled-components';

const BackgroundLayout = styled.div`
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: ${({ theme }) => theme.black};
  opacity: 0.4;
`;

const Modal = styled.div<{ isCentered?: boolean, isFullWidth?: boolean, isFullHeight?: boolean, }>`
  max-height: 85vh;
  height: ${({ isFullHeight }) => (isFullHeight ? '100vh' : 'auto')};
  overflow: auto;
  z-index: 200;
  position: fixed;
  display: flex;
  flex-direction: column;
  min-width: ${({ isFullWidth }) => (isFullWidth ? '100%' : '328px')};
  background: ${({ theme }) => theme.white};
  color: ${({ theme }) => theme.black};
  box-shadow: 0px 4px 8px -4px ${({ theme }) => theme.boxShadowCard};
  border-radius: ${({ isFullWidth }) => (isFullWidth ? '16px 16px 0 0' : '16px')};
  padding: 1rem;
  top: ${({ isCentered }) => (isCentered ? '50%' : '100%')};
  left: 50%;
  transform: ${({ isCentered }) => (
    isCentered ? 'translate(-50%, -50%)' : 'translate(-50%, -100%)'
  )};
`;

export default {
  BackgroundLayout,
  Modal,
};
