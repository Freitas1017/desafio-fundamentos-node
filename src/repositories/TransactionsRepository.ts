import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CreateTransactionsDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class TransactionsRepository {
  private transactions: Transaction[];

  constructor() {
    this.transactions = [];
  }

  public all(): Transaction[] {
    return this.transactions;
  }

  public getBalance(): Balance {
    const { income, outcome } = this.transactions.reduce(
      (accumulator: Balance, transaction: Transaction) => {
        switch (transaction.type) {
          case 'income':
            accumulator.income += transaction.value;
            accumulator.total += transaction.value;
            break;
          case 'outcome':
            accumulator.outcome += transaction.value;
            accumulator.total -= transaction.value;
            break;
          default:
            break;
        }

        return accumulator;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );

    const total = income - outcome;

    return { income, outcome, total };
  }

  public create({ title, value, type }: CreateTransactionsDTO): Transaction {
    const transaction = new Transaction({ title, value, type });

    const { total } = this.getBalance();

    if (type === 'outcome') {
      if (value > total) {
        throw Error('Insufficient funds');
      }
    }

    this.transactions.push(transaction);

    return transaction;
  }
}

export default TransactionsRepository;
