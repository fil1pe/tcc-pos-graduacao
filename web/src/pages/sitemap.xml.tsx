import { GetServerSideProps } from 'next'

function generateSiteMap(pages: Route[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${pages
        .map(
          (path) => `<url>
              <loc>${process.env.SITE_URL}${path}</loc>
              <changefreq>${path.changeFreq}</changefreq>
              <priority>${path.priority}</priority>
            </url>`
        )
        .join('')}
    </urlset>`.replace(/(^ +)|\n/gm, '')
}

export default function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const sitemap = generateSiteMap([new Route('/')])

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {},
  }
}

class Route {
  path: string
  changeFreq: string
  priority: number

  constructor(
    path: string,
    changeFreq: string = 'daily',
    priority: number = 0.7
  ) {
    this.path = path
    this.changeFreq = changeFreq
    this.priority = priority
  }

  toString() {
    return this.path
  }
}
