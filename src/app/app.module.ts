import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { LoaderComponent } from './components/loader/loader.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { UserListComponent } from './components/users/user-list/user-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { UserFormComponent } from './components/users/user-form/user-form.component';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input-gg';
import { CategoryListComponent } from './components/categories/category-list/category-list.component';
import { CategoryFormComponent } from './components/categories/category-form/category-form.component';
import { ModelComponent } from './components/shared/model/model.component';
import { CommonModule } from '@angular/common';
import { SubCategoryListComponent } from './components/sub-categories/sub-category-list/sub-category-list.component';
import { SubCategoryFormComponent } from './components/sub-categories/sub-category-form/sub-category-form.component';
import { TagsListComponent } from './components/tags/tags-list/tags-list.component';
import { TagsFormComponent } from './components/tags/tags-form/tags-form.component';
import { UploadMediaComponent } from './components/uploads/upload-media/upload-media.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { AllImagesComponent } from './components/uploads/all-images/all-images.component';
import { ImageDetailComponent } from './components/uploads/image-detail/image-detail.component';
import { DownloadedImagesComponent } from './components/users/downloaded-images/downloaded-images.component';
import { ImagesListComponent } from './components/website/images-list/images-list.component';
import { AddImageComponent } from './components/website/add-image/add-image.component';
import { ImagePreviewComponent } from './components/website/image-preview/image-preview.component';
import { NgxEditorModule } from 'ngx-editor';
import { CollabRequestComponent } from './components/request/collab-request/collab-request.component';

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    LoaderComponent,
    DashboardComponent,
    SidebarComponent,
    UserListComponent,
    UserFormComponent,
    HeaderComponent,
    CategoryListComponent,
    CategoryFormComponent,
    ModelComponent,
    SubCategoryListComponent,
    SubCategoryFormComponent,
    TagsListComponent,
    TagsFormComponent,
    UploadMediaComponent,
    ForgetPasswordComponent,
    ChangePasswordComponent,
    AllImagesComponent,
    ImageDetailComponent,
    DownloadedImagesComponent,
    ImagesListComponent,
    AddImageComponent,
    ImagePreviewComponent,
    CollabRequestComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxIntlTelInputModule,
    NgxEditorModule,
    ToastrModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
