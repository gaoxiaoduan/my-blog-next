import React from 'react';
import { Divider } from 'antd';
import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import ListItem from 'components/ListItem';
import type { NextPage } from 'next';
import type { IArticle } from './api';

interface IProps {
  articles: IArticle[];
}

export async function getServerSideProps() {
  const AppDataSource = await connectToDatabase();
  const articles = await AppDataSource.getRepository(Article).find({
    relations: ['user', 'tags', 'comments'],
    order: {
      create_time: "DESC"
    },
  });

  return {
    props: {
      articles: JSON.parse(JSON.stringify(articles)) || [],
    },
  };
}

const Home: NextPage<IProps> = (props) => {
  const { articles } = props;
  return (
    <div className="contentLayout">
      {articles?.map((article) => (
        <React.Fragment key={article.id}>
          <ListItem article={article} />
          <Divider />
        </React.Fragment>
      ))}
    </div>
  );
};

export default Home;
