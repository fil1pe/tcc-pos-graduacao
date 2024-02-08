import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { ServiceType } from 'src/service-types/service-type.entity'
import { Establishment } from '../establishments/establishment.entity'

@Entity('services')
export class Service {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number

  @ManyToOne(() => ServiceType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({
    name: 'type',
    foreignKeyConstraintName: 'service_type_fk',
  })
  type: ServiceType

  @ManyToOne(() => Establishment, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'establishment',
    foreignKeyConstraintName: 'service_establishment_fk',
  })
  establishment: Establishment
}
