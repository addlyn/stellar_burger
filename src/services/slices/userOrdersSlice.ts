import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';

interface UserOrdersState {
  orders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: UserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const fetchUserOrders = createAsyncThunk(
  'userOrders/fetch',
  async (_, { rejectWithValue }) => {
    try {
      return await getOrdersApi();
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  }
});

export default userOrdersSlice.reducer;
