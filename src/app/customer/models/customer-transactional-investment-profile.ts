export interface CustomerAttribute{
  size?: number;
  min?: string | number;
  max?: string | number;
  maxlength?: number;
  minlength?: number;
  required: boolean;
  type: string;
}

export interface CustomerOption{
  optionId: number | string;
  checked: boolean;
  answerText: string;
  value: string;
}

export interface CustomerQuestion {
  questionId: number;
  questionText: string;
  questionType: number;
  responseType: number;
  attributes: CustomerAttribute;
  options?: CustomerOption[];
}

export interface CustomerQuizSection {
  sectionId: string;
  questions: CustomerQuestion[];
}

export type Attribute = CustomerAttribute;
export type Option = CustomerOption;
export type Question = CustomerQuestion;
export type QuizSection = CustomerQuizSection;

