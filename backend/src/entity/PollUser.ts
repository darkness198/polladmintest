import { Field, Int, ObjectType, InputType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BaseEntity, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { Admin } from './Admin';
import { PollInstance } from './PollInstance';
import { Response } from './Response';


@ObjectType()
@InputType("PollUserInput")
@Entity()
export class PollUser extends BaseEntity{
  
  @PrimaryGeneratedColumn()
  @Field(type => Int)
  id: number;

  @Column({ 
    type: 'varchar',
    nullable: true,
    length: 200
  })
  @Field({ nullable: true })
  firstName?: string;
  
  @Column({ 
    type: 'varchar',
    nullable: true,
    length: 200
  })
  @Field({ nullable: true })
  lastName?: string;
  
  @ManyToOne(type => Admin, admin => admin.users, {
    onDelete: "CASCADE"
  })
  @Field(type => Admin)
  creator: Admin;

  @Column({ type: "varchar", nullable: true })
  @Field(type => String, { nullable: true })
  phoneNumber?: string;

  @OneToMany(type => Response, response => response.pollUser, {
      onDelete: "CASCADE"
  })  
  @Field(type => [Response], { nullable: true })
  responses?: Response[];

  @OneToMany(type => PollInstance, pollInstance => pollInstance.sentTo, {
      onDelete: "CASCADE"
  })  
  @Field(type => [PollInstance], { nullable: true })
  pollInstances?: PollInstance[];
}