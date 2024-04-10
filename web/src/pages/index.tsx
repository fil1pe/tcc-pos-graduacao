import { GetServerSideProps } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import { Head, Layout } from '~/components'
import { Typography } from '@mui/material'
import { fetch } from '~/utils'

export default function HomePage() {
  return (
    <>
      <Head />
      <Layout>
        <Typography variant="h1">
          Meus interesses, matches e reservas
        </Typography>
      </Layout>
    </>
  )
}

interface HomePageProps {}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  try {
    const jwt = getCookie('user-token', context)

    await fetch('users/me/interests', {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    })

    return {
      props: {},
    }
  } catch {
    deleteCookie('user-token', context)
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
}
