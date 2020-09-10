import AppError from '../errors/AppError';
import {getCustomRepository} from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionsRepository from "../repositories/TransactionsRepository";
import CreateTagService from '../services/CreateTagService';
import { format } from 'prettier';

interface Request{
  title: string;
  type: 'income'|'outcome';
  value:number;
  category: string;
}

class CreateTransactionService {
  public async execute({title,type,value,category}:Request): Promise<Transaction> {
    const transactionsRepo = getCustomRepository(TransactionsRepository);
    const balance  = await transactionsRepo.getBalance();

    if((type === 'outcome') && (balance.total < value)){
      throw new AppError('Value is grater than the current balance');
    }

    const createTag = new CreateTagService();

    const dtag = await createTag.execute(category);

    const transaction = transactionsRepo.create({title,type,value,tag_id:dtag});
    await transactionsRepo.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
