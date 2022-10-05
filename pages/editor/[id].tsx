import { ChangeEvent, useState } from 'react';
import { Button, Input, message } from 'antd';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import request from 'service/fetch';
import { Article } from 'db/entity';
import { connectToDatabase } from 'db';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { IArticle } from 'pages/api';

interface IProps {
  article: IArticle;
  articleId: number;
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const AppDataSource = await connectToDatabase();
  const ArticleRepository = AppDataSource.getRepository(Article);
  const article = await ArticleRepository.findOne({
    where: { id: articleId },
    relations: ['user'],
  });

  return {
    props: {
      article: JSON.parse(JSON.stringify(article)) || {},
      articleId,
    },
  };
}

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

// 编辑文章
const ModifyEditor: NextPage<IProps> = (props) => {
  const { article, articleId } = props;
  const { push, back } = useRouter();
  const [content, setContent] = useState(article.content || '');
  const [title, setTitle] = useState(article.title || '');

  const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTitle(e?.target?.value);
  };

  const handlePublish = async () => {
    if (!title) return message.warning('请输入文章标题～');
    const res = await request.post('/api/article/update', {
      id: articleId,
      title,
      content,
    });
    if (res.code !== 0) return message.error(res.msg || '未知错误');
    articleId ? push(`/article/${articleId}`) : push('/');
    message.success('更新成功');
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
ModifyEditor.layout = null;

export default ModifyEditor;
