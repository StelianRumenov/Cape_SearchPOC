import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";
import { Tag } from "./tag.entity";
import { Like } from "./like.entity";

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  content: string;

  @ManyToOne(() => User, (user) => user.posts, { nullable: true })
  user: User;

  @OneToMany(() => Comment, (comment) => comment.post, { nullable: true })
  comments: Comment[];

  @ManyToMany(() => Tag, { nullable: true })
  tags: Tag[];

  @OneToMany(() => Like, (like) => like.post, { nullable: true })
  likes: Like[];
}
