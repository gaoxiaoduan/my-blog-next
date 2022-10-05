import React, { useState } from 'react';
import Link from 'next/link';
import { Avatar, Button, Divider, Input, message } from 'antd';
import { format } from 'date-fns';
import MarkDown from 'markdown-to-jsx';
import { observer } from 'mobx-react-lite';

import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import { useStore } from 'store';
import request from 'service/fetch';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { IArticle, IComment } from 'pages/api';

interface IArticleExpand extends IArticle {
  comments: IComment[] | any[];
}
interface IProps {
  article: IArticleExpand;
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const AppDataSource = await connectToDatabase();
  const ArticleRepository = AppDataSource.getRepository(Article);
  const article = await ArticleRepository.findOne({
    where: { id: articleId },
    relations: ['user', 'comments', 'comments.user'],
    order: {
      comments: {
        create_time: 'DESC',
      },
    },
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
  const [inputVal, setInputVal] = useState('');
  const [comments, setComments] = useState(article?.comments || []);

  const handleComment = async () => {
    const res = await request.post('/api/comment/publish', {
      articleId: article?.id,
      content: inputVal,
    });
    if (res.code !== 0) return message.error(res.msg || '未知错误');
    const newComments = [
      {
        id: Math.floor(Math.random() * 10000),
        create_time: new Date(),
        update_time: new Date(),
        content: inputVal,
        user: {
          avatar: loginUserInfo?.avatar,
          nickname: loginUserInfo?.nickname,
        },
      },
    ].concat([...comments]);
    setComments(newComments);
    setInputVal('');
    console.log('res::', res);
    message.success('发表成功');
  };

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
                {format(new Date(article?.update_time), 'yyyy-MM-dd HH:mm')}
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

      <div className={styles.divider}></div>

      <div className="contentLayout">
        <div className={styles.comment}>
          <h3>评论</h3>
          {loginUserInfo?.userId && (
            <div className={styles.enter}>
              <Avatar src={avatar} size={40} />
              <div className={styles.content}>
                <Input.TextArea
                  placeholder="请输入评论"
                  maxLength={200}
                  rows={3}
                  value={inputVal}
                  onChange={(event) => setInputVal(event?.target?.value)}
                />
                <Button type="primary" onClick={handleComment}>
                  发表评论
                </Button>
              </div>
            </div>
          )}
          <Divider />
          <div className={styles.display}>
            {comments?.map((comment: any) => (
              <div className={styles.wrapper} key={comment?.id}>
                <Avatar src={comment?.user?.avatar} size={40} />
                <div className={styles.info}>
                  <div className={styles.name}>
                    <div>{comment?.user?.nickname}</div>
                    <div className={styles.date}>
                      {format(
                        new Date(comment?.update_time),
                        'yyyy-MM-dd HH:mm'
                      )}
                    </div>
                  </div>
                  <div className={styles.content}>{comment?.content}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(ArticleInfo);
