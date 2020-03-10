import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { PollModelService } from '../../shared/services/pollModel.service'
import { AuthenticationService } from '../../core/services/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { localUsersQuery, PollUserService } from '../../shared/services/pollUser.service';
import { PollUser } from '../../shared/types/index';
import { UserState } from '../../graphql.module';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-poll-send',
  templateUrl: './poll-send.component.html',
  styleUrls: ['./poll-send.component.css']
})
export class PollSendComponent implements OnInit {


  mappedUsers: { pollUser: PollUser, send: boolean }[];
  pollId: number;

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private pollModelService: PollModelService,
    private authService: AuthenticationService,
    private apollo: Apollo,
    private route: ActivatedRoute, 
    private pollUserService: PollUserService
  ) { }

  ngOnInit() {

    this.route.paramMap.subscribe(params => {
      this.pollId = +params.get('id')
    })
    this.pollUserService.getUsers(this.authService.currentUser.email).subscribe((val: any) => {
        this.mappedUsers = (val.data as UserState).getUsers.map(user => {
          return { pollUser: user, send: false }
        });
      })

  }

  setChanged(ev, i) {
    this.mappedUsers[i].send = ev.checked;
  }

  sendLinks() {
    const userIds = this.mappedUsers.filter(user => user.send).map(user => user.pollUser.id)
    this.pollModelService.sendPoll(this.authService.currentUser.email, this.pollId, userIds).subscribe(res => {
      
    });
  }

}
