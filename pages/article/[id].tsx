import React from 'react';
import Link from 'next/link';
import { Avatar } from 'antd';
import { format } from 'date-fns';
import MarkDown from 'markdown-to-jsx';

import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import { useStore } from 'store';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { IArticle } from 'pages/api';

interface IProps {
  article: IArticle;
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const AppDataSource = await connectToDatabase();
  const ArticleRepository = AppDataSource.getRepository(Article);
  const article = await ArticleRepository.findOne({
    where: { id: articleId },
    relations: ['user'],
  });

  if (article) {
    article.views += 1;
    await ArticleRepository.save(article);
  }

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
    },
  };
}

// 文章详情页
const ArticleInfo: NextPage<IProps> = (props) => {
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const { article } = props;
  const {
    user: { nickname, avatar, id },
  } = article;

  return (
    <div>
      <div className="contentLayout">
        <h2 className={styles.title}>{article?.title}</h2>
        <div className={styles.user}>
          <Avatar src={avatar} size={50} />
          <div className={styles.info}>
            <div className={styles.name}>{nickname}</div>
            <div className={styles.date}>
              <div>
                {format(new Date(article?.update_time), 'yyyy-MM-dd hh:mm:ss')}
              </div>
              <div>阅读 {article?.views}</div>
              {Number(loginUserInfo?.userId) === Number(id) && (
                <Link href={`/editor/${article?.id}`}>编辑</Link>
              )}
            </div>
          </div>
        </div>
        <MarkDown className={styles.markdown}>{article?.content}</MarkDown>
      </div>
    </div>
  );
};

export default ArticleInfo;
