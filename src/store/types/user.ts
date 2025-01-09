/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Address {
  street: string;
  number: number;
  zipCode: string;
  city: string;
  province: string;
}

export interface User {
  [x: string]: any;
  id: number;
  first_name: string;
  last_name: string;
  phone: string;
  address: Address[];
  birthday: string;
  points: number;
  cuponizate: boolean;
  avatar: string;
  gender: string;
  cuil: string;
  bank: string;
  paymentDate: string;
  create: string;
  last_login: string;
  prestamo: Prestamo[];
  score: number;
  email: string;
  zip_code: string;
}

export interface Prestamo {
  numero: string;
  fecha: string;
  monto: number;
  estado_pago: string;
  status: string;
  user?: User;
}
