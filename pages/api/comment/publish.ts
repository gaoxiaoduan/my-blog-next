import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User, Article, Comment } from 'db/entity';
import { EXCEPTION_COMMENT } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(publish, ironOptions);

async function publish(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const session: ISession = req.session;
    const { articleId, content } = req.body;
    const AppDataSource = await connectToDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const articleRepository = AppDataSource.getRepository(Article);
    const commentRepository = AppDataSource.getRepository(Comment);

    const user = await userRepository.findOne({
      where: {
        id: session?.userId,
      },
    });
    const article = await articleRepository.findOne({
      where: {
        id: articleId,
      },
    });

    const comment = new Comment();
    comment.content = content;
    comment.create_time = new Date();
    comment.update_time = new Date();

    if (user) {
      comment.user = user;
    }

    if (article) {
      comment.article = article;
    }

    const resComment = await commentRepository.save(comment);
    if (resComment) {
      res.status(200).json({
        code: 0,
        msg: '发布成功',
        data: resComment,
      });
    } else {
      res.status(200).json({
        ...EXCEPTION_COMMENT.PUBLISH_FAILED,
      });
    }
  }
}
