import { connectToDatabase } from 'db';
import { UserAuth } from 'db/entity';
import { EXCEPTION_USER } from '../config/codes';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

async function getList(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'GET') {
    const AppDataSource = await connectToDatabase();
    const userAuthRepository = AppDataSource.getRepository(UserAuth);

    const users = await userAuthRepository.find({
      relations: ['user'],
    });
    
    if (users) {
      res.status(200).json({
        code: 0,
        msg: '获取用户列表成功',
        data: users,
      });
    } else {
      res.status(200).json({ ...EXCEPTION_USER.GET_LIST_FAILED });
    }
  }
}

export default getList;
