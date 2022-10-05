import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { Tag, User } from 'db/entity';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';
import { EXCEPTION_TAG, EXCEPTION_USER } from '../config/codes';

export default withIronSessionApiRoute(get, ironOptions);

async function get(req: NextApiRequest, res: NextApiResponse<ICommonResponse>) {
  if (req.method === 'POST') {
    const session: ISession = req.session;
    const { userId = 0 } = session;
    const { type, tagId } = req.body;
    const AppDataSource = await connectToDatabase();
    const tagRepository = AppDataSource.getRepository(Tag);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      res?.status(200).json({
        ...EXCEPTION_USER?.NOT_LOGIN,
      });
      return;
    }

    const tag = await tagRepository.findOne({
      where: {
        id: tagId,
      },
      relations: ['users'],
    });

    if (tag?.users) {
      if (type === 'follow') {
        tag.users = tag?.users?.concat([user]);
        tag.follow_count = tag?.follow_count + 1;
      } else if (type === 'unFollow') {
        tag.users = tag?.users?.filter((user) => user.id !== userId);
        tag.follow_count = tag?.follow_count - 1;
      }
      const resTag = await tagRepository.save(tag);
      res?.status(200)?.json({
        code: 0,
        msg: 'Success',
        data: resTag,
      });
    } else {
      res?.status(200)?.json({
        ...EXCEPTION_TAG?.FOLLOW_FAILED,
      });
    }
  }
}
