import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { Service } from 'src/services/service.entity'

@Entity('offers')
export class Offer {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ name: 'min_people' })
  minPeople: number

  @Column({ name: 'max_people' })
  maxPeople: number

  @Column()
  date: Date

  @ManyToOne(() => Service, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'service',
    foreignKeyConstraintName: 'offer_service_fk',
  })
  service: Service
}
