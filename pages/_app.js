import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import Layout from '../components/layout';
import '../api/i18n';
import '../styles/globals.css';
import ThemeConfig from '../theme';


export default function App({ Component, pageProps }) {

  return (
    <ThemeConfig>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeConfig>
  );
}