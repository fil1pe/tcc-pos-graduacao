import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm'
import { Interest } from 'src/interests/interest.entity'
import { Offer } from 'src/offers/offer.entity'

@Entity('matches')
export class Match {
  @Column()
  reserved: boolean

  @ManyToOne(() => Offer, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'offer',
    foreignKeyConstraintName: 'match_offer_fk',
  })
  @PrimaryColumn()
  offer: Offer

  @ManyToOne(() => Interest, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'interest',
    foreignKeyConstraintName: 'match_interest_fk',
  })
  @PrimaryColumn()
  interest: Interest
}
