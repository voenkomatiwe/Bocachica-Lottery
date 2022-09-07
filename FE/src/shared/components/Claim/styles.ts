import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${({ theme }) => theme.pinkOp01};
  border-radius: 16px;
  padding: 1rem;
  max-height: 196px;
  width: 100%;
`;

const Title = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.375rem;
  text-align: center;
`;

const AdditionalTitle = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.375rem;
`;

const Label = styled.p`
  margin: 1rem 0 .375rem;
  color: ${({ theme }) => theme.gray};
  font-weight: 500;
  font-size: .75rem;
  line-height: .938rem;
`;

const Amount = styled.p`
  margin: 0;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.black};
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.188rem;
`;

const Footer = styled.div`
  display: flex;
  width: 100%;
  & > button {
    width: 100%;
    height: 100vh;
  }
`;

export default {
  Container,
  Title,
  AdditionalTitle,
  Label,
  Amount,
  Footer,
};
