import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { NotificationService } from '../../core/services/notification.service';
import { NGXLogger } from 'ngx-logger';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { PhoneValidator } from 'src/app/shared/validators/phoneValidator';
import { AuthenticationService } from 'src/app/core/services/auth.service';
import { PollUserService, localUsersQuery } from 'src/app/shared/services/pollUser.service';
import { Apollo } from 'apollo-angular';
import { map, take } from 'rxjs/operators';
import { PollUser } from 'src/app/shared/types';
import { UserState } from 'src/app/graphql.module';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  addUserForm: FormGroup;
  formCreated: boolean = false;
  users: PollUser[] = [];

  constructor(
    private logger: NGXLogger,
    private notificationService: NotificationService,
    private titleService: Title,
    private authService: AuthenticationService,
    private usersService: PollUserService, 
    private apollo: Apollo
  ) { }

  ngOnInit() {
    this.titleService.setTitle('Users');
    
    this.createForm();
    this.usersService.getUsers(this.authService.currentUser.email).pipe(take(1)).subscribe((res: any) => {
      
      this.apollo.getClient().writeData({
        data: {
          getUsers: res.data.getUsers
        },
      });
    })

    this.apollo
      .watchQuery({
        query: localUsersQuery,
      })
      .valueChanges.subscribe((val: any) => {
        this.users = (val.data as UserState).getUsers;
      })
  }

  addUser() {
    const { firstName, lastName, phoneNumber } = this.addUserForm.value;
    this.usersService.addUser(this.authService.currentUser.email, firstName, lastName, phoneNumber)
      .subscribe(
        (res: any) => {}
    );
  }
  
  private createForm() {
      this.addUserForm = new FormGroup({
          firstName: new FormControl('', [Validators.required]),
          lastName: new FormControl('', [Validators.required]),
          phoneNumber: new FormControl('', [Validators.required, PhoneValidator.validCountryPhone()])
      });
      this.formCreated = true;
  }
}
