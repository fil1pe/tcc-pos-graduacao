import { City } from 'src/cities/city.entity'
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryColumn({ length: 11 })
  cpf: string

  @Column()
  name: string

  @Column({ unique: true })
  email: string

  @Column()
  password: string

  @Column({ type: 'date', name: 'birth_date' })
  birthDate: Date

  @Column()
  address: string

  @ManyToOne(() => City, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'city', foreignKeyConstraintName: 'user_city_fk' })
  city: City
}
