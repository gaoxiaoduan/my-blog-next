
import React from 'react';
import { Divider, Empty } from 'antd';
import * as ANTD_ICONS from '@ant-design/icons';

import ListItem from 'components/ListItem';
import { Tag } from 'db/entity';
import { connectToDatabase } from 'db';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { ITag } from 'pages/api';

interface IProps {
    tags: ITag;
}

export async function getServerSideProps({ params }: { params: any }) {
    const tagId = params?.id;
    const AppDataSource = await connectToDatabase();
    const TagRepository = AppDataSource.getRepository(Tag);
    const tags = await TagRepository.findOne({
        where: { id: tagId },
        relations: ['articles', "articles.user"]
    })
    return {
        props: {
            tags: JSON.parse(JSON.stringify(tags)) || {},
        },
    };
}

// 文章详情页
const TagInfo: NextPage<IProps> = (props) => {
    const tags = props.tags;
    const articles = tags.articles;

    return (
        <div className={styles.tagInfo}>
            <div className={styles.tagTitleBox}>
                {/* @ts-ignore */}
                <div>{ANTD_ICONS[tags.icon]?.render()}</div>
                <h1>{tags.title || '-'}</h1>
                <div>{tags.follow_count || 0} 关注, {tags.article_count || 0} 文章</div>
            </div>
            <div className={styles.tagInfoListBox}>
                {articles?.length === 0 ? <Empty description='当前标签下暂无文章' /> : articles?.map((article) => (
                    <React.Fragment key={article.id}>
                        <ListItem article={article} />
                        <Divider />
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default TagInfo;
