import styled from 'styled-components';

const Container = styled.div<{ minWidth?: number }>`
  display: flex;
  align-items: center;
  min-width: ${({ minWidth }) => (minWidth ? `${minWidth}px` : '100%')};
  min-height: 28px;
  padding-left: .5rem;
  background-color: ${({ theme }) => theme.grayOp01};
  border-radius: 4px;
  justify-content: space-between;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.gray};
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
`;

const TimeBlock = styled.div`
  min-width: 120px;
  display: flex;
  & > div:last-child {
    & > div:last-child {
      display: none;
    }
  }
`;

const Time = styled.div`
  display: flex;
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
`;

const Dots = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  margin: 0 .25rem;
  ::before {
    content: '';
    width: 2px;
    height: 2px;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.gray};
  }
  ::after {
    bottom: 0;
    content: '';
    width: 2px;
    height: 2px;
    border-radius: 50px;
    background-color: ${({ theme }) => theme.gray};
  }
`;

export default {
  Container,
  Title,
  TimeBlock,
  Time,
  Dots,
};
