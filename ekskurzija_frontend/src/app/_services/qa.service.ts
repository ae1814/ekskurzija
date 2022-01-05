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
import { QA } from '../_models/qa';

@Injectable({ providedIn: 'root' })
export class QAService {
    public qa: Observable<QA[]>;
    private qaSubject: BehaviorSubject<any>;
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
      this.qaSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('qa') || '{}'));
      this.qa = this.qaSubject.asObservable();
      if (localStorage.getItem('qa') == undefined || localStorage.getItem('qa') == "undefined" || localStorage.getItem('qa') == null)
        {
          localStorage.removeItem('qa');
          this.qaSubject.next(null);
        }
    }

    addToLocalStorage(id : string) {
        return new Promise<Quiz>((resolve, reject) => {
            this.http.get<Quiz>(`${environment.apiUrl}/school_trip/quiz/qa/${id}`).subscribe((data : any) => {
              if (data != null && data[0] != undefined) {

                  data = data[0]
                  if (localStorage.getItem('qa') != undefined && localStorage.getItem('qa') != "undefined" && localStorage.getItem('qa') != null)
                  {
                    localStorage.removeItem('qa');
                    this.qaSubject.next(null);
                  }
                  localStorage.setItem('qa', JSON.stringify(data));
                  this.qaSubject.next(data);
                  resolve(data);
              } else {
                reject([]);
              }
            }, (err) => {
              reject(err);
            });
      });
    }
    removeFromLocalStorage() {
      localStorage.removeItem('qa');
      this.qaSubject.next(null);
    }

    public get qaValue(): QA {
        return this.qaSubject.value;
    }
    convert_answers_to_array(questions)
    {
      for (let j = 0; j < questions.length; j++)
      {
        questions[j].answers = questions[j].answers.split(";@")
        //console.log(questions[j].answers)
      }
      //console.log(questions.length)
      return questions
    }
    convert_answers_to_string(questions)
    {
      for (let j = 0; j < questions.length; j++)
      {
        var str = ""
        for (let i = 0; i < questions[j].answers.length-1; i++)
        {
          str += questions[j].answers[i] + ";@"
        }
        str += questions[j].answers[questions[j].answers.length-1]
        questions[j].answers = str
      }
      return questions
    }
    storeAllQA(questions)
    {
      return this.http.post(`${environment.apiUrl}/school_trip/quiz/qa/add_new`, questions);
    }
    getQAByQuizID(id)
    {
      return new Promise<[]>((resolve, reject) => {
        this.http.request('get', `${environment.apiUrl}/school_trip/quiz/qa/get_by_quiz_id/${id}`).subscribe((data : any) => {
          if (data != null && data["data"] != null) {
            //console.log()
              data["data"] = this.convert_answers_to_array(data["data"])

              resolve(data);
          } else {

            reject('No data exists!');
          }
        }, (err) => {
          reject(err);
        });
      });
    }
    updateQAImages(images_indicator, quiz_id)
    {
      return this.http.post(`${environment.apiUrl}/school_trip/quiz/qa/upload_image`, [images_indicator, quiz_id])
    }
    updateQA(questions)
    {
       questions = this.convert_answers_to_string(questions)
       return this.http.put(`${environment.apiUrl}/school_trip/quiz/qa/update_qa`, questions)
    }

}
