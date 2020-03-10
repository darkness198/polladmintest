import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/delay';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';

export const localGetPollsQuery = gql`
      {
        getPolls @client {
          id
          name
          questions {
            questionText
          }
        }
      }
    `

export enum PollStatus {
  NOTVIEWED = "notviewed",
  VIEWED = "viewed",
  INPROGRESS = "inprogress",
  COMPLETED = "completed"
}

@Injectable({
  providedIn: 'root'
})
export class PollModelService {

  private addPollMutation = gql`
      mutation ($email: String!, $questions: [String!]!, $name: String!) {
        addPoll(email: $email, questions: $questions, name: $name) {
          questions {
            id
            questionText
          }
        }
      }
    `;

  private getPollsQuery = gql`
      query ($email: String!) {
        getAdmin(email: $email) {
            polls {
              id
              name
              questions {
                id
                questionText
              }
            }
        }
    }
    `

  private getInstanceQuery = gql`
    query ($userId: Int!, $pollInstanceId: Int!) {
      getInstance(userId: $userId, pollInstanceId: $pollInstanceId ) {
          id
          model {
            questions {
              id
              questionText
            }
          }
          responses {
            id
            selection
            question {
              id
              questionText
            }
          }
          status 
      }
    }
    `

  private sendLinksMutation = gql`
      mutation ($email: String!, $pollUsers: [Int!]!, $pollModelId: Int!) {
        sendPoll(email: $email, pollUsers: $pollUsers, pollModelId: $pollModelId) {
          createdAt
          status
          responses {
            id
            selection
          }
        }
      }
    `;

  private setPollStatusMutation = gql`
    mutation ($status: String!, $instanceId: Int!, $userId: Int!) {
      setPollStatus(status: $status, instanceId: $instanceId, userId: $userId) {
        createdAt
        status
        responses {
          id
          selection
        }
      }
    }
  `;

  private answerQuestionMutation = gql`
  mutation ($userId: Int!, $questionId: Int!, $instanceId: Int!, $response: Boolean!) {
    answerQuestion(userId: $userId, questionId: $questionId, instanceId: $instanceId, response: $response) {
      id
      selection
      question {
        id
      }
    }
  }
`;


  constructor(private http: HttpClient,

    private apollo: Apollo) {
  }

  getPolls(email: String) {
    return this.apollo.query({
      query: this.getPollsQuery,
      variables: {
        email: email
      },
      fetchPolicy: 'network-only'

    })
  }

  addPoll(email: string, questions: string[], name: string) {
    return this.apollo.mutate({
      mutation: this.addPollMutation,
      variables: {
        email: email,
        questions: questions,
        name: name
      },
      update: (store, { data: { } }) => {
        // Read the data from our cache for this query.
        const data: any = store.readQuery({ query: localGetPollsQuery })
        data.getPolls.push({
          name: name,
          questions: questions,
          __typename: 'PollModel'
        });
        store.writeQuery({ query: localGetPollsQuery, data })
      },
    })
  }

  sendPoll(email: string, pollModelId: number, pollUsers: number[]) {
    return this.apollo.mutate({
      mutation: this.sendLinksMutation,
      variables: {
        email: email,
        pollModelId: pollModelId,
        pollUsers: pollUsers
      },
    })
  }

  getInstance(userId: number, pollInstanceId: number) {
    return this.apollo.query({
      query: this.getInstanceQuery,
      variables: {
        userId: userId,
        pollInstanceId: pollInstanceId
      }
    })
  }

  setPollStatus(status: string, pollInstanceId: number, userId: number) {
    return this.apollo.mutate({
      mutation: this.setPollStatusMutation,
      variables: {
        status: status,
        instanceId: pollInstanceId,
        userId: userId
      }
    })
  }

  answerQuestion(userId: number, questionId: number, instanceId: number, response: boolean) {
    return this.apollo.mutate({
      mutation: this.answerQuestionMutation,
      variables: {
        userId: userId,
        questionId: questionId,
        instanceId: instanceId,
        response: response
      }
    })
  }
}
