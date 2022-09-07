import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';

import { DataProvider } from 'providers/DataProvider';
import { WalletProvider } from 'providers/NearWalletProvider';
import { ServiceProvider } from 'providers/ServiceProvider';
import AppRoutes from 'routes';
import { ModalProvider } from 'shared/providers/ModalProvider';
import theme from 'shared/theme';
import 'react-toastify/dist/ReactToastify.css';

import './services/translation';
import './index.css';

function AppWrapper() {
  return (
    <ThemeProvider theme={theme}>
      <ModalProvider>
        <WalletProvider>
          <ServiceProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </ServiceProvider>
        </WalletProvider>
      </ModalProvider>
    </ThemeProvider>
  );
}

createRoot(
  document.getElementById('root')!,
).render(<AppWrapper />);
