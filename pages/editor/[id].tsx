import { ChangeEvent, useEffect, useState } from 'react';
import { Button, Input, message, Select } from 'antd';
import { useRouter } from 'next/router';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

import request from 'service/fetch';
import { Article } from 'db/entity';
import { connectToDatabase } from 'db';

import styles from './index.module.scss';
import type { NextPage } from 'next';
import type { IArticle, ITag } from 'pages/api';

interface IArticleExpand extends IArticle {
  tags: ITag[];
}
interface IProps {
  article: IArticleExpand;
  articleId: number;
}

export async function getServerSideProps({ params }: { params: any }) {
  const articleId = params?.id;
  const AppDataSource = await connectToDatabase();
  const ArticleRepository = AppDataSource.getRepository(Article);
  const article = await ArticleRepository.findOne({
    where: { id: articleId },
    relations: ['user', 'tags'],
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
  const [tagIds, setTagIds] = useState(article?.tags?.map((i) => i.id) || []);
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
    await request.post('/api/article/update', {
      id: articleId,
      title,
      content,
      tagIds,
    });
    articleId ? push(`/article/${articleId}`) : push('/');
    message.success('更新成功', 1);
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
          value={tagIds}
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
ModifyEditor.layout = null;

export default ModifyEditor;
