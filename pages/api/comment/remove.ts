import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Comment } from 'db/entity';
import { EXCEPTION_COMMENT } from '../config/codes';
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
      return res.status(200).json({ ...EXCEPTION_COMMENT.REMOVE_FAILED });
    }
    const { id: commentId } = req.body;
    const AppDataSource = await connectToDatabase();
    const commentRepository = AppDataSource.getRepository(Comment);

    const comment = await commentRepository.findOne({
      where: { id: commentId },
    });
    const result = await comment?.remove();

    if (result) {
      res.status(200).json({
        code: 0,
        msg: '删除评论成功',
      });
    } else {
      res.status(200).json({ ...EXCEPTION_COMMENT.REMOVE_FAILED });
    }
  }
}
