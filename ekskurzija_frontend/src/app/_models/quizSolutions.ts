export class QuizSolutions {
  idquiz_solutions ?: string;
  qs_idquiz: string;
  qs_iduser: string;
  answers: number[];
  score: number;
  grade: number;
  qs_idschool_trip:string
  constructor(init:QuizSolutions) {
    this.idquiz_solutions = init.idquiz_solutions
    this.qs_idquiz = init.qs_idquiz
    this.qs_iduser = init.qs_iduser
    this.answers = init.answers
    this.score = init.score
    this.grade = init.grade
    this.qs_idschool_trip = init.qs_idschool_trip
  }
}
