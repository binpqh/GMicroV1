import {
  CheckOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeOutlined,
  FieldTimeOutlined,
  IssuesCloseOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, Checkbox, Form, Input, Select } from 'antd';
import { memo, useEffect, useState, useTransition } from 'react';
import { useTranslation } from 'react-i18next';
import { TExternalDevices, TProductDropdown } from '../../../../interface';
import { useAppDispatch } from '../../../../apps/hooks';
import { setLoading } from '../../../../apps/Feature/loadingSlice/loadingSlice';
import ProductApi from '../../../../service/product.service';
import ClientApi from '../../../../service/Client.service';
import { toast } from 'react-toastify';
import { showToastErrors } from '../../../../utils/toast_errors';
const { Option } = Select;
export type TEditPeripheralProps = {
  externalDevices: TExternalDevices;
  deviceId: string;
  isRender: boolean;
  handleRerender: () => void;
  handleCloseModal: () => void;
};

function EditPeripheral({
  externalDevices,
  deviceId,
  handleRerender,
  handleCloseModal,
  isRender,
}: TEditPeripheralProps) {
  const { t } = useTranslation('lng');
  const [form] = Form.useForm();

  const dispatch = useAppDispatch();
  const [productList, setProductList] = useState<TProductDropdown[]>();
  const [itemCodeList, setItemCodeList] = useState<string[]>();
  const getProductDropdown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.getProductDropdown();

      if (externalDevices.productCode && externalDevices.itemCode) {
        const newItemCodeList = response.data.data.find(
          (product) => product.productCode === externalDevices.productCode
        );
        setItemCodeList(newItemCodeList?.itemCodes);
      }

      setProductList(response.data.data);
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch getGroupIdList', error);

      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  };

  const handleProductCodeChange = (productCode: string) => {
    console.log(productCode);
    const newItemCodeList = productList?.find(
      (product) => product.productCode === productCode
    );
    setItemCodeList(newItemCodeList?.itemCodes);

    // when change Kiosk set fields dispensers : null
    const { itemCode } = form.getFieldsValue();
    itemCode &&
      form.setFieldsValue({
        itemCode: null,
      });
  };
  console.log(itemCodeList, productList);

  const handleUpdatePeripheral = async (data: {
    productCode?: string;
    itemCode?: string;
    path: string;
  }) => {
    console.log(data);
    try {
      dispatch(setLoading(true));
      await ClientApi.updatePeripheral(externalDevices.id, deviceId, data);
      handleCloseModal();
      handleRerender();
      form.resetFields();
      // toast.success(`${t('kiosk.ChangeStatusKiosk.messageSuccess')}`);
      toast.success(`Update Peripheral successfully`);
    } catch (error: any) {
      dispatch(setLoading(false));
      console.log('failed to delete connection', error);
      // toast.error(`${t('kiosk.ChangeStatusKiosk.messageError')}`);
      showToastErrors(error.errors);
      toast.error(`Failed Update Peripheral`);
    }
  };

  useEffect(() => {
    getProductDropdown();
  }, []);

  useEffect(() => {
    // set init Value when externalDevices change
    form.setFieldsValue({
      path: externalDevices.path,
      productCode: externalDevices.productCode,
      itemCode: externalDevices.itemCode,
      hasSerialNumbers: externalDevices.hasSerialNumbers,
    });
  }, [externalDevices.path, isRender]);

  return (
    <Form
      form={form}
      layout="vertical"
      labelWrap
      onFinish={handleUpdatePeripheral}
      name="control-hooks"
    >
      {externalDevices.code !== '' &&
        externalDevices.code &&
        ['DI1', 'DI2', 'DI3', 'DI4'].includes(
          externalDevices.code.toUpperCase()
        ) && (
          <>
            <Form.Item
              className="font-bold  "
              name="productCode"
              label={`${t('kiosk.detail.externalInformation.productCode')}`}
              rules={[{ required: true }]}
              colon
            >
              {productList && (
                <Select
                  placeholder={`${t(
                    'kiosk.detail.externalInformation.productCode'
                  )}`}
                  onChange={handleProductCodeChange}
                  virtual={false}
                >
                  {productList.map((item) => (
                    <Option value={item.productCode} key={item.productCode}>
                      {item.productCode}
                    </Option>
                  ))}
                </Select>
              )}
            </Form.Item>
            {itemCodeList && (
              <Form.Item
                className="font-bold  "
                name="itemCode"
                label={`${t('kiosk.detail.externalInformation.itemCode')}`}
                rules={[{ required: true }]}
                colon
              >
                <Select
                  placeholder={`${t(
                    'kiosk.detail.externalInformation.itemCode'
                  )}`}
                  virtual={false}
                >
                  {itemCodeList.map((item) => (
                    <Option value={item} key={item}>
                      {item}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            )}
            <Form.Item
              className="font-bold  "
              // label={`${t('kiosk.detail.externalInformation.hasSerialNumbers')}`}
              name="hasSerialNumbers"
              valuePropName="checked"
            >
              <Checkbox>
                {t('kiosk.detail.externalInformation.hasSerialNumbers')}
              </Checkbox>
            </Form.Item>
          </>
        )}

      <Form.Item
        className="font-bold  "
        label={`${t('kiosk.detail.externalInformation.devicePath')}`}
        name="path"
        rules={[{ required: true }]}
      >
        <Input className="font-normal" />
      </Form.Item>

      <div className="flex justify-center items-center">
        <Button
          htmlType="submit"
          className="bg-green-500 hover:bg-green-400 flex  items-center px-5 py-4"
          size="large"
          type="primary"
          shape="round"
          icon={<CheckOutlined />}
        >
          {t('buttons.saveChanges')}
        </Button>
      </div>
    </Form>
  );
}
export default EditPeripheral;
