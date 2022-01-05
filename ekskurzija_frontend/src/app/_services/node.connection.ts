import { HttpClient, HttpHeaders, HttpRequest  } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//require('dotenv').config({ path: 'C:/Users/erzina/Desktop/WORK CENTER/.env'});
import  { IssuesMain } from '../common/objects/IssuesMain.object'
import  { IssuesAll } from '../common/objects/IssuesAll.object'
import { RadioButton } from '../common/objects/RadioButton.object';
import { Filter } from '../common/objects/Filter.object';

@Injectable({ providedIn: 'root' })
export class NodeAPI {
    // Login je treba ugotovit kje on preverja auth
    connection_string_issues = 'http://localhost:5201/work_center_issues';
    connection_string_filter_request = 'http://localhost:5201/filter_request';
    status : RadioButton[];
    constructor(private http: HttpClient) {}
    
    // Ta mora sprejet se parametre za query in na podlagi tega poklice prav request
    get_details_issue_by_id(id)
    {
      return new Promise<IssuesAll>((resolve, reject) => {
        this.http.get(this.connection_string_issues + "/details?id="+id/*, { headers: headers}*/).subscribe((data : IssuesAll) => {
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

    get_issues_main()
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.request('get', this.connection_string_issues + "/main"/*, { headers: headers}*/).subscribe((data : any) => {
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
    get_issues_main_filtered(filters : Filter)
    {
      //console.log(filters)
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.get(this.connection_string_issues + "/main/filtered?type="+ filters.type.join(',') + "&status="+filters.status.join(',')
                           + "&search="+filters.search.join(",") + "&priority=" + filters.priority.join(",") + "&created_at="+filters.created_at  + 
                           "&created_from="+filters.created_from  + "&created_to="+filters.created_to  + "&modified_at="+filters.modified_at  + 
                           "&modified_from="+filters.modified_from  + "&modified_to="+filters.modified_to /*, { headers: headers}*/).subscribe((data : any) => {
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
    get_status_issues_main()
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<RadioButton[]>((resolve, reject) => {
            this.http.request('get', this.connection_string_filter_request + "/status_all"/*, { headers: headers}*/).subscribe((data : RadioButton[]) => {
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
    get_type_issues_main()
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<RadioButton[]>((resolve, reject) => {
            this.http.request('get', this.connection_string_filter_request + "/type_all"/*, { headers: headers}*/).subscribe((data : RadioButton[]) => {
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
    get_priority_issues_main()
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<RadioButton[]>((resolve, reject) => {
            this.http.request('get', this.connection_string_filter_request + "/priority_all"/*, { headers: headers}*/).subscribe((data : RadioButton[]) => {
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
    delete_issues_main(id : number)
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.delete(this.connection_string_issues + "/main?id="+id /*, { headers: {password : "secreterzin"}}*/).subscribe((data : any) => {
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
    update_issues(data : any, id : number)
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.post(this.connection_string_issues + "/update_all", [data, id] /*, { headers: {password : "secreterzin"}}*/).subscribe((data : any) => {
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
    post_issues(data : any)
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.post(this.connection_string_issues + "/all", data /*, { headers: {password : "secreterzin"}}*/).subscribe((data : any) => {
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

    put_issues_main(data : IssuesMain)
    {
       //let headers = new HttpHeaders().set('password', 'secreterzinc');
        return new Promise<[]>((resolve, reject) => {
            this.http.put(this.connection_string_issues + "/main", data /*, { headers: headers}*/).subscribe((data : any) => {
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
}