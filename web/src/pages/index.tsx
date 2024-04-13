import { useState } from 'react'
import { GetServerSideProps } from 'next'
import { deleteCookie, getCookie } from 'cookies-next'
import { Head, Layout } from '~/components'
import {
  Button,
  IconButton,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { DateTimePicker } from '@mui/x-date-pickers'
import AddIcon from '@mui/icons-material/Add'
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import DeleteIcon from '@mui/icons-material/Delete'
import PendingIcon from '@mui/icons-material/Pending'
import { fetch, formatDate } from '~/utils'
import { FetchError } from '~/utils/fetch'
import { useContext } from '~/hooks'
import { SubmitHandler, useForm } from 'react-hook-form'
import st from '~/styles/Form.module.styl'

export default function HomePage({
  interests: _interests,
  serviceTypes,
}: HomePageProps) {
  const [interests, setInterests] =
    useState<(Interest & { loading?: boolean })[]>(_interests)
  const [formVisible, setFormVisible] = useState(false)
  const [locked, setLocked] = useState(false)

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

  const jwt = getCookie('user-token')

  const onSubmit: SubmitHandler<InterestInputs> = async (data) => {
    try {
      const interest = await fetch<
        Omit<Omit<Interest, 'match'>, 'serviceType'> & {
          serviceType: { id: number }
        }
      >('interests', {
        method: 'POST',
        body: JSON.stringify({ ...data, people: Number(data.people) }),
        headers: {
          Authorization: `Bearer ${jwt}`,
          'Content-Type': 'application/json',
        },
      })
      setInterests([
        ...interests,
        {
          ...interest,
          minPrice: Number(interest.minPrice).toFixed(2),
          maxPrice: Number(interest.maxPrice).toFixed(2),
          serviceType: serviceTypes.find(({ id }) => id === data.serviceType)!,
          match: null,
        },
      ])
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

        <TableContainer component={Paper} className={st.table}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Serviço</TableCell>
                <TableCell align="right">Preço</TableCell>
                <TableCell align="right">Data e horário</TableCell>
                <TableCell align="right">Qtde. pessoas</TableCell>
                <TableCell align="right">Estabelecimento</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {interests.map(
                ({
                  id,
                  serviceType,
                  minDate,
                  maxDate,
                  minPrice,
                  maxPrice,
                  people,
                  match,
                  loading,
                }) => (
                  <TableRow
                    key={id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      transition:
                        'opacity 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                      pointerEvents: loading ? 'none' : 'auto',
                      opacity: loading ? 0.5 : 1,
                    }}
                  >
                    <TableCell>{serviceType.name}</TableCell>
                    <TableCell align="right">
                      R${' '}
                      {match
                        ? match.offer.service.price
                        : minPrice + ' - ' + maxPrice}
                    </TableCell>
                    <TableCell align="right">
                      {match
                        ? formatDate(match.offer.date)
                        : formatDate(minDate) + ' - ' + formatDate(maxDate)}
                    </TableCell>
                    <TableCell align="right">{people}</TableCell>
                    <TableCell align="right">
                      {match ? (
                        <>
                          {match.offer.service.establishment.name}
                          <br />
                          {match.offer.service.establishment.address}
                          <br />
                          {match.offer.service.establishment.city.name},{' '}
                          {match.offer.service.establishment.city.uf}
                        </>
                      ) : (
                        <PendingIcon titleAccess="Pendente" />
                      )}
                    </TableCell>
                    <TableCell align="right">
                      {match && !match.reserved && (
                        <IconButton
                          onClick={async () => {
                            if (locked) return
                            setLocked(true)
                            setInterests(
                              interests.map((interest) => {
                                if (interest.id !== id) return interest
                                return {
                                  ...interest,
                                  loading: true,
                                }
                              })
                            )
                            try {
                              await fetch(`interests/${id}/reserve`, {
                                method: 'POST',
                                headers: {
                                  Authorization: `Bearer ${jwt}`,
                                },
                              })
                              setInterests(
                                interests.map((interest) => {
                                  if (interest.id !== id) return interest
                                  return {
                                    ...interest,
                                    loading: false,
                                    match: {
                                      ...interest.match!,
                                      reserved: true,
                                    },
                                  }
                                })
                              )
                              setSnackbar('Reserva efetuada com sucesso')
                            } catch (err) {
                              console.error(err)
                              if (err instanceof Error) setSnackbar(err.message)
                              setInterests(
                                interests.map((interest) => {
                                  if (interest.id !== id) return interest
                                  return {
                                    ...interest,
                                    loading: false,
                                  }
                                })
                              )
                            }
                            setLocked(false)
                          }}
                        >
                          <BookmarkBorderIcon />
                        </IconButton>
                      )}
                      {match?.reserved && (
                        <IconButton disabled>
                          <BookmarkIcon />
                        </IconButton>
                      )}
                      <IconButton
                        onClick={async () => {
                          if (locked) return
                          setLocked(true)
                          setInterests(
                            interests.map((interest) => {
                              if (interest.id !== id) return interest
                              return {
                                ...interest,
                                loading: true,
                              }
                            })
                          )
                          try {
                            await fetch('interests/' + id, {
                              method: 'DELETE',
                              headers: {
                                Authorization: `Bearer ${jwt}`,
                              },
                            })
                            setInterests(
                              interests.filter((interest) => interest.id !== id)
                            )
                            setSnackbar('Interesse removido com sucesso')
                          } catch (err) {
                            console.error(err)
                            if (err instanceof Error) setSnackbar(err.message)
                            setInterests(
                              interests.map((interest) => {
                                if (interest.id !== id) return interest
                                return {
                                  ...interest,
                                  loading: false,
                                }
                              })
                            )
                          }
                          setLocked(false)
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                )
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {formVisible ? (
          <form
            onSubmit={
              locked ? (e) => e.preventDefault() : handleSubmit(onSubmit)
            }
            className={st.form}
          >
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
              {isSubmitting ? 'Enviando...' : 'Adicionar'}
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

declare global {
  interface Establishment {
    cnpj: string
    name: string
    address: string
    city: City
  }

  interface Service {
    id: number
    price: string
    establishment: Establishment
  }

  interface Offer {
    id: number
    date: string
    minPeople: number
    maxPeople: number
    service: Service
  }

  interface Match {
    interest: number
    offer: Offer
    reserved: boolean
  }

  interface Interest {
    id: number
    serviceType: ApiOption
    minPrice: string
    maxPrice: string
    minDate: string
    maxDate: string
    people: number
    match: Match | null
  }
}

interface HomePageProps {
  interests: Interest[]
  serviceTypes: ApiOption[]
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (
  context
) => {
  try {
    const jwt = getCookie('user-token', context)

    const [interests, serviceTypes] = await Promise.all([
      fetch<Interest[]>('users/me/interests', {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      }),
      fetch<ApiOption[]>('services/types'),
    ])

    return {
      props: {
        interests,
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
