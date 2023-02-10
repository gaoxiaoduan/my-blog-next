import React, { useState } from 'react';

import Image from 'next/image';
import { Layout, Menu, MenuProps } from 'antd';
import { CommentOutlined, FileTextOutlined, SmileOutlined, UserOutlined } from '@ant-design/icons';

import type { NextPage } from 'next';
import { useRouter } from 'next/router';
const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[],
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}

const items: MenuItem[] = [
    getItem('欢迎', '/admin/home', <SmileOutlined />),
    getItem('用户管理', '/admin/user', <UserOutlined />),
    getItem('文章管理', '/admin/article', <FileTextOutlined />),
    getItem('评论管理', '/admin/comment', <CommentOutlined />),
];

interface IProps {
    children: React.ReactNode;
}

const AdminLayout: NextPage<IProps> = ({ children }) => {
    const [collapsed, setCollapsed] = useState(false);
    const { pathname, push } = useRouter();
    const handleMenuClink: MenuProps['onClick'] = e => push(e.key);

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider collapsible collapsed={collapsed} onCollapse={value => setCollapsed(value)}>
                <Image src='/images/logo.png' width='40px' height='40px' alt='BLOG' />
                <Menu theme="dark" onClick={handleMenuClink} defaultSelectedKeys={[pathname]} mode="inline" items={items} />
            </Sider>

            <Layout className="site-layout">
                <Content style={{ margin: '0 16px' }}>
                    <main>{children}</main>
                </Content>
            </Layout>
        </Layout>
    );
};

export default AdminLayout;
