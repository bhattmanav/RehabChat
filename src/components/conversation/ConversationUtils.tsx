export interface Conversation {
  id: string;
  createdAt: Date;
  questions: Array<QuestionData>;
  title: string;
}

export interface Question {
  title: string;
  type: string;
  serverResponse: string;
  instruction: string;
  options?: Array<MultipleChoiceOption>;
}

export interface QuestionData {
  [questionID: string]: Question;
}

export interface MultipleChoiceOption {
  [optionID: string]: {
    title: string;
    reference: string;
  };
}
