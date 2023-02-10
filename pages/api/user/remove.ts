import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { UserAuth } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';
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
      return res.status(200).json({ ...EXCEPTION_USER.REMOVE_FAILED });
    }
    const { id: userAuthId } = req.body;
    const AppDataSource = await connectToDatabase();
    const userAuthRepository = AppDataSource.getRepository(UserAuth);

    const userAuth = await userAuthRepository.findOne({
      where: { id: userAuthId },
      relations: ['user'],
    });
    const result = await userAuth?.remove();

    if (result) {
      res.status(200).json({
        code: 0,
        msg: '删除用户成功',
      });
    } else {
      res.status(200).json({ ...EXCEPTION_USER.REMOVE_FAILED });
    }
  }
}
