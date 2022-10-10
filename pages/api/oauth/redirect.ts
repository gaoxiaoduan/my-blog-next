import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config';
import { connectToDatabase } from 'db';
import { User, UserAuth } from 'db/entity';
import { setCookie } from 'utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(redirect, ironOptions);

async function redirect(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'GET') {
    const session: ISession = req.session;
    const cookies = Cookie.fromApiRoute(req, res);
    const { code } = req?.query || {};
    const AppDataSource = await connectToDatabase();
    const userAuthRepository = AppDataSource.getRepository(UserAuth);
    const githubSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET || '';
    const githubClientID = process.env.NEXT_PUBLIC_CLIENT_ID || '';
    const redirectUrl =
      process.env.NODE_ENV === 'development'
        ? 'http://localhost:3000/'
        : 'https://my-blog-next-gaoxiaoduan.vercel.app/';

    if (code) {
      const url = `https://github.com/login/oauth/access_token?client_id=${githubClientID}&client_secret=${githubSecret}&code=${code}`;
      const result = await fetch(url, {
        method: 'POST',
        headers: {
          accept: 'application/json',
        },
        body: JSON.stringify({}),
      }).then((res) => res.json());

      const { access_token } = result;
      const githubUserInfo = await fetch('https://api.github.com/user', {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `token ${access_token}`,
        },
      }).then((res) => res.json());

      const userAuth = await userAuthRepository.findOne({
        where: {
          identity_type: 'github',
          identifier: githubClientID,
        },
        relations: ['user'],
      });

      if (userAuth) {
        // 之前登录过，从user 表里获取用户信息，更新credential
        const user = userAuth?.user;
        userAuth.credential = access_token;
        await userAuthRepository.save(userAuth);

        const { id, nickname, avatar } = user;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCookie(cookies, user);
        res.redirect(redirectUrl);
      } else {
        // 创建一个新用户，包括 user 和 user_auth
        const { login = '', avatar_url = '' } = githubUserInfo || {};
        const user = new User();
        user.nickname = login;
        user.avatar = avatar_url;
        user.job = '暂无';
        user.introduce = '暂无';

        const userAuth = new UserAuth();
        userAuth.identity_type = 'github';
        userAuth.identifier = githubClientID;
        userAuth.credential = access_token;
        userAuth.user = user;

        const resUserAuth = await userAuthRepository.save(userAuth);

        const addUser = resUserAuth?.user || {};
        const { id, nickname, avatar } = addUser;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;

        await session.save();
        setCookie(cookies, addUser);
        res.redirect(redirectUrl);
      }
    } else {
      res?.status(200).json({
        code: 0,
        msg: 'code为空',
      });
    }
  }
}
