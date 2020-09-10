import { Router,Request,Response } from 'express';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import { getCustomRepository } from 'typeorm';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import multer from 'multer';
import uploadConfig from '../config/upload';
const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRep = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRep.find();
  const balance = await transactionsRep.getBalance();

  response.json({transactions,balance});
});

transactionsRouter.post('/', async (request, response) => {
  const {title,type,value,category} = request.body;
  const createTransaction = new CreateTransactionService;
  const newTransaction = await createTransaction.execute({
    title,
    type,
    value,
    tag:category
  });
  return response.json(newTransaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const {id} = request.params;
  const deleteTransactionSe = new DeleteTransactionService;
  await deleteTransactionSe.execute(id);
  return response.send()
});


transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request: Request, response: Response) => {
    const importTransactionsService = new ImportTransactionsService();

    const transactions = await importTransactionsService.execute(
      request.file.path,
    );

    return response.json(transactions);
  },
);

// transactionsRouter.post('/import', async (request, response) => {
//   //todo
// });


export default transactionsRouter;
