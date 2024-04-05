import { Button, Container, TextField, Typography } from '@mui/material'
import { getCookie, setCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Head } from '~/components'
import st from '~/styles/LoginPage.module.styl'
import { fetch } from '~/utils'
import { FetchError } from '~/utils/fetch'

export default function LoginPage() {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginInputs>()

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const { accessToken } = await fetch<{ accessToken: string }>(
        'auth/login',
        {
          method: 'post',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      setCookie('user-token', accessToken, {
        path: '/',
      })
      router.push('/')
    } catch (err) {
      let message = 'Erro desconhecido'
      if (err instanceof FetchError) message = err.message
      setError('root', {
        message,
      })
    }
  }

  return (
    <>
      <Head />
      <Container maxWidth="xs" className={st.root}>
        <Typography variant="h1">Login</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            className={st.textField}
            required
            {...register('email')}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            className={st.textField}
            required
            {...register('password')}
          />
          {errors.root && (
            <Typography className={st.error}>{errors.root.message}</Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={st.button}
          >
            {isSubmitting ? 'Carrgando...' : 'Entrar'}
          </Button>
        </form>
      </Container>
    </>
  )
}

interface LoginInputs {
  email: string
  password: string
}

export const getServerSideProps: GetServerSideProps<{}> = async (context) => {
  const jwt = getCookie('user-token', context)

  if (jwt)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  return {
    props: {},
  }
}
