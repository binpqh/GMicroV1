import { SUPERMAN, ROLE, ADMINISTRATOR, USER } from '../Constant/Role';

export const getPermissionCanHandleRole = (role: string) => {
  console.log(role);
  if (!role) return [];
  if (role.toLowerCase() === SUPERMAN.toLowerCase()) {
    return ROLE.filter(
      (role) => role.name.toLowerCase() != SUPERMAN.toLowerCase()
    );
  }
  if (role.toLowerCase() == ADMINISTRATOR.toLowerCase()) {
    return ROLE.filter(
      (role) =>
        role.name.toLowerCase() !== ADMINISTRATOR.toLowerCase() &&
        role.name.toLowerCase() !== SUPERMAN.toLowerCase()
    );
  }
  return ROLE.filter((role) => role.name.toLowerCase() == USER.toLowerCase());
};
