import React, { useEffect, useState } from 'react';
import { Card, Col, Divider, Empty, Row, Statistic } from 'antd';
import { UserOutlined, LoadingOutlined, FileTextOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';

import request from 'service/fetch'
import styles from './index.module.scss';
import type { NextPage } from 'next';

const initCountData = [
    {
        title: '用户数量',
        value: 0,
        prefix: <UserOutlined />
    }, {
        title: '文章数量',
        value: 0,
        prefix: <FileTextOutlined />
    },
    {
        title: '浏览数量',
        value: 0,
        prefix: <EyeOutlined />
    },
    {
        title: '评论数量',
        value: 0,
        prefix: <CommentOutlined />
    }
]

const Home: NextPage = () => {
    const [countData, setCountData] = useState<any[]>(initCountData)

    useEffect(() => { getList() }, [])

    const getList = async () => {
        const { data: userList } = await request.get('/api/user/getList');
        const { data: articleList } = await request.get('/api/article/getList');
        const { data: commentList } = await request.get('/api/comment/getList');
        const views = articleList.reduce((prev: any, cur: { views: any; }) => prev += cur.views, 0)
        countData[0].value = userList.length;
        countData[1].value = articleList.length;
        countData[2].value = views;
        countData[3].value = commentList.length;
        setCountData([...countData])
    }


    return (
        <div>
            <h1 className={styles.header}>
                <span>欢迎:admin</span>
            </h1>


            <Divider dashed />

            <Row justify="space-around">
                {
                    countData.map(item => <Col span={5} key={item.title}>
                        <Card>
                            <Statistic title={item.title || '-'} value={item.value || 0} prefix={item.prefix || <LoadingOutlined />} />
                        </Card>
                    </Col>)
                }
            </Row>

            <Divider dashed />

            <Empty style={{ height: "300px", marginTop: '50px' }} image='/images/Home.png' description='欢迎来到工作台～' />
        </div>
    );
};

// @ts-ignore
Home.layout = 'admin';
export default Home;
