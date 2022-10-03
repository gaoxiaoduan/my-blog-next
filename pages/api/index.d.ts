import { IronSession } from 'iron-session';

export type ICommonResponse = {
  code: number,
  msg: string,
  data?: any,
};

export type ISession = IronSession & Record<string, any>;
