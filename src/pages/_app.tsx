import '@/styles/globals.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primeicons/primeicons.css';

import type { AppProps } from 'next/app';
import { Roboto } from 'next/font/google';
import { appWithTranslation } from 'next-i18next';
import { PrimeReactProvider } from 'primereact/api';
import { QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import { AuthProvider } from '@/components/common/Auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import FooterWrapper from '@/footers';
import LayoutWrapper from '@/layouts';
import queryClient from '@/lib/react-query-client'; // Importa el QueryClient
import { wrapper } from '@/store/wrapper';

const robotoFont = Roboto({
  subsets: ['latin'],
  weight: ['100', '300', '400', '500', '700', '900'],
});

const App = ({ Component, ...rest }: AppProps) => {
  const { props, store } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <AuthProvider>
        <PrimeReactProvider>
          <QueryClientProvider client={queryClient}>
            <LayoutWrapper>
              <FooterWrapper>
                <>
                  <main className={robotoFont.className}>
                    <Component {...pageProps} />
                  </main>
                  <Toaster />
                </>
              </FooterWrapper>
            </LayoutWrapper>
          </QueryClientProvider>
        </PrimeReactProvider>
      </AuthProvider>
    </Provider>
  );
};

export default appWithTranslation(App);
