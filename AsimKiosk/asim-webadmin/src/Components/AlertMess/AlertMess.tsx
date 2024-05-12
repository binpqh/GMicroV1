import React from 'react';
import { Alert, Space } from 'antd';

type AlertMessProps = {
  message: React.ReactNode | string;
  type: 'success' | 'info' | 'warning' | 'error';
  showIcon: boolean;
  closable?: boolean;
  className?: string;
};
const AlertMess = ({
  message,
  type,
  showIcon,
  closable = false,
  className,
}: AlertMessProps) => (
  <Alert
    className={`font-semibold ${className && className}
    ${type === 'info' && 'text-infoColor'}
    ${type === 'success' && 'text-successColor'}
    ${type === 'warning' && 'text-warningColor'}
    ${type === 'error' && 'text-errorColor'}`}
    message={message}
    type={type}
    showIcon={showIcon}
    closable={closable}
  />
);

export default AlertMess;
