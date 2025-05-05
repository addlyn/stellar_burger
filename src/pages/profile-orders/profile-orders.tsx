import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchUserOrders } from '../../services/slices/userOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  const orders = useSelector((state) => state.userOrders.orders);
  if (!orders) return <Preloader />;
  return <ProfileOrdersUI orders={orders} />;
};
