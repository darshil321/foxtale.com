'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from './store';
import LoadingDots from '@/components/loading-dots';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //  hello world
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<LoadingDots />}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default Providers;
