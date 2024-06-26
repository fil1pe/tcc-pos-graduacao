export async function fetchData<TResponse>(
  path: string,
  config?: RequestInit
): Promise<TResponse> {
  const response = await fetch(
    `${process.env.API_URL || process.env.API_URL_PUB}/${path}`,
    config
  )

  let data: any = {}
  try {
    data = await response.json()
  } catch {}

  if (response.status !== 200 && response.status !== 201) {
    if (!data.statusCode)
      throw new FetchError(response.status, response.statusText)
    else throw new FetchError(data.statusCode, data.message, data.errors)
  }
  return data
}

export class FetchError extends Error {
  statusCode: number
  errors?: { [input: string]: string }

  constructor(
    statusCode: number,
    message: string,
    errors?: { [input: string]: string }
  ) {
    super(message)
    this.statusCode = statusCode
    this.errors = errors
  }
}
