import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AdminService } from "../services/admin.service";
import { Int, InputType, Field,  } from "type-graphql";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Admin } from "../entity/Admin";
import { PollUser } from "../entity/PollUser";
import { PollModel } from "../entity/PollModel";
import { PollService } from "../services/poll.service";
import { PollInstance, PollStatus } from "../entity/PollInstance";
import { Response } from "../entity/Response";

@Resolver(of => PollModel)
export class PollResolver {
  constructor(
    private readonly pollService: PollService,
  ) {}

  @Mutation(returns => PollModel)
  async addPoll(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'questions', type: () => [String] }) questions: string[],
    @Args({ name: 'name', type: () => String }) name: string,
  ) {
    let newPoll: PollModel;
    try {
      newPoll = await this.pollService.addPoll(email, questions, name);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return newPoll;
  }

  @Mutation(returns => PollInstance)
  async sendPoll(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'pollModelId', type: () => Int }) pollModelId: number,
    @Args({ name: 'pollUsers', type: () => [Int] }) pollUsers: number[],
  ) {
    let newPoll: PollInstance;
    try {
      newPoll = await this.pollService.sendPoll(email, pollUsers, pollModelId);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return newPoll;
  }

  @Query(returns => PollInstance)
  async getInstance(
    @Args({ name: 'userId', type: () => Int }) userId: number,
    @Args({ name: 'pollInstanceId', type: () => Int }) pollInstanceId: number,
  ) {
    let instance: PollInstance;
    try {
      instance = await this.pollService.getInstance(userId, pollInstanceId);
    } catch(err) {
      console.log(JSON.stringify(err))
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return instance;
  }
  



  @Mutation(returns => PollInstance)
  async setPollStatus(
    @Args({ name: 'status', type: () => String }) status: string,
    @Args({ name: 'instanceId', type: () => Int }) instanceId: number,
    @Args({ name: 'userId', type: () => Int }) userId: number
  ) {
    let updatedInstance: PollInstance;
    try {
      updatedInstance = await this.pollService.setPollStatus(status, instanceId, userId);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return updatedInstance;
  }


  @Mutation(returns => Response)
  async answerQuestion(
    @Args({ name: 'userId', type: () => Int }) userId: number,
    @Args({ name: 'questionId', type: () => Int }) questionId: number,
    @Args({ name: 'instanceId', type: () => Int }) instanceId: number,
    @Args({ name: 'response', type: () => Boolean }) response: boolean,
  ) {
    let newResponse: Response;
    try {
      newResponse = await this.pollService.answerQuestion(userId, questionId, instanceId, response);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return newResponse;
  }

  // @Mutation(returns => PollModel)
  // async submitPoll(
  //   @Args({ name: 'email', type: () => String }) email: string,
  //   @Args({ name: 'password', type: () => String }) password: string,
  // ) {

  //   return newOrReturningAdmin;
  // }
  
}