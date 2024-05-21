import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { User } from 'src/users/user.entity'
import { ServiceType } from 'src/service-types/service-type.entity'

@Entity('interests')
export class Interest {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'min_price', type: 'decimal', precision: 10, scale: 2 })
  minPrice: number

  @Column({ name: 'max_price', type: 'decimal', precision: 10, scale: 2 })
  maxPrice: number

  @Column({ name: 'min_date' })
  minDate: Date

  @Column({ name: 'max_date' })
  maxDate: Date

  @Column()
  people: number

  @Column({ default: 0 })
  status: number

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'user',
    foreignKeyConstraintName: 'interest_user_fk',
  })
  user: User

  @ManyToOne(() => ServiceType, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'RESTRICT',
  })
  @JoinColumn({
    name: 'service_type',
    foreignKeyConstraintName: 'interest_service_type_fk',
  })
  serviceType: ServiceType
}
