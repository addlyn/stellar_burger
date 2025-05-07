import reducer, {
  createOrder,
  clearOrderModal
} from '../slices/orderCreationSlice';
import { TOrder } from '@utils-types';

describe('Редьюсер orderCreationSlice', () => {
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '123',
    number: 1010,
    name: 'Фантастический бургер',
    status: 'done',
    ingredients: ['ingr1', 'ingr2'],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  };

  it('Должен обнулять модальное окно заказа clearOrderModal', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder
    };
    const newState = reducer(stateWithOrder, clearOrderModal());
    expect(newState).toEqual(initialState);
  });

  it('pending - устанавливает флаг запроса', () => {
    const action = { type: createOrder.pending.type };
    const newState = reducer(initialState, action);
    expect(newState.orderRequest).toBe(true);
    expect(newState.error).toBeNull();
  });

  it('fulfilled - сохраняет данные заказа и сбрасывает флаг', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const newState = reducer(initialState, action);
    expect(newState.orderRequest).toBe(false);
    expect(newState.orderModalData).toEqual(mockOrder);
  });

  it('rejected - сохраняет ошибку и сбрасывает флаг', () => {
    const action = {
      type: createOrder.rejected.type,
      payload: 'Ошибка оформления заказа'
    };
    const newState = reducer(initialState, action);
    expect(newState.orderRequest).toBe(false);
    expect(newState.error).toBe('Ошибка оформления заказа');
  });
});
