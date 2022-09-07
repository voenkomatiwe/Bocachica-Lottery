import styled from 'styled-components';

const Container = styled.div<{ isOpen?: boolean }>`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  z-index: ${({ isOpen }) => (isOpen ? '10' : '0')};
  min-height: 100vh;
  min-width: 100vw;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  background-color: ${({ theme }) => theme.black};
  justify-content: flex-end;
  align-items: flex-start;
  padding-left: 2rem;
  padding-bottom: 3.188rem;
  & > div:last-child {
    margin-top: 5.25rem;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Row = styled.a`
  cursor: pointer;
  text-decoration: none;
  color: ${({ theme }) => theme.white};
  display: flex;
  align-items: center;
  margin-bottom: 2.375rem;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
  & > svg {
    margin-right: .875rem;
  }
`;

const Line = styled.div`
  width: 312px;
  height: 1px;
  background: ${({ theme }) => theme.grayLine};
  opacity: 0.4;
  margin-bottom: 2.375rem;
`;

export default {
  Container,
  Column,
  Row,
  Line,
};
