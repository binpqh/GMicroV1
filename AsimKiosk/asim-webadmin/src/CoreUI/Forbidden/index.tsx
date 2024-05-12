import { Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { useAppDispatch } from '../../apps/hooks';
import img403 from '../../assets/img/error.png';
import { setForbidden } from '../../apps/Feature/Forbiden403/forbidenSlice';
import { logout } from '../../apps/Feature/authSlice/authSlice';
import { language } from '../../i18n/i18n';

const { Option } = Select;
export default function Forbidden() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('lng');
  const handleChangeLanguage = (lng: string) => {
    console.log(`selected ${lng}`);
    i18n.changeLanguage(lng);
  };
  return (
    <div className=" bg-colorBgContainer h-screen">
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
      <div className="w-full h-full m-auto container max-w-screen-sm mx-auto  flex justify-center flex-col ">
        <img src={img403} alt="" className="object-center" />
        <div className="text-center font-[700] tracking-wider text-primary-focus sm:text-lg lg:text-xl my-5">
          <h1 className="text-primary sm:text-xl lg:text-2xl">
            {t('403.title')}
          </h1>
          <p> {t('403.description')}</p>
        </div>
        <div className="text-center my-5 flex gap-5 mx-5 md:mx-0 flex-wrap md:flex-nowrap ">
          <Button
            onClick={() => {
              dispatch(setForbidden(false));
              navigate('/dashboard');
            }}
            type="primary"
            size="large"
            className=" w-full bg-successColor rounded-lg hover:bg-successColorHover text-bold "
          >
            {t('GO DASHBOARD.title')}
          </Button>

          <Button
            onClick={() => dispatch(logout())}
            size="large"
            type="primary"
            className="w-full text-bold "
          >
            {t('settingMenuItems.account.signOut').toLocaleUpperCase()}
          </Button>
        </div>
      </div>
    </div>
  );
}
