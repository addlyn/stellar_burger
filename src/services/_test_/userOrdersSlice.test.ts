import reducer, { fetchUserOrders } from '../slices/userOrdersSlice';
import { TOrder } from '@utils-types';

describe('Редьюсер userOrdersSlice', () => {
  const initialState = {
    orders: [],
    loading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: 'order1',
      number: 1001,
      name: 'Супер бургер',
      ingredients: ['ingr1', 'ingr2'],
      status: 'done',
      createdAt: new Date().toDateString(),
      updatedAt: new Date().toDateString()
    }
  ];

  it('Должен включать индикатор загрузки', () => {
    const newState = reducer(initialState, {
      type: fetchUserOrders.pending.type
    });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('Должен сохранять данные заказов', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.orders).toEqual(mockOrders);
  });

  it('Должен сохранять ошибку загрузки заказов', () => {
    const action = {
      type: fetchUserOrders.rejected.type,
      payload: 'Ошибка загрузки заказов'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки заказов');
  });
});
