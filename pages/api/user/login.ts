import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse, ISession } from '..';

export default withIronSessionApiRoute(login, ironOptions);
async function login(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const { phone, verify } = req.body;
    console.log(phone, verify);
    res.status(200).json({
      code: 0,
      msg: 'success',
      data: {
        phone,
        verify,
      },
    });
  }
}
