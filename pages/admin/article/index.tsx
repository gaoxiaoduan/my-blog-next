import { useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';
import { format } from 'date-fns';

import ProTable from 'components/ProTable';

import request from 'service/fetch';

import type { NextPage } from 'next';

const Article: NextPage = () => {
    const [tabData, setTableData] = useState<any[]>([]);

    const getTableData = async () => {
        const res = await request.get('/api/article/getList');
        res.data.map((item: any) => {
            item.create_user = item.user.nickname
            return item
        })
        setTableData(res.data)
    }

    useEffect(() => { getTableData() }, [])

    const handleConfirm = async (id: number) => {
        await request.delete('/api/article/remove', { data: { id } })
        message.success('删除成功');
        setTableData(tabData.filter(item => item.id !== id))
    }


    const columns = [
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '创建用户',
            dataIndex: 'create_user',
            key: 'create_user',
            align: 'center',
        },
        {
            title: '阅读量',
            dataIndex: 'views',
            key: 'views',
            width: '80px',
            align: 'center'
        },
        {
            title: '创建时间',
            dataIndex: 'create_time',
            key: 'create_time',
            responsive: ['md'],
            align: 'center',
            render: (_: any, record: { create_time: string | number | Date; }) => {
                return format(new Date(record.create_time), 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '更新时间',
            dataIndex: 'update_time',
            key: 'update_time',
            responsive: ['md'],
            align: 'center',
            render: (_: any, record: { update_time: string | number | Date; }) => {
                return format(new Date(record.update_time), 'yyyy-MM-dd HH:mm:ss')
            }
        },
        {
            title: '操作',
            key: 'action',
            width: '80px',
            align: 'center',
            render: (_: any, record: { id: number; }) => <Popconfirm
                title="确定删除此条数据吗?"
                onConfirm={() => handleConfirm(record.id)}
                okText="确定"
                cancelText="取消"
            >
                <Button type='link'>删除</Button>
            </Popconfirm>
        },
    ];


    return (
        <div>
            <ProTable title='文章管理' tabData={tabData} columns={columns} />
        </div>
    );
};

// @ts-ignore
Article.layout = 'admin';
export default Article;
