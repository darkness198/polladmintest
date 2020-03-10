import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as jwt_decode from 'jwt-decode';
import * as moment from 'moment';
import 'rxjs/add/operator/delay';

import { environment } from '../../../environments/environment';
import { of, EMPTY } from 'rxjs';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    private loginMutation = gql`mutation ($email: String!, $password: String!) {
        login(email: $email, password: $password ) {
          email,
          password
        }
      }`;

    public currentUser: { email: string };

    constructor(private http: HttpClient,
        @Inject('LOCALSTORAGE') private localStorage: Storage, 
        private apollo: Apollo) {
    }

    login(email: String, password: String) {
        return this.apollo.mutate({
            mutation: this.loginMutation,
            variables: {
                email: email, 
                password: password
            }
        })
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.localStorage.removeItem('currentUser');
    }

    getCurrentUser(): any {
        // TODO: Enable after implementation
        // return JSON.parse(this.localStorage.getItem('currentUser'));
        return {
            token: 'aisdnaksjdn,axmnczm',
            isAdmin: true,
            email: 'john.doe@gmail.com',
            id: '12312323232',
            alias: 'john.doe@gmail.com'.split('@')[0],
            expiration: moment().add(1, 'days').toDate(),
            fullName: 'John Doe'
        };
    }

    passwordResetRequest(email: string) {
        return of(true).delay(1000);
    }

    changePassword(email: string, currentPwd: string, newPwd: string) {
        return of(true).delay(1000);
    }

    passwordReset(email: string, token: string, password: string, confirmPassword: string): any {
        return of(true).delay(1000);
    }
}
