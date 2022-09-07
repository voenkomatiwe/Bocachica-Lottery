import styled, { keyframes } from 'styled-components';

import { ReactComponent as LoadingComponent } from 'assets/images/loading.svg';

const Image = styled.img`
  height: 100vh;
  max-width: 296px;
  max-height: 296px;
  border-radius: 4px;
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Loading = styled(LoadingComponent)`
  width: 2.5rem;
  height: 2.5rem;
  align-self: center;
  animation: ${spin} 1s linear infinite;
  & > circle {
    opacity: .25;
  }
  & > path {
    opacity: .75;
  }
`;

export default {
  Image,
  Loading,
};
