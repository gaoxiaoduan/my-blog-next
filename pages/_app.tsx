import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { StoreProvider } from 'store';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <StoreProvider initialValue={{}}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

export default MyApp;
