import { DataSourceOptions } from 'typeorm'
import { join } from 'path'

export const config: DataSourceOptions = {
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'root',
  password: 'tiki',
  database: 'tcc',
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  synchronize: true,
}
