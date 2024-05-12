export interface ILoginInput {
  username: string;
  password: string;
}

export interface ILoginForm {
  username: string;
  password: string;
}

export interface ILoginResponse {
  data: {
    role: string;
    token: string;
    userId: string;
  };
  status: boolean;
}
export interface IForgotPassword {
  email: string;
}
