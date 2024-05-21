'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      {/* <PersistGate persistor={persistor} loading={<Loader />}> */}
      {children}
      {/* </PersistGate> */}
    </Provider>
  );
};

export default Providers;
