import App from 'next/app';
import Layout from 'components/Layout';
import AdminLayout from 'components/Layout/AdminLayout';
import ErrorBoundary from 'components/ErrorBoundary';
import { StoreProvider } from 'store';
import type { AppProps } from 'next/app';
import '../styles/globals.css';

interface IProps extends AppProps {
  initialValue: any;
}

function MyApp({ Component, pageProps, initialValue }: IProps) {
  const renderLayout = () => {

    // @ts-ignore
    switch (Component?.layout) {
      case null: {
        return <Component {...pageProps} />;
      }
      case "admin": {
        return (
          <AdminLayout>
            <Component {...pageProps} />
          </AdminLayout>
        )
      }
      default: {
        return (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        );
      }
    }
  };

  return (
    <ErrorBoundary>
      <StoreProvider initialValue={initialValue}>
        {renderLayout()}
      </StoreProvider>
    </ErrorBoundary>
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
