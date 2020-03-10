import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { PollModelService, localGetPollsQuery, PollStatus } from '../../shared/services/pollModel.service'
import { AuthenticationService } from '../../core/services/auth.service';
import { take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Router, ActivatedRoute } from '@angular/router';
import { PollModel, Question, Response } from 'src/app/shared/types';
import { Subject } from 'rxjs';


@Component({
  selector: 'app-poll-answer',
  templateUrl: './poll-answer.component.html',
  styleUrls: ['./poll-answer.component.css']
})
export class PollAnswerComponent implements OnInit {
 
  private userId: number;
  private instanceId: number;
  private questionEmitter: Subject<Question> = new Subject<Question>();

  public currentQuestion: Question;
  private questionsLeft: Question[];



  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title, 
    private pollModelService: PollModelService, 
    private authService: AuthenticationService,
    private apollo: Apollo, 
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
   
    this.route.paramMap.subscribe(params =>  {
      this.userId = +params.get('userId');
      this.instanceId = +params.get('instanceId');
      this.pollModelService.getInstance(this.userId, this.instanceId).subscribe((res: any) => {
        console.log(res)
        if(res.data.getInstance.status === PollStatus.NOTVIEWED) {
          this.pollModelService.setPollStatus(PollStatus.VIEWED, this.instanceId, this.userId).subscribe((response: any) => {
            console.log(response)
            
          })
        } else {
          this.startQuestions(res.data.getInstance.model.questions as Question[],res.data.getInstance.responses as Response[] )
        }
      })
    })

    this.questionEmitter.subscribe(question => {
      console.log(question)
      this.currentQuestion = question;
    })
  
  }

  startQuestions(questions: Question[], responses: Response[] ) {
    const answeredIds = responses.map(response => response.question.id);
    
    const questionsLeft = questions.filter(question => {
      return !answeredIds.includes(question.id) 
    })
    console.log('left v all', questionsLeft, questions)
    this.questionsLeft = questionsLeft;
    this.getNextQuestion()
    
  }

  getNextQuestion() {
    const nextQ = { ...this.questionsLeft.shift()} ;
    this.questionEmitter.next(nextQ)
  }

  sendAnswer(answer: boolean) {
    this.pollModelService.answerQuestion(this.userId, this.currentQuestion.id, this.instanceId, answer).toPromise().then(() =>{
      this.getNextQuestion()
    })
  } 



  goToAdd() {
    this.router.navigate(['/customers/add']);
  }


}
