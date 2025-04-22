import { Routes } from '@angular/router';
import { LoginComponent } from './Components/login/login.component';
import { UserDashboardComponent } from './Components/user-dashboard/user-dashboard.component';
import { authGuard } from './Guards/auth-guard';
import { NotFoundComponent } from './Components/not-found/not-found.component';
import { PostsListComponent } from './Components/posts-list/posts-list.component';
import { AddUserComponent } from './Components/add-user/add-user.component';

export const routes: Routes = [
    {
        path :'',
        redirectTo : 'dashboard',
        pathMatch : 'full'
    },
    { 
        path : 'dashboard',
        canActivate : [authGuard],
        component : UserDashboardComponent
    },
    {
        path : 'login',
        component : LoginComponent
    },

    {
        path : 'posts/add',
        canActivate : [authGuard],
        component : AddUserComponent
    },
    {
        path : 'posts/edit/:id',
        canActivate : [authGuard],
        component : AddUserComponent
    },
    {
        path : 'posts',
        canActivate : [authGuard],
        component : PostsListComponent
    },
  
    {
        path : '**',
        canActivate : [authGuard],
        component : NotFoundComponent
    }


];
