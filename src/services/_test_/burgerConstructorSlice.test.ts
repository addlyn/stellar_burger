import reducer, {
  addBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} from '../slices/burgerConstructorSlice';
import { TConstructorIngredient } from '@utils-types';

const bun: TConstructorIngredient = {
  id: '1',
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420
};

const mainIngredient: TConstructorIngredient = {
  id: '2',
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242
};

describe('Конструктор бургера', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  it('Должен Инициализировать state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('Должен добавить булку', () => {
    expect(reducer(initialState, addBun(bun))).toEqual({
      ...initialState,
      bun
    });
  });

  it('Должен добавить ингредиент', () => {
    expect(reducer(initialState, addIngredient(mainIngredient))).toEqual({
      bun: null,
      ingredients: [mainIngredient]
    });
  });

  it('Должен удалить игредиент', () => {
    const state = { ...initialState, ingredients: [mainIngredient] };
    expect(reducer(state, removeIngredient(0))).toEqual({
      bun: null,
      ingredients: []
    });
  });

  it('Должен перенести ингредиент вверх', () => {
    const ingredient1 = bun;
    const ingredient2 = mainIngredient;

    const state = { bun: null, ingredients: [ingredient2, ingredient1] };
    expect(reducer(state, moveIngredientUp(1))).toEqual({
      bun: null,
      ingredients: [ingredient1, ingredient2]
    });
  });

  it('Должен перенести ингредиент вниз', () => {
    const ingredient1 = bun;
    const ingredient2 = mainIngredient;

    const state = { bun: null, ingredients: [ingredient1, ingredient2] };
    expect(reducer(state, moveIngredientDown(0))).toEqual({
      bun: null,
      ingredients: [ingredient2, ingredient1]
    });
  });

  it('Должен очистить конструктор', () => {
    const state = {
      bun: bun,
      ingredients: [mainIngredient]
    };
    expect(reducer(state, clearConstructor())).toEqual({
      bun: null,
      ingredients: []
    });
  });
});
