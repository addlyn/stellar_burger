import { FC, useMemo, useState } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearOrderModal,
  createOrder
} from '../../services/slices/orderCreationSlice';
import { useNavigate } from 'react-router-dom';
import { Path } from '../../constants/path';
import { clearConstructor } from '../../services/slices/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const { orderRequest, orderModalData } = useSelector(
    (state) => state.orderCreation
  );

  const constructorItems = {
    bun: bun,
    ingredients: ingredients || []
  };

  const onOrderClick = () => {
    if (!isAuthenticated) return navigate(Path.login);
    if (!bun || orderRequest) return;
    const ingredientIds = [
      bun._id,
      ...ingredients.map((ing) => ing._id),
      bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => dispatch(clearConstructor()))
      .catch((err) => console.error(err));
  };
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
