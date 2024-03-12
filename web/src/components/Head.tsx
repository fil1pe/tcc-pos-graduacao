import Helmet from 'next/head'

export function Head({ title = 'Título do site' }: { title?: string }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
