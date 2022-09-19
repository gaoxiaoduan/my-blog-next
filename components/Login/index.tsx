import { useState } from 'react';
import { Statistic } from 'antd';
import type { ChangeEvent } from 'react';
import type { NextPage } from 'next';
import styles from './index.module.scss';

const { Countdown } = Statistic;

interface IProps {
  isShow: boolean;
  onClose: Function;
}

const Login: NextPage<IProps> = (props) => {
  // console.log(props);
  const { isShow, onClose } = props;
  const [isShowVerifyCode, setIsVerifyCode] = useState(false);
  const [form, setForm] = useState({
    phone: '',
    verify: '',
  });

  const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleClose = () => {
    onClose?.();
  };

  const handleLogin = () => {};

  const handleOAuthGithub = () => {};

  const handleGetVerifyCode = () => {
    setIsVerifyCode(true);
  };

  const handleEnd = () => {
    setIsVerifyCode(false);
  };

  return isShow ? (
    <div className={styles.loginArea}>
      <div className={styles.loginBox}>
        <div className={styles.loginTitle}>
          <div>手机登录</div>
          <div className={styles.close} onClick={handleClose}>
            x
          </div>
        </div>

        <input
          type="text"
          name="phone"
          placeholder="请输入手机号"
          value={form.phone}
          onChange={handleFormChange}
        />
        <div className={styles.verifyCodeArea}>
          <input
            type="text"
            name="verify"
            placeholder="请输入验证码"
            value={form.verify}
            onChange={handleFormChange}
          />
          <div className={styles.verifyCode}>
            {isShowVerifyCode ? (
              <Countdown
                format="s"
                value={Date.now() + 1000 * 60}
                onFinish={handleEnd}
                valueStyle={{
                  fontSize: '14px',
                  color: '#909090',
                }}
              />
            ) : (
              <span onClick={handleGetVerifyCode}>获取验证码</span>
            )}
          </div>
        </div>
        <div className={styles.loginBtn} onClick={handleLogin}>
          登录
        </div>
        <div className={styles.otherLogin} onClick={handleOAuthGithub}>
          使用GitHub登录
        </div>
        <div className={styles.loginPrivacy}>
          注册登录即表示同意
          <a
            href="https://lf3-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/juejin/86857833-55f6-4d9e-9897-45cfe9a42be4.html"
            target="_blank"
            rel="noreferrer"
          >
            用户协议
          </a>
        </div>
      </div>
    </div>
  ) : null;
};

export default Login;
