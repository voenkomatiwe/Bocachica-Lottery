import styled from 'styled-components';

import Translate from 'shared/components/Translate';

const Container = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
  margin-top: 3rem;
  & > p {
    display: flex;
    justify-content: center;
    flex: 1;
    font-weight: 400;
    font-size: .75rem;
    color: ${({ theme }) => theme.gray};
    margin: 0;
  }
`;

export default function Footer(): JSX.Element {
  const year = new Date().getUTCFullYear();
  return (
    <Container>
      <p><Translate value="footer.launchpad" /></p>
      <p><Translate value="footer.copyright" dynamicValue={year.toString()} /></p>
    </Container>
  );
}
