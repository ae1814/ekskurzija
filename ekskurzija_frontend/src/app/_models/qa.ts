export class QA {
  idqa ?: string;
  question: string;
  answers: string[];
  correct_answer: number;
  school_tripID: string;
  summary: string;
  quizID?: string;
  constructor(init:QA) {
    this.idqa = init.idqa
    this.question = init.question
    this.answers = init.answers
    this.correct_answer = init.correct_answer
    this.school_tripID = init.school_tripID
    this.summary = init.summary
    this.quizID = init.quizID
  }
}
