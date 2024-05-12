import { toast } from 'react-toastify';

export const showToastErrors = (errors: any) => {
  for (let key in errors) {
    if (errors.hasOwnProperty(key)) {
      toast.error(errors[key]);
    }
  }
};
