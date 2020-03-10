import { Field, Int, ObjectType, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity } from 'typeorm';
import { PollUser } from './PollUser';
import { PollModel } from './PollModel';


@InputType('AdminInput')
export class AdminInput {
  @Field(type => String)
  firstName: string;
  
  @Field(type => String)
  lastName: string
}


@ObjectType()
@InputType('AdminUserInput')
@Entity()
export class Admin extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ 
    type: 'varchar',
    nullable: true,
    length: 200
  })
  @Field({ nullable: true })
  email?: string;
  
  @Column({ 
    type: 'varchar',
    nullable: true,
    length: 200
  })
  @Field({ nullable: true })
  password?: string;


  @OneToMany(type => PollUser, user => user.creator, {
      eager: true, 
      onDelete: "CASCADE"
  })  
  @Field(type => [PollUser], { nullable: true })
  users?: PollUser[];

  @OneToMany(type => PollModel, model => model.admin, {
      eager: true, 
      onDelete: "CASCADE"
  })  
  @Field(type => [PollModel], { nullable: true })
  polls?: PollModel[];
}