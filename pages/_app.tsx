import '../styles/global.css'
import { AppProps } from 'next/app'
import store, { useAppSelector } from '../reducers/store'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import Modal from 'react-modal';
import { appWithTranslation } from 'next-i18next'
Modal.setAppElement('#__next');

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <Provider store={store}>
      <ModeEffect />
      <Component {...pageProps} />
    </Provider>
  )
}

function ModeEffect() {
  const mode = useAppSelector(state => state.mode.value)
  useEffect(() => {
    document.documentElement.className = mode;
  }, [mode])
  return null;
}

export default appWithTranslation(App)
