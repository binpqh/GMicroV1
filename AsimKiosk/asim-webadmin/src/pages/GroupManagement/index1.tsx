import {
  AppstoreAddOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
  InfoCircleOutlined,
} from '@ant-design/icons';
import { Button, Form, Input, Modal, Space, Tag } from 'antd';
import Table, { ColumnsType } from 'antd/es/table';
import queryString from 'query-string';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import Forbidden from '../../CoreUI/Forbidden';

import { useAppDispatch } from '../../apps/hooks';
import { TGroup } from '../../interface/IGroup';
import GroupApi from '../../service/Group.service';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';

const { confirm } = Modal;

export interface IGroupManagementProps {}

export default function GroupManagement(props: IGroupManagementProps) {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation('lng');

  const [openModal, setOpenModal] = useState(false);
  const [isRender, setIsRender] = useState<boolean>(false);
  const [is403, setIs403] = useState<boolean>(false);
  const [groupData, setGroupData] = useState<TGroup[]>();

  const [total, setToTal] = useState<number>();
  const [filter, setFilter] = useState({
    page: 1,
    pageSize: 10,
  });

  async function getAllGroupAsync() {
    try {
      const params = queryString.stringify(filter);
      dispatch(setLoading(true));
      const response = await GroupApi.getAll(params);
      setGroupData(response.data.data.items);
      // console.log('logAPI', response.data.data.items);
      setToTal(response.data.data.totalCount);
      dispatch(setLoading(false));
    } catch (error: any) {
      dispatch(setLoading(false));
      if (error.status === 403) {
        setIs403(!is403);
      } else {
        toast.error(`${error}`);
        console.log('failed to fetch productList', error);
      }
    }
  }

  useEffect(() => {
    getAllGroupAsync();
  }, [isRender, filter.page, filter.pageSize]);

  const handlePageChange = (page: number, pageSize: number) => {
    // console.log(page, pageSize);
    setFilter({
      ...filter,
      page: page,
      pageSize: pageSize,
    });
  };

  const showDeleteConfirm = (title: string, desc: string, id: string) => {
    confirm({
      title: title,
      icon: (
        <ExclamationCircleFilled style={{ fontSize: '22px', color: 'red' }} />
      ),
      content: desc,
      okType: 'danger',
      cancelButtonProps: { type: 'default' },
      autoFocusButton: 'cancel',
      onOk() {
        {
          //delete kiosk
          handleDeleteKiosk(id);
        }
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  async function navigateFunction(url: string) {
    await navigate(url);
  }

  const handleDeleteKiosk = async (id: string) => {
    try {
      dispatch(setLoading(true));
      console.log('delete kiosk');
      const response = await GroupApi.delete(id);
      console.log(response);
      const newData = groupData?.filter((data) => data.groupId !== id);
      setGroupData(newData);
      dispatch(setLoading(false));
      toast.success('Xoá Kiosk Thành Công');
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error.data.errors);
      // toast.error(`${error}`);
    }
  };

  const columns: ColumnsType<TGroup> = [
    {
      title: `${t('group.list.columns.groupId')}`,
      dataIndex: 'groupId',
      key: 'groupId',
      width: 95,
      fixed: 'left',
      ellipsis: true,
    },
    {
      title: `${t('group.list.columns.name')}`,
      dataIndex: 'groupName',
      key: 'groupName',
    },

    {
      title: `${t('group.list.columns.status')}`,
      key: 'status',

      dataIndex: 'status',
      render: (_, { status }) => {
        let color = '';
        if (status.toLocaleLowerCase() === 'inactive') {
          color = 'red';
        }
        if (status.toLocaleLowerCase() === 'active') {
          color = 'green';
        }
        return (
          <Tag color={color} key={'status'} className="font-[600]  ">
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: `${t('group.list.columns.userCount')}`,
      dataIndex: 'userCount',
      key: 'userCount',
    },
    {
      title: `${t('group.list.columns.kioskCount')}`,
      dataIndex: 'kioskCount',
      key: 'kioskCount',
    },
    {
      title: `${t('group.list.columns.action')}`,
      key: 'action',
      // fixed: 'right',

      render: (_, record) => (
        <Space>
          <Button
            size="middle"
            type="primary"
            shape="round"
            icon={<InfoCircleOutlined />}
            onClick={() => {
              // console.log(record);
              const id = record.groupId;
              navigateFunction(`/group/${id}`);
            }}
          >
            {t('group.list.btnAcction')}
          </Button>
          <Button
            size="middle"
            // type="primary"
            danger
            shape="round"
            icon={<DeleteOutlined />}
            onClick={() => {
              // console.log(record);
              const id = record.groupId;
              const name = record.groupName;
              showDeleteConfirm(
                `${t('group.list.DeleteConfirmTitle')} ${name}`,
                `${t('group.list.DeleteConfirmDesc')}`,
                id
              );
            }}
          >
            {t('group.list.btnDelete')}
          </Button>
        </Space>
      ),
    },
  ];
  const showModal = () => {
    setOpenModal(true);
  };
  const handleCancel = () => {
    setOpenModal(false);
  };
  async function onFinish(values: Pick<TGroup, 'groupName'>) {
    console.log(values);
    try {
      const response = await GroupApi.createGroup(values.groupName);
      toast.success(`${t('group.messages.successfully')}`);
      handleCancel();
      setIsRender(!isRender);
      form.resetFields();
    } catch (error) {
      toast.error(`${t('group.messages.unsuccessfully')}`);
      console.log('failed to create Account', error);
    }
  }
  return (
    <>
      <div className=" bg-gray-100 min-h-min ">
        <div className="flex items-center ">
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<AppstoreAddOutlined />}
            onClick={showModal}
          >
            {`${t('group.form.title')}`}
          </Button>
        </div>
        <h2 className="font-bold text-3xl  text-inherit mb-2 text-center ">
          {t('group.title')}
        </h2>

        <Table
          columns={columns}
          dataSource={groupData}
          tableLayout={'auto'}
          // loading
          scroll={{ x: 550 }}
          rowKey={(record) => record.groupId}
          pagination={{
            position: ['bottomCenter'],
            defaultCurrent: 1,
            showSizeChanger: true,
            pageSizeOptions: ['10', '15', '20', '25'],
            onChange: handlePageChange,
            total: total,
            current: filter.page,
            pageSize: filter.pageSize,
          }}
        />
        {/* -------- AddGroup--------- */}
        <Modal
          title={
            <h4 className="font-bold text-2xl text-center mb-5 text-primary">
              {`${t('group.form.title').toUpperCase()}`}
            </h4>
          }
          open={openModal}
          // centered
          // onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >
          <Form
            // {...layout}
            // // layout={''}
            form={form}
            name="control-hooks"
            onFinish={onFinish}
            style={{ maxWidth: 600 }}
          >
            <div className="w-full">
              <Form.Item
                name="groupName"
                label={`${t('group.form.groupName')}`}
                rules={[
                  {
                    required: true,
                    message: `${t('group.form.groupNameRequire')}`,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="flex justify-end gap-3 items-center">
              <Button
                htmlType="submit"
                size="middle"
                type="primary"
                shape="round"
                icon={<AppstoreAddOutlined />}
              >
                {t('group.form.submit')}
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
    </>
  );
}
