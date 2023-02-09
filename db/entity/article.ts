import { Entity, BaseEntity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, ManyToMany } from 'typeorm';
import { User } from './user';
import { Comment } from './comment';
import { Tag } from './tag';

@Entity({name: 'articles'})
export class Article extends BaseEntity {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  title!: string;

  @Column('text')
  content!: string;

  @Column()
  views!: number;

  @Column()
  create_time!: Date;

  @Column()
  update_time!: Date;

  @Column()
  is_delete!: number;

  @ManyToOne(() => User)
  @JoinColumn({name: 'user_id'})
  user!: User;

  @OneToMany(() => Comment, (comment) => comment.article)
  comments!: Comment[];

  @ManyToMany(() => Tag, (tag) => tag.articles, {
    cascade: true
  })
  tags!: Tag[]
}