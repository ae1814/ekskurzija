export class SchoolTrip {
  idschool_trip : string;
  teacherID: string;
  name: string;
  class: string;
  n_questions: Number;
  summary : string;
  quizes_to_solve ?: number
  constructor(init:SchoolTrip) {
    this.idschool_trip = init.idschool_trip
    this.name = init.name
    this.teacherID = init.teacherID
    this.class = init.class
    this.n_questions = init.n_questions
    this.summary = init.summary
    this.quizes_to_solve = init.quizes_to_solve
  }
}
