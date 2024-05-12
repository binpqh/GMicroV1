import {
  CaretRightOutlined,
  LockOutlined,
  MailOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

import { useAppDispatch, useAppSelector } from '../../apps/hooks';

import logo1 from '../../assets/img/logo.png';
import { language } from '../../i18n/i18n';
import { IForgotPassword, ILoginForm } from '../../interface/IAuth';
import { isLoading, setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { isLogin, login } from '../../apps/Feature/authSlice/authSlice';

const { Option } = Select;
const LoginNew: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const loading = useAppSelector(isLoading);
  const isAuth = useAppSelector(isLogin);

  const { t, i18n } = useTranslation('lng');
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  useEffect(() => {
    if (isAuth) {
      navigate('/dashboard');
    }
  }, [isAuth]);

  const handleLogin = async (data: ILoginForm) => {
    // console.log(data);
    try {
      dispatch(setLoading(true));

      await dispatch(
        login({
          username: data.username,
          password: data.password,
        })
      ).unwrap();

      toast(`${t('signIn.messages.successfully')}`, {
        type: 'success',
      });
    } catch (error: any) {
      dispatch(setLoading(false));
      error.status === 500 && toast.error(`${error.message}`);

      if (error.status === 403) {
        toast.error(`${error.message}`);
      } else {
        toast(`${t('signIn.messages.unsuccessfully')}`, {
          type: 'error',
        });
        console.log(error);
      }
    }
  };

  const handleForgotPassword = async (data: IForgotPassword) => {
    console.log(data);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const handleChangeLanguage = (lng: string) => {
    console.log(`selected ${lng}`);
    i18n.changeLanguage(lng);
  };
  return (
    <div className="w-full h-screen">
      <div className="absolute  bottom-8 inset-x-0 px-5  text-center">
        <Select
          defaultValue={i18n.language}
          style={{ width: 150 }}
          bordered={false}
          dropdownStyle={{ color: '#ccc' }}
          onChange={handleChangeLanguage}
        >
          {language.map((item: any) => (
            <Option key={item.value} value={item.value} label={item.label}>
              <div className="flex items-center gap-2 justify-start font-semibold  ">
                <img src={item.img} alt="" />
                <p> {item.label}</p>
              </div>
            </Option>
          ))}
        </Select>
      </div>
      <div className="flex justify-center items-center h-screen">
        <div className="w-11/12 sm:w-1/2 lg:w-1/3 2xl:w-1/4 items-center flex flex-col justify-center">
          <div className="my-10 flex items-center  flex-col">
            <img src={logo1} alt="" className="object-cover w-2/3	text-center" />
            <h1 className="mt-5 text-3xl font-semibold text-center">
              {t('layout.appName')}
            </h1>
          </div>

          <Form
            name="normal_login"
            initialValues={{ remember: true }}
            onFinish={(data) =>
              forgotPassword ? handleForgotPassword(data) : handleLogin(data)
            }
            onFinishFailed={onFinishFailed}
            autoComplete="off"
            className="border-black login-form w-full lg:w-[75%] 2xl:w-[90%]"
          >
            {!forgotPassword && (
              <>
                <Form.Item
                  className=" text-base "
                  name="username"
                  rules={[
                    {
                      required: true,
                      message: `${t('signIn.inputRequire.username')}`,
                    },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined className="site-form-item-icon" />}
                    placeholder={t('signIn.form.username')}
                  />
                </Form.Item>

                <Form.Item
                  className=" text-base "
                  name="password"
                  rules={[
                    {
                      required: true,
                      message: `${t('signIn.inputRequire.password')}`,
                    },
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined className="site-form-item-icon" />}
                    type="password"
                    placeholder={t('signIn.form.password')}
                  />
                </Form.Item>
              </>
            )}
            {forgotPassword && (
              <>
                <div className="text-sm font-[500]  mb-3">
                  {t('forgotPassword.messages.guideline')}
                </div>
                <Form.Item
                  className=" text-base "
                  name="email"
                  rules={[
                    {
                      required: true,
                      type: 'email',
                      message: `${t('forgotPassword.messages.wrongEmail')}`,
                    },
                  ]}
                >
                  <Input
                    prefix={<MailOutlined className="site-form-item-icon" />}
                    placeholder={t('forgotPassword.form.email')}
                  />
                </Form.Item>
              </>
            )}
            <Form.Item>
              {!forgotPassword ? (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button w-full bg-primary flex items-center justify-center text-base font-semibold"
                >
                  <CaretRightOutlined className="site-form-item-icon" />
                  {t('signIn.form.login')}
                </Button>
              ) : (
                <Button
                  type="primary"
                  htmlType="submit"
                  className="login-form-button w-full bg-primary flex items-center justify-center text-base font-semibold"
                >
                  <LockOutlined className="site-form-item-icon" />

                  {t('forgotPassword.btnForgotPassword')}
                </Button>
              )}
            </Form.Item>

            <Form.Item className="text-center w-full ">
              <div
                className="login-form-forgot text-base hover:text-primary cursor-pointer hover:underline hover:underline-offset-4"
                onClick={() => setForgotPassword(!forgotPassword)}
              >
                {!forgotPassword
                  ? t('signIn.form.forgotPassword')
                  : t('signIn.form.login')}
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};
export default LoginNew;
