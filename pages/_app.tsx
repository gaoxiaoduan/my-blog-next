import App from 'next/app';
import Layout from 'components/Layout';
import { StoreProvider } from 'store';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

interface IProps extends AppProps {
  initialValue: any;
}

function MyApp({ Component, pageProps, initialValue }: IProps) {
  const renderLayout = () => {
    // @ts-ignore
    if (Component?.layout === null) {
      return <Component {...pageProps} />;
    } else {
      return (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      );
    }
  };
  return (
    <StoreProvider initialValue={initialValue}>{renderLayout()}</StoreProvider>
  );
}

MyApp.getInitialProps = async (appContext: any) => {
  const userInfo = appContext?.ctx?.req?.cookies || {};
  const appProps = await App.getInitialProps(appContext);

  return {
    ...appProps,
    initialValue: {
      user: {
        userInfo,
      },
    },
  };
};

export default MyApp;
