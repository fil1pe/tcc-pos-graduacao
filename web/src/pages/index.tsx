import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import { Head, Layout } from '~/components'
import { Button, MenuItem, TextField, Typography } from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import AddIcon from '@mui/icons-material/Add'
import { fetch } from '~/utils'
import { FetchError } from '~/utils/fetch'
import { useContext } from '~/hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import st from '~/styles/Form.module.styl'

export default function HomePage({ serviceTypes }: HomePageProps) {
  const [formVisible, setFormVisible] = useState(false)

  const { setSnackbar } = useContext()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    setError,
    reset,
  } = useForm<InterestInputs>()

  const minDateProps = register('minDate')
  const maxDateProps = register('maxDate')

  const onSubmit: SubmitHandler<InterestInputs> = async (data) => {
    try {
      const jwt = getCookie('user-token')
      await fetch('interests', {
        method: 'POST',
        body: JSON.stringify({ ...data, people: Number(data.people) }),
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      })
      setSnackbar('Interesse registrado com sucesso')
      setFormVisible(false)
      reset()
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
        <Typography variant="h1">
          Meus interesses, matches e reservas
        </Typography>

        {formVisible ? (
          <form onSubmit={handleSubmit(onSubmit)} className={st.form}>
            <TextField
              label="Tipo de serviço"
              variant="outlined"
              required
              select
              error={!!errors.serviceType}
              {...register('serviceType')}
            >
              {serviceTypes.map(({ id, name }) => (
                <MenuItem value={id} key={id}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
            {errors.serviceType && (
              <Typography className={st.error}>
                {errors.serviceType.message}
              </Typography>
            )}
            <TextField
              label="Preço mínimo"
              variant="outlined"
              required
              error={!!errors.minPrice}
              {...register('minPrice')}
            />
            {errors.minPrice && (
              <Typography className={st.error}>
                {errors.minPrice.message}
              </Typography>
            )}
            <TextField
              label="Preço máximo"
              variant="outlined"
              required
              error={!!errors.maxPrice}
              {...register('maxPrice')}
            />
            {errors.maxPrice && (
              <Typography className={st.error}>
                {errors.maxPrice.message}
              </Typography>
            )}
            <DateTimePicker
              ampm={false}
              format="DD/MM/YYYY HH:mm"
              label="Primeira data e horário"
              slotProps={{
                textField: {
                  variant: 'outlined',
                  required: true,
                  error: !!errors.minDate,
                },
              }}
              ref={minDateProps.ref}
              name={minDateProps.name}
              onChange={(e) => {
                try {
                  setValue('minDate', e?.toISOString() || '')
                } catch {
                  setValue('minDate', '')
                }
              }}
            />
            {errors.minDate && (
              <Typography className={st.error}>
                {errors.minDate.message}
              </Typography>
            )}
            <DateTimePicker
              ampm={false}
              format="DD/MM/YYYY HH:mm"
              label="Última data e horário"
              slotProps={{
                textField: {
                  variant: 'outlined',
                  required: true,
                  error: !!errors.maxDate,
                },
              }}
              ref={maxDateProps.ref}
              name={maxDateProps.name}
              onChange={(e) => {
                try {
                  setValue('maxDate', e?.toISOString() || '')
                } catch {
                  setValue('maxDate', '-')
                }
              }}
            />
            {errors.maxDate && (
              <Typography className={st.error}>
                {errors.maxDate.message}
              </Typography>
            )}
            <TextField
              label="Quantidade de pessoas"
              variant="outlined"
              required
              error={!!errors.people}
              {...register('people')}
            />
            {errors.people && (
              <Typography className={st.error}>
                {errors.people.message}
              </Typography>
            )}
            {errors.root && (
              <Typography className={st.error}>
                {errors.root.message}
              </Typography>
            )}
            <Button variant="contained" type="submit" className={st.button}>
              {isSubmitting ? 'Enviando...' : 'Enviar'}
            </Button>
          </form>
        ) : (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setFormVisible(true)}
            className={st.add}
          >
            Adicionar interesse
          </Button>
        )}
      </Layout>
    </>
  )
}

interface InterestInputs {
  serviceType: number
  minPrice: number
  maxPrice: number
  minDate: string
  maxDate: string
  people: number
}

interface HomePageProps {
  serviceTypes: ApiOption[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  try {
    const jwt = getCookie('user-token', context)

    const [_, serviceTypes] = await Promise.all([
      fetch('users/me/interests', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      fetch<ApiOption[]>('services/types'),
    ])

    return {
      props: {
        serviceTypes,
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
