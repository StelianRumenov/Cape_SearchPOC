import { DataSource, getRepository } from "typeorm";
import { myDataSource } from "../database/mysql";
import { User } from "../entity/user.entity";
import { Comment } from "../entity/comment.entity";
import { Tag } from "../entity/tag.entity";
import { Category } from "../entity/category.entity";
import { Post } from "../entity/post.entity";
import { Like } from "../entity/like.entity";

export default class SearchService {
  async findLikeFromPost(data: any) {
    const likeRepo = myDataSource.getRepository(Like);
    return await likeRepo.find({
      where: {
        post: { id: data },
      },
    });
  }

  async;
}
