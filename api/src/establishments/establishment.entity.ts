import { City } from 'src/cities/city.entity'
import { User } from 'src/users/user.entity'
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm'

@Entity('establishments')
export class Establishment {
  @PrimaryColumn({ length: 14 })
  cnpj: string

  @Column()
  name: string

  @Column()
  address: string

  @ManyToOne(() => City, {
    nullable: false,
    onDelete: 'RESTRICT',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'city',
    foreignKeyConstraintName: 'establishment_city_fk',
  })
  city: City

  @ManyToMany(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinTable({
    name: 'admins',
    joinColumn: {
      name: 'establishment',
      foreignKeyConstraintName: 'admin_establishment_fk',
    },
    inverseJoinColumn: {
      name: 'user',
      foreignKeyConstraintName: 'admin_user_fk',
    },
  })
  admins?: User[]
}
