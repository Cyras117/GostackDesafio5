 import AppError from '../errors/AppError';
 import {getCustomRepository} from 'typeorm';
 import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';


class DeleteTransactionService {
  public async execute(id:string): Promise<void> {
    const transactionsRep = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRep.findOne(id);
    if(!transaction){
      throw new AppError('Transaction not found!');
    }
    await transactionsRep.remove(transaction);
  }
}

export default DeleteTransactionService;
