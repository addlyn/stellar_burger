import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';

interface OrderState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  loading: boolean;
  error: string | undefined;
  currentOrder: null | TOrder;
  orderLoading: boolean;
  orderError: string | null;
}

const initialState: OrderState = {
  orders: [],
  total: 0,
  totalToday: 0,
  loading: false,
  error: undefined,
  currentOrder: null,
  orderLoading: false,
  orderError: null
};

export const fetchFeeds = createAsyncThunk(
  'feed/fetchFeeds',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getFeedsApi();
      return {
        orders: response.orders,
        total: response.total,
        totalToday: response.totalToday
      } as TOrdersData;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'orders/fetchByNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders[0];
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);
const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderLoading = true;
        state.orderError = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderLoading = false;
        state.orderError = action.payload as string;
      });
  }
});

export default orderSlice.reducer;
