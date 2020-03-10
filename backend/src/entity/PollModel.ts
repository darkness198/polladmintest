import { Field, Int, ObjectType, InputType } from 'type-graphql';
// import { Post } from './Post';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne } from 'typeorm';
// import { Message } from './Message';
import { Admin } from './Admin';
import { Question } from './Question';
import { PollInstance } from './PollInstance';

@ObjectType()
@InputType("PollModelInput")
@Entity()
export class PollModel extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ 
    type: 'varchar',
    nullable: true,
    length: 200
  })
  @Field({ nullable: true })
  name?: string;
  
  @OneToMany(type => Question, question => question.pollModel, {
      eager: true, 
      onDelete: "CASCADE"
  })  
  @Field(type => [Question])
  questions: Question[];

  @OneToMany(type => PollInstance, instance => instance.model, { 
      onDelete: "CASCADE"
  })  
  @Field(type => [PollInstance], { nullable: true })
  instances?: PollInstance[];

  @ManyToOne(type => Admin, admin => admin.polls, {
    onDelete: "CASCADE"
  })
  @Field(type => Admin)
  admin: Admin;
}