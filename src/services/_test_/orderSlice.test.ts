import reducer, {
  fetchFeeds,
  fetchOrderByNumber,
  initialState
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

describe('Редьюсер orderSlice', () => {
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

  it('fetchFeeds.pending — включает индикатор загрузки', () => {
    const newState = reducer(initialState, { type: fetchFeeds.pending.type });
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeUndefined();
  });

  it('Должен сохранять данные заказов fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: {
        orders: mockOrders,
        total: 200,
        totalToday: 10
      }
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.orders).toEqual(mockOrders);
    expect(newState.total).toBe(200);
    expect(newState.totalToday).toBe(10);
  });

  it('Должен сохранять данные заказов reject', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      payload: 'Ошибка загрузки заказов'
    };
    const newState = reducer(initialState, action);
    expect(newState.loading).toBe(false);
    expect(newState.error).toBe('Ошибка загрузки заказов');
  });

  it('Должен включать индикатор загрузки заказа', () => {
    const newState = reducer(initialState, {
      type: fetchOrderByNumber.pending.type
    });
    expect(newState.orderLoading).toBe(true);
    expect(newState.orderError).toBeNull();
  });

  it('Должен сохранять заказ в текущий заказ', () => {
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrders[0]
    };
    const newState = reducer(initialState, action);
    expect(newState.orderLoading).toBe(false);
    expect(newState.currentOrder).toEqual(mockOrders[0]);
  });

  it('Должен сохранять ошибку заказа', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Ошибка получения заказа'
    };
    const newState = reducer(initialState, action);
    expect(newState.orderLoading).toBe(false);
    expect(newState.orderError).toBe('Ошибка получения заказа');
  });
});
