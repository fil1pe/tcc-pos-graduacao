import Helmet from 'next/head'

export function Head({ title = 'BookMyLuck' }: { title?: string }) {
  return (
    <Helmet>
      <title>{title}</title>
    </Helmet>
  )
}
