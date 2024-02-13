import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity('service_types')
export class ServiceType {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column({ unique: true })
  name: string
}
