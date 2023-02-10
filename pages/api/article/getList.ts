import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

async function getList(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'GET') {
    const AppDataSource = await connectToDatabase();
    const articleRepository = AppDataSource.getRepository(Article);

    const articles = await articleRepository.find({
      relations: ['user', 'tags', 'comments'],
      order: {
        create_time: 'DESC',
      },
    });

    if (articles) {
      res.status(200).json({
        code: 0,
        msg: '获取文章列表成功',
        data: articles,
      });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.GET_LIST_FAILED });
    }
  }
}

export default getList;
