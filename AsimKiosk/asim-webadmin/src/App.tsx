import ConfigProvider from 'antd/es/config-provider';
import localeEN from 'antd/locale/en_US';
import localeVN from 'antd/locale/vi_VN';

import 'antd/dist/reset.css';
import { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import { SignalRContext, SingalListner } from './Context';
import Loading from './CoreUI/loading';
import { useAppSelector } from './apps/hooks';

import { DefaultRouter } from './router';

import { useTranslation } from 'react-i18next';
import { isLoading } from './apps/Feature/loadingSlice/loadingSlice';

const URL =
  import.meta.env.VITE_HUB_ADDRESS ?? `http://103.107.182.5:9601/KioskHub`;
//or whatever your backend port is

function App() {
  const { i18n } = useTranslation('lng');

  const [newConnection, setNewConnection] = useState<SingalListner | null>(
    null
  );

  useEffect(() => {
    initHubConnection();
  }, []);

  const initHubConnection = async () => {
    const hubKiosk = new SingalListner();
    console.log('initConnection');
    //  const hub = hubKiosk.build();
    // hubKiosk.registerEventListener();
    // const HubConnection = new HubConnectionBuilder()
    //   .withUrl(URL)
    //   .withAutomaticReconnect([10000, 10000, 10000, 10000])
    //   .configureLogging(LogLevel.Information)
    //   .build();
    // try {
    //   await HubConnection.start();
    //   HubConnection?.on("connected", (res) => {
    //     console.log('Connected to the SignalR hub');
    //   })
    // } catch (error) {
    //   console.log('connection error: ', error);
    // }
    setNewConnection(hubKiosk);
  };

  const loading = useAppSelector(isLoading);
  return (
    <ConfigProvider
      // change global language app
      
      locale={i18n.language === 'vi' ? localeVN : localeEN}
      theme={{
        components: {
          Spin: {
            contentHeight: 500,
            dotSizeLG: 70,
          },
        },
        token: {
          colorBgLayout: '#f3f4f6',
          colorBgContainer: '#ffffff',
          colorPrimary: '#ff2f48',
          colorInfo: '#0ea5e9',
          colorWarning: '#FAAD14',
          colorError: '#e71f45',
          colorLink: '#13c2c2',
          // wireframe: true,
        },
      }}
    >
      <SignalRContext.Provider
        value={{
          connection: newConnection,
          setConnection: setNewConnection,
        }}
      >
        {/* <Loading></Loading> */}
        {loading && <Loading />}
        <BrowserRouter>
          <ToastContainer
            theme="light"
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
          />
          <DefaultRouter />
        </BrowserRouter>
      </SignalRContext.Provider>
    </ConfigProvider>
  );
}

export default App;
