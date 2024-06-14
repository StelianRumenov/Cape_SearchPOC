import { DataSource } from "typeorm";
import { Category } from "../entity/category.entity";
import { Post } from "../entity/post.entity";
import { Tag } from "../entity/tag.entity";
import { User } from "../entity/user.entity";
import { Like } from "../entity/like.entity";
import { Comment } from "../entity/comment.entity";

export const myDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 8889,
  username: "root",
  password: "root",
  database: "mysql_search",
  entities: [User, Post, Comment, Tag, Category, Like],
  logging: false,
  synchronize: true,
});
