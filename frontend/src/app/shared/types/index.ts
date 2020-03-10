export interface PollUser {
  id: number;
  firstName: string;
  lastName: string;
  __typename: 'PollUser'
}

export interface PollModel {
  id: number;
  name: string;
  questions: Question[];
  __typename: 'PollModel'
}

export interface Question {
  id: number;
  questionText: string;
  __typename: 'Question'
}

export interface Response {
  id: number;
  selection: string;
  question?: Question;
  __typename: 'Response'
}

// export interface Admin {
//   email: string;
//   selection?: boolean;
//   __typename: 'Question'
// }