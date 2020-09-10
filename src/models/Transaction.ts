import{
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn
}from 'typeorm';

import tag from './Category';

@Entity('transactions')
class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  type: 'income' | 'outcome';

  @Column('float')
  value: number;

  @Column('uuid')
  tag_id: string;

  @ManyToOne(()=> tag)
  @JoinColumn({name:'tag_id'})
  tag:tag;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Transaction;
