import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Establishment } from './establishment.entity'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column()
  type: string

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @ManyToOne(() => Establishment, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'establishment',
    foreignKeyConstraintName: 'service_establishment_fk',
  })
  establishment: string
}
