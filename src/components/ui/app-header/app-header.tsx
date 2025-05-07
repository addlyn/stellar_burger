import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import styles from './app-header.module.css';
import { TAppHeaderUIProps } from './type';
import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon
} from '@zlden/react-developer-burger-ui-components';
import { Path } from '../../../constants/path';

export const AppHeaderUI: FC<TAppHeaderUIProps> = ({ userName }) => (
  <header className={styles.header}>
    <nav className={`${styles.menu} p-4`}>
      <div className={styles.menu_part_left}>
        <Link to={Path.home} className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}>
          <BurgerIcon type={'primary'} />
          <p className='text text_type_main-default ml-2 mr-10'>Конструктор</p>
        </Link>
        <Link to={Path.feed} className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}>
          <ListIcon type={'primary'} />
          <p className='text text_type_main-default ml-2'>Лента заказов</p>
        </Link>
      </div>
      <div className={styles.logo}>
        <Link to={Path.home}>
          <Logo className='' />
        </Link>
      </div>
      <div className={styles.link_position_last}>
        <Link
          to={Path.profile}
          className={`${styles.link} pl-5 pr-5 pb-4 pt-4`}
        >
          <ProfileIcon type={'primary'} />
          <p className='text text_type_main-default ml-2' data-cy='user-name'>
            {userName || 'Личный кабинет'}
          </p>
        </Link>
      </div>
    </nav>
  </header>
);
