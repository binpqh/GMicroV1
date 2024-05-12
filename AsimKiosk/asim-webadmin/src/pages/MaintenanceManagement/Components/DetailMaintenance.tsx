import {
  CheckCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
  SyncOutlined,
  UserAddOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Descriptions, Form, Row, Select, Tag } from 'antd';
import moment from 'moment';
import { memo, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CompletionStingStatus } from '../../../Constant/CompletionStatus';
import {
  TCreateMaintenance,
  TMaintenance,
} from '../../../interface/TMaintenance';
import { useAppDispatch } from '../../../apps/hooks';
import { setLoading } from '../../../apps/Feature/loadingSlice/loadingSlice';
import { showToastErrors } from '../../../utils/toast_errors';
import UserApi from '../../../service/User.service';
import MaintenanceApi from '../../../service/Maintenance.service';
import { toast } from 'react-toastify';
import TextArea from 'antd/es/input/TextArea';
import { current } from '@reduxjs/toolkit';
import { TUserDropdown } from '../../../interface';
export interface IDetailMaintenanceProps {
  handleRerender: () => void;
  handleCloseDrawer: () => void;
  currentTicket: TMaintenance;
  handleSetIsAssignee: () => void;
  isAssignee: boolean;
}
const { Option } = Select;
const formItemLayout = {
  // labelCol: { span: 4 },
  wrapperCol: { span: 24 },
};
function DetailMaintenance({
  handleRerender,
  handleCloseDrawer,
  currentTicket,
  handleSetIsAssignee,
  isAssignee = false,
}: IDetailMaintenanceProps) {
  const [form] = Form.useForm();
  const { t } = useTranslation('lng');

  const [userList, setUserList] = useState<TUserDropdown[]>();
  const dispatch = useAppDispatch();
  const getUserDropdown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await UserApi.getUsersDropdown(currentTicket.groupId);
      console.log('setKioskList', response.data.data);
      setUserList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch getGroupIdList', error);
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    if (currentTicket.groupId) {
      getUserDropdown();
      form.resetFields();
    }
  }, [currentTicket.groupId]);

  const handleUpdateMaintenance = async (values: {
    note: string;
    assignee: string;
  }) => {
    console.log(values);
    try {
      dispatch(setLoading(true));
      const response = await MaintenanceApi.UpdateMaintenance(
        currentTicket.id,
        values
      );
      handleRerender();
      handleCloseDrawer();
      toast.success('Giao người thực hiện thành công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const onFinish = (values: { note: string; assignee: string }) => {
    console.log('Received values of form: ', values, currentTicket.id);

    handleUpdateMaintenance(values);
  };
  const handleDoneTicketMaintenance = async () => {
    try {
      dispatch(setLoading(true));
      const response = await MaintenanceApi.DoneTicket(currentTicket.id);
      handleRerender();
      handleCloseDrawer();
      toast.success('Hoàn thành ticket thành công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };
  const handleDeleteTicketMaintenance = async () => {
    try {
      dispatch(setLoading(true));
      const response = await MaintenanceApi.DeleteTicket(currentTicket.id);
      handleRerender();
      handleCloseDrawer();
      toast.success('Xoá ticket thành công');
      form.resetFields();
    } catch (error: any) {
      console.log(error);
      showToastErrors(error.errors);
    } finally {
      dispatch(setLoading(false));
    }
  };
  return (
    <div>
      <Card
        className=" xl:mx-auto mb-4 w-full  break-words "
        title={
          <p className=" text-base md:text-xl break-words font-semibold">
            {t('maintenance.detail.info')}
          </p>
        }
        headStyle={{
          textAlign: 'center',
          padding: '0px',
        }}
      >
        <Row gutter={[16, 16]} justify="space-around" align="middle">
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold  "
          >
            <div className="w-1/3  xl:w-1/4 ">
              {t('maintenance.list.columns.kioskName')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">
              {currentTicket.kioskName}
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base  items-center flex font-semibold"
          >
            <div className="w-1/3  xl:w-1/4  ">
              {t('maintenance.list.columns.deviceErrorCode')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">
              {currentTicket.deviceErrorCode}
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base  items-center flex font-semibold"
          >
            <div className="w-1/3  xl:w-1/4  ">
              {t('maintenance.list.columns.logBy')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">
              {currentTicket.logBy}
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base  items-center flex font-semibold"
          >
            <div className="w-1/3  xl:w-1/4  ">
              {t('maintenance.list.columns.createdAt')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">
              {moment(currentTicket.createdAt).format('DD/MM/YYYY')}
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base items-center flex font-semibold "
          >
            <div className="w-1/3  xl:w-1/4  ">
              {t('maintenance.list.columns.maintenanceState')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word ">
              <Tag
                className="m-0"
                color={
                  currentTicket.maintenanceState ===
                  CompletionStingStatus.Completed
                    ? 'success'
                    : currentTicket.maintenanceState ===
                      CompletionStingStatus.Pending
                    ? 'volcano'
                    : 'processing'
                }
                icon={
                  currentTicket.maintenanceState ===
                  CompletionStingStatus.Completed ? (
                    <CheckCircleOutlined />
                  ) : currentTicket.maintenanceState ===
                    CompletionStingStatus.Pending ? (
                    <MinusCircleOutlined spin />
                  ) : (
                    <SyncOutlined spin />
                  )
                }
                key={'isOnline'}
              >
                {currentTicket.maintenanceState.toUpperCase()}
              </Tag>
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 12 }}
            md={{ span: 12 }}
            lg={{ span: 12 }}
            xl={{ span: 12 }}
            className="text-base  items-center flex font-semibold"
          >
            <div className="w-1/3  xl:w-1/4  ">
              {t('maintenance.list.columns.assignee')}:
            </div>
            <div className="w-1/2 2xl:w-3/4 pl-5 break-word  ">
              {currentTicket.assignee}
            </div>
          </Col>
          <Col
            xs={{ span: 24 }}
            sm={{ span: 24 }}
            md={{ span: 24 }}
            lg={{ span: 24 }}
            xl={{ span: 24 }}
            className="text-base items-center flex font-semibold "
          >
            <div className="w-1/4 sm:w-1/6   2xl:w-[13%] ">
              {t('maintenance.list.columns.note')}:
            </div>
            <div className="w-3/4 sm:w-5/6  2xl:w-[87%] pl-5 break-word ">
              {currentTicket.note}
            </div>
          </Col>
        </Row>
      </Card>
      <div className="flex items-center gap-5 justify-center flex-wrap lg:flex-nowrap">
        {currentTicket.maintenanceState.toUpperCase() ===
          CompletionStingStatus.Processing.toUpperCase() && (
          <Button
            className="w-1/2"
            type="primary"
            size="large"
            shape="round"
            icon={<CheckOutlined />}
            onClick={() => handleDoneTicketMaintenance()}
          >
            {t('maintenance.list.btnSuccecs')}
          </Button>
        )}
        {currentTicket.maintenanceState.toUpperCase() ===
          CompletionStingStatus.Pending.toUpperCase() && (
          <Button
            className="w-1/2"
            size="large"
            type="primary"
            shape="round"
            disabled={currentTicket.groupId ? false : true}
            icon={<UserAddOutlined />}
            onClick={() => handleSetIsAssignee()}
          >
            {t('maintenance.list.btnAssignee')}
          </Button>
        )}
        {currentTicket.maintenanceState.toUpperCase() ===
          CompletionStingStatus.Completed.toUpperCase() && (
          <Button
            className="w-1/2"
            type="primary"
            size="large"
            shape="round"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteTicketMaintenance()}
          >
            {t('maintenance.list.btnDelete')}
          </Button>
        )}
      </div>
      {isAssignee && (
        <Card
          className=" xl:mx-auto mt-4 w-full  break-words "
          title={
            <p className=" text-base md:text-xl break-words font-semibold">
              {t('maintenance.detail.ChoseUser')}
            </p>
          }
          headStyle={{
            textAlign: 'center',
            padding: '0px',
          }}
        >
          <Form
            {...formItemLayout}
            labelWrap
            name="AddInventoryTicket"
            form={form}
            layout="vertical"
            onFinish={onFinish}
            // validateMessages={validateMessages}
            className="w-full font-medium text-base"
          >
            <Form.Item
              name="assignee"
              label={`${t('maintenance.detail.ChoseUser')}`}
              rules={[{ required: true }]}
              colon
            >
              <Select
                placeholder={`${t('maintenance.detail.ChoseUser')}`}
                virtual={false}
              >
                {userList &&
                  userList?.map((user) => (
                    <Option key={user.id} value={user.id}>
                      <p className="font-semibold">{user.fullName}</p>
                      {/* ({user.role}) */}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item
              className="flex-1 "
              name="note"
              label={`${t(
                'inventoryManagement.detailTicket.form.description'
              )}`}
              initialValue={currentTicket.note}
            >
              <TextArea
                rows={4}
                placeholder={`${t(
                  'inventoryManagement.detailTicket.form.description'
                )}`}
              />
            </Form.Item>

            <Button
              htmlType="submit"
              className=" mt-4 py-0 px-4 flex items-center w-full justify-center "
              size="large"
              type="primary"
              shape="round"
              icon={<CheckOutlined />}
            >
              {t('buttons.save')}
            </Button>
          </Form>
        </Card>
      )}
    </div>
  );
}
export default memo(DetailMaintenance);
