import { TreeSelect } from 'antd';
import { CarryOutOutlined, GroupOutlined, HddOutlined } from '@ant-design/icons';
import { memo, useEffect, useState } from 'react';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import { TGroupKioskListDropDown, TResOrderCode, TResOrderSearch } from '../../interface';
import ReportApi from '../../service/Report.service';
import { showToastErrors } from '../../utils/toast_errors';
import ClientApi from '../../service/Client.service';
import ProductApi from '../../service/product.service';

const { SHOW_PARENT, SHOW_ALL } = TreeSelect;
let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string[];

const DebounceChangeEvent = (
  value: string[],
  callback: Function,
  treeType: 'GroupKioskList' | 'ProductItemList'
) => {
  if (timeout) {
    console.log('321', timeout);
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const ChangMapValue = async () => {
    if (currentValue === value && value.length > 0 && treeType === 'GroupKioskList') {
      // const newArrayGroupId = value
      //   .filter((item) => item.includes('groupId'))
      //   .map((item) => item.split(':')[1].trim());
      // const newArrayKioskId = value
      //   .filter((item) => item.includes('kioskId'))
      //   .map((item) => item.split(':')[1].trim());

      // use Flat() method to creates a new array with all sub-array elements concatenated into it recursively up to the specified depth. hehehehe hơi bùa 1 xíu :))))))))
      const newValue = value.map((item) => JSON.parse(item.toString()));

      console.log('newValue2: ', newValue.flat(), newValue);
      callback(newValue.flat());
    }

    if (currentValue === value && value.length > 0 && treeType === 'ProductItemList') {
      const newValue = value.map((item) => JSON.parse(item));
      // use Flat() method to creates a new array with all sub-array elements concatenated into it recursively up to the specified depth. hehehehe hơi bùa 1 xíu :))))))))
      console.log('newValue1: ', newValue.flat(), newValue);
      callback(newValue.flat());
    }
  };

  if (value && value.length > 0) {
    timeout = setTimeout(ChangMapValue, 1000);
    console.log('123');
  } else {
    console.log(value);
    callback([]);
  }
};
const initTreeData = [
  {
    title: '',
    icon: <GroupOutlined />,
    value: '',
    key: '',
    children: [
      {
        icon: <HddOutlined />,
        title: '',
        value: '1',
        key: '1',
      },
    ],
  },
];

const SelectTree: React.FC<{
  treeType: 'GroupKioskList' | 'ProductItemList';
  placeholder: string;
  treeIcon?: boolean;
  handleFilter: (value: string[] | []) => void;
}> = ({ placeholder, handleFilter, treeIcon = true, treeType }) => {
  const dispatch = useAppDispatch();
  const [treeData, setTreeData] = useState({
    GroupKioskList: initTreeData,
    ProductItemList: initTreeData,
  });

  const getGroupKioskListDropdown = async () => {
    try {
      dispatch(setLoading(true));

      const response = await ClientApi.getGroupKioskDropdown();
      console.log(response.data.data);
      const newTreeData = response.data.data.map((data) => ({
        title: data.groupName,
        // value of group === kioskId[] of this group
        value: JSON.stringify(data.kiosks.map((item) => item.deviceId)),
        key: JSON.stringify(data.kiosks.map((item) => item.deviceId)),
        // value: `groupId:${data.groupId}`,
        // key: `groupId:${data.groupId}`,
        icon: <GroupOutlined />,
        children: data.kiosks.map((kiosks) => ({
          title: kiosks.kioskName,
          icon: <HddOutlined />,
          value: JSON.stringify(kiosks.deviceId),
          key: JSON.stringify(kiosks.deviceId),
        })),
      }));

      console.log('newTreeDataGroupKioskList', newTreeData);
      setTreeData({ ...treeData, GroupKioskList: newTreeData });
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch ', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getProductDropdown = async () => {
    try {
      dispatch(setLoading(true));
      const response = await ProductApi.getProductDropdown();
      const newTreeData = response.data.data.map((data) => ({
        title: data.productCode,
        // value of productCode === productItem[] of this productCode
        value: JSON.stringify(data.itemCodes),
        key: JSON.stringify(data.itemCodes),
        icon: <GroupOutlined />,
        children: data.itemCodes.map((kiosks) => ({
          title: kiosks,
          icon: <HddOutlined />,
          value: JSON.stringify(kiosks),
          key: JSON.stringify(kiosks),
        })),
      }));

      console.log('newTreeDataItemCode', newTreeData);
      setTreeData({ ...treeData, ProductItemList: newTreeData });
      dispatch(setLoading(false));
    } catch (error: any) {
      console.log('failed to fetch getGroupIdList', error);

      dispatch(setLoading(false));
      showToastErrors(error.errors);
    }
  };

  const onChange = (newValue: string[]) => {
    console.log('onChange ', newValue);
    if (newValue && newValue.length === 0) {
      treeType === 'GroupKioskList' && handleFilter([]);
      treeType === 'ProductItemList' && handleFilter([]);
    } else {
      treeType === 'GroupKioskList' &&
        DebounceChangeEvent(newValue, handleFilter, 'GroupKioskList');
      treeType === 'ProductItemList' &&
        DebounceChangeEvent(newValue, handleFilter, 'ProductItemList');
    }
  };

  useEffect(() => {
    treeType === 'GroupKioskList' && getGroupKioskListDropdown();
    treeType === 'ProductItemList' && getProductDropdown();
  }, []);

  return (
    <TreeSelect
      allowClear={true}
      treeData={treeType === 'GroupKioskList' ? treeData.GroupKioskList : treeData.ProductItemList}
      onChange={onChange}
      treeCheckable={true}
      virtual={false}
      showCheckedStrategy={SHOW_PARENT}
      placeholder={placeholder}
      className="w-full"
      size="large"
      treeIcon={treeIcon}
      // treeLine={false}
      treeDefaultExpandedKeys={
        treeType === 'GroupKioskList'
          ? [treeData.GroupKioskList[0].key]
          : [treeData.ProductItemList[0].key]
      } // lấy value của mảng tại vị trí 0
      showSearch={false}
    />
  );
};
export default memo(SelectTree);
