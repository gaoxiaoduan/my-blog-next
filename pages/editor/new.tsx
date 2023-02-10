import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import { useRouter } from 'next/router';
import { observer } from 'mobx-react-lite';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import { useStore } from 'store';
import request from 'service/fetch';

import styles from './index.module.scss';
import type { NextPage } from 'next';

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

const NewEditor: NextPage = () => {
  const store = useStore();
  const { userId } = store.user.userInfo;
  const { push, back } = useRouter();
  const [content, setContent] = useState('Hello World');
  const [title, setTitle] = useState('');
  const [tagIds, setTagIds] = useState([]);
  const [allTags, setAllTags] = useState([]);

  useEffect(() => {
    request.get('/api/tag/get').then((res: any) => {
      setAllTags(res?.data?.allTags || []);
    });
  }, []);

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e?.target?.value);
  };

  const handlePublish = async () => {
    if (!title) return message.warning('请输入文章标题～');
    if (tagIds.length === 0) return message.warning('请选择标签～')
    await request.post('/api/article/publish', {
      title,
      content,
      tagIds,
    });
    userId ? push(`/user/${userId}`) : push('/');
    message.success('发布成功', 1);
  };

  const handleContentChange = (value: any) => {
    setContent(value);
  };

  return (
    <div className={styles.container}>
      <div className={styles.operation}>
        <Input
          className={styles.title}
          placeholder="请输入文章标题"
          value={title}
          onChange={handleTitleChange}
        />
        <Select
          className={styles.tag}
          mode="multiple"
          maxTagCount='responsive'
          allowClear
          placeholder="请选择标签"
          onChange={setTagIds}
        >
          {allTags?.map((tag: any) => (
            <Select.Option key={tag?.id} value={tag?.id}>
              {tag?.title}
            </Select.Option>
          ))}
        </Select>
        <Button
          className={styles.button}
          type="primary"
          onClick={handlePublish}
        >
          发布
        </Button>
        <Button className={styles.goBack} type="primary" onClick={back}>
          返回
        </Button>
      </div>
      <MDEditor
        value={content}
        height={660}
        maxHeight={800}
        onChange={handleContentChange}
      />
    </div>
  );
};

// @ts-ignore
NewEditor.layout = null;

export default observer(NewEditor);
