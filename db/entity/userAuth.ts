import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './user'

@Entity({name: 'user_auths'})
export class UserAuth extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  identity_type!: string;

  @Column()
  identifier!: string;

  @Column()
  credential!: string;

  @ManyToOne(() => User, {
    cascade: true
  })
  @JoinColumn({name: 'user_id'})
  user!: User
}