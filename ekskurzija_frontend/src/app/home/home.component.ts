import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '../_models';
import { Quiz } from '../_models/quiz';
import { SchoolTrip } from '../_models/schoolTrip';
import { AccountService, SchoolTripService } from '../_services';
import { QuizService } from '../_services/quiz.service';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    user: User;
    school_trips: any[] = [];
    submited_quizes : any = {}
    constructor(
      private schoolTripService : SchoolTripService,
      private accountService: AccountService,
      private quizService: QuizService
      ) {
        this.user = this.accountService.userValue;
    }

    ngOnInit() {
      if (this.user.type == 0)
      {
        this.schoolTripService.getSchoolTripByTeacherId(this.user.idperson)
        .then((response : SchoolTrip[]) => {
          if (response != null)
          {
            console.log(response)
            this.school_trips = response;

          }
        }).catch(err => {console.log(err)});
      }
      else if (this.user.type == 1) {
        this.schoolTripService.getSchoolTripByClass(this.user.class)
        .then((response : SchoolTrip[]) => {
          if (response != null)
          {
            this.school_trips = response;
            //console.log("sch trips: ",this.school_trips)
            this.school_trips.forEach((element : SchoolTrip)=> {
              //console.log(element.idschool_trip)
              this.quizService.getQuizByStudentAndSchoolTripId(element.idschool_trip, this.user.idperson).then(
                (data : Quiz[]) => {
                  //console.log(element.idschool_trip, data);
                  if (data != null && data.length > 0 && data[0].submited)
                  {
                      this.submited_quizes[element.idschool_trip] = true
                  }
                  else {
                      this.submited_quizes[element.idschool_trip] = false
                  }
                }).catch(err => console.log(err))
            });
          }
        }).catch(err => {console.log(err)});


      }
    }


    storeSchoolTrip(id : string) {
        this.schoolTripService.addToLocalStorage(id).then().catch(err => {console.log(err)});
    }
}
