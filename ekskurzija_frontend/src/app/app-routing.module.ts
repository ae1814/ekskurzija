import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home';
import { AuthGuard } from './_helpers';

const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const usersModule = () => import('./users/users.module').then(x => x.UsersModule);
const schoolTripsModule = () => import('./school_trips/school_trips.module').then(x => x.schoolTripsModule);
//const quizesModule = () => import('./quizes/quizes.module').then(x => x.QuizesModule);

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'users', loadChildren: usersModule, canActivate: [AuthGuard] },
    { path: 'school_trips', loadChildren: schoolTripsModule, canActivate: [AuthGuard] },
    //{ path: 'school_trips/:idtrip/quizes/:idquiz/edit', loadChildren: quizesModule, canActivate: [AuthGuard] },
    { path: 'account', loadChildren: accountModule },
    { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
