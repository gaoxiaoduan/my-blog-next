import { IronSession } from 'iron-session';
import type { IUserInfo } from 'store/userStore';

export type ICommonResponse = {
  code: number,
  msg: string,
  data?: any,
};

export type IComment = {
  id: number,
  content: string,
  create_time: Date,
  update_time: Date,
};

export type ITag = {
  id: number,
  title: string,
  icon: string,
  follow_count: number,
  article_count: number,
  articles?: IArticle[],
};

export type IArticle = {
  id: number,
  title: string,
  content: string,
  views: number,
  create_time: Date,
  update_time: Date,
  user: IUserInfo,
  tags?: ITag[],
  comments?: IComment[],
};

export type ISession = IronSession & Record<string, any>;
