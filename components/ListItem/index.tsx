import React from 'react';
import Link from 'next/link';
import { Avatar, Button, message, Popconfirm } from 'antd';
import { EyeOutlined, MessageOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import zhCN from 'date-fns/locale/zh-CN';
import markdownToTxt from 'markdown-to-txt';

import { useStore } from 'store';
import request from 'service/fetch';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { IArticle } from 'pages/api';
import Highlight from 'components/Highlight';

interface IProps {
  article: IArticle;
  isUserHome?: boolean;
  successDeleteHooks?: Function;
  keyword?: string
}

const ListItem: NextPage<IProps> = (props) => {
  const store = useStore();
  const loginUserInfo = store?.user?.userInfo;
  const { article, isUserHome = false, successDeleteHooks, keyword = '🀎🀎🀎♾' } = props;
  const { user, tags = [], comments = [] } = article;

  const handleDelete = async (id: number, e: React.MouseEvent<HTMLElement, MouseEvent> | undefined,) => {
    e?.preventDefault();
    const res = await request.delete(`/api/article/remove`, {
      data: { id }
    });
    successDeleteHooks?.(id);
    message.success(res.msg || '删除成功')
  }

  return (
    <Link href={`/article/${article.id}`}>
      <div className={styles.container}>
        <div className={styles.article}>

          <div className={styles.userInfo}>
            <span className={styles.name}>{user?.nickname}</span>
            <span className={styles.date}>
              {formatDistanceToNow(new Date(article?.create_time), { locale: zhCN })}前
            </span>
            {tags.length !== 0 && tags.map(tag => <Link href={`/tag/${tag.id}`} key={tag.id}>{tag.title}</Link>)}
          </div>

          <h4 className={styles.title}><Highlight text={article?.title} search={keyword} /> </h4>

          <p className={styles.content}>{markdownToTxt(article?.content)}</p>

          <div className={styles.statistics}>
            <EyeOutlined />
            <span className={styles.item}>{article?.views}</span>
            <MessageOutlined className={styles.comment} />
            <span className={styles.item}>{comments.length}</span>

            {isUserHome && Number(loginUserInfo.userId) === Number(user.id) &&
              <Popconfirm
                title="确定要删除此文章?"
                onConfirm={(e) => handleDelete(article.id, e)}
                onCancel={(e) => e?.preventDefault()}
                okText="确定"
                cancelText="取消"
              >
                <Button type='link'>删除</Button>
              </Popconfirm>
            }
          </div>
        </div>
        <Avatar src={user?.avatar} size={48} />
      </div>
    </Link >
  );
};

export default ListItem;
