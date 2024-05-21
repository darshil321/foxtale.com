'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import Navbar from '@/components/layout/navbar';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<Navbar></Navbar>}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
