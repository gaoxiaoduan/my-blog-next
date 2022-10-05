import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Tag } from 'db/entity';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse<ICommonResponse>) {
  if (req.method === 'GET') {
    const session: ISession = req.session;
    const { userId = 0 } = session;
    const AppDataSource = await connectToDatabase();
    const tagRepository = AppDataSource.getRepository(Tag);
    const followTags = await tagRepository.find({
      where: {
        users: {
          id: userId,
        },
      },
      relations: ['users'],
    });

    const allTags = await tagRepository.find({
      relations: ['users'],
    });

    res?.status(200)?.json({
      code: 0,
      msg: 'Success',
      data: {
        followTags,
        allTags,
      },
    });
  }
}
