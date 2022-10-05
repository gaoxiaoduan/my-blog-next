import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

export default withIronSessionApiRoute(update, ironOptions);

async function update(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const { id, title, content } = req.body;
    const AppDataSource = await connectToDatabase();
    const articleRepository = AppDataSource.getRepository(Article);

    const article = await articleRepository.findOne({
      where: { id },
    });

    if (article) {
      article.title = title;
      article.content = content;
      article.update_time = new Date();

      const resArticle = await articleRepository.save(article);

      if (resArticle) {
        res.status(200).json({
          code: 0,
          msg: '更新成功',
          data: resArticle,
        });
      } else {
        res.status(200).json({ ...EXCEPTION_ARTICLE.UPDATE_FAILED });
      }
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.NOT_FOUND });
    }
  }
}
