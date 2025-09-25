import { Routes } from '@angular/router';
import { Signup } from './auth/signup/signup';
import { Signin } from './auth/signin/signin';
import { Home } from './home/home';

export const routes: Routes = [
    { path: 'signin', component: Signin },
    { path: 'signup', component: Signup },
    { path: 'home', component: Home },
    { path: '', redirectTo: '/home', pathMatch: 'full' }
];
