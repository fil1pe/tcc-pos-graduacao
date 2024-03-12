/// <reference types="next-stylus" />

import type { AppProps as NextAppProps } from 'next/app'

declare module 'next/app' {
  type AppProps = NextAppProps & {
    emotionCache: EmotionCache
  }
}
