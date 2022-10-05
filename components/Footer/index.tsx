import styles from './index.module.scss';
import type { NextPage } from 'next';

const Footer: NextPage = () => {
  return (
    <div className={styles.footer}>
      <p>Blog - Next.js</p>
    </div>
  );
};

export default Footer;
