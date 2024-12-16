/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserProps } from "@utils/interfaces";

export interface IAuthState {
  token: any;
  authenticated: boolean;
  loading: boolean;
  user: UserProps | null;
}

export interface IErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export interface AuthPayload {
  token: string;
  user?: any;
}

export interface IAuthState {
  authenticated: boolean;
  loading: boolean;
  user: UserProps | null;
  updatingAvatar: boolean;
  avatarUpdateError: string | null;
  updatingUser: boolean;
  userUpdateError: null | string;
}

export interface IErrorResponse {
  response: {
    data: {
      message: string;
    };
  };
}

export type UserDataInputType = {
  first_name: string;
  last_name: string;
  cuil: string;
  birthday: string;
  phone: string;
  gender: string;
};
