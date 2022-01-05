import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { LowerCasePipe } from '@angular/common';
import { SchoolTrip } from '../_models/schoolTrip';

@Injectable({ providedIn: 'root' })
export class SchoolTripService {
    public schoolTrip: Observable<SchoolTrip>;
    private schoolTripSubject: BehaviorSubject<any>;
    constructor(
        private router: Router,
        private http: HttpClient
    ) {
      this.schoolTripSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('schoolTrip') || '{}'));
      this.schoolTrip = this.schoolTripSubject.asObservable();
      if (localStorage.getItem('schoolTrip') == undefined || localStorage.getItem('schoolTrip') == "undefined" || localStorage.getItem('schoolTrip') == null)
        {
          localStorage.removeItem('schoolTrip');
          this.schoolTripSubject.next(null);
        }
    }

    addToLocalStorage(id : string) {
        return new Promise<SchoolTrip>((resolve, reject) => {
            this.http.get<SchoolTrip>(`${environment.apiUrl}/school_trip/${id}`).subscribe((data : any) => {
              if (data != null && data[0] != undefined) {

                  data = data[0]
                  if (localStorage.getItem('schoolTrip') != undefined && localStorage.getItem('schoolTrip') != "undefined" && localStorage.getItem('schoolTrip') != null)
                  {
                    localStorage.removeItem('schoolTrip');
                    this.schoolTripSubject.next(null);
                  }
                  localStorage.setItem('schoolTrip', JSON.stringify(data));
                  this.schoolTripSubject.next(data);
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
      localStorage.removeItem('schoolTrip');
      this.schoolTripSubject.next(null);
    }

    public get schoolTripValue(): SchoolTrip {
        return this.schoolTripSubject.value;
    }


      getSchoolTripByClass(razred: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/get_by_class/${razred}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              reject('No data exists!');
            }
          }, (err) => {
            reject(err);
          });
        });
    }
    getSchoolTripByTeacherId(id: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/school_trip/get_by_teacher_id/${id}`).subscribe((data : any) => {
            if (data != null) {
                resolve(data);
            } else {
              reject('No data exists!');
            }
          }, (err) => {
            reject(err);
          });
        });
    }
    deleteSchoolTrip(id: string) {
        return this.http.delete(`${environment.apiUrl}/school_trip/${id}`)
            .pipe(map(x => {
              localStorage.removeItem('schoolTrip');
              this.schoolTripSubject.next(null);
            }));
    }

    update(id : any, params : any) {
        if (params.class != undefined)
          params.class = params.class.toLowerCase()
        return this.http.put(`${environment.apiUrl}/school_trip/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.schoolTripValue.idschool_trip) {
                    // update local storage
                    const scTr = { ...this.schoolTripValue, ...params };
                    localStorage.setItem('schoolTrip', JSON.stringify(scTr));

                    // publish updated user to subscribers
                    this.schoolTripSubject.next(scTr);
                }
                return x;
            }));
    }
    addNewSchoolTrip(school_trip: SchoolTrip) {
      if (school_trip.class != undefined)
        school_trip.class = school_trip.class.toLowerCase()
        return this.http.post(`${environment.apiUrl}/school_trip/add_new`, school_trip);
    }
    getAllGradesBySchoolTripAndClass(school_trip_id, razred)
    {
      return new Promise<any[]>((resolve, reject) => {
        this.http.request<any[]>('get', `${environment.apiUrl}/school_trip/grades/all/${school_trip_id}/${razred}`).subscribe((data : any) => {
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
    updateFinalGrade(id, grade){
      return this.http.put(`${environment.apiUrl}/school_trip/grades/add_grade/${id}`, {grade:grade})
    }
    deleteFinalGrade(id){
      return this.http.delete(`${environment.apiUrl}/school_trip/grades/delete_grade/${id}`)
    }
    getGradeBySchoolTripAndStudentID(idschool_trip, idperson)
    {
      return new Promise<any[]>((resolve, reject) => {
        this.http.request<any[]>('get', `${environment.apiUrl}/school_trip/grades/${idschool_trip}/${idperson}`).subscribe((data : any) => {
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
    calcFinalGradeAndStore(razred : string, school_trip_id : string) {
      return this.http.post(`${environment.apiUrl}/school_trip/grades/auto_complete`, {school_tripID:school_trip_id, class:razred});
    }
}
