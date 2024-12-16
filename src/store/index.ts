import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authSlice from "./reducers/auth";
import Productslice from "./reducers/products";
import addressSlice from "./reducers/user";
import BlockuserSlice from "./reducers/blockUser";

const reducer = combineReducers({
  auth: authSlice,
  Product: Productslice,
  address: addressSlice,
  blckUser: BlockuserSlice,
});

const store = configureStore({
  reducer,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
