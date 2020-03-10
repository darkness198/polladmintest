import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Entity, Repository, getRepository, getConnectionManager, Connection } from 'typeorm';
// import { ConnectionService } from './connection.service';
import { connect } from '../config';
import { Admin } from '../entity/Admin';
import { PollUser } from '../entity/PollUser';

@Injectable()
export class AdminService {

  private adminRepository: Repository<Admin> = null;
  private userRepository: Repository<PollUser> = null;

  constructor() {

  }

  getRepo = async (): Promise<Connection> => {

    const connection = await connect();
    if (!connection) {
      throw new HttpException({ status: HttpStatus.GATEWAY_TIMEOUT, error: 'Error in connection' }, 408);
    }
    this.adminRepository = connection.getRepository(Admin);
    this.userRepository = connection.getRepository(PollUser);
    return connection;

  }

  async findAll(): Promise<Admin[]> {
    const connection = await this.getRepo();
    let all: Admin[] = [];
    try {
      all = await this.adminRepository.find();
      await connection.close();
    } catch (err) {
      throw new HttpException({ status: HttpStatus.BAD_REQUEST, error: err }, 400);
    }
    return all;
  }

  async createOrLogin(email: string, password: string): Promise<Admin> {
    let adminResult: Admin;
    const connection = await this.getRepo();

    if ((await this.adminRepository.count({ email: email })) > 0) {
      adminResult = await this.adminRepository.findOne({ email: email });
      adminResult = await this.adminRepository.save(adminResult);
    } else {

      const adminData = this.adminRepository.create({
        email: email,
        password: password
      });
      adminResult = await this.adminRepository.save(adminData);
    }

    await connection.close()
    return adminResult;
  }

  async getUsers(email: string): Promise<PollUser[]> {
    const connection = await this.getRepo();
    const admin = await this.adminRepository.findOne({ email: email })
    await connection.close()
    return admin.users;
  }

  async getAdmin(email: string): Promise<Admin> {
    const connection = await this.getRepo();
    const admin = await this.adminRepository.findOne({ email: email })
    await connection.close()
    return admin;
  }


  async addUser(email: string, firstName: string, lastName: string, phoneNumber: string): Promise<PollUser> {
    let admin, linkedUser;
    try {
      const connection = await this.getRepo();
      admin = await this.adminRepository.findOne({ email: email });
      linkedUser = { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, creator: admin };
      const newUser = await this.userRepository.save(linkedUser)

      await this.adminRepository.createQueryBuilder()
        .relation("users")
        .of(admin.id)
        .add(newUser);

      admin = await this.adminRepository.findOne({ email: email });

      await connection.close()
    } catch (err) {
      console.log(err)
    }
    return linkedUser;
  }

}
