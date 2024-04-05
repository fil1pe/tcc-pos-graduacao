import { GetServerSideProps } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import { Head } from '~/components'
import { fetch } from '~/utils'

export default function HomePage() {
  return (
    <>
      <Head />
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
