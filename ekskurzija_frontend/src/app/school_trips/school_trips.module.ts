import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SchoolTripRoutingModule } from './school_trips-routing.module';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { AddEditComponent } from './add-edit.component';
import { AddEditQuizComponent } from './add-edit-quiz.component';
import { SolveQuizComponent } from './solve_quiz.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        SchoolTripRoutingModule
    ],
    declarations: [
        LayoutComponent,
        DetailsComponent,
        AddEditComponent,
        AddEditQuizComponent,
        SolveQuizComponent
    ]
})
export class schoolTripsModule { }
