import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { PollUser, PollModel } from './shared/types';

const uri = 'http://localhost:5000/graphql';

const cache = new InMemoryCache();


export interface UserState {
  getUsers: PollUser[], 
  getPolls: PollModel[]
}
const data: UserState = {
  getUsers: [],
  getPolls: []
}
cache.writeData({ data });

export function createApollo(httpLink: HttpLink) {
  return {
    link: httpLink.create({uri}),
    cache: cache,
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
