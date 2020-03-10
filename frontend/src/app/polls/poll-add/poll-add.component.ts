import { Component, OnInit, ViewChild } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { PollModelService } from '../../shared/services/pollModel.service'
import { AuthenticationService } from '../../core/services/auth.service';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';


@Component({
  selector: 'app-poll-add',
  templateUrl: './poll-add.component.html',
  styleUrls: ['./poll-add.component.css']
})
export class PollAddComponent implements OnInit {

  questions: string[] = [];
  questionText: string;
  name: string;
  isNamed = false;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private pollModelService: PollModelService,
    private authService: AuthenticationService,
    private apollo: Apollo,
    private router: Router
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Poll Add');
  }

  addQuestion() {
    this.questions.push(this.questionText)
    this.questionText = '';
  }


  setQuestion(event) {
    this.questionText = event.target.value
  }

  setName(event) {
    this.name = event.target.value
  }

  continueToQuestions() {
    this.isNamed = true;
  }

  removeQuestion(ind: number) {
    this.questions.splice(ind, 1);
  }

  submit() {
    this.pollModelService.addPoll(this.authService.currentUser.email, this.questions, this.name).subscribe(res => {
      this.router.navigate(['/polls'])
    })
  }
}
