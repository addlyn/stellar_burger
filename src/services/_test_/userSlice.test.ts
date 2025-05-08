import reducer, {
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  initialState
} from '../slices/userSlice';
import { TUser } from '@utils-types';

describe('Редьюсер userSlice', () => {
  const mockUser: TUser = {
    email: 'daria123@test.com',
    name: 'Дарья'
  };

  it('Должен включать индикатор загрузки', () => {
    const newState = reducer(initialState, { type: registerUser.pending.type });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  it('Должен сохранять пользователя и устанавливать isAuthenticated в true при регистрации', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: mockUser
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
  });

  it('Должен сохранять ошибку при неудачной регистрации', () => {
    const action = {
      type: registerUser.rejected.type,
      payload: 'Ошибка регистрации'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка регистрации');
  });

  it('Должен обрабатывать загрузку при авторизации', () => {
    const newState = reducer(initialState, { type: loginUser.pending.type });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  it('Должен сохранять пользователя и устанавливать isAuthenticated в true при логине', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
  });

  it('Должен сохранять ошибку при неудачной авторизации', () => {
    const action = {
      type: loginUser.rejected.type,
      payload: 'Ошибка входа'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка входа');
  });

  it('Должен обрабатывать загрузку при получении данных о пользователе', () => {
    const newState = reducer(initialState, { type: fetchUser.pending.type });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeUndefined();
    expect(newState.isLoading).toBe(true);
  });

  it('Должен загружать данные пользователя при fetchUser', () => {
    const action = {
      type: fetchUser.fulfilled.type,
      payload: mockUser
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
    expect(newState.isLoading).toBe(false);
  });

  it('Должен сбрасывать пользователя при ошибке', () => {
    const action = {
      type: fetchUser.rejected.type,
      payload: 'Ошибка получения данных пользователя'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка получения данных пользователя');
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.user).toBeNull();
    expect(newState.isLoading).toBe(false);
  });

  it('Должен обратывать загрузку при изменении пользователя', () => {
    const newState = reducer(initialState, { type: updateUser.pending.type });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  it('Должен обновлять данные пользователя', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: mockUser
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.user).toEqual(mockUser);
    expect(newState.isAuthenticated).toBe(true);
  });

  it('Должен обрабатывать ошибку при изменении данных пользователя', () => {
    const action = {
      type: updateUser.rejected.type,
      payload: 'Ошибка обновления пользователя'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка обновления пользователя');
  });

  it('Должен сбрасывать данные пользователя при logout', () => {
    const action = { type: logoutUser.fulfilled.type };
    const newState = reducer(initialState, action);
    expect(newState.user).toBeNull();
    expect(newState.isAuthenticated).toBe(false);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBeUndefined();
  });
});
