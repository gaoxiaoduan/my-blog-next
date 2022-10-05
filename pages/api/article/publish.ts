import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User, Article } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const session: ISession = req.session;
    const { title, content } = req.body;
    const AppDataSource = await connectToDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const articleRepository = AppDataSource.getRepository(Article);

    const user = await userRepository.findOne({
      where: {
        id: session.userId,
      },
    });
    const article = new Article();
    article.title = title;
    article.content = content;
    article.create_time = new Date();
    article.update_time = new Date();
    article.is_delete = 0;
    article.views = 0;

    if (user) {
      article.user = user;
    }

    const resArticle = await articleRepository.save(article);
    if (resArticle) {
      res.status(200).json({
        code: 0,
        msg: '发布成功',
        data: resArticle,
      });
    } else {
      res.status(200).json({ ...EXCEPTION_ARTICLE.PUBLISH_FAILED });
    }
  }
}
