import { message } from 'antd';
import axios from 'axios';

const requestInstance = axios.create({
  baseURL: '/',
});

requestInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

requestInstance.interceptors.response.use(
  (response) => {
    if (response.status === 200) {
      if (response.data.code !== 0) {
        return message.error(response.data.msg || '未知错误');
      }
      return response.data;
    }

    return {
      code: -1,
      msg: '未知错误',
      data: null,
    };
  },
  (error) => Promise.reject(error)
);

export default requestInstance;
