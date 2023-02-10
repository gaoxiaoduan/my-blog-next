import { connectToDatabase } from 'db';
import { Comment } from 'db/entity';
import { EXCEPTION_COMMENT } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

async function getList(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'GET') {
    const AppDataSource = await connectToDatabase();
    const commentRepository = AppDataSource.getRepository(Comment);

    const comments = await commentRepository.find({
      relations: ['user', 'article'],
      order: {
        create_time: 'DESC',
      },
    });

    if (comments) {
      res.status(200).json({
        code: 0,
        msg: '获取评论列表成功',
        data: comments,
      });
    } else {
      res.status(200).json({ ...EXCEPTION_COMMENT.GET_LIST_FAILED });
    }
  }
}

export default getList;
