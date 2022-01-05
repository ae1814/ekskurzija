import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { LowerCasePipe } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AccountService {
    private userSubject: BehaviorSubject<any>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
       /* if (localStorage.getItem('user') == "undefined")
          this.userSubject = new BehaviorSubject<any>(JSON.parse('{}'));
        else*/
        this.userSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('user') || '{}'));
        this.user = this.userSubject.asObservable();
        if (localStorage.getItem('user') == undefined || localStorage.getItem('user') == "undefined" || localStorage.getItem('user') == null)
        {
          localStorage.removeItem('user');
          this.userSubject.next(null);
        }
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(email : any, password : any) {
      return new Promise<[]>((resolve, reject) => {
         this.http.post<User>(`${environment.apiUrl}/users/signin`, {email, password }).subscribe((data : any) => {
            if (data != null && data[0] != undefined) {
                data = data[0]
                var arr = data.class.split(";");
                data.class = arr
                localStorage.setItem('user', JSON.stringify(data));
                this.userSubject.next(data);
                resolve(data);
            } else {
              reject([]);
            }
          }, (err) => {
            reject(err);
          });
    });
    }

    logout() {
        // remove user from local storage and set current user to null

        localStorage.removeItem('user');
        this.userSubject.next(null);
        console.log(localStorage)
        this.router.navigate(['/account/login']);
        console.log(this.router)
    }

    register(user: User) {
      if (user.class != undefined)
        user.class = user.class.toLowerCase()
      console.log(user)
      return this.http.post(`${environment.apiUrl}/users/signup`, user);
    }

    getAllStudents(razred : String) {
      return new Promise<[]>((resolve, reject) => {
        this.http.request<User[]>('get', `${environment.apiUrl}/users/get_all_students/${razred}`).subscribe((data : any) => {
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


    getById(id: string) {
        //return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
        console.log("jlkl")
        return new Promise<[]>((resolve, reject) => {
          this.http.request<User[]>('get', `${environment.apiUrl}/users/${id}`).subscribe((data : any) => {
            if (data != null) {
                console.log(data)
                resolve(data);
            } else {
              reject('No data exists!');
            }
          }, (err) => {
            reject(err);
          });
        });
    }

    update(id : any, params : any) {
        if (params.class != undefined)
          params.class = params.class.toLowerCase()
        return this.http.put(`${environment.apiUrl}/users/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.idperson) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    var arr = user.class.split(";");
                    user.class = arr
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/users/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.idperson) {
                    this.logout();
                }
                return x;
            }));
    }
}
