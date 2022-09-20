import { format } from 'date-fns';
import md5 from 'md5';
import { encode } from 'js-base64';
import { parseString } from 'xml2js';
import type { NextApiRequest, NextApiResponse } from 'next';
import type { ICommonResponse } from '..';

export default async function sendVerifyCode(
  req: NextApiRequest,
  res: NextApiResponse<ICommonResponse>
) {
  if (req.method === 'POST') {
    const { to = '', templateId = '1' } = req.body;
    const appId = '8a216da882f1f59401835453f4431101';
    const ACCOUNT_SID = '8a216da882f1f59401835453f34010fa';
    const AUTH_TOKEN = '69aa7978e47240058352a22f78d28b32';
    const NowDate = format(new Date(), 'yyyyMMddHHmmss');
    const SigParameter = md5(`${ACCOUNT_SID}${AUTH_TOKEN}${NowDate}`);
    const Authorization = encode(`${ACCOUNT_SID}:${NowDate}`);
    const verifyCode = Math.floor(Math.random() * 8999) + 1000;
    const expireMinute = '5';

    const URL = `https://app.cloopen.com:8883/2013-12-26/Accounts/${ACCOUNT_SID}/SMS/TemplateSMS?sig=${SigParameter}`;

    const headers = new Headers();
    headers.append('Authorization', Authorization);
    headers.append(
      'Content-Type',
      'application/xml;charset=utf-8;application/json;charset=utf-8'
    );
    const response = await fetch(URL, {
      method: 'POST',
      body: JSON.stringify({
        to,
        templateId,
        appId,
        datas: [verifyCode, expireMinute],
      }),
      headers,
    }).then((res) => res.text());
    parseString(response, (err: any, result: any) => {
      if (err) return console.error(err);
      // console.log(result);
      const { statusCode, templateSMS, statusMsg } = result.Response;
      if (statusCode && statusCode?.at(0) === '000000') {
        res.status(200).json({
          code: 0,
          msg: statusMsg,
          data: { templateSMS },
        });
      } else {
        res.status(200).json({
          code: (statusCode && statusCode?.at(0)) || -1,
          msg: statusMsg,
        });
      }
    });
    console.log('verifyCode:', verifyCode);
  }
}
