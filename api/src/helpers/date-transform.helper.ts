import { TransformFnParams } from 'class-transformer'

export function transformDate({ value }: TransformFnParams) {
  const dateParts = value.split('/')
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
}
