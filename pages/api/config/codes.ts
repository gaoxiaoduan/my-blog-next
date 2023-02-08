export const EXCEPTION_USER = {
  NOT_LOGIN: {
    code: 1001,
    msg: '未登录',
  },
  NOT_FOUND: {
    code: 1002,
    msg: '未找到用户',
  },
};

export const EXCEPTION_ARTICLE = {
  PUBLISH_FAILED: {
    code: 2001,
    msg: '发布文章失败',
  },
  UPDATE_FAILED: {
    code: 2002,
    msg: '更新文章失败',
  },
  NOT_FOUND: {
    code: 2003,
    msg: '未找到文章',
  },
  REMOVE_FAILED: {
    code: 2004,
    msg: '删除文章失败',
  },
};

export const EXCEPTION_TAG = {
  FOLLOW_FAILED: {
    code: 3001,
    msg: '关注/取关操作失败',
  },
};

export const EXCEPTION_COMMENT = {
  PUBLISH_FAILED: {
    code: 4001,
    msg: '发表失败',
  },
};
