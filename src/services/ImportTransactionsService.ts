import fs from 'fs';
import cvsParser from 'csv-parse';
import { getCustomRepository, getRepository, In } from 'typeorm';
import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';

interface TransactionDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<Transaction[]> {
    const transactions: TransactionDTO[] = [];
    const categories: string[] = [];

    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoriesRepository = getRepository(Category);

    const readCSVStream = fs.createReadStream(filePath);
    const parseStream = cvsParser({
      from_line: 2,
      ltrim: true,
      rtrim: true,
    });

    const parseCSV = readCSVStream.pipe(parseStream);

    parseCSV.on('data', async line => {
      const [title, type, value, category] = line;

      if (!title || !type || !value) return;

      categories.push(category);
      transactions.push({ title, type, value, category });
    });

    await new Promise(resolve => {
      parseCSV.on('end', resolve);
    });

    const existsCategories = await categoriesRepository.find({
      where: { title: In(categories) },
    });

    const existentCategoriesTitle = existsCategories.map(
      (category: Category) => category.title,
    );

    const addCategoriesTitle = categories
      .filter(category => !existentCategoriesTitle.includes(category))
      .filter((value, index, self) => self.indexOf(value) === index);

    const addCategory = categoriesRepository.create(
      addCategoriesTitle.map(title => ({
        title,
      })),
    );

    await categoriesRepository.save(addCategory);

    const finalCategories = [...addCategory, ...existsCategories];

    const createTransactions = transactionsRepository.create(
      transactions.map(transaction => ({
        title: transaction.title,
        value: transaction.value,
        type: transaction.type,
        category: finalCategories.find(
          category => category.title === transaction.category,
        ),
      })),
    );

    await transactionsRepository.save(createTransactions);

    await fs.promises.unlink(filePath);

    return createTransactions;
  }
}

export default ImportTransactionsService;
