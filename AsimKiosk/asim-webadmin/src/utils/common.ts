import { MenuProps } from 'antd';

type MenuItem = Required<MenuProps>['items'][number];

export function getItem(
  label: React.ReactNode,
  key?: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
  // disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    // disabled,
  } as MenuItem;
}

export function getMenuInventory(
  label: React.ReactNode,
  key?: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
  // disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    // disabled,
  } as MenuItem;
}

export function getLogOut(
  label: React.ReactNode,
  key?: React.Key,
  icon?: React.ReactNode,
  danger?: boolean,
  disabled?: boolean
): MenuItem {
  return {
    key,
    icon,
    label,
    danger,
    disabled,
  } as MenuItem;
}

export const MAX_UPS = 50;
export const MAX_TEMPERTUR = 80;
