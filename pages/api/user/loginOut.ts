import { withIronSessionApiRoute } from 'iron-session/next';
import { Cookie } from 'next-cookie';
import { ironOptions } from 'config';
import { clearCookie } from 'utils';
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
    clearCookie(cookies);
    await session.destroy();

    res.status(200).json({
      code: 0,
      msg: '退出成功',
    });
  }
}
