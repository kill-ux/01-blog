import { Routes } from '@angular/router';
import { Signup } from './features/auth/signup/signup';
import { Signin } from './features/auth/signin/signin';
import { authRoutes } from './features/auth/auth.routes';
import { UsersRoutes } from './features/user/auth.routes';

export const routes: Routes = [
    {
        path: 'auth',
        children: authRoutes
    },
    {
        path: 'users',
        children: UsersRoutes
    },
    {
        path: '',
        redirectTo: 'auth',
        pathMatch: 'full'
    }
];
