import { Button, Drawer, Select, Space } from 'antd';
import { ReactNode, memo } from 'react';

export interface IDrawerProps {
  openDrawer: boolean;
  handleCloseDrawer: () => void;
  handleSubmit?: () => void;
  children: ReactNode;
  width: string;
  closeTitle?: string;
  submitTitle?: string;
  title: string;
}

function DrawerComponents({
  openDrawer,
  handleCloseDrawer,
  handleSubmit,
  children,
  width,
  closeTitle,
  submitTitle,
  title,
}: IDrawerProps) {
  return (
    <>
      <Drawer
        title={<h2 className="text-lg xl:text-xl text-primary">{title}</h2>}
        width={width}
        onClose={handleCloseDrawer}
        open={openDrawer}
        // styles={{
        //   body: {
        //     paddingBottom: 80,
        //   },
        // }}
        extra={
          <Space>
            {closeTitle && (
              <Button onClick={handleCloseDrawer}>{closeTitle}</Button>
            )}
            {submitTitle && (
              <Button onClick={handleSubmit} type="primary">
                {submitTitle}
              </Button>
            )}
          </Space>
        }
      >
        {children}
      </Drawer>
    </>
  );
}
export default memo(DrawerComponents);
