export class Quiz {
  idquiz ?: string;
  school_tripID: string;
  studentID: string;
  submited: boolean;
  grade ?: number;
  teacher_comment ?: string
  constructor(init:Quiz) {
    this.idquiz = init.idquiz
    this.school_tripID = init.school_tripID
    this.studentID = init.studentID
    this.submited = init.submited
    this.grade = init.grade
    this.teacher_comment = init.teacher_comment
  }
}
