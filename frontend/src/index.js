import { USERS_URL } from './constants.js';
import {
  React,
  ReactDOM,
  App,
  BrowserRouter,
  Route,
  Routes,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  HomeScreen,
  ProductScreen,
  store,
  Provider,
  CartScreen,
  LoginScreen,
  RegisterScreen,
  ShippingScreen,
  PrivateRoute,
  PaymentScreen,
  PlaceOrderScreen,
  OrderScreen,
  PayPalScriptProvider,
  ProfileScreen,
  AdminRoute,
  OrdersListScreen,
  ProductsListScreen
} from './imports.js';

import ProductEditScreen from './screens/admin/ProductEditScreen.jsx';
import UsersListScreen from './screens/admin/UsersListScreen.jsx';
import UserEditScreen from './screens/admin/UserEditScreen.jsx';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} >
      <Route index={true} path='/' element={<HomeScreen />} />
      <Route path='/search/:keyword' element={<HomeScreen />} />
      <Route path='/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/search/:keyword/page/:pageNumber' element={<HomeScreen />} />
      <Route path='/product/:id' element={<ProductScreen />} />
      <Route path='/cart' element={<CartScreen />} />
      <Route path='/auth' element={< LoginScreen />} />
      <Route path='/register' element={<RegisterScreen />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/shipping' element={<ShippingScreen />} />
        <Route path='/payment' element={<PaymentScreen />} />
        <Route path='/placeorder' element={<PlaceOrderScreen />} />
        <Route path='/order/:id' element={<OrderScreen />} />
        <Route path='/profile' element={<ProfileScreen />} />
      </Route>

      <Route path='' element={<AdminRoute />}>
        <Route path='/admin/ordersList' element={<OrdersListScreen />}></Route>
        <Route path='/admin/ordersList/page/:pageNumber' element={<OrdersListScreen />}></Route>
        <Route path='/admin/products' element={<ProductsListScreen />}></Route>
        <Route path='/admin/products/page/:pageNumber/:isAdmin' element={<ProductsListScreen />}></Route>
        <Route path='/admin/product/:id/edit' element={<ProductEditScreen />}></Route>
        <Route path='/admin/users' element={<UsersListScreen />}></Route>
        <Route path='/admin/user/:id/edit' element={<UserEditScreen />}></Route>
      </Route>

    </Route>
  )
)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true} options={{
          "client-id": "test", // Este valor se sobrescribirá cuando se cargue el verdadero client-id
          currency: "USD"
        }}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
  </React.StrictMode>
);
