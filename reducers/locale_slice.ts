import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { i18n } from '../next-i18next.config'

interface LocaleState {
  language: typeof i18n.locales[number];
}

const initialState: LocaleState = {
  language: i18n.defaultLocale,
};

export const localeSlice = createSlice({
  reducers: {
    changeLanguage: (state, action: PayloadAction<typeof i18n.locales[number]>) => {
      state.language = action.payload;
    }
  },
  initialState,
  name: 'locales'
})

export const { changeLanguage } = localeSlice.actions

export default localeSlice.reducer
