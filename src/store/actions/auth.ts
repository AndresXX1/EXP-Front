import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { useAppDispatch } from "@store/hooks";
import { IErrorResponse } from "@store/types/auth";
import { apiUrls, baseUrl, tokenAccess } from "@config/config";
import { alertConfirm, alertError } from "@utils/alerts";
import { jwtDecode } from "jwt-decode";
import { updateAvatar,updateUserById  } from "../services/users";





export const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 5000,
});

let interceptor = 0;

const getToken = () => {
  return localStorage.getItem(tokenAccess.tokenName) || "";
};

const getRefreshToken = () => {
  return localStorage.getItem(tokenAccess.refreshTokenName);
};

const validateToken = async () => {
  if (!getToken() || !getRefreshToken()) {
    return false;
  }
  if (isRefreshTokenAboutToExpire()) {
    return false;
  }
  if (isTokenAboutToExpire()) {
    const updated = await updatedToken();
    if (!updated) {
      return false;
    }
  }
  return true;
};

const updatedToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return false;
  }
  try {
    const response = await axios.post(apiUrls.refreshToken(), {
      refresh_token: refreshToken,
    });
    if (response.data.ok) {
      localStorage.setItem(tokenAccess.tokenName, response.data.token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const updateAvatarAsync = createAsyncThunk<
  any,
  { avatarFile: File; token: string },
  { rejectValue: string }
>(
  "user/updateAvatar",
  async ({ avatarFile, token }, { rejectWithValue }) => {
    if (!avatarFile) {
      throw new Error("No avatar file selected");
    }

    try {
      // Usamos el token que pasamos desde el componente
      const response = await updateAvatar(avatarFile, token);
      return response;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message || 'Error desconocido');
      } else {
        console.error('An unknown error occurred:', error);
        return rejectWithValue('Error desconocido');
      }
    }
  }
);


const isTokenAboutToExpire = (extraTimeInSeconds = 30) => {
  const token = getToken();
  if (!token) {
    return true;
  }
  const decodedToken = jwtDecode(token);
  const currentTime = Date.now() / 1000;
  const expirationTime = decodedToken.exp;
  if (expirationTime !== undefined) {
    return expirationTime - currentTime <= extraTimeInSeconds;
  } else {
    return true;
  }
};

const deleteAccess = async () => {
  try {
    if (await validateToken()) {
      await axios.post(
        apiUrls.logOut(),
        {},
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );
    }
  } finally {
    localStorage.removeItem(tokenAccess.tokenName);
    localStorage.removeItem(tokenAccess.refreshTokenName);
    localStorage.removeItem("completedForm");
  }
};

const isRefreshTokenAboutToExpire = (extraTimeInSeconds = 30) => {
  const refreshtoken = getRefreshToken();
  if (!refreshtoken) {
    return true;
  }
  const decodedToken = jwtDecode(refreshtoken);
  const currentTime = Date.now() / 1000;
  const expirationTime = decodedToken.exp;
  if (expirationTime !== undefined) {
    return expirationTime - currentTime <= extraTimeInSeconds;
  } else {
    return true;
  }
};

export const logOutAsync = createAsyncThunk(
  "auth/logOutAsync",
  async (_, { rejectWithValue }) => {
    try {
      await deleteAccess();
      return {};
    } catch (error) {
      rejectWithValue("error");
    } finally {
      if (interceptor) {
        axiosInstance.interceptors.response.eject(interceptor);
      }
    }
  }
);

const setupAxiosInterceptors = (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  interceptor = axiosInstance.interceptors.request.use(
    async config => {
      try {
        const token = getToken();
        const refreshToken = getRefreshToken();
        if (!token || !refreshToken) {
          dispatch(logOutAsync());
        } else if (isRefreshTokenAboutToExpire()) {
          dispatch(logOutAsync());
        } else if (isTokenAboutToExpire()) {
          const response = await axios.post(apiUrls.refreshToken(), {
            refresh_token: refreshToken,
          });
          if (response.data.ok) {
            config.headers["Authorization"] = `Bearer ${response.data.token}`;
            localStorage.setItem(tokenAccess.tokenName, response.data.token);
          } else {
            dispatch(logOutAsync());
          }
        } else {
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      } catch (error) {
        return Promise.reject(error);
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );
};

export const resendCode = async (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  try {
    const response = await axiosInstance.post(apiUrls.resendCode(), {});
    if (response.data.ok) {
      alertConfirm("Codigo reenviado");
      dispatch(getUserAsync());
    } else {
      alertError("Error al reenviar codigo");
    }
  } catch (error) {
    alertError("Error al reenviar codigo");
  }
};

export const getUserAsync = createAsyncThunk(
  "auth/getUserAsync",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrls.getUser());
      if (response.data.ok) {
        return response.data;
      } else {
        return rejectWithValue("error");
      }
    } catch (error) {
      deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const getAllUser = createAsyncThunk(
  "auth/getAllUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(apiUrls.getUsers());
      if (response.data.ok) {
        return response.data;
      } else {
        return rejectWithValue("error");
      }
    } catch (error) {
      deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const logInAsync = createAsyncThunk(
  "auth/logInAsync",
  async (
    {
      data,
      setActive,
      setError,
      dispatch,
    }: {
      data: {
        email: string;
        password: string;
      };
      setActive: (boolean: boolean) => void;
      setError: (error: string) => void;
      dispatch: ReturnType<typeof useAppDispatch>;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(apiUrls.logIn(), data);
      if (response.data.ok) {
        localStorage.setItem(tokenAccess.tokenName, response.data.token);
        localStorage.setItem(tokenAccess.refreshTokenName, response.data.refreshToken);
        setupAxiosInterceptors(dispatch);
        setActive(false);
        alertConfirm("Sesión iniciada correctamente");
        dispatch(getUserAsync());
        return {};
      } else {
        setError(response.data.message);
        return rejectWithValue("error");
      }
    } catch (error) {
      setActive(false);
      const message =
        (error as IErrorResponse).response.data.message ||
        "Error al iniciar sesión";
      setError(message);
      return rejectWithValue("error");
    }
  }
);

export const verifySessionAsync = createAsyncThunk(
  "auth/verifySessionAsync",
  async (
    {
      dispatch,
    }: {
      dispatch: ReturnType<typeof useAppDispatch>;
    },
    { rejectWithValue }
  ) => {
    if (!(await validateToken())) {
      await deleteAccess();
      return rejectWithValue("error");
    }
    try {
      setupAxiosInterceptors(dispatch);
      await dispatch(getUserAsync());
      return {};
    } catch (error) {
      await deleteAccess();
      return rejectWithValue("error");
    }
  }
);

export const getSessionId = () => {
  const token = getToken();
  if (!token) {
    return null;
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const decodedToken = jwtDecode<any>(token);
  return decodedToken.sessionId;
};

export const deleteSessionById = async (id: number) => {
  try {
    const response = await axiosInstance.delete(apiUrls.deleteSession(id));
    if (response.data.ok) {
      alertConfirm("Sesión eliminada");
      return true;
    } else {
      alertError("Error al eliminar sesión");
      return false;
    }
  } catch (error) {
    alertError("Error al obtener sesiones");
    return false;
  }
};

export const getMySessions = async (
  dispatch: ReturnType<typeof useAppDispatch>
) => {
  try {
    const response = await axiosInstance.get(apiUrls.getSessions());
    if (response.data.ok) {
      return response.data.sessions;
    } else {
      alertError("Error al obtener sesiones");
      dispatch(logOutAsync());
      return [];
    }
  } catch (error) {
    alertError("Error al obtener sesiones");
    dispatch(logOutAsync());
    return [];
  }
};


export const updateUserAsync = createAsyncThunk<
  any,
  { userId: number; userData: { first_name: string; last_name: string; cuil: string; birthday: string; phone: string }; token: string },
  { rejectValue: string }
>(
  "user/updateUser",
  async ({ userId, userData, token }, { rejectWithValue }) => {
    console.log("Token JWT:", token);
    if (!token) {
      return rejectWithValue('Token no encontrado');
    }

    try {
      // Llamada al servicio de actualización de usuario
      const updatedUser = await updateUserById(userId, userData, token);
      
      if (!updatedUser) {
        return rejectWithValue('No se pudo actualizar el usuario');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar el usuario:', error);
      // Mensaje de error más detallado
      return rejectWithValue(  'Error desconocido');
    }
  }
);
