import { configureStore } from '@reduxjs/toolkit'
import light_slice from './light/light_slice'
import figure_slice from './figure/figure_slice';
import mode_slice from './mode/mode_slice';
import neonsign_slice from './neonsign/neonsign_slice';
import locale_slice from './locale_slice';

export const store = configureStore({
  reducer: {
    light: light_slice,
    figure: figure_slice,
    mode: mode_slice,
    neonsign: neonsign_slice,
    locale: locale_slice,
  }
})

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export default store;
