import { DataSourceOptions } from 'typeorm'
import { join } from 'path'

export const config: DataSourceOptions = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: 3306,
  username: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'dev',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
}
