import { SearchOutlined, UserOutlined } from '@ant-design/icons';
import {
  AutoComplete,
  Button,
  Card,
  Descriptions,
  Input,
  Modal,
  Select,
  Space,
  Table,
  Tag,
} from 'antd';
import { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { setLoading } from '../../apps/Feature/loadingSlice/loadingSlice';
import { useAppDispatch } from '../../apps/hooks';
import debounce from 'lodash.debounce';

import ReportApi from '../../service/Report.service';
import { formatPrice } from '../../utils';
import { useTranslation } from 'react-i18next';
import { TResOrderSearch } from '../../interface';
const { Option } = Select;
const { Search } = Input;
let usageTime: string;
export interface SearchDetail {
  numberGet: number;
}
const renderTitle = (title: any) => (
  <span>
    {title}
    <a
      style={{
        float: 'right',
      }}
      href="https://www.google.com/search?q=antd"
      target="_blank"
      rel="noopener noreferrer"
    >
      more
    </a>
  </span>
);

const renderItem = (title: any, count: any) => ({
  value: title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      <span>
        <UserOutlined /> {count}
      </span>
    </div>
  ),
});

export default function SearchDetail({ numberGet }: SearchDetail) {
  const { t } = useTranslation('lng');
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [data, setData] = useState<TResOrderSearch[]>([]);

  const handleSearch = async (value: string) => {
    console.log(value);
    if (value !== '') {
      try {
        // dispatch(setLoading(true));
        const response = await ReportApi.getFind(value, numberGet);
        console.log(response.data.data);
        setData(response.data.data);
        // dispatch(setLoading(false));
        // setIsModalOpen(true);
      } catch (error) {
        dispatch(setLoading(false));
        toast.error(`${error}`);
      }
    }
  };

  const onSearch = (value: string) => {
    handleSearch(value);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // Debounce function
  const debouncedSearch = debounce((query: string) => {
    handleSearch(query);
  }, 500); // 1000 milliseconds debounce delay

  // Event handler for input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    debouncedSearch(query);
  };
  const handleChange = (newValue: string) => {
    console.log(newValue);
    // setValue(newValue);
  };
  const options = [
    {
      label: renderTitle('Libraries'),
      options: [renderItem('AntDesign', 10000), renderItem('AntDesign UI', 10600)],
    },
    {
      label: renderTitle('Solutions'),
      options: [renderItem('AntDesign UI FAQ', 60100), renderItem('AntDesign FAQ', 30010)],
    },
    {
      label: renderTitle('Articles'),
      options: [renderItem('AntDesign design language', 100000)],
    },
    {
      label: renderTitle('Teste'),
      options: [renderItem('AntDesign design language1', 100000)],
    },
    {
      label: renderTitle('Teste2'),
      options: [renderItem('AntDesign design language2', 100000)],
    },
    {
      label: renderTitle('teste3'),
      options: [renderItem('AntDesign design language3', 100000)],
    },
  ];

  return (
    <div>
      {/* <Space.Compact className="border-2 rounded-2xl bg-white hover:border-primary  border-[#ccc]	w-full"> */}
      <AutoComplete
        className="w-full  "
        onChange={handleChange}
        virtual={false}
        popupClassName="certain-category-search-dropdown "
        popupMatchSelectWidth={500}
        options={(data || []).map((item) => ({
          value: item.orderCode,
          label: `${item.orderCode} - Tổng tiền: ${formatPrice(item.totalMountVND)}`,
        }))}
        // options={options}
        size="large"
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
      >
        <Search
          // className="w-full inline-flex justify-center items-center "
          enterButton={
            <Button type="primary" icon={<SearchOutlined style={{ fontSize: '18px' }} />}>
              {t('buttons.search')}
            </Button>
          }
          size="large"
          placeholder={` Nhập mã đơn hàng`}
          onSearch={onSearch}
          allowClear={true}
          onChange={(event) => handleInputChange(event)}
        />
      </AutoComplete>
    </div>
  );
}
