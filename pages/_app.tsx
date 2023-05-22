import '../styles/global.css'
import { AppProps } from 'next/app'
import store, { useAppSelector } from '../reducers/store'
import { Provider } from 'react-redux'
import { useEffect } from 'react'
import Modal from 'react-modal';
import '../i18n'
Modal.setAppElement('#__next');

export default function App({ Component, pageProps }: AppProps) {
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
