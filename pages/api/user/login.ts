import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';

import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User, UserAuth } from 'db/entity';
import { setCookie } from 'utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(login, ironOptions);
async function login(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);
    const { phone, verify, identity_type = 'phone' } = req.body;
    const AppDataSource = await connectToDatabase();
    const userAuthRepository = AppDataSource.getRepository(UserAuth);

    if (String(session.verifyCode) === String(verify)) {
      // 验证码通过，在 user_auths 表中查找 identity_type 是否有记录
      const userAuth = await userAuthRepository.findOne({
        relations: ['user'],
        where: {
          identity_type,
          identifier: phone,
        },
      });
      if (userAuth) {
        // 用户已存在，返回用户信息
        const user = userAuth.user;
        const { id, nickname, avatar } = user;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCookie(cookies, user);
        res?.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      } else {
        // 用户不存在,注册新用户
        const user = new User();
        user.nickname = `user_${Math.floor(Math.random() * 10000)}`;
        user.avatar = '/images/avatar.jpg';
        user.job = '暂无';
        user.introduce = '暂无';

        const userAuth = new UserAuth();
        userAuth.identifier = phone;
        userAuth.identity_type = identity_type;
        userAuth.credential = session.verifyCode;
        userAuth.user = user;

        const resUserAuth = await userAuthRepository.save(userAuth);
        const {
          user: { id, nickname, avatar },
        } = resUserAuth;

        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        await session.save();
        setCookie(cookies, resUserAuth.user);
        res?.status(200).json({
          code: 0,
          msg: '登录成功',
          data: {
            userId: id,
            nickname,
            avatar,
          },
        });
      }
    } else {
      // 验证失败
      res?.status(200).json({ code: -1, msg: '验证码错误' });
    }
  }
}
