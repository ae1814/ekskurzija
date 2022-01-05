import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../_helpers';
import { LayoutComponent } from './layout.component';
import { DetailsComponent } from './details.component';
import { AddEditComponent } from './add-edit.component';
import { AddEditQuizComponent } from './add-edit-quiz.component';
import { SolveQuizComponent } from './solve_quiz.component';

const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: ':id', component: DetailsComponent },
            { path: 'add/new', component: AddEditComponent },
            { path: 'edit/:id', component: AddEditComponent },
            { path: ':idtrip/quizes/:idquiz/edit', component: AddEditQuizComponent },
            { path: ':idtrip/quizes/:idquiz/edit/:idstudent', component: AddEditQuizComponent },
            { path: ':idtrip/quizes/:idquiz/solve_quiz', component: SolveQuizComponent },
            { path: ':idtrip/quizes/:idquiz/check_quiz', component: SolveQuizComponent },
            { path: ':idtrip/quizes/:idquiz/check_quiz/:idstudent', component: SolveQuizComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SchoolTripRoutingModule { }
