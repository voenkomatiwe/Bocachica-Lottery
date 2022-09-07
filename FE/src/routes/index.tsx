import { useState } from 'react';
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';

import bg from 'assets/images/background.svg';
import CardPage from 'pages/card-page';
import HomePage from 'pages/home-page';
import BurgerMenu from 'shared/components/BurgerMenu';
import Footer from 'shared/components/Footer';
import Header from 'shared/components/Header';

import { APP_ROUTES } from './constant';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-image: url(${bg});
  background-position: center 5.25rem;
  background-repeat: no-repeat;
  ${({ theme }) => theme.mediaWidth.upToSmall`
    background-size: 44rem;
  `}
`;

const Pages = styled.div<{ isOpened?: boolean }>`
  flex: 1;
  display: ${({ isOpened }) => (isOpened ? 'none' : 'flex')};
  flex-direction: column;
  position: relative;
  max-width: 100vw;
  z-index: 1;
`;

export default function AppRoutes(): JSX.Element {
  const [isOpened, setIsOpened] = useState<boolean>(false);
  return (
    <Router>
      <Container>
        <Background />
        <BurgerMenu isOpened={isOpened} />
        <Header isOpened={isOpened} setIsOpened={setIsOpened} />
        <Pages isOpened={isOpened}>
          <Routes>
            <Route path={APP_ROUTES.HOME} element={<HomePage />} />
            <Route path={APP_ROUTES.CARD_BY_ID} element={<CardPage />} />
            <Route path={APP_ROUTES.DEFAULT} element={<Navigate replace to={APP_ROUTES.HOME} />} />
          </Routes>
        </Pages>
        <Footer />
        <ToastContainer />
      </Container>
    </Router>
  );
}
