import Document, { Html, Head, Main, NextScript } from 'next/document'
import { AppProps } from 'next/app'
import createEmotionServer from '@emotion/server/create-instance'
import { createEmotionCache } from '~/utils'

export default class CustomDocument extends Document<{
  emotionStyleTags: JSX.Element[]
}> {
  render() {
    return (
      <Html lang="pt-BR">
        <Head>{this.props.emotionStyleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

CustomDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  const cache = createEmotionCache()
  const { extractCriticalToChunks } = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) =>
        function EnhanceApp(props: AppProps) {
          return <App emotionCache={cache} {...props} />
        },
    })

  const initialProps = await Document.getInitialProps(ctx)

  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ))

  return {
    ...initialProps,
    emotionStyleTags,
  }
}
