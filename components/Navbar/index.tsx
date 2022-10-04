import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu, MenuProps } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';

import Login from 'components/Login';
import { useStore } from 'store';
import styles from './index.module.scss';
import type { NextPage } from 'next';
import { navs } from './config';

const Navbar: NextPage = () => {
  const { pathname } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const handleGotoEditorPage = () => {};

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
  };

  const renderMenu = (
    <Menu
      onClick={handleMenuClick}
      items={[
        {
          key: 'home',
          label: '个人主页',
          icon: <HomeOutlined />,
        },
        {
          key: 'loginOut',
          label: '退出系统',
          icon: <LoginOutlined />,
        },
      ]}
    />
  );

  return (
    <div className={styles.navbar}>
      <section className={styles.logoArea}>BLOG</section>
      <section className={styles.linkArea}>
        {navs.map((nav) => (
          <Link key={nav.label} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav.label}
            </a>
          </Link>
        ))}
      </section>
      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <Dropdown overlay={renderMenu} placement="bottomCenter" arrow>
            <Avatar src={avatar} size={32} />
          </Dropdown>
        ) : (
          <Button type="primary" onClick={handleLogin}>
            登录
          </Button>
        )}
      </section>
      {isShowLogin && <Login isShow={isShowLogin} onClose={handleClose} />}
    </div>
  );
};

export default Navbar;
