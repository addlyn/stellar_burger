import { ConstructorPage } from '@pages';
import '../../index.css';
import styles from './app.module.css';
import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Location
} from 'react-router-dom';
import {
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Path } from '../../constants/path';
import { ProtectedRoute } from './hoc/protected-route';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { background?: Location };

  const handleModalClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={state?.background || location}>
        <Route path={Path.home} element={<ConstructorPage />} />
        <Route path={Path.feed} element={<Feed />} />
        <Route
          path={Path.login}
          element={
            <ProtectedRoute onlyForUnauth>
              <Login />
            </ProtectedRoute>
          }
        />
        <Route
          path={Path.register}
          element={
            <ProtectedRoute onlyForUnauth>
              <Register />
            </ProtectedRoute>
          }
        />
        <Route
          path={Path.forgotPassword}
          element={
            <ProtectedRoute onlyForUnauth>
              <ForgotPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={Path.resetPassword}
          element={
            <ProtectedRoute onlyForUnauth>
              <ResetPassword />
            </ProtectedRoute>
          }
        />
        <Route
          path={Path.profile}
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path={Path.profileOrders}
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path={Path.notFound} element={<NotFound404 />} />
      </Routes>

      {state?.background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title='Детали заказа' onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute>
                <Modal title='Детали ' onClose={handleModalClose}>
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
