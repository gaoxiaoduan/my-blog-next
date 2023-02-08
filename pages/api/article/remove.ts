import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Article } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(remove, ironOptions);

async function remove(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'DELETE') {
    const session: ISession = req.session;
    if (session.userId === null || session.userId === undefined) {
      return res.status(200).json({ ...EXCEPTION_ARTICLE.REMOVE_FAILED });
    }
    const { id: articleId } = req.body;
    const AppDataSource = await connectToDatabase();
    const articleRepository = AppDataSource.getRepository(Article);

    const article = await articleRepository.findOne({
      where: { id: articleId },
    });
    const result = await article?.remove();

    if (result) {
      res.status(200).json({
        code: 0,
        msg: '删除文章成功',
      });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.REMOVE_FAILED });
    }
  }
}
