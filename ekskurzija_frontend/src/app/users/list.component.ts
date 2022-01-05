import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { first } from 'rxjs/operators';
import { User } from '../_models';

import { AccountService } from '../_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
    users : any[] = [];
    user : User;
    flag = false;
    current_class=""
    constructor(private accountService: AccountService,private fb:FormBuilder) {
      this.user = this.accountService.userValue;
    }

    ngOnInit() {
      this.flag = false
      if (this.user.type == 1)
      {
        this.accountService.getById(this.user.idperson)
        .then((response : User[]) => {
          if (response != null)
          {
            this.flag = true
            console.log(response)
            this.users = response;
          }
        }).catch(err => {console.log(err)});
      }
    }
    submit(razred : string)
    {

      this.accountService.getAllStudents(razred)
      .then((response : User[]) => {
        if (response != null)
        {
          this.flag = true
          console.log(response)
          this.users = response;
          this.current_class = razred
        }
      }).catch(err => {console.log(err)});
    }
    deleteUser(id: string) {
        if (this.users != null)
        {
          const user = this.users.find(x => x.idperson === id);
          user.isDeleting = true;
          this.accountService.delete(id)
              .pipe(first())
              .subscribe(() => {
                  if (this.users != null)
                    this.users = this.users.filter(x => x.id !== id)
              });
          }
    }
}
