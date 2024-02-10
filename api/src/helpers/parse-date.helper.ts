export function parseDate(value: string) {
  const dateParts = value.split('/').map((value) => parseInt(value))
  return new Date(dateParts[2], dateParts[1] - 1, dateParts[0])
}
