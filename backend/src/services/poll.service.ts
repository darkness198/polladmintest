import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Entity, Repository, getRepository, getConnectionManager, Connection, In } from 'typeorm';
import { connect } from '../config';
import { Admin } from '../entity/Admin';
import { PollUser } from '../entity/PollUser';
import { Question } from '../entity/Question';
import { PollModel } from '../entity/PollModel';
import { PollInstance, PollStatus } from '../entity/PollInstance';
import { Response } from '../entity/Response';


@Injectable()
export class PollService {
  private adminRepository: Repository<Admin> = null;
  private userRepository: Repository<PollUser> = null;
  private pollRepository: Repository<PollModel> = null;
  private questionRepository: Repository<Question> = null;
  private pollInstanceRepository: Repository<PollInstance> = null;
  private responseRepository: Repository<Response> = null;
  

  constructor() {
  }

  getRepo = async (): Promise<Connection> => {
      const connection = await connect();
      if(!connection) {
        throw new HttpException({status: HttpStatus.GATEWAY_TIMEOUT, error: 'Error in connection'}, 408);
      }
      this.adminRepository = connection.getRepository(Admin);
      this.userRepository = connection.getRepository(PollUser);
      this.pollRepository = connection.getRepository(PollModel);
      this.questionRepository = connection.getRepository(Question);
      this.pollInstanceRepository = connection.getRepository(PollInstance);
      this.responseRepository = connection.getRepository(Response);
      return connection;
    
  }

  async createOrLogin(email: string, password: string): Promise<Admin> {
    let adminResult: Admin;
    console.log('before connect');

    const connection = await this.getRepo();
    console.log('after connect, connection is: ' + !!connection)

    if((await this.adminRepository.count({ email: email })) > 0) {
      
      adminResult = await this.adminRepository.findOne({ email: email });
      console.log('result from found:', adminResult);
      adminResult = await this.adminRepository.save(adminResult);
      
      console.log('successful save')
      
    } else {
      console.log('did not find');
      const adminData = this.adminRepository.create({
        email: email,
        password: password
      });
      adminResult = await this.adminRepository.save(adminData);
    }

    await connection.close()
    console.log('successful close')
    return adminResult;
  }

  async getUsers(email: string): Promise<PollUser[]> {
    const connection = await this.getRepo();

    const admin = await this.adminRepository.findOne({ email: email})

    await connection.close()
    console.log('successful close')
    return admin.users;
  }


  async addPoll(email: string, questions: string[], name: string): Promise<PollModel> {
    let admin, newPoll;
    try {
      const connection = await this.getRepo();      
      admin = await this.adminRepository.findOne({ email: email });
      const newQuestions = questions.map(question =>{
        return { questionText: question };
      }) as Partial<Question>;
      const questionEnts: Question[] = await this.questionRepository.save(newQuestions) as unknown as Question[];

      const filledPoll: Partial<PollModel> = { questions: questionEnts, admin: admin, name: name };
      newPoll = await this.pollRepository.save(filledPoll)
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    return newPoll;
  }

  
  async sendPoll(email: string, pollUsers: number[], pollModelId: number): Promise<PollInstance> {
    let admin, newPollInstance: PollInstance;
    try {
      const connection = await this.getRepo();      
      admin = await this.adminRepository.findOne({ email: email });
      const userEnts = await this.userRepository.find({
        where: { authorId: In(pollUsers) }
      })
      const pollModelEnt = await this.pollRepository.findOne({ id: pollModelId });
      
      const allLinks = [];
      for(let i = 0; i < userEnts.length; i++) {
        
        const pollInst = await this.pollInstanceRepository.save({ model: pollModelEnt, status: PollStatus.NOTVIEWED, createdAt: new Date(), sentTo: userEnts[i] })
        allLinks.push(`http://localhost:4200/polls/answer/${userEnts[i].id}/${pollInst.id}`)
        newPollInstance = pollInst; //To change to array of pollInstances
      }
      userEnts.forEach(user => {
        
        
      })
      console.log('links', allLinks)
      
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    return newPollInstance;
  }

  async getInstance(userId: number, pollInstanceId: number): Promise<PollInstance> {
    let pollInstance: PollInstance;
    try {
      const connection = await this.getRepo();      
      pollInstance = await this.pollInstanceRepository.findOne({ id: pollInstanceId });      
      pollInstance.responses = pollInstance.responses.filter(response => response.pollUser.id === userId) || [];
    
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    return pollInstance;
  }

  async answerQuestion(userId: number, questionId: number, instanceId: number, response: boolean): Promise<Response> {
    let pollInstance: PollInstance, newResponse: Response;
    try {
      const connection = await this.getRepo();      
      pollInstance = (await this.pollInstanceRepository.find({ where: { id: instanceId }, relations: ['responses', 'model']}))[0];
      const pollUser = await this.userRepository.findOne({ id: userId });
      const questionEnt = await this.questionRepository.findOne({ id: questionId });
      newResponse = await this.responseRepository.save({ selection: response, pollUser: pollUser, pollInstance: pollInstance, question: questionEnt})
      pollInstance.responses.push(newResponse)
      
      pollInstance = await this.pollInstanceRepository.save(pollInstance);
    
      if(pollInstance.status !== PollStatus.COMPLETED) {
        pollInstance.status = PollStatus.INPROGRESS;
      }
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    return newResponse;
  }

  async setPollStatus(status: string, instanceId: number, userId: number): Promise<PollInstance> {
    let pollInst: PollInstance;
    try {
      const connection = await this.getRepo();      
      pollInst = await this.pollInstanceRepository.findOne({ id: instanceId});
      pollInst.status = status;
      pollInst = await this.pollInstanceRepository.save(pollInst);
      await connection.close()
    } catch(err) {
      console.log(err)
    }
    return pollInst;
  }
  
}
