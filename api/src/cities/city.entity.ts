import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm'

@Entity('cities')
@Index(['name', 'uf'], { unique: true })
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  name: string

  @Column({ type: 'char', length: 2 })
  uf: string
}
