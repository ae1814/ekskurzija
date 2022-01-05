export class Grades {
  idgrades : string;
  grade: string;
  studentID: string;
  school_tripID: string;
  class: string;
  constructor(init:Grades) {
    this.idgrades = init.idgrades
    this.grade = init.grade
    this.studentID = init.studentID
    this.school_tripID = init.school_tripID
    this.class = init.class
  }
}
