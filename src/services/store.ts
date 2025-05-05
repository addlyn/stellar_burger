import { configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import ingredientsReducer from './slices/ingredientsSlice';
import userReducer from './slices/userSlice';
import ordersReducer from './slices/orderSlice';
import userOrdersReducer from './slices/userOrdersSlice';
import burgerConstructorReducer from './slices/burgerConstructorSlice';
import orderCreationReducer from './slices/orderCreationSlice';

export const store = configureStore({
  reducer: {
    ingredients: ingredientsReducer,
    user: userReducer,
    orders: ordersReducer,
    userOrders: userOrdersReducer,
    burgerConstructor: burgerConstructorReducer,
    orderCreation: orderCreationReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = dispatchHook;
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
