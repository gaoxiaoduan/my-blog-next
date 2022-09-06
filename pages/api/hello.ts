import type { NextApiRequest, NextApiResponse } from 'next';
import { mock } from 'mockjs';

type Data = {
  name: string,
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  res.status(200).json(
    mock({
      'list|1-10': [{ 'id|+1': 1 }],
    })
  );
}
