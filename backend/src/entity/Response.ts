import { Field, Int, ObjectType, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { Admin } from './Admin';
import { PollModel } from './PollModel';
import { PollInstance } from './PollInstance';
import { PollUser } from './PollUser';
import { Question } from './Question';


@ObjectType()
@InputType("ResponseInput")
@Entity()
export class Response extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ 
    type: 'boolean',
    nullable: true
  })
  @Field({ nullable: true })
  selection?: boolean;
  
  @ManyToOne(type => PollUser, user => user.responses, {
    eager: true, 
    onDelete: "CASCADE"
  })
  @Field(type => PollUser)
  pollUser: PollUser;

  @ManyToOne(type => PollInstance, instance => instance.responses, {
    onDelete: "CASCADE"
  })
  @Field(type => PollInstance,  { nullable: true })
  pollInstance?: PollInstance;

  @ManyToOne(type => Question, question => question.responses, {
    eager: true,
  })
  @Field(type => Question)
  question: Question;
  
}