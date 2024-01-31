import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column({ type: 'char', length: 2 })
  uf: string
}
