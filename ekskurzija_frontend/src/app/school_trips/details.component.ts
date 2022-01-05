import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { SchoolTrip } from '../_models/schoolTrip';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService, AlertService, QAService, SchoolTripService } from '../_services';
import { QuizService } from '../_services/quiz.service';
import { Quiz } from '../_models/quiz';
import { QA } from '../_models/qa';
import { QuizSolutions } from '../_models/quizSolutions';
import * as $ from 'jquery'
import { Grades } from '../_models/grades';
@Component({ templateUrl: 'details.component.html' })
export class DetailsComponent implements OnInit {
    user : User;
    schoolTrip : SchoolTrip;
    quizCreated : boolean = false
    quizSubmited = false
    quiz : Quiz
    quizSolutions :QuizSolutions
    grades : any[] = []
    grade_for_user : Number
    defaultAnswer = "Napišite odgovor"
    defaultQestion = "Napišite vprašanje"
    quizes_to_solve : QuizSolutions[]
    quizes_to_solve_percent : number[]  = []
    school_trip_classes : string[] = []
    quizes_by_trip_classes : any[] = []
    solving_quizes_by_trip_classes : any[] = []
    current_class = ""
    flag = false
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private schoolTripService : SchoolTripService,
        private quizService : QuizService,
        private qaService : QAService

        )
        {
              this.user = this.accountService.userValue;

              var id = this.route.snapshot.params['id']
              this.schoolTrip = this.schoolTripService.schoolTripValue
              this.schoolTripService.addToLocalStorage(id).then((response : any) => {
                this.schoolTrip = this.schoolTripService.schoolTripValue
                console.log(this.schoolTrip)
                this.school_trip_classes = this.schoolTrip.class.split(";")
                this.quizService.getQuizByStudentAndSchoolTripId(this.schoolTrip.idschool_trip, this.user.idperson).then(
                  (data : Quiz[]) => {
                    if (data != null && data.length > 0)
                    {
                      this.quizSubmited = data[0].submited
                      this.quiz = data[0]
                      this.quizCreated = true
                      this.quizService.addToLocalStorage(data[0].idquiz).then((response : any) => {
                        this.quiz = this.quizService.quizValue
                      }).catch(err => {console.log(err)});
                    }
                  }).catch(err => console.log(err))
              }).catch(err => {console.log(err)});
              this.quizService.getQuizSolutionsByTripAndStudentId(this.schoolTrip.idschool_trip, this.user.idperson).then(data => {
                  this.quizes_to_solve = data
                  for (let i = 0; i < this.quizes_to_solve.length; i++)
                  {
                      if (this.quizes_to_solve[i].score != null)
                      {
                        this.quizes_to_solve_percent[i] = Math.round((this.quizes_to_solve[i].score*100/+this.schoolTrip.n_questions) * 10) / 10
                      }
                      else {
                        this.quizes_to_solve_percent[i] = 0
                      }
                  }
              }).catch(err => console.log(err))
              this.grade_for_user = -1
              if (this.user.type == 1)
              {
                this.schoolTripService.getGradeBySchoolTripAndStudentID(this.schoolTrip.idschool_trip, this.user.idperson).then(data => {
                  this.grade_for_user = data[0].grade
                }).catch(err => console.log(err))
              }
        }

    ngOnInit() {
    }

    deleteSchoolTrip() {
      this.schoolTripService.deleteSchoolTrip(this.schoolTrip.idschool_trip)
          .pipe(first())
          .subscribe(() => {
            this.alertService.success('Ekskurzija uspešno izbrisana!');
                    this.router.navigate(['.']);
          });
    }

    createQuiz()
    {
      this.quizService.addNewQuiz(new Quiz({"school_tripID":this.schoolTrip.idschool_trip, "studentID":this.user.idperson, "submited": false})).pipe(first())
            .subscribe(
              dd => {
                  this.quizService.getQuizByStudentAndSchoolTripId(this.schoolTrip.idschool_trip, this.user.idperson).then((data : Quiz[])=> {
                    this.quizService.addToLocalStorage(data[0].idquiz).then(_ => {
                      this.quiz = this.quizService.quizValue
                      var questions : any= []
                      for (let i = 0; i < this.schoolTrip.n_questions; i++)
                      {
                        questions[i] = new QA({question:this.defaultQestion, answers:[this.defaultAnswer], correct_answer:-1, summary: "",school_tripID:this.schoolTrip.idschool_trip, quizID:this.quiz.idquiz})
                      }
                      this.qaService.getQAByQuizID(this.quiz.idquiz).then(res => {
                        if (res["data"].length == 0)
                        {
                          this.qaService.storeAllQA(questions).pipe(first()).subscribe(
                            _ => {
                              //this.router.navigate(['../..'+this.router.url+'/quizes/'+data[0].idquiz+'/edit']);
                              this.router.navigate(['quizes', data[0].idquiz, 'edit'], {relativeTo: this.route});
                            },
                            error => {console.log(error)}
                          )
                        }
                        else{
                          //this.router.navigate(['../..'+this.router.url+'/quizes/'+data[0].idquiz+'/edit']);
                          this.router.navigate(['quizes', data[0].idquiz, 'edit'], {relativeTo: this.route});
                        }
                      }).catch(err => console.log(err))


                    }).catch(err => console.log(err))
                  }).catch(err => console.log(err))
              },
              error => {

              }
            )
    }
    editQuiz(idstudent)
    {
      var id = this.user.idperson
      if (idstudent != -1)
      {
        id = idstudent
      }
      this.quizService.getQuizByStudentAndSchoolTripId(this.schoolTrip.idschool_trip, id).then((data : Quiz[])=> {
        this.quizService.addToLocalStorage(data[0].idquiz).then(_ => {
          this.quiz = this.quizService.quizValue
          var questions : any= []
          for (let i = 0; i < this.schoolTrip.n_questions; i++)
          {
            questions[i] = new QA({question:this.defaultQestion, answers:[this.defaultAnswer], correct_answer:-1, summary: "",school_tripID:this.schoolTrip.idschool_trip, quizID:this.quiz.idquiz})
          }
          this.qaService.getQAByQuizID(this.quiz.idquiz).then(res => {
            if (res["data"].length == 0)
            {
              this.qaService.storeAllQA(questions).pipe(first()).subscribe(
                _ => {
                  //this.router.navigate(['../..'+this.router.url+'/quizes/'+data[0].idquiz+'/edit']);
                  if (idstudent == -1)
                    this.router.navigate(['quizes', data[0].idquiz, 'edit'], {relativeTo: this.route});
                  else
                    this.router.navigate(['quizes', data[0].idquiz, 'edit', idstudent], {relativeTo: this.route});
                },
                error => {console.log(error)}
              )
            }
            else{
             // this.router.navigate(['../..'+this.router.url+'/quizes/'+data[0].idquiz+'/edit']);
             //this.router.navigate(['../'+this.schoolTrip.idschool_trip+'/quizes/'+data[0].idquiz+'/edit', { relativeTo: this.route }]);
            if (idstudent == -1)
              this.router.navigate(['quizes', data[0].idquiz, 'edit'], {relativeTo: this.route});
            else
              this.router.navigate(['quizes', data[0].idquiz, 'edit', idstudent], {relativeTo: this.route});

            }
          }).catch(err => console.log(err))


        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
    }
    deleteQuiz()
    {
      this.quizService.deleteQuiz(this.quiz.idquiz)
      .pipe(first())
      .subscribe(() => {
        this.alertService.success('Kviz uspešno izbrisan!');
          this.quizCreated = false
          this.quizSubmited = false
      });
    }
    submitQuiz()
    {
      this.quizService.update(this.quiz.idquiz, {"submited":true})
      .pipe(first())
      .subscribe(
          data => {
              this.alertService.success('Kviz je oddan v ocenjevanje');
              this.quizSubmited = true
              //this.router.navigate(['./school_trips/'+this.schoolTrip.idschool_trip]);
          },
          error => {
            console.log(error)
              this.alertService.error(error);
          });
    }
    submitClass(razred : string)
    {

      this.quizService.getAllQuizesBySchoolTripIdAndClass(this.schoolTrip.idschool_trip, razred)
      .then((response : any[]) => {
        if (response != null)
        {
          this.quizes_by_trip_classes = response
          this.flag = true
          this.current_class = razred


        }
      }).catch(err => {console.log(err)});
      this.quizService.getAllSolvingQuizesBySchoolTripIdAndClass(this.schoolTrip.idschool_trip, razred)
            .then((response1 : any[]) => {
              if (response1 != null)
              {
                this.solving_quizes_by_trip_classes = response1
                this.flag = true
                this.current_class = razred
              }
            }).catch(err => {console.log(err)});
      this.schoolTripService.getAllGradesBySchoolTripAndClass(this.schoolTrip.idschool_trip, razred).then(data => {
        this.grades = data
      }).catch(err => console.log(err))
    }
    add_quizes_for_solving()
    {
        if (this.current_class == "")
        {
          this.alertService.error("Najprej izberite željen razred!")
          return
        }
        this.quizService.addQuizToSolvingPool(this.schoolTrip.idschool_trip, this.current_class, this.schoolTrip.quizes_to_solve, this.quizes_by_trip_classes, this.schoolTrip.n_questions)
        this.alertService.success("Kvizi oddani v reševanje!")
    }
    add_grade_in_quiz(quiz_id, studentID)
    {
        var grade = +$("#grade_"+studentID)[0].innerHTML
        if (grade == 0)
        {
          this.alertService.error("Vpišite oceno!")
          return
        }
        this.quizService.updateGradeInQuiz(quiz_id, grade).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je shranjena!")}, error => {this.alertService.error("Napaka pri vnosu ocene v bazo!")})
    }
    add_grade_in_quiz_solving(quiz_id, studentID)
    {
        var grade = +$("#grade_1_"+studentID)[0].innerHTML
        if (grade == 0)
        {
          this.alertService.error("Vpišite oceno!")
          return
        }
        this.quizService.updateGradeInQuizSolving(quiz_id, grade).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je shranjena!")}, error => {this.alertService.error("Napaka pri vnosu ocene v bazo!")})
    }
    update_grade(id)
    {
        var grade = +$("#grade_123_"+id)[0].innerHTML
        if (grade == 0)
        {
          this.alertService.error("Vpišite oceno!")
          return
        }
        this.schoolTripService.updateFinalGrade(id, grade).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je shranjena!")}, error => {this.alertService.error("Napaka pri vnosu ocene v bazo!")})
    }
    delete_grade(id)
    {
        this.schoolTripService.deleteFinalGrade(id).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je izbrisana!"); this.submitClass(this.current_class)}, error => {this.alertService.error("Napaka pri izbrisu ocene iz baze!")})
    }
    calc_final_grade_and_store()
    {
        if (this.current_class == "")
        {
          this.alertService.error("Najprej izberite željen razred!")
          return
        }
        this.schoolTripService.calcFinalGradeAndStore(this.current_class, this.schoolTrip.idschool_trip)
        .pipe(first())
            .subscribe(
                data => {
                  this.submitClass(this.current_class)
                  this.alertService.success("Ocene so izračunane in shranjene!");
                },
                error => {
                  this.submitClass(this.current_class)
                  this.alertService.success("Ocene so izračunane in shranjene!");
                });
    }
}
