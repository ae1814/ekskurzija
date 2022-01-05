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
import { keyframes } from '@angular/animations';


class ImageSnippet {
  pending: boolean = false;
  status: string = 'init';

  constructor(public src: string, public file: File) {}
}



@Component({
  selector: 'add-edit',
  templateUrl: './add-edit-quiz.component.html'
})
export class AddEditQuizComponent implements OnInit {
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
    images_indicator_sizes = {}
    teacherMode : boolean = false
    form: FormGroup = this.formBuilder.group({
      question: [''],
      correct_answer: [-1],
      summary: [''],

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
      var schoolTripId = this.route.snapshot.params['idtrip']
      var quizId = this.route.snapshot.params['idquiz']
      this.quizService.addToLocalStorage(quizId).then(_ => {
        this.quiz = this.quizService.quizValue
        this.qaService.getQAByQuizID(this.quiz.idquiz).then(data=> {
            this.questions = data["data"]
            this.images_indicator = data["images"]
            for (let key in this.images_indicator)
            {
              const image = new Image();
              image.src = this.images_indicator[key];
              image.onload = () => {
                this.images_indicator_sizes[key] = [image.width, image.height]
              };
            }

            console.log("images",data)
            /*for (let i = 0; i < this.images.length; i++)
            {
              this.images_indicator[this.images[i].name] = this.images[i]
            }
            console.log(this.questions)*/
            this.loadForm()
        }).catch(err => console.log(err))
      }).catch(err => console.log(err))
      this.schoolTripService.addToLocalStorage(schoolTripId).then(_ => {
        this.schoolTrip = this.schoolTripService.schoolTripValue
      }).catch(err => console.log(err))
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
        this.current_question = new_question
        this.loadForm()
      }).catch(err => {this.alertService.error("Poskusite ponovno!");})
    }
    answersAreNotFull(answers) {
        for (let i = 0; i < answers.length; i++)
        {
          if (answers[i] == this.defaultAnswer)
          {
            return true
          }
        }
        return false
    }
    loadForm()
    {
      //console.log(this.questions)
      this.f["question"].setValue(this.questions[this.current_question].question)
      this.f["correct_answer"].setValue(this.questions[this.current_question].correct_answer)
      console.log(this.f["correct_answer"].value)
      this.f["summary"].setValue(this.questions[this.current_question].summary)
      var clear_index = 0
      while (this.f["text_answer_"+clear_index] != undefined)
      {
        this.form.removeControl("text_answer_"+clear_index)
        clear_index++;
      }
      this.n_curr_answers = []
      for (let i = 0; i < this.questions[this.current_question].answers.length; i++)
      {
        this.form.addControl("text_answer_"+i, new FormControl(this.questions[this.current_question].answers[i]))
        this.n_curr_answers[this.n_curr_answers.length] = this.n_curr_answers.length
      }
    }
    storeForm()
    {
      return new Promise((resolve, reject) => {
        var formValue = this.form.value
        this.questions[this.current_question].question = formValue.question
        //this.questions[this.current_question].summary = formValue.summary
        console.log("button", formValue.correct_answer)
        this.questions[this.current_question].correct_answer = formValue.correct_answer
        var tmp_answer = 0
        //console.log(formValue["text_answer_"+tmp_answer])
        while (formValue["text_answer_"+tmp_answer] != undefined)
        {
          //console.log(tmp_answer)
          this.questions[this.current_question].answers[tmp_answer] = formValue["text_answer_"+tmp_answer]
          tmp_answer++;
        }
      /*
      for (let i = 0; i < this.questions.length; i++)
      {
        for (let j = 0; j < this.questions[i].answers.length; j++)
        {
          if (this.questions[i].answers[j] == "")
          {
              this.questions[i].answers[j] = "GenerateAutoAnswer" + j
          }
        }
      }*/
        //console.log(this.questions)
        resolve(null)
      });
    }

    add_answer()
    {
      this.storeForm().then(_ => {
        //console.log(this.form.value)

        //console.log(this.form)
        var allCurrAnswers = this.questions[this.current_question].answers
        var dolzina = allCurrAnswers.length
        //console.log(dolzina)
        if (this.answersAreNotFull(allCurrAnswers))
        {
          this.alertService.error("Pred dodajo polja za odgovor pravilno izpolnite ostala polja!");
          return
        }
        this.n_curr_answers[this.n_curr_answers.length] = this.n_curr_answers[this.n_curr_answers.length-1]+1;
        this.questions[this.current_question].answers[dolzina] = this.defaultAnswer
        this.form.addControl("text_answer_"+dolzina, new FormControl(this.defaultAnswer))
        //this.form.addControl("text_answer_"+dolzina, new FormControl(this.defaultAnswer, Validators.required))
        //if (this.form.value["text_answer_"+dolzina] != undefined)
        //  this.questions[this.current_question].answers[dolzina] = this.defaultAnswer
      }).catch(err => this.alertService.error("Pojavila se je napaka, poskusite ponovno!"))

    }

    delete_answer(index)
    {

      this.storeForm().then(_ => {
        if (this.f["correct_answer"].value == index)
        {
          this.f["correct_answer"].setValue("")
        }
        this.delete_pictures_as_well(index)
        if (this.n_curr_answers.length == 1)
        {
          this.f["text_answer_"+index].setValue(this.defaultAnswer)
          this.questions[this.current_question].answers[index] = this.defaultAnswer
          return
        }

        var curr = index
        for (let i = index+1; i < this.n_curr_answers.length; i++)
        {

            this.f["text_answer_" + curr].setValue(this.questions[this.current_question].answers[i])
            this.f["text_answer_" + i].setValue(this.questions[this.current_question].answers[curr])
            var tmp = this.questions[this.current_question].answers[curr]
            this.questions[this.current_question].answers[curr] = this.questions[this.current_question].answers[i]
            this.questions[this.current_question].answers[i] = tmp
            curr++
        }



        //console.log("before ", this.form.value)

        this.n_curr_answers.splice(this.n_curr_answers.length-1, 1)

        this.questions[this.current_question].answers.splice(this.questions[this.current_question].answers.length - 1, 1)
        this.form.removeControl("text_answer_"+(this.n_curr_answers.length))

        //console.log("after ", this.form.value)
      }).catch(err => this.alertService.error("Pojavila se je napaka, poskusite ponovno!"))



    }


    private onSuccess() {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'ok';
    }

    private onError() {
      this.selectedFile.pending = false;
      this.selectedFile.status = 'fail';
      this.selectedFile.src = '';
    }

    processFile(imageInput: any) {
      var addedString = imageInput.id
      var tmp = addedString.split("_")
      if (this.questions[this.current_question].answers[tmp[tmp.length-1]] == "Napišite odgovor")
      {
        this.questions[this.current_question].answers[tmp[tmp.length-1]] = ""
        this.loadForm()
      }
      var newName=this.quiz.idquiz + "-"  + this.questions[this.current_question].idqa+"-"+addedString
      //const newFile :File = new File([imageInput.files[0]], newName)
      //console.log(imageInput.files[0])
      //imageInput.files[0] = newFile
      if (this.images_indicator[imageInput.files[0].name] != undefined)
      {
        this.alertService.error("Če želite dodati novo sliko, morate prejšnjo izbrisati!")
        return
      }


      const file: File = imageInput.files[0];
      const reader = new FileReader();

      reader.addEventListener('load', (event: any) => {
        this.selectedFile = new ImageSnippet(event.target.result, file);
        this.selectedFile.pending = true;


        this.images_indicator[newName] = reader.result
        const image = new Image();
        image.src = this.images_indicator[newName];
        image.onload = () => {
          this.images_indicator_sizes[newName] = [image.width, image.height]
        };
        //this.qaService.uploadImage(this.selectedFile.file).then(res => {}).catch(err=> console.log(err))
      });
      reader.readAsDataURL(file);
    }
    removeFile(id, i)
    {
        var tmp_in = {}
        var tmp_in_sizes = {}
        var str = this.quiz.idquiz + "-" + this.questions[this.current_question].idqa+"-"+id
        if (i != -1)
          str += i
        Object.keys(this.images_indicator).forEach(key => {
          if (key != str)
          {
            tmp_in_sizes[key] = this.images_indicator_sizes[key]
            tmp_in[key] = this.images_indicator[key]
          }
        })
        this.images_indicator_sizes = tmp_in_sizes
        this.images_indicator = tmp_in
        var tmp = str.split("_")
        console.log(str)
        if (this.questions[this.current_question].answers[tmp[tmp.length-1]] == "")
        {
          this.questions[this.current_question].answers[tmp[tmp.length-1]] = "Napišite odgovor"
          this.loadForm()
        }
    }
    delete_pictures_as_well(index)
    {
        var tmp_in = {}
        var tmp_in_sizes = {}
        var flag = false
        Object.keys(this.images_indicator).forEach(key => {

          var name = key.split("-")
          var curr_quiz = name[0]
          var curr_qa = name[1]
          var curr = name[2].split("_")
          console.log(curr)
          var curr_index = +curr[curr.length - 1]
          if (curr[0] == "question")
          {
            tmp_in[key] = this.images_indicator[key]
            tmp_in_sizes[key] = this.images_indicator_sizes[key]
          }
          else if (curr_quiz != this.quiz.idquiz || curr_qa != this.questions[this.current_question].idqa)
          {
            tmp_in[key] = this.images_indicator[key]
            tmp_in_sizes[key] = this.images_indicator_sizes[key]
          }
          else if (index == curr_index)
          {
            flag = true
          }
          else if (flag)
          {
            tmp_in[curr_quiz+"-"+curr_qa+"-"+curr[0] + "_" + curr[1] + "_" + (curr_index - 1)] = this.images_indicator[key]
            tmp_in_sizes[curr_quiz+"-"+curr_qa+"-"+curr[0] + "_" + curr[1] + "_" + (curr_index - 1)] = this.images_indicator_sizes[key]
          }
          else if (index != curr_index)
          {
            tmp_in[key] = this.images_indicator[key]
            tmp_in_sizes[key] = this.images_indicator_sizes[key]

          }
        })
        this.images_indicator = tmp_in
        this.images_indicator_sizes = tmp_in_sizes
        //console.log(Object.keys(this.images_indicator))
    }
    updateQuizQA()
    {

      this.storeForm().then(_ => {
        this.qaService.updateQA(this.questions).pipe(first()).subscribe(
          data => {
            if (Object.keys(this.images_indicator).length > 0)
              this.qaService.updateQAImages(this.images_indicator, this.quiz.idquiz).pipe(first()).subscribe()
          },
          error =>
          {
            console.log(error)
          }
        )
      }).catch(err => console.log(err))

    }

    zavrniOddajo()
    {
      $("#addComment").css("visibility", "visible")
    }
    zavrniInKomentiraj()
    {
      var komentar = $("#comment").val()
      console.log(komentar)
      this.quizService.denySubmission(this.quiz.idquiz, komentar).pipe(first()).subscribe(
        data => {
          this.router.navigate(['../../../../'], {relativeTo: this.route});
        },
        error => {console.log(error)}
      )
    }
    storeGrade()
    {
        var grade = +$("#vpisana_ocena").val()
        if (grade == 0)
        {
          this.alertService.error("Vpišite oceno!")
          return
        }
        this.quizService.updateGradeInQuiz(this.quiz.idquiz, grade).pipe(first())
        .subscribe(data => {this.alertService.success("Ocena je shranjena!"); this.router.navigate(['../../../../'], {relativeTo: this.route});}, error => {this.alertService.error("Napaka pri vnosu ocene v bazo!")})
    }
}


