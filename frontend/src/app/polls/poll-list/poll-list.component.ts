import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NGXLogger } from 'ngx-logger';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { PollModelService, localGetPollsQuery } from '../../shared/services/pollModel.service'
import { AuthenticationService } from '../../core/services/auth.service';
import { take } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { Router } from '@angular/router';
import { PollModel } from 'src/app/shared/types';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

@Component({
  selector: 'app-poll-list',
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css']
})
export class PollListComponent implements OnInit {
  displayedColumns: string[] = ['__typename', 'name'];
  dataSource: MatTableDataSource<PollModel>;
  polls: PollModel[]

  @ViewChild(MatSort, { static: true }) sort: MatSort;

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
    this.titleService.setTitle('Polls');
    this.pollModelService.getPolls(this.authService.currentUser.email)
      .pipe(take(1)).subscribe((res: any) => {
        this.apollo.getClient().writeData({
          data: {
            getPolls: res.data.getAdmin.polls
          },
        });

        this.apollo.getClient().store.getCache().writeQuery({ query: localGetPollsQuery, data: { getPolls: res.data.getAdmin.polls } })

        this.apollo
          .watchQuery({
            query: localGetPollsQuery,
          })
          .valueChanges.subscribe((val: any) => {
            this.polls = val.data.getPolls;
            this.dataSource = new MatTableDataSource(this.polls);
            this.dataSource.sort = this.sort;
          })
      })
  }

  goToAdd() {
    this.router.navigate(['/polls/add']);
  }
}
