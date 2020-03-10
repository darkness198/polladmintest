import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomersRoutingModule } from './poll-routing.module';
import { SharedModule } from '../shared/shared.module';

import { PollAddComponent } from './poll-add/poll-add.component';
import { PollSendComponent } from './poll-send/poll-send.component';
import { PollListComponent } from './poll-list/poll-list.component';
import { PollAnswerComponent } from './poll-answer/poll-answer.component';

@NgModule({
  imports: [
    CommonModule,
    CustomersRoutingModule,
    SharedModule
  ],
  declarations: [
    PollListComponent,
    PollAddComponent, 
    PollSendComponent,
    PollAnswerComponent
  ],
  entryComponents: [
  ]
})
export class PollsModule { }
