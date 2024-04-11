import { GetServerSideProps } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import { Head, Layout } from '~/components'
import { useContext } from '~/hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import moment from 'moment'
import { Button, MenuItem, TextField, Typography } from '@mui/material'
import st from '~/styles/Form.module.styl'
import { fetch } from '~/utils'
import { FetchError } from '~/utils/fetch'

export default function UserPage({ user, cities }: UserPageProps) {
  const { setSnackbar } = useContext()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<UserInputs>({
    defaultValues: {
      ...user,
      city: user.city.id,
      birthDate: moment(user.birthDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
    },
  })

  const onSubmit: SubmitHandler<UserInputs> = async (data) => {
    try {
      const jwt = getCookie('user-token')
      await fetch('users/me', {
        method: 'PATCH',
        body: JSON.stringify(data),
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      })
      setSnackbar('Dados alterados com sucesso')
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
      <Layout>
        <Typography variant="h1">Meus dados</Typography>
        <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
          <TextField
            label="Nome"
            variant="outlined"
            required
            error={!!errors.name}
            {...register('name')}
          />
          {errors.name && (
            <Typography className={st.error}>{errors.name.message}</Typography>
          )}
          <TextField
            label="E-mail"
            type="email"
            variant="outlined"
            required
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email && (
            <Typography className={st.error}>{errors.email.message}</Typography>
          )}
          <TextField
            label="Senha atual"
            type="password"
            variant="outlined"
            required
            error={!!errors.currentPassword}
            {...register('currentPassword')}
          />
          {errors.currentPassword && (
            <Typography className={st.error}>
              {errors.currentPassword.message}
            </Typography>
          )}
          <TextField
            label="Nova senha"
            type="password"
            variant="outlined"
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
            required
            select
            defaultValue={user.city.id}
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
            <Typography className={st.error}>{errors.city.message}</Typography>
          )}
          {errors.root && (
            <Typography className={st.error}>{errors.root.message}</Typography>
          )}
          <Button variant="contained" type="submit" className={st.button}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </Layout>
    </>
  )
}

interface UserInputs {
  name: string
  email: string
  currentPassword: string
  password: string
  birthDate: string
  address: string
  city: number
}

declare global {
  interface User {
    name: string
    email: string
    birthDate: string
    address: string
    city: City
  }
}

interface UserPageProps {
  user: User
  cities: City[]
}

export const getServerSideProps: GetServerSideProps<UserPageProps> = async (
  context
) => {
  try {
    const jwt = getCookie('user-token', context)

    const [user, cities] = await Promise.all([
      fetch<User>('users/me', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      fetch<City[]>('cities'),
    ])

    return {
      props: {
        user,
        cities,
      },
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
