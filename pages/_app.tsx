import type { AppProps } from 'next/app';
import Layout from 'components/Layout';
import { StoreProvider } from 'store';
import '../styles/globals.css';

interface IProps extends AppProps {
  initialValue: any;
}

function MyApp({ Component, pageProps, initialValue }: IProps) {
  return (
    <StoreProvider initialValue={initialValue}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </StoreProvider>
  );
}

MyApp.getInitialProps = async ({ ctx }: any) => {
  const userInfo = ctx?.req?.cookies || {};
  return {
    initialValue: {
      user: {
        userInfo,
      },
    },
  };
};

export default MyApp;
