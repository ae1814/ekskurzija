import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { LowerCasePipe } from '@angular/common';
import { SchoolTrip } from '../_models/schoolTrip';
import { Quiz } from '../_models/quiz';
import { QuizSolutions } from '../_models/quizSolutions';
import { AccountService } from '.';

@Injectable({ providedIn: 'root' })
export class QuizService {
    public quiz: Observable<Quiz>;
    private quizSubject: BehaviorSubject<any>;
    constructor(
        private router: Router,
        private http: HttpClient,
        private accountService : AccountService
    ) {
      this.quizSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('quiz') || '{}'));
      this.quiz = this.quizSubject.asObservable();
      if (localStorage.getItem('quiz') == undefined || localStorage.getItem('quiz') == "undefined" || localStorage.getItem('quiz') == null)
        {
          localStorage.removeItem('quiz');
          this.quizSubject.next(null);
        }
    }

    addToLocalStorage(id) {
        return new Promise<Quiz>((resolve, reject) => {
            this.http.get<Quiz>(`${environment.apiUrl}/school_trip/quiz/${id}`).subscribe((data : any) => {
              if (data != null && data[0] != undefined) {

                  data = data[0]
                  if (localStorage.getItem('quiz') != undefined && localStorage.getItem('quiz') != "undefined" && localStorage.getItem('quiz') != null)
                  {
                    localStorage.removeItem('quiz');
                    this.quizSubject.next(null);
                  }
                  localStorage.setItem('quiz', JSON.stringify(data));
                  this.quizSubject.next(data);
                  resolve(data);
              } else {
                reject("No data exists!");
              }
            }, (err) => {
              reject(err);
            });
      });
    }
    removeFromLocalStorage() {
      localStorage.removeItem('quiz');
      this.quizSubject.next(null);
    }

    public get quizValue(): Quiz {
        return this.quizSubject.value;
    }


      getQuizById(id: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/quiz/${id}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              resolve([]);
            }
          }, (err) => {
            reject(err);
          });
        });
    }
    getQuizBySchoolTripId(id: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/quiz/by_school_trip/${id}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              resolve([]);
            }
          }, (err) => {
            reject(err);
          });
        });
    }
    getQuizByStudentId(id: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/quiz/by_student/${id}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              resolve([]);
            }
          }, (err) => {
            reject(err);
          });
        });
    }

    deleteQuiz(id) {
        return this.http.delete(`${environment.apiUrl}/school_trip/quiz/${id}`)
            .pipe(map(x => {
              localStorage.removeItem('quiz');
              this.quizSubject.next(null);
            }));
    }

    update(id : any, params : any) {
        if (params.class != undefined)
          params.class = params.class.toLowerCase()
        return this.http.put(`${environment.apiUrl}/school_trip/quiz/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.quizValue.idquiz) {
                    // update local storage
                    const scTr = { ...this.quizValue, ...params };
                    localStorage.setItem('quiz', JSON.stringify(scTr));

                    // publish updated user to subscribers
                    this.quizSubject.next(scTr);
                }
                return x;
            }));
    }
    addNewQuiz(quiz: Quiz) {
      console.log(quiz)
        return this.http.post(`${environment.apiUrl}/school_trip/quiz/add_new`, quiz);
    }
    getQuizByStudentAndSchoolTripId(id_schooltrip: string, id_student:string) {
      //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/quiz/by_school_trip/${id_schooltrip}/by_student/${id_student}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              resolve([]);
            }
          }, (err) => {
            reject(err);
          });
        });
    }

    convert_answers_to_array_numbers(data)
    {

      console.log(data)
      for (let j = 0; j < data.length; j++)
      {
        var tmp =  data[j].answers.split(";@")
        for (let i = 0; i < tmp.length ; i++)
        {
          tmp[i] = +tmp[i]
        }
        data[j].answers = tmp
      }

      //console.log(questions.length)
      return data
    }
    convert_answers_to_string(data)
    {
        var str = ""
        for (let i = 0; i < data.answers.length-1; i++)
        {
          str += data.answers[i] + ";@"
        }
        str += data.answers[data.answers.length-1]
        data.answers = str
      return data
    }
    getQuizSolutionsByTripAndStudentId(id_school_trip : string, id_user : string)
    {
      return new Promise<[]>((resolve, reject) => {
        this.http.request<QuizSolutions[]>('get', `${environment.apiUrl}/school_trip/quiz/quiz_solving/by_trip_user/${id_school_trip}/${id_user}`).subscribe((data : any) => {
          if (data != null) {
            console.log(data)
            data = this.convert_answers_to_array_numbers(data)
              resolve(data);
          } else {
            resolve([]);
          }
        }, (err) => {
          reject(err);
        });
      });
    }
    getQuizSolutionsByQuizAndStudentId(id_quiz : string, id_user : string)
    {
      return new Promise<QuizSolutions>((resolve, reject) => {
        console.log(id_quiz, id_user)
        this.http.request<QuizSolutions[]>('get', `${environment.apiUrl}/school_trip/quiz/quiz_solving/by_quiz_user/${id_quiz}/${id_user}`).subscribe((data : any) => {
          if (data != null  && data.length != 0) {

            data = this.convert_answers_to_array_numbers(data)[0]
              resolve(data);
          } else {
            resolve(data);
          }
        }, (err) => {
          reject(err);
        });
      });
    }
    getAllSolvingQuizesBySchoolTripIdAndClass(school_trip_id, razred)
    {
      return new Promise<any[]>((resolve, reject) => {
        this.http.request<any[]>('get', `${environment.apiUrl}/school_trip/quiz/solving_quizes/by_trip_and_class/${school_trip_id}/${razred}`).subscribe((data : any) => {
          if (data != null  && data.length != 0) {
              console.log(data)
              resolve(data);
          } else {
            resolve([]);
          }
        }, (err) => {
          reject(err);
        });
      });
    }

    getAllQuizesBySchoolTripIdAndClass(school_trip_id, razred)
    {
      return new Promise<any[]>((resolve, reject) => {
        this.http.request<any[]>('get', `${environment.apiUrl}/school_trip/quiz/by_trip_and_class/${school_trip_id}/${razred}`).subscribe((data : any) => {
          if (data != null  && data.length != 0) {
              console.log(data)
              resolve(data);
          } else {
            resolve([]);
          }
        }, (err) => {
          reject(err);
        });
      });
    }

    updateQuizSolutions(quiz_answers)
    {
      quiz_answers = this.convert_answers_to_string(quiz_answers)
      return this.http.put(`${environment.apiUrl}/school_trip/quiz/quiz_solving/update`, quiz_answers)
    }
    submitQuizSolutions(quiz_answers)
    {
      quiz_answers = this.convert_answers_to_string(quiz_answers)
      return this.http.put(`${environment.apiUrl}/school_trip/quiz/quiz_solving/submit`, quiz_answers)
          .pipe(

          );
    }

    updateGradeInQuiz(quiz_id,  grade)
    {
      return this.http.put(`${environment.apiUrl}/school_trip/quiz/update_grade/${quiz_id}`, {grade:grade})
    }
    denySubmission(idquiz, komentar : any)
    {
      console.log(komentar)
      return this.http.put(`${environment.apiUrl}/school_trip/quiz/update_submission/${idquiz}`, {komentar:komentar})
    }
    updateGradeInQuizSolving(quiz_id,  grade)
    {
      return this.http.put(`${environment.apiUrl}/school_trip/quiz/quiz_solving/update_grade/${quiz_id}`, {grade:grade})
    }

    getRandomInt(min, max) : number{
     // console.log(min, max)
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    user_has_own_quiz(quizes, idperson)
    {
      for (let i = 0; i < quizes.length; i++)
      {
        if (quizes[i].studentID == idperson)
          return true
      }
      return false
    }
    sendData(assigned_quizes)
    {
      return this.http.post(`${environment.apiUrl}/school_trip/quiz/solving_quizes/add_new`, assigned_quizes);

    }
    get_currently_assigned(user, solving_q)
    {
        var count = 0
        for (let i = 0; i < solving_q.length; i++)
        {
          if (user == solving_q[i].qs_iduser)
          {
            count++
          }

        }
        return count
    }
    get_currently_assigned_quiz(user, solving_q, current)
    {
        for (let i = 0; i < solving_q.length; i++)
        {
          if (user == solving_q[i].qs_iduser)
          {
            if (current.idquiz == solving_q[i].qs_idquiz)
              return true
          }

        }
        return false
    }
    addQuizToSolvingPool(school_trip, razred, n_assigned, possible_quizes, n_questions)
    {

      this.accountService.getAllStudents(razred).then((users : any[]) =>
        {
            this.getAllSolvingQuizesBySchoolTripIdAndClass(school_trip, razred).then((solving_q : any[]) => {
              var answers = ""
              var i = 0;
              console.log(users)
              while (i < n_questions - 1)
              {
                  answers += "-1;@"
                  i++;
              }
              answers += "-1"
              var assigned_quizes : any[] = []
              console.log(users)
              for (let i = 0; i < users.length; i++)
              {

                var ucenec = users[i]
                var chosen_numbers  : any = []
                var stevec = this.get_currently_assigned(users[i].idperson, solving_q)
                //console.log("check", stevec, n_assigned)
                while (stevec < n_assigned)
                {

                  var pick_one = this.getRandomInt(0, possible_quizes.length-1)
                  //console.log(possible_quizes.length, pick_one, possible_quizes[pick_one].studentID,  users[i].idperson)
                  if (n_assigned > (possible_quizes.length) || (n_assigned > (possible_quizes.length - 1) && this.user_has_own_quiz(possible_quizes, users[i].idperson)))
                    break;
                  if (pick_one in chosen_numbers || possible_quizes[pick_one].studentID == users[i].idperson || this.get_currently_assigned_quiz(users[i].idperson, solving_q, possible_quizes[pick_one]))
                    continue
                  chosen_numbers[chosen_numbers.length] = pick_one
                  assigned_quizes[assigned_quizes.length] = [possible_quizes[pick_one].idquiz, users[i].idperson, answers, school_trip]
                  stevec++
                }
              }
             // console.log("bla", assigned_quizes)
              this.sendData(assigned_quizes).pipe(first())
              .subscribe()
            }).catch(err => console.log(err))

        }).catch(err => {console.log(err);})

    }
}
