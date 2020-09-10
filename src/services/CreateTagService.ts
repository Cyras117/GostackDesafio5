import { getRepository } from "typeorm";
import Category from '../models/Category';


class CreateTagService {
  public async execute(title:string): Promise<string> {
    const tagRepo = getRepository(Category);

    const existentTag = await tagRepo.findOne({
      where:{title}
    });

    if(!existentTag){
      const newTag = tagRepo.create({title});
      await tagRepo.save(newTag);
      return newTag.id;
    }
    return existentTag.id;
  }
}

export default CreateTagService;
