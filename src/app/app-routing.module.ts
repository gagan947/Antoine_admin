import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LogInComponent } from './components/log-in/log-in.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { SubCategoryListComponent } from './components/sub-categories/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './components/sub-categories/sub-category-form/sub-category-form.component';
import { TagsListComponent } from './components/tags/tags-list/tags-list.component';
import { TagsFormComponent } from './components/tags/tags-form/tags-form.component';
import { AuthGuard } from './guards/auth.guard';
import { UploadMediaComponent } from './components/uploads/upload-media/upload-media.component';

const routes: Routes = [
  {
    path: '', component: LogInComponent, pathMatch: 'full'
  },
  {
    path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]
  },
  {
    path: 'users', component: UserListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'users/user-form', component: UserFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'categories/category-form', component: CategoryFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sub-categories', component: SubCategoryListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sub-categories/sub-category-form', component: SubCategoryFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tags', component: TagsListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tags/tags-form', component: TagsFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'upload-media', component: UploadMediaComponent, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
