import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LayoutComponent } from '../shared/layout/layout.component';

import { PollAddComponent } from './poll-add/poll-add.component';
import { PollSendComponent } from './poll-send/poll-send.component';
import { PollListComponent } from './poll-list/poll-list.component';
import { PollAnswerComponent } from './poll-answer/poll-answer.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: PollListComponent },
    ],
    
  },
  {
    path: 'add', 
    component: LayoutComponent, 
    children: [
      { path: '', component: PollAddComponent}
    ]
  },
  {
    path: 'send/:id', 
    component: LayoutComponent, 
    children: [
      { path: '', component: PollSendComponent}
    ]
  },
  {
    path: 'answer/:userId/:instanceId', 
    component: LayoutComponent, 
    children: [
      { path: '', component: PollAnswerComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule { }
