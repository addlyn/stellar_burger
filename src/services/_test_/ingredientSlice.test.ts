import reducer, { setCurrentIngredient } from '../slices/ingredientsSlice';
import { fetchIngredients } from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Ингредиенты', () => {
  const ingredient1: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
  };

  const ingredient2: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
  };

  const initialState = {
    items: [],
    loading: false,
    error: null,
    currentIngredient: null
  };

  it('Должен инициализировать стейт ingredients', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Должен добавить в стейт выбранный ингредиент', () => {
    expect(reducer(initialState, setCurrentIngredient(ingredient1))).toEqual({
      ...initialState,
      currentIngredient: ingredient1
    });
  });

  it('Должен обработать состояние pendging в получении ингредиента', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      loading: true
    });
  });

  it('Должен обработать состояние fulfilled в получении ингредиента', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [ingredient1, ingredient2]
    };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      items: [ingredient1, ingredient2],
      loading: false
    });
  });

  it('Должен обработать ошибку в получении ингредиентов', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      payload: 'Fetch failed'
    };
    const state = reducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      error: 'Fetch failed',
      loading: false
    });
  });
});
