import { withIronSessionApiRoute } from 'iron-session/next';
import { difference } from 'lodash-es';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Article, Tag } from 'db/entity';
import { EXCEPTION_ARTICLE } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

export default withIronSessionApiRoute(update, ironOptions);

async function update(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const { id, title, content, tagIds = [] } = req.body;
    const AppDataSource = await connectToDatabase();
    const articleRepository = AppDataSource.getRepository(Article);
    const tagRepository = AppDataSource.getRepository(Tag);

    const article = await articleRepository.findOne({
      where: { id },
      relations: ['tags'],
    });

    const tags = await tagRepository.find();

    if (article) {
      article.title = title;
      article.content = content;
      article.update_time = new Date();
      if (article?.tags && article?.tags.length > 0) {
        // 1. tags:[1,2] tagIds:[1,2]
        // 长度相等 说明tags没变

        // 2. tags:[1,2] tagIds:[1]
        // 说明有删除
        if (article.tags.length > tagIds.length) {
          // 找到要删除tag
          // deleteTags:[2] tags:[1,2] tagIds:[1]
          const deleteTags = difference(
            article?.tags?.map((tag) => tag.id),
            tagIds
          );
          const newTags = tags.map((tag) => {
            deleteTags.forEach((delId) => {
              if (delId === tag.id) tag.article_count -= 1;
            });
            return tag;
          });
          await tagRepository.save(newTags);
          article.tags = article.tags.filter(
            (tag) => !deleteTags.includes(tag.id)
          );
        } else {
          // 3. tags:[1,2] tagIds:[1,2,3]
          // 说明有新增加
          // addTags:[3] tagIds:[1,2,3] tags:[1,2]
          const addTags = difference(
            tagIds,
            article?.tags?.map((tag) => tag.id)
          );
          let addTagArr: Tag[] = [];
          tags.forEach((tag) => {
            addTags.forEach((addId) => {
              if (addId === tag.id) {
                tag.article_count += 1;
                addTagArr.push(tag);
              }
            });
          });
          article.tags = article.tags.concat(addTagArr);
        }
      }
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
