import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User, Article, Tag } from 'db/entity';
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
    const { title, content, tagIds = [] } = req.body;
    const AppDataSource = await connectToDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const articleRepository = AppDataSource.getRepository(Article);
    const tagRepository = AppDataSource.getRepository(Tag);

    const user = await userRepository.findOne({
      where: {
        id: session.userId,
      },
    });

    const where = tagIds?.length
      ? tagIds?.map((tagId: number) => ({ id: tagId }))
      : {};
    const tags = await tagRepository.find({
      where,
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

    if (tags) {
      const newTags = tags.map((tag) => {
        tag.article_count = tag.article_count + 1;
        return tag;
      });
      article.tags = newTags;
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
