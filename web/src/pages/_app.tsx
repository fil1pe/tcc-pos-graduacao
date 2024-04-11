import 'reset-css'
import '~/styles/globals.styl'
import { createContext, useState } from 'react'
import { AppProps } from 'next/app'
import { Snackbar, ThemeProvider } from '@mui/material'
import { CacheProvider } from '@emotion/react'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ptBR } from '@mui/x-date-pickers/locales'
import { createEmotionCache, theme } from '~/utils'
import Router from 'next/router'
import NProgress from 'nprogress'

const clientSideEmotionCache = createEmotionCache()

NProgress.configure({
  speed: 150,
  minimum: 0.3125,
  trickleSpeed: 150,
  showSpinner: false,
})
Router.events.on('routeChangeStart', () => NProgress.start())
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export default function App({
  Component,
  pageProps,
  emotionCache = clientSideEmotionCache,
}: AppProps) {
  const [snackbar, setSnackbar] = useState('')

  return (
    <CacheProvider value={emotionCache}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider
          dateAdapter={AdapterDayjs}
          localeText={
            ptBR.components.MuiLocalizationProvider.defaultProps.localeText
          }
        >
          <context.Provider value={{ setSnackbar }}>
            <Component {...pageProps} />
            <Snackbar
              open={!!snackbar}
              autoHideDuration={6000}
              onClose={() => setSnackbar('')}
              message={snackbar}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            />
          </context.Provider>
        </LocalizationProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

export const context = createContext({
  setSnackbar: (msg: string) => {},
})
