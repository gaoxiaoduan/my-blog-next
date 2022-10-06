import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(detail, ironOptions);

async function detail(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'GET') {
    const session: ISession = req.session;
    const { userId } = session;
    const AppDataSource = await connectToDatabase();
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });
    if (user) {
      res.status(200).json({
        code: 0,
        msg: 'Success',
        data: {
          userInfo: user,
        },
      });
    } else {
      res?.status(200)?.json({
        ...EXCEPTION_USER.NOT_FOUND,
      });
    }
  }
}
