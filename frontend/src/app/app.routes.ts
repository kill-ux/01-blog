import { Routes } from '@angular/router';
import { authRoutes } from './features/auth/auth.routes';
import { UsersRoutes } from './features/user/auth.routes';
import { MainLayout } from './layouts/main-layout/main-layout';
import { AuthLayout } from './layouts/auth-layout/auth-layout';
import { homeRoutes } from './features/home/home.routes';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: MainLayout,
        children: homeRoutes,
        canActivate: [authGuard]
    },
    {
        path: 'auth',
        component: AuthLayout,
        children: authRoutes,
        canActivate: [noAuthGuard]

    },
    // {
    //     path: 'users',
    //     children: UsersRoutes
    // },

];
