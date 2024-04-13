import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material'
import { getCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Head, Link } from '~/components'
import st from '~/styles/LoginPage.module.styl'
import { fetch } from '~/utils'
import { FetchError } from '~/utils/fetch'

export default function Register({ cities }: RegisterPageProps) {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterInputs>()

  const onSubmit: SubmitHandler<RegisterInputs> = async (data) => {
    try {
      await fetch<{ accessToken: string }>('users', {
        method: 'post',
        body: JSON.stringify({ ...data, cpf: data.cpf.replace(/\D/g, '') }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      router.push('/login')
    } catch (err) {
      let message = 'Erro desconhecido'
      if (err instanceof FetchError) {
        message = err.message
        Object.entries(err.errors || {}).map(([name, fieldMessage]) => {
          if (message === fieldMessage) message = ''
          setError(name as never, {
            message: fieldMessage,
          })
        })
      }
      message &&
        message !== 'Corrija os erros e tente novamente' &&
        setError('root', {
          message,
        })
    }
  }

  return (
    <>
      <Head />
      <Box>
        <CssBaseline />
        <AppBar
          position="fixed"
          sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
          <Toolbar>
            <Typography variant="h6" noWrap component="div">
              BookMyLuck
            </Typography>
          </Toolbar>
        </AppBar>

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Toolbar />
          <Container className={st.root}>
            <Typography variant="h1">Cadastro</Typography>
            <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
              <TextField
                label="Nome"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.name}
                {...register('name')}
              />
              {errors.name && (
                <Typography className={st.error}>
                  {errors.name.message}
                </Typography>
              )}
              <TextField
                label="CPF"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.cpf}
                {...register('cpf')}
              />
              {errors.cpf && (
                <Typography className={st.error}>
                  {errors.cpf.message}
                </Typography>
              )}
              <TextField
                label="E-mail"
                type="email"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.email}
                {...register('email')}
              />
              {errors.email && (
                <Typography className={st.error}>
                  {errors.email.message}
                </Typography>
              )}
              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.password}
                {...register('password')}
              />
              {errors.password && (
                <Typography className={st.error}>
                  {errors.password.message}
                </Typography>
              )}
              <TextField
                label="Data de nascimento"
                placeholder="DD/MM/AAAA"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.birthDate}
                {...register('birthDate')}
              />
              {errors.birthDate && (
                <Typography className={st.error}>
                  {errors.birthDate.message}
                </Typography>
              )}
              <TextField
                label="Endereço"
                variant="outlined"
                className={st.textField}
                required
                error={!!errors.address}
                {...register('address')}
              />
              {errors.address && (
                <Typography className={st.error}>
                  {errors.address.message}
                </Typography>
              )}
              <TextField
                label="Cidade"
                variant="outlined"
                className={st.textField}
                required
                select
                error={!!errors.city}
                {...register('city')}
              >
                {cities.map(({ id, name }) => (
                  <MenuItem value={id} key={id}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
              {errors.city && (
                <Typography className={st.error}>
                  {errors.city.message}
                </Typography>
              )}
              {errors.root && (
                <Typography className={st.error}>
                  {errors.root.message}
                </Typography>
              )}
              <Typography>
                Já tem cadastro? Entre <Link href="/login">aqui</Link>.
              </Typography>
              <Button variant="contained" type="submit" className={st.button}>
                {isSubmitting ? 'Enviando...' : 'Enviar'}
              </Button>
            </form>
          </Container>
        </Box>
      </Box>
    </>
  )
}

interface RegisterInputs {
  name: string
  cpf: string
  email: string
  password: string
  birthDate: string
  address: string
  city: number
}

declare global {
  interface ApiOption {
    id: number
    name: string
  }

  interface City extends ApiOption {
    uf: string
  }
}

interface RegisterPageProps {
  cities: City[]
}

export const getServerSideProps: GetServerSideProps<RegisterPageProps> = async (
  context
) => {
  const jwt = getCookie('user-token', context)

  if (jwt)
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }

  const cities = await fetch<City[]>('cities')

  return {
    props: {
      cities,
    },
  }
}
