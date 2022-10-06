import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(update, ironOptions);

async function update(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const session: ISession = req.session;
    const { userId } = session;
    const { nickname, job, introduce } = req.body;
    const AppDataSource = await connectToDatabase();
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
    });

    if (user) {
      user.nickname = nickname;
      user.job = job;
      user.introduce = introduce;
      const resUser = await userRepository.save(user);
      if (resUser) {
        res?.status(200)?.json({
          code: 0,
          msg: 'Success',
          data: resUser,
        });
      }
    } else {
      res?.status(200)?.json({
        ...EXCEPTION_USER.NOT_FOUND,
      });
    }
  }
}
