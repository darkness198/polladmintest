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

export const localUsersQuery = gql`
      {
        getUsers @client {
          id
          firstName
          lastName
        }
      }
    `

@Injectable({
    providedIn: 'root'
})
export class PollUserService {

    private addUserMutation = gql`
      mutation ($email: String!, $firstName: String!, $lastName: String!, $phoneNumber: String!) {
        addUser(email: $email, firstName: $firstName,  lastName: $lastName,  phoneNumber: $phoneNumber) {
          id
          firstName,
          lastName, 
          phoneNumber
        }
      }
    `;

    private getUsersQuery = gql`
      query ($email: String!) {
        getUsers(email: $email) {
          id
          firstName,
          lastName,
          phoneNumber
        }
      }
    `
    

    constructor(private http: HttpClient,
        // @Inject('LOCALSTORAGE') private localStorage: Storage, 
        private apollo: Apollo) {
    }

    getUsers(email: String) {
      return this.apollo.query({
        query: this.getUsersQuery,
        variables: {
          email: email
        }, 
        fetchPolicy: 'network-only'

      })
    }

    addUser(email: String, firstName: String, lastName: String, phoneNumber: String) {
        return this.apollo.mutate({
            mutation: this.addUserMutation,
            variables: {
                email: email, 
                firstName: firstName, 
                lastName: lastName,
                phoneNumber: phoneNumber
            },
            update: (store, { data: { } }) => {
              // Read the data from our cache for this query.
              const data: { getUsers } = store.readQuery({ query: localUsersQuery })
              data.getUsers.push({
                firstName: firstName, 
                lastName: lastName,
                phoneNumber: phoneNumber,
                __typename: 'PollUser'
              });
              store.writeQuery({ query: localUsersQuery, data })
            },
        }) 
    }

    


}
