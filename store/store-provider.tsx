'use client';
import React from 'react';
import { Provider } from 'react-redux';

import { store } from './store';

export const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  //  hello world
  return <Provider store={store}>{children}</Provider>;
};

export default Providers;
