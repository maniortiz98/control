export interface Attribute{
  size?: number;
  min?: string | number;
  max?: string | number;
  maxlength?: number;
  minlength?: number;
  required: boolean;
  type: string;
}

export interface Option{
  optionId: number | string;
  checked: boolean;
  answerText: string;
  value: string;
}

export interface Question {
  questionId: number;
  questionText: string;
  questionType: number;
  responseType: number;
  attributes: Attribute;
  options?: Option[];
}

export interface QuizSection {
  sectionId: string;
  questions: Question[];
}
