import {
  Button,
  Container,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material'
import { getCookie } from 'cookies-next'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Head } from '~/components'
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
        Object.entries(err.errors || {}).map(([name, message]) => {
          setError(name as never, {
            message,
          })
        })
      }
      setError('root', {
        message,
      })
    }
  }

  return (
    <>
      <Head />
      <Container maxWidth="xs" className={st.root}>
        <Typography variant="h1">Cadastro</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
          <TextField
            label="Nome"
            variant="outlined"
            className={st.textField}
            required
            {...register('name')}
          />
          {errors.name && (
            <Typography className={st.errorField}>
              {errors.name.message}
            </Typography>
          )}
          <TextField
            label="CPF"
            variant="outlined"
            className={st.textField}
            required
            {...register('cpf')}
          />
          {errors.cpf && (
            <Typography className={st.errorField}>
              {errors.cpf.message}
            </Typography>
          )}
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            className={st.textField}
            required
            {...register('email')}
          />
          {errors.email && (
            <Typography className={st.errorField}>
              {errors.email.message}
            </Typography>
          )}
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            className={st.textField}
            required
            {...register('password')}
          />
          {errors.password && (
            <Typography className={st.errorField}>
              {errors.password.message}
            </Typography>
          )}
          <TextField
            label="Data de nascimento"
            placeholder="DD/MM/AAAA"
            variant="outlined"
            className={st.textField}
            required
            {...register('birthDate')}
          />
          {errors.birthDate && (
            <Typography className={st.errorField}>
              {errors.birthDate.message}
            </Typography>
          )}
          <TextField
            label="Endereço"
            variant="outlined"
            className={st.textField}
            required
            {...register('address')}
          />
          {errors.address && (
            <Typography className={st.errorField}>
              {errors.address.message}
            </Typography>
          )}
          <TextField
            label="Cidade"
            variant="outlined"
            className={st.textField}
            required
            select
            {...register('city')}
          >
            {cities.map(({ id, name }) => (
              <MenuItem value={id}>{name}</MenuItem>
            ))}
          </TextField>
          {errors.city && (
            <Typography className={st.errorField}>
              {errors.city.message}
            </Typography>
          )}
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
  interface City {
    id: number
    name: string
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
