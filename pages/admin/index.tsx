import Image from 'next/image'
import { Button, Form, Input, message } from 'antd';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';


const AdminPage: NextPage = () => {
    const { push } = useRouter();
    const onFinish = (values: any) => {
        if (values.username === 'admin' && values.password === 'admin') {
            message.success('登录成功')
            push('/admin/home');
        } else {
            message.error('用户名或密码错误')
        }
    };

    return (
        <div className={styles.loginArea}>
            <div className={styles.formArea}>

                <div className={styles.headerArea}>
                    <Image src='/images/logo.png' width='40px' height='40px' alt='BLOG' />
                    <span>Blog 后台管理</span>
                </div>

                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="用户名"
                        name="username"
                        rules={[{ required: true, message: '请输入用户名!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="密码"
                        name="password"
                        rules={[{ required: true, message: '请输入密码!' }]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>

        </div>

    )
};

// @ts-ignore
AdminPage.layout = null;

export default AdminPage;

