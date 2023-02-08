import Link from 'next/link';
import { useEffect, useState } from 'react';

import request from 'service/fetch';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { ITag } from 'pages/tag';

const Classification: NextPage = () => {
    const [allTags, setAllTags] = useState<ITag[]>([]);
    useEffect(() => {
        request.get('/api/tag/get').then((res: any) => {
            if (res?.code === 0) {
                const { allTags = [] } = res?.data || {};
                setAllTags(allTags)
                console.log(allTags)
            }
        });
    }, [])


    return (
        <div className={styles.classification}>
            {allTags.map((item) => (
                <Link href={`/tag/${item.id}`} key={item.id}>{item.title}</Link>
            ))}
        </div>
    );
};

export default Classification;
