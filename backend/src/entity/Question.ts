import { Field, Int, ObjectType, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne } from 'typeorm';
import { PollModel } from './PollModel';
import { Response } from './Response';


@ObjectType()
@InputType("QuestionInput")
@Entity()
export class Question extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;
  
  @ManyToOne(type => PollModel, poll => poll.questions, {
    onDelete: "CASCADE"
  })
  @Field(type => PollModel)
  pollModel: PollModel;

  
  @OneToMany(type => Response, response => response.question, {
      onDelete: "CASCADE"
  })  
  @Field(type => [Response], { nullable: true })
  responses?: Response[];

  
  @Column({ type: "varchar", nullable: true })
  @Field(type => String)
  questionText: string;
}