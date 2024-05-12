import { SearchOutlined } from '@ant-design/icons';
import { Button, Select } from 'antd';
import { memo, useState } from 'react';
import { toast } from 'react-toastify';
import { TResOrderCode, TResOrderSearch } from '../../interface';
import ReportApi from '../../service/Report.service';
import { formatPrice } from '../../utils';
import OrderDetail from '../OrderDetail';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { showToastErrors } from '../../utils/toast_errors';
import { useAppDispatch } from '../../apps/hooks';
const { Option } = Select;
let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const getValueSearch = (value: string, numberGet: number, callback: Function) => {
  if (timeout) {
    clearTimeout(timeout);
    timeout = null;
  }
  currentValue = value;

  const fake = async () => {
    console.log(value);
    if (value !== '' && currentValue === value) {
      try {
        const response = await ReportApi.getFind(value, numberGet);
        console.log(response.data.data);
        callback(response.data.data);
      } catch (error) {
        toast.error(`${error}`);
      }
    }
  };
  if (value) {
    timeout = setTimeout(fake, 500);
  } else {
    callback([]);
  }
};
const SearchInput: React.FC<{
  placeholder: string;
  numberGet: number;
}> = ({ placeholder, numberGet }) => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<TResOrderSearch[]>([]);
  const [detailSearch, setDetailSearch] = useState<{
    isOpen: boolean;
    orderDetail?: TResOrderCode;
  }>({
    isOpen: false,
  });

  const handleSearch = (newValue: string) => {
    getValueSearch(newValue, numberGet, setData);
  };

  const handleChange = (newValue: string) => {
    console.log(newValue);
    // get detail Order by orderCode
    {
      newValue && takeResBookingById(newValue);
    }
  };

  const takeResBookingById = async (orderCode: string) => {
    try {
      dispatch(setLoading(true));
      const response = await ReportApi.getDetailOrder(orderCode);
      console.log(response.data.data);
      setDetailSearch({ isOpen: true, orderDetail: response.data.data });
    } catch (error: any) {
      showToastErrors(error.errors);
      console.log('failed to fetch ', error);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleCloseModal = () => {
    setDetailSearch({ isOpen: false });
  };

  return (
    <>
      <Select
        className="w-full h-fit scroll-smooth overflow-auto"
        showSearch={true}
        virtual={false}
        allowClear
        placeholder={placeholder}
        defaultActiveFirstOption={false}
        size="large"
        filterOption={false}
        onSearch={handleSearch}
        onChange={handleChange}
        notFoundContent={null}
        options={(data || []).map((item) => ({
          value: item.orderCode,
          label: `${item.orderCode} - Tổng tiền: ${formatPrice(item.totalMountVND)}`,
        }))}
      ></Select>
      {detailSearch.orderDetail && (
        <OrderDetail
          isModalOpen={detailSearch.isOpen}
          handleCloseModal={handleCloseModal}
          dataDetail={detailSearch.orderDetail}
        />
      )}
    </>
  );
};
export default memo(SearchInput);
