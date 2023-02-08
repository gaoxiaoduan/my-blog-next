import React from 'react';
import { Divider, Empty } from 'antd';
import { Like } from 'typeorm';
import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import type { NextPage } from 'next';
import type { IArticle } from 'pages/api';

interface IProps {
  searchKey: string;
  articles: IArticle[];
}

export async function getServerSideProps({ query }: { query: any }) {
  const { title = '' } = query
  const AppDataSource = await connectToDatabase();
  const articleRepository = AppDataSource.getRepository(Article);

  const articles = await articleRepository.find({
    where: {
      title: Like(`%${title}%`),
    },
    relations: ['user', 'tags', 'comments'],
    order: {
      create_time: 'DESC',
    },
  });

  return {
    props: {
      searchKey: title,
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const ResultItem = ({ article, searchKey }: { article: IArticle, searchKey: string }) => (
  <>
    <ListItem article={article} keyword={searchKey} />
    <Divider />
  </>
);

const Search: NextPage<IProps> = (props) => {
  const { articles, searchKey } = props;

  return (
    <div className="contentLayout">
      {
        articles?.length ? articles?.map((article) =>
          <ResultItem key={article.id} article={article} searchKey={searchKey} />
        ) :
          <Empty description='搜索结果为空' />
      }
    </div>
  )
};

export default Search;
