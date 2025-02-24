import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/bootstrap.custom.css';
import './assets/styles/index.css';
import App from './App';
import { BrowserRouter, Route, Routes, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import store from './store';
import { Provider } from 'react-redux';
import CartScreen from './screens/cartScreen';
import LoginScreen from './screens/LoginScreen.jsx';
import 'react-toastify/dist/ReactToastify.css';
import RegisterScreen from './screens/RegisterScreen.jsx';
import ShippingScreen from './screens/ShippingScreen.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import PaymentScreen from './screens/PaymentScreen.jsx';
import PlaceOrderScreen from './screens/PlaceOrderScreen.jsx';
import OrderScreen from './screens/OrderScreen.jsx';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import ProfileScreen from './screens/ProfileScreen.jsx';
import AdminRoute from './components/admin/AdminRoute.jsx';
import OrdersListScreen from './screens/admin/OrdersListScreen.jsx';
import ProductsListScreen from './screens/admin/ProductsListScreen.jsx';

export {
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
};