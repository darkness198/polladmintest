import { Field, Int, ObjectType, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne, BeforeInsert } from 'typeorm';
import { PollModel } from './PollModel';


export enum PollStatus {
  NOTVIEWED = "notviewed",
  VIEWED = "viewed",
  INPROGRESS= "inprogress",
  COMPLETED = "completed"
}

import { Response } from './Response';
import { PollUser } from './PollUser';

@ObjectType()
@InputType("PollInstanceInput")
@Entity()
export class PollInstance extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @ManyToOne(type => PollModel, model => model.instances, {
    onDelete: "CASCADE",
    eager: true,
  })
  @Field(type => PollModel)
  model: PollModel;

   
  @Column({ type: "varchar", nullable: true })
  @Field(type => String, { nullable: true })
  status?: string;

  @OneToMany(type => Response, response => response.pollInstance, {
      eager: true, 
      onDelete: "CASCADE"
  })  
  @Field(type => [Response], { nullable: true })
  responses?: Response[];

  @Column({ type: 'date'})
  @Field(type => Date, { nullable: true })
  createdAt: Date;

  @ManyToOne(type => PollUser, user => user.pollInstances, {
    onDelete: "CASCADE"
  })
  @Field(type => PollUser, { nullable: true })
  sentTo: PollUser;
}