import { useEffect, useState } from 'react';
import { Button, message, Popconfirm } from 'antd';

import ProTable from 'components/ProTable';

import request from 'service/fetch';

import type { NextPage } from 'next';

const User: NextPage = () => {
    const [tabData, setTableData] = useState<any[]>([]);

    const getTableData = async () => {
        const res = await request.get('/api/user/getList');
        let data = res.data.map((item: any) => {
            item = { ...item.user, ...item, }
            delete item.user;
            return item
        })
        setTableData(data)
    }

    useEffect(() => { getTableData() }, [])

    const handleConfirm = async (id: number) => {
        await request.delete('/api/user/remove', { data: { id } })
        message.success('删除成功');
        setTableData(tabData.filter(item => item.id !== id))
    }


    const columns = [
        {
            title: '注册类型',
            dataIndex: 'identity_type',
            key: 'identity_type',
            align: 'center',
        },
        {
            title: '注册标识',
            dataIndex: 'identifier',
            key: 'identifier',
            align: 'center',
        },
        {
            title: '用户名',
            dataIndex: 'nickname',
            key: 'nickname',
            align: 'center',
        },
        {
            title: '职业',
            dataIndex: 'job',
            key: 'job',
            align: 'center',
        },
        {
            title: '介绍',
            dataIndex: 'introduce',
            key: 'introduce',
            align: 'center',
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
            <ProTable title='用户管理' tabData={tabData} columns={columns} />
        </div>
    );
};

// @ts-ignore
User.layout = 'admin';
export default User;
