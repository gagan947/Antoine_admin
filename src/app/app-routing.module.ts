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
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AllImagesComponent } from './components/uploads/all-images/all-images.component';
import { ImageDetailComponent } from './components/uploads/image-detail/image-detail.component';
import { DownloadedImagesComponent } from './components/users/downloaded-images/downloaded-images.component';
import { ImagesListComponent } from './components/website/images-list/images-list.component';
import { AddImageComponent } from './components/website/add-image/add-image.component';
import { ImagePreviewComponent } from './components/website/image-preview/image-preview.component';
import { CollabRequestComponent } from './components/request/collab-request/collab-request.component';
import { SubSubcategorisListComponent } from './components/sub-subcategories/sub-subcategoris-list/sub-subcategoris-list.component';
import { SubSubcategorisFormComponent } from './components/sub-subcategories/sub-subcategoris-form/sub-subcategoris-form.component';
import { SubTagListComponent } from './components/sub-tag/sub-tag-list/sub-tag-list.component';
import { SubTagFormComponent } from './components/sub-tag/sub-tag-form/sub-tag-form.component';

const routes: Routes = [
  {
    path: '', component: LogInComponent, pathMatch: 'full'
  },
  {
    path: 'forget-password', component: ForgetPasswordComponent
  },
  {
    path: 'change-password', component: ChangePasswordComponent, canActivate: [AuthGuard]
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
    path: 'users/downloaded-images', component: DownloadedImagesComponent, canActivate: [AuthGuard]
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
    path: 'sub-subcategories', component: SubSubcategorisListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sub-subcategories/sub-subcategory-form', component: SubSubcategorisFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tags', component: TagsListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'tags/tags-form', component: TagsFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sub-tags', component: SubTagListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'sub-tags/sub-tags-form', component: SubTagFormComponent, canActivate: [AuthGuard]
  },
  {
    path: 'all-images/upload-media', component: UploadMediaComponent, canActivate: [AuthGuard]
  },
  {
    path: 'all-images', component: AllImagesComponent, canActivate: [AuthGuard]
  },
  {
    path: 'image-detail', component: ImageDetailComponent, canActivate: [AuthGuard]
  },
  {
    path: 'website', component: ImagesListComponent, canActivate: [AuthGuard]
  },
  {
    path: 'website/add-new', component: AddImageComponent, canActivate: [AuthGuard]
  },
  {
    path: 'website/image-preview', component: ImagePreviewComponent, canActivate: [AuthGuard]
  },
  {
    path: 'collab-request', component: CollabRequestComponent, canActivate: [AuthGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
