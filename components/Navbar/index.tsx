import { useState } from 'react';
import Image from 'next/image'
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar, Button, Dropdown, Input, Menu, MenuProps, message, Popover } from 'antd';
import { HomeOutlined, LoginOutlined } from '@ant-design/icons';
import { observer } from 'mobx-react-lite';

import Login from 'components/Login';
import { useStore } from 'store';
import request from 'service/fetch';
import styles from './index.module.scss';
import type { NextPage } from 'next';
import { navs } from './config';
import Classification from 'components/Classification';
const { Search } = Input;

const Navbar: NextPage = () => {
  const { pathname, push } = useRouter();
  const [isShowLogin, setIsShowLogin] = useState(false);
  const store = useStore();
  const { userId, avatar } = store.user.userInfo;

  const handleGotoEditorPage = () => {
    if (userId) {
      // 跳转编辑页
      push('/editor/new');
    } else {
      message.warning('请先登录～');
    }
  };

  const handleLogin = () => {
    setIsShowLogin(true);
  };

  const handleClose = () => {
    setIsShowLogin(false);
  };

  const handleLoginOut = async () => {
    const res = await request.post('/api/user/loginOut');
    store.user.setUserInfo({});
    message.success(res.msg || '退出成功');
  };

  const onSearch = async (value: string) => {
    const title = value.trim();
    if (title === '') return;
    push(`/search?title=${title}`)
  }

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    switch (e.key) {
      case 'personalPage':
        // 跳转个人主页
        push(`/user/${userId}`);
        break;
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
          key: 'personalPage',
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
      <section className={styles.logoArea} onClick={() => push('/')}>
        <Image src='/images/logo.png' width='40px' height='40px' alt='BLOG' />
      </section>
      <section className={styles.linkArea}>
        {navs.map((nav) => (
          <Link key={nav.label} href={nav.value}>
            <a className={pathname === nav.value ? styles.active : ''}>
              {nav.label}
            </a>
          </Link>
        ))}

        <Popover trigger="hover" content={<Classification />}>
          <a>分类</a>
        </Popover>
      </section>

      <section className={styles.searchArea}>
        <Search placeholder="请输入搜索关键字" onSearch={onSearch} />
      </section>

      <section className={styles.operationArea}>
        <Button onClick={handleGotoEditorPage}>写文章</Button>
        {userId ? (
          <Dropdown overlay={renderMenu} placement="bottom" arrow>
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
