import styled from 'styled-components';

const Toggle = styled.button<{ isOpen?: boolean }>`
  transition: none;
  display: inline-flex;
  flex-direction: column;
  justify-content: space-around;
  height: 21px;
  width: 50px;
  background: transparent;
  border: none;
  cursor: pointer;
  z-index: 10;
  overflow: hidden;
  padding: 0;

  &:focus {
    outline: none;
  }

  div {
    border-radius: 10px;
    transition: width 200ms ease-out, height 0.3s linear, transform 0.3s linear, opacity 300ms linear;
    position: relative;
    transform-origin: 1px;
    min-height: 7px;

    span {
      background: ${({ theme }) => theme.white};
      height: 2px;
      display: block;
      margin: .125rem 0;
      border-radius: 5px;
    }

    :first-child {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(45deg)' : 'rotate(0)')};
      width: ${({ isOpen }) => (isOpen ? '22px' : '20px')};
    }

    :nth-child(2) {
      width: ${({ isOpen }) => (isOpen ? '0' : '20px')};
    }

    :nth-child(3) {
      transform: ${({ isOpen }) => (isOpen ? 'rotate(-45deg)' : 'rotate(0)')};
      width: ${({ isOpen }) => (isOpen ? '22px' : '20px')};
    }
  }
`;

export default {
  Toggle,
};
