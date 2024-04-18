import { DataSourceOptions } from 'typeorm'
import { join } from 'path'
import { config as configEnv } from 'dotenv'

configEnv()

export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
}
