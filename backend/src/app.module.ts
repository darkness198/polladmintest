import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule} from '@nestjs/graphql';
import { AdminService} from './services/admin.service';
import { AdminResolver } from './resolvers/admin.resolver';
import { PollResolver } from './resolvers/poll.resolver';
import { PollService } from './services/poll.service';

console.log(process.env.NODE_ENV === 'production' ? {
  autoSchemaFile: '/tmp/schema.gql.log',
} : {
  autoSchemaFile: './dist/schema.gql.log',
})

@Module({
  imports: [
    GraphQLModule.forRoot(process.env.NODE_ENV === 'production' ? {
      autoSchemaFile: '/tmp/schema.gql.log',
    } : {
      autoSchemaFile: '../tmp/schema.gql',
      
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AdminService, AdminResolver, PollResolver, PollService],
})
export class AppModule {}
