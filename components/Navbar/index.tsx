import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Menu, MenuProps, message } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';

import Login from 'components/Login';
import { useStore } from 'store';
import request from 'service/fetch';
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

  const handleLoginOut = async () => {
    const res = await request.post('/api/user/loginOut');
    if (res.code === 0) {
      store.user.setUserInfo({});
      message.success(res.msg || '退出成功');
    } else message.error(res.msg || '未知错误');
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'loginOut':
        handleLoginOut();
        break;
      default:
        break;
    }
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

export default observer(Navbar);
