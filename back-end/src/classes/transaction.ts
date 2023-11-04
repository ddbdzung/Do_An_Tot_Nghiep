import { DateTime } from 'luxon';

import TransactionModel from '../models/transaction.model';

class TransactionMetadata {
  bank: string; // Tên ngân hàng nguồn
  createdAt: Date; // Ngày tạo giao dịch

  /**
   * @example value = '11/10/2023 15:34'
   */
  toDateTime(value: string) {
    const date = value.split(' ')[0];
    const time = value.split(' ')[1];
    const [day, month, year] = date.split('/');
    const [hour, minute] = time.split(':');
    const luxonDate = DateTime.fromObject(
      {
        day: Number(day),
        month: Number(month),
        year: Number(year),
        hour: Number(hour),
        minute: Number(minute),
      },
      {
        zone: 'Asia/Ho_Chi_Minh',
      },
    );

    return luxonDate.toJSDate();
  }

  /**
   *
   * @param bankWithDatetime example = 'BankName:11/10/2023 15:34'
   */
  constructor(bankWithDatetime: string) {
    const [bank, ...rest] = bankWithDatetime.split(':');
    const datetime = rest.join(':');
    this.bank = bank;
    this.createdAt = this.toDateTime(datetime);
  }
}

type Float = number;

class Money {
  value: string; // Giá trị tiền tệ
  amount: number; // Số tiền
  currency: string; // Loại tiền tệ

  /**
   * @example value = '3,840,000VND'
   */
  toAmount(value: string): Float {
    const amount = value.replace(/[^-\d]/g, '');
    return parseFloat(amount);
  }

  /**
   * @example value = '3,840,000VND'
   */
  toCurrency(value: string) {
    return value.match(/[A-Za-z]+/g).join('');
  }

  constructor(value: string) {
    const cleaner = value.replace(/\s/g, '').trim();

    this.value = cleaner;
    this.amount = this.toAmount(cleaner) || 0;
    this.currency = this.toCurrency(cleaner);
  }
}

export class Transaction {
  metadata: TransactionMetadata;
  account: string; // Tài khoản nguồn
  changes: Money; // Biến động giao dịch
  currentBalance: Money; // Số dư hiện tại
  content: string; // Nội dung giao dịch

  constructor(raw: string) {
    const cleaner = raw.trim().split('|');
    const values = cleaner.map(i => {
      const x = i.split(':');
      x.shift();
      return x.join(':');
    });
    this.metadata = new TransactionMetadata(cleaner[0]);
    this.account = values[1];
    this.changes = new Money(values[2]);
    this.currentBalance = new Money(values[3]);
    this.content = values[4];
  }

  toDocument() {
    return new TransactionModel({
      account: this.account,
      changes: this.changes,
      currentBalance: this.currentBalance,
      content: this.content,
      metadata: this.metadata,
    });
  }
}

const raw = `VietinBank:11/10/2023 15:34|TK:113645126666|GD:-3,840,000VND|SDC:5,383,338VND|ND:So GD: 420A23A0H17FQX1Q +BHXH+103+00+TA1239Z+03800+DONG BHXH+DONG BHYT; t~`;

const transaction = new Transaction(raw);
// console.log('transaction', transaction.toDocument());
