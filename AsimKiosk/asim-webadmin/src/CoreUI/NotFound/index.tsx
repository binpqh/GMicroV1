import { useNavigate } from 'react-router';
import img404 from '../../assets/img/404.png';
import { Button, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { language } from '../../i18n/i18n';

const { Option } = Select;
export default function NotFound() {
  const { t, i18n } = useTranslation('lng');

  const navigate = useNavigate();

  const handleChangeLanguage = (lng: string) => {
    console.log(`selected ${lng}`);
    i18n.changeLanguage(lng);
  };

  console.log(i18n.language);
  return (
    <div className=" bg-white h-screen ">
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
      <div className="h-full w-full container max-w-screen-lg  flex justify-center flex-col m-auto">
        <img src={img404} alt="" className="object-center" />
        <div className="text-center font-[900] tracking-wider text-primary-focus sm:text-lg lg:text-xl">
          <h1 className="text-primary sm:text-xl lg:text-2xl">
            {t('404.title')}
          </h1>
          <p> {t('404.description')}</p>
        </div>

        <div
          className="text-center my-5  "
          onClick={() => navigate('/dashboard')}
        >
          <Button
            type="primary"
            size="large"
            className="btn w-3/6 bg-green-500 rounded-lg hover:bg-green-500 glass  text-bold "
          >
            {t('GO DASHBOARD.title')}
          </Button>
        </div>
      </div>
    </div>
  );
}
