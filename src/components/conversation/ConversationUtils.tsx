export interface Conversation {
  id: string;
  questions: Array<QuestionData>;
  title: string;
}

export interface Question {
  title: string;
  type: string;
  serverResponse: string;
  options?: Array<MultipleChoiceOption>;
}

export interface QuestionData {
  [questionID: string]: Question;
  // Todo: look into if string is needed [questionID: string]: Question | string;
}

export interface MultipleChoiceOption {
  [optionID: string]: {
    title: string;
    reference: string;
  };
}
