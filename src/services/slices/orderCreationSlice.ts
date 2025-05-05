import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

interface OrderCreationState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
}

const initialState: OrderCreationState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/create',
  async (ingredients: string[], { rejectWithValue }) => {
    try {
      const response = await orderBurgerApi(ingredients);
      return response.order;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const orderCreationSlice = createSlice({
  name: 'orderCreation',
  initialState,
  reducers: {
    clearOrderModal: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.payload as string;
      });
  }
});

export const { clearOrderModal } = orderCreationSlice.actions;
export default orderCreationSlice.reducer;
