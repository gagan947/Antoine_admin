import { Component, HostListener, ViewChild } from '@angular/core';
import { SharedService } from '../../../services/shared.service';
import { Router } from '@angular/router';
import { ModelComponent } from '../../shared/model/model.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-all-images',
  templateUrl: './all-images.component.html',
  styleUrl: './all-images.component.css'
})
export class AllImagesComponent {
  data: any[] = [];
  loading: boolean = false;
  offset = 0;
  limit = 10;
  deleteId: any;
  userData: any;
  permissionObject: any;
  searchQuery: any = '';

  constructor(
    private service: SharedService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    const userDataString: any = localStorage.getItem('userData');

    if (userDataString) {
      try {
        this.userData = JSON.parse(userDataString);
        if (this.userData.permission) {
          const parsedPermissions = JSON.parse(this.userData.permission);
          this.permissionObject = parsedPermissions.reduce((acc: any, curr: any) => {
            return { ...acc, ...curr };
          }, {});
        }
      } catch (error) {
        console.error('Error parsing userData or permission', error);
      }
    }
  }

  ngOnInit() {
    this.getImages()
  }

  getImages(): void {
    this.loading = true;
    const apiUrl = `image/getadmin-allalbums?limit=${this.limit}&offset=${this.offset}&imageSearch=${this.searchQuery}`;

    this.service.get(apiUrl).subscribe(res => {
      if (res.success) {
        if (this.offset === 0) {
          this.data = res.data;
        } else {
          this.data = [
            ...this.data,
            ...res.data.filter((item: { id: any; }) => !this.data.some(existingItem => existingItem.id === item.id))
          ];
        }
        this.offset += this.limit;
      }
      this.loading = false;
    }, error => {
      this.loading = false;
      console.error(error);
    });
  }

  search() {
    this.offset = 0;
    this.data = [];
    this.getImages();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any): void {
    const threshold = 300;
    const position = window.pageYOffset + window.innerHeight;
    const height = document.documentElement.scrollHeight;

    if (position > height - threshold && !this.loading) {
      this.getImages();
    }
  }

  @ViewChild('modal') modal!: ModelComponent;

  openModal(id: any) {
    this.deleteId = id
    this.modal.open();
  }

  onModalConfirm() {
    this.loading = true
    let apiUrl = `image/delete-byid?id=${this.deleteId}`
    this.service.delete(apiUrl).subscribe(res => {
      if (res.success) {
        this.loading = false
        this.toastr.success(res.message)
        this.offset = 0;
        this.limit = 10;
        this.data = []
        this.getImages()
      } else {
        this.toastr.error(res.message)
        this.loading = false
      }
    })
  }
}
