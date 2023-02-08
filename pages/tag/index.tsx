import { useEffect, useState } from 'react';
import { Tabs, Button, message, Empty } from 'antd';
import * as ANTD_ICONS from '@ant-design/icons';
import { observer } from 'mobx-react-lite';

import { useStore } from 'store';
import request from 'service/fetch';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import Link from 'next/link';

interface IUser {
  id: number;
  nickname: string;
  avatar: string;
}

export interface ITag {
  id: number;
  title: string;
  icon: string;
  follow_count: number;
  article_count: number;
  users: IUser[];
}

const Tag: NextPage = () => {
  const store = useStore();
  const { userId } = store?.user?.userInfo || {};
  const [followTags, setFollowTags] = useState<ITag[]>([]);
  const [allTags, setAllTags] = useState<ITag[]>([]);
  const [needRefresh, setNeedRefresh] = useState(false);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      if (res?.code === 0) {
        const { followTags = [], allTags = [] } = res?.data || {};
        setFollowTags(followTags);
        setAllTags(allTags);
      }
    });
  }, [needRefresh]);

  const handleFollow = async (tagId: number) => {
    const res = await request.post('/api/tag/follow', {
      type: 'follow',
      tagId
    })
    if (res.code !== 0) return message.error(res?.msg || '关注失败');
    message.success('关注成功');
    setNeedRefresh(!needRefresh);
  };
  const handleUnFollow = async (tagId: number) => {
    const res = await request.post('/api/tag/follow', {
      type: 'unFollow',
      tagId
    })
    if (res.code !== 0) return message.error(res?.msg || '取关失败');
    message.success('取关成功');
    setNeedRefresh(!needRefresh);
  };

  const renderFollowItem = () => {
    if (followTags.length === 0) {
      return <Empty description='暂无关注标签' />
    }

    return (
      <div className={styles.tags}>
        {followTags?.map((tag) => (
          <div key={tag?.title} className={styles.tagWrapper}>
            <Link href={`/tag/${tag.id}`}>
              <div className={styles.tagLink}>
                {/* @ts-ignore */}
                <div>{ANTD_ICONS[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
              </div>
            </Link>
            <div>
              {tag?.follow_count} 关注 {tag?.article_count} 文章
            </div>
            {tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
              <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                已关注
              </Button>
            ) : (
              <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderAllItem = () => {
    return (
      <div className={styles.tags}>
        {allTags?.map((tag) => (
          <div key={tag?.title} className={styles.tagWrapper}>
            <Link href={`/tag/${tag.id}`}>
              <div className={styles.tagLink}>
                {/* @ts-ignore */}
                <div>{ANTD_ICONS[tag?.icon]?.render()}</div>
                <div className={styles.title}>{tag?.title}</div>
              </div>
            </Link>
            <div>
              {tag?.follow_count} 关注 {tag?.article_count} 文章
            </div>
            {tag?.users?.find((user) => Number(user?.id) === Number(userId)) ? (
              <Button type="primary" onClick={() => handleUnFollow(tag?.id)}>
                已关注
              </Button>
            ) : (
              <Button onClick={() => handleFollow(tag?.id)}>关注</Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="contentLayout">
      <Tabs
        defaultActiveKey="all"
        items={[
          {
            label: '全部标签',
            key: 'all',
            children: renderAllItem(),
          },
          {
            label: '已关注标签',
            key: 'follow',
            children: renderFollowItem(),
          },
        ]}
      ></Tabs>
    </div>
  );
};

export default observer(Tag);
