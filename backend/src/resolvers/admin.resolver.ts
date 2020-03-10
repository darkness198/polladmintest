import { Resolver, Query, Args, Mutation } from "@nestjs/graphql";
import { AdminService } from "../services/admin.service";
import { Int, InputType, Field,  } from "type-graphql";
import { HttpException, HttpStatus } from "@nestjs/common";
import { Admin } from "../entity/Admin";
import { PollUser } from "../entity/PollUser";




@Resolver(of => Admin)
export class AdminResolver {
  constructor(
    private readonly adminService: AdminService,
  ) {}

  @Query(returns => [Admin])
  async allUsers() {
    let allUsers: Admin[];
    try {
      allUsers = await this.adminService.findAll();
    } catch(err) {
      console.log(JSON.stringify(err))
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return allUsers;
  }

  @Query(returns => [PollUser])
  async getUsers(
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    let allUsers: Admin[];
    try {
      allUsers = await this.adminService.getUsers(email);
    } catch(err) {
      console.log(JSON.stringify(err))
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return allUsers;
  }

  @Query(returns => Admin)
  async getAdmin(
    @Args({ name: 'email', type: () => String }) email: string,
  ) {
    let admin: Admin;
    try {
      admin = await this.adminService.getAdmin(email);
    } catch(err) {
      console.log(JSON.stringify(err))
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return admin;
  }
  
  @Mutation(returns => Admin)
  async login(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'password', type: () => String }) password: string,
  ) {
    let newOrReturningAdmin: Admin;
    try {
      newOrReturningAdmin = await this.adminService.createOrLogin(email, password);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return newOrReturningAdmin;
  }
  

  @Mutation(returns => PollUser)
  async addUser(
    @Args({ name: 'email', type: () => String }) email: string,
    @Args({ name: 'firstName', type: () => String }) firstName: string,
    @Args({ name: 'lastName', type: () => String }) lastName: string,
    @Args({ name: 'phoneNumber', type: () => String }) phoneNumber: string
  ) {
    let newUser: PollUser;
    try {
      newUser = await this.adminService.addUser(email, firstName, lastName, phoneNumber);
    } catch(err) {
      throw new HttpException({status:HttpStatus.BAD_REQUEST, error: err}, 400);
    }
    return newUser;
  }
}