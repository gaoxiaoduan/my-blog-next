import { User } from 'db/entity';
import { Cookie } from 'next-cookie';

export const setCookie = (cookies: Cookie, user: User) => {
  const expires = new Date(Date.now() + 1000 * 60 * 60 * 24); // 登录时效，24h
  const path = '/';
  const options = { expires, path };
  cookies.set('userId', user.id, options);
  cookies.set('nickname', user.nickname, options);
  cookies.set('avatar', user.avatar, options);
};

export const clearCookie = async (cookies: Cookie) => {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const path = '/';
  const options = { expires, path };
  cookies.set('userId', '', options);
  cookies.set('nickname', '', options);
  cookies.set('avatar', '', options);
};
