import { useEffect, useState } from 'react';
import { CheckOutlined, ReloadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import GroupApi from '../../../service/Group.service';
import AccountApi from '../../../service/Account.service';
import { showToastErrors } from '../../../utils/toast_errors';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { getPermissionCanHandleRole } from '../../../utils/getPermissionCanHandleRole';
import { TGroup } from '../../../interface';
import { ADMINISTRATOR } from '../../../Constant/Role';
const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 24 },
};
const CreateAccount = ({
  role,
  handleCreateAccountVisible,
}: {
  role: string;
  handleCreateAccountVisible: () => void;
}) => {
  const { t, i18n } = useTranslation('lng');
  const dispatch = useDispatch();
  const { Option } = Select;
  const [form] = Form.useForm();
  const [group, setGroup] = useState<TGroup[]>([]);
  const [isRoleAdmin, setIsRoleAdmin] = useState<boolean>(false);
  const onFinish = async (values: any) => {
    try {
      dispatch(setLoading(true));
      const res = await AccountApi.createNewAccounts({
        ...values,
      });
      dispatch(setLoading(false));
      toast.success('Tạo tạo khoản thành công');
      onReset();
      handleCreateAccountVisible();
    } catch (error) {
      //@ts-ignore
      showToastErrors(error.errors);
      dispatch(setLoading(false));
    }
  };
  const onReset = () => {
    form.resetFields();
  };

  const getGroupIdList = async () => {
    try {
      dispatch(setLoading(true));
      const res = await GroupApi.getGroupList();
      setGroup(res.data.data);
      dispatch(setLoading(false));
    } catch (error) {
      //@ts-ignore
      const errorMessage: string = Object.values(error.errors)[0];
      dispatch(setLoading(false));
      toast.error(errorMessage);
    }
  };
  const handleSetIsRoleAdmin = (value: string) => {
    value.toLowerCase() === ADMINISTRATOR.toLowerCase()
      ? setIsRoleAdmin(true)
      : setIsRoleAdmin(false);
  };
  useEffect(() => {
    getGroupIdList();
  }, []);
  return (
    <Form
      // {...layout}
      layout={'vertical'}
      form={form}
      name="control-hooks"
      onFinish={onFinish}
      style={{ maxWidth: 600 }}
    >
      <Row gutter={[16, 0]}>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="fullName"
            label={`${t('register.form.fullName')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.fullName')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="email"
            label={`${t('register.form.email')}`}
            rules={[
              {
                required: true,

                message: `${t('register.inputRequire.email')}`,
              },
              {
                type: 'email',
                message: 'Vui lòng nhập đúng định dạng',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="userName"
            label={`${t('register.form.username')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.username')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="password"
            label={`${t('register.form.password')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.password')}`,
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="role"
            label={`${t('register.form.role')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.role')}`,
              },
            ]}
          >
            <Select
              placeholder={`${t('register.form.role')}`}
              onChange={(value) => handleSetIsRoleAdmin(value)}
              allowClear
            >
              {/* Quyềm Administrator mới có quyền tạo Account Manager Group */}
              {getPermissionCanHandleRole(role).map((role) => (
                <Option key={role.id + role.name} value={role.name}>
                  {role.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {!isRoleAdmin && (
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold  "
          >
            <Form.Item
              className="w-full  "
              name="groupId"
              label={`${t('register.form.groupId')}`}
              rules={[
                {
                  required: true,
                  message: `${t('register.inputRequire.groupId')}`,
                },
              ]}
            >
              <Select placeholder={`${t('register.form.groupId')}`} allowClear>
                {group?.map((groupItem) => (
                  <Option key={groupItem.groupId} value={groupItem.groupId}>
                    {groupItem.groupName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        )}

        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="address"
            label={`${t('register.form.address')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.address')}`,
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col
          xs={{ span: 24 }}
          sm={{ span: 24 }}
          md={{ span: 24 }}
          lg={{ span: 12 }}
          xl={{ span: 12 }}
          className="text-base items-center flex font-semibold  "
        >
          <Form.Item
            className="w-full  "
            name="phoneNumber"
            label={`${t('register.form.phoneNumber')}`}
            rules={[
              {
                required: true,
                message: `${t('register.inputRequire.phoneNumber')}`,
              },
              {
                type: 'number',
                transform: (value) => {
                  return Number(value);
                },
                message: `${t('register.form.phoneNumber')} ${t('messages.validate.number')}`,
              },
              {
                max: 11,
                min: 10,
                message: `${t('messages.validate.phoneNumberCharter')}`,
              },
            ]}
          >
            <Input addonBefore={'+84'} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>

      <div className="flex justify-end gap-3 items-center">
        <Button
          className="w-1/3"
          htmlType="button"
          onClick={onReset}
          size="middle"
          type="default"
          shape="round"
          icon={<ReloadOutlined />}
        >
          Reset
        </Button>
        <Button
          className="w-2/3"
          htmlType="submit"
          size="middle"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
        >
          {t('register.form.submit')}
        </Button>
      </div>
    </Form>
  );
};

export default CreateAccount;
