import { GetServerSideProps } from 'next'

function generateRobots() {
  return (
    'User-agent: *\n' +
    'Allow: /\n' +
    `Sitemap: ${process.env.SITE_URL}/sitemap.xml\n` +
    `Host: ${process.env.SITE_URL}/`
  )
}

export default function Robots() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  const robots = generateRobots()

  res.setHeader('Content-Type', 'text/plain')
  res.write(robots)
  res.end()

  return {
    props: {},
  }
}
