import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { first } from 'rxjs/operators';
import * as $ from 'jquery';
import { AccountService, AlertService, SchoolTripService, QuizService } from '../_services';
import { User } from '../_models';
import { SchoolTrip } from '../_models/schoolTrip';
import { QA } from '../_models/qa';
import { Quiz } from '../_models/quiz';
import { stringify } from 'querystring';
import { QAService } from '../_services/qa.service';
import { QuizSolutions } from '../_models/quizSolutions';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}



@Component({
  selector: 'solve_quiz',
  templateUrl: './solve_quiz.component.html'
})
export class SolveQuizComponent implements OnInit {
    isAddMode: boolean = false;

    loading = false;
    submitted = false;
    id: string = "-1";
    questions : QA[] = [];
    current_question : number;
    user : User;
    schoolTrip : SchoolTrip;
    quiz : Quiz;
    n_curr_answers : number[] = []
    selectedFile: ImageSnippet;
    images : File[]
    images_indicator = {}
    solving_quiz_data : QuizSolutions
    review_quiz : boolean = false
    teacherMode : boolean = false
    form: FormGroup = this.formBuilder.group({
      given_answer: [-1],

  });
    defaultAnswer = "Napišite odgovor"
    defaultQestion = "Napišite vprašanje"
    constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private schoolTripService: SchoolTripService,
      private qaService: QAService,
      private quizService: QuizService,
      private alertService: AlertService,
      private accountService: AccountService
    ) {
      var userID = this.route.snapshot.params['idstudent']
      console.log(userID)
      this.teacherMode = !(!userID)
      console.log(this.teacherMode)
      if (this.teacherMode)
      {
        this.accountService.getById(userID).then((data : User[]) => {
          console.log(data)
          this.user = data[0]
        }).catch(err => console.log(err))
      }
      else
      {
        this.user = this.accountService.userValue
      }
      var rebiew = location.pathname.split("/")
      if ("check_quiz" == rebiew[rebiew.length-1] || (this.teacherMode && "check_quiz" == rebiew[rebiew.length-2]))
        this.review_quiz = true
      var schoolTripId = this.route.snapshot.params['idtrip']
      console.log(schoolTripId)
      var quizId = this.route.snapshot.params['idquiz']
      this.quizService.addToLocalStorage(quizId).then(_ => {
        this.quiz = this.quizService.quizValue
        this.qaService.getQAByQuizID(this.quiz.idquiz).then(data=> {
            this.questions = data["data"]
            console.log(this.questions)
            this.images_indicator = data["images"]
            this.schoolTripService.addToLocalStorage(schoolTripId).then(_ => {
              this.schoolTrip = this.schoolTripService.schoolTripValue
              if (this.quiz.idquiz == undefined)
                this.quiz.idquiz = "-1"
              this.quizService.getQuizSolutionsByQuizAndStudentId(this.quiz.idquiz, this.user.idperson).then(data => {
                  this.solving_quiz_data = data
                console.log(data)
                this.loadForm()
              }).catch(err => console.log(err))
            }).catch(err => console.log(err))
            /*for (let i = 0; i < this.images.length; i++)
            {
              this.images_indicator[this.images[i].name] = this.images[i]
            }
            console.log(this.questions)*/

        }).catch(err => console.log(err))
      }).catch(err => console.log(err))



      this.current_question = 0
      for (let i = 0; i < 10; i++)
      {
        this.questions[i] = new QA({idqa:"",question:"", answers:[""], correct_answer:-1, summary: "",school_tripID:"", quizID:""})
      }
      if (this.quiz == undefined)
      {
        this.quiz = new Quiz({school_tripID:"", studentID:"", submited:false})
      }
      this.schoolTrip = new SchoolTrip({idschool_trip:"",teacherID:"", name:"", class:"", summary: "",n_questions:10})
    }
    get f() { return this.form.controls; }
    ngOnInit() {

    }
    onSubmit() {
    }
    revealQuestion(index)
    {
      if (this.form.invalid)
      {
        this.onSubmit()
        return
      }
      this.current_question = index
      this.onSubmit()
    }
    move_to_question(new_question)
    {
      if (this.form.invalid)
        return
      this.storeForm().then(_ => {
        console.log(new_question)
        this.current_question = new_question
        this.loadForm()
      }).catch(err => {console.log(err); this.alertService.error("Poskusite ponovno!");})
    }
    loadForm()
    {
      //console.log(this.questions)
      this.f["given_answer"].setValue(this.solving_quiz_data.answers[this.current_question])
      this.n_curr_answers = []
      for (let i = 0; i < this.questions[this.current_question].answers.length; i++)
      {
        this.n_curr_answers[this.n_curr_answers.length] = this.n_curr_answers.length
      }
    }
    storeForm()
    {
      return new Promise((resolve, reject) => {
        console.log("jkljl")
        var formValue = this.form.value
        this.solving_quiz_data.answers[this.current_question] = formValue.given_answer
        resolve("")
      });
    }
    updateSolvingQuiz()
    {
      this.storeForm().then(_ => {
        this.quizService.updateQuizSolutions(this.solving_quiz_data).pipe(first()).subscribe(
          data => {
          },
          error =>
          {
            console.log(error)
          }
        )
      }).catch(err => console.log(err))
    }
    submitQuizSolutions()
    {
      this.storeForm().then(_ => {
        var score = 0
        for (let i = 0; i < this.solving_quiz_data.answers.length; i++)
        {
          if (this.questions[i].correct_answer == this.solving_quiz_data.answers[i])
            score += 1
        }
        this.solving_quiz_data.score = score
        this.quizService.submitQuizSolutions(this.solving_quiz_data).pipe(first()).subscribe(
          data => {
          },
          error =>
          {
            console.log(error)
          }
        )
      }).catch(err => console.log(err))
    }

    storeGrade()
    {
        var grade = +$("#vpisana_ocena").val()
        if (grade == 0)
        {
          this.alertService.error("Vpišite oceno!")
          return
        }
        this.quizService.updateGradeInQuizSolving(this.solving_quiz_data.idquiz_solutions, grade).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je shranjena!"); this.router.navigate(['../../../../'], {relativeTo: this.route});}, error => {this.alertService.error("Napaka pri vnosu ocene v bazo!")})
    }
}


