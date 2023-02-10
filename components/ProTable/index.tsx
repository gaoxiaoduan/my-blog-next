import { Table } from 'antd';

import styles from './index.module.scss';
import type { NextPage } from 'next';


interface IProps {
    title: string;
    tabData: any[];
    columns: any[];
}

const ProTable: NextPage<IProps> = (props) => {
    const { title = '', tabData = [], columns = [] } = props;
    return (
        <div className={styles.proTableWrapper}>
            <div className={styles.title}>
                {title}
            </div>
            <Table dataSource={tabData} columns={columns} rowKey='id' />
        </div>
    );
};

export default ProTable;
