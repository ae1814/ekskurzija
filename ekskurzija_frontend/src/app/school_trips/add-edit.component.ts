import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AccountService, AlertService, SchoolTripService } from '../_services';
import { User } from '../_models';
import { SchoolTrip } from '../_models/schoolTrip';
@Component({
  selector: 'add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
    form: FormGroup = this.formBuilder.group({
        name: ['', Validators.required],
        class: ['', Validators.required],
        n_questions: ['', Validators.required],
        quizes_to_solve: ['', Validators.required],
        summary:  ['', Validators.required]
    });
    schoolTrip : SchoolTrip
    id: string = "-1";
    isAddMode: boolean = false;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private accountService: AccountService,
        private alertService: AlertService,
        private schoolTripService: SchoolTripService
    ) {
        console.log("uaudlsailduasilu")
        if (!this.isAddMode)
        {
          this.schoolTrip = schoolTripService.schoolTripValue
        }
      }

    ngOnInit() {
      console.log("khl")
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;




        if (!this.isAddMode) {
          this.f['name'].setValue(this.schoolTrip.name);
          this.f['n_questions'].setValue(this.schoolTrip.n_questions);
          this.f['quizes_to_solve'].setValue(this.schoolTrip.quizes_to_solve);
          this.f['summary'].setValue(this.schoolTrip.summary);
          this.f['class'].setValue(this.schoolTrip.class);
/*
            this.schoolTripService.addToLocalStorage(this.id)
            .then((response : SchoolTrip) => {
              if (response != null)
              {
                console.log(response)
                this.f['name'].setValue(response.name);
                this.f['n_questions'].setValue(response.n_questions);
                this.f['summary'].setValue(response.summary);
                this.f['class'].setValue(response.class);
              }
            }).catch(err => {console.log(err)});
*/
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createSchoolTrip();
        } else {
            this.updateSchoolTrip();
        }
    }

    private createSchoolTrip() {
        this.form.value.teacherID = this.accountService.userValue.idperson
        console.log(this.form.value.teacherID)
        this.schoolTripService.addNewSchoolTrip(this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Ekskurzija uspešno dodana', { keepAfterRouteChange: true });
                    this.router.navigate(['.']);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }
    private updateSchoolTrip() {
      console.log(this.form.value)
        this.schoolTripService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.success('Update successful', { keepAfterRouteChange: true });
                    this.router.navigate(['./school_trips/'+this.id]);
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

}
