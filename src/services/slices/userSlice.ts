import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TUser } from '@utils-types';

interface UserState {
  user: TUser | null;
  loading: boolean;
  error: string | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const initialState: UserState = {
  user: null,
  loading: false,
  error: undefined,
  isAuthenticated: false,
  isLoading: true
};

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: string }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    const response = await registerUserApi(data);
    return response.user;
  } catch (error: unknown) {
    const message = (error as Error).message || 'Unknown error';
    return rejectWithValue(message);
  }
});

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    try {
      const response = await loginUserApi(data);
      return response.user;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  'user/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: Partial<TRegisterData>, { rejectWithValue }) => {
    try {
      const response = await updateUserApi(user);
      return response.user;
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

export const logoutUser = createAsyncThunk<void, void, { rejectValue: string }>(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch (error: unknown) {
      const message = (error as Error).message || 'Unknown error';
      return rejectWithValue(message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<TUser | undefined>) => {
          if (action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
        state.isLoading = true;
      })
      .addCase(
        fetchUser.fulfilled,
        (state, action: PayloadAction<TUser | undefined>) => {
          if (action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
          } else {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
          }
        }
      )
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(
        updateUser.fulfilled,
        (state, action: PayloadAction<TUser | undefined>) => {
          if (action.payload) {
            state.user = action.payload;
            state.isAuthenticated = true;
          } else {
            state.user = null;
            state.isAuthenticated = false;
          }
        }
      )
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = undefined;
      });
  }
});

export const selectUser = (state: RootState) => state.user.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;
